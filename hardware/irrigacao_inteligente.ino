#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFi.h>

// Ajuste estes valores para a sua placa, sensor e rede.
const char* WIFI_SSID = "SUA_REDE_WIFI";
const char* WIFI_SENHA = "SUA_SENHA_WIFI";
const char* API_BASE_URL = "http://192.168.1.100:3000";

constexpr uint8_t PINO_SENSOR_UMIDADE = 34;
constexpr uint8_t PINO_RELE_BOMBA = 26;
constexpr uint16_t INTERVALO_LEITURA_MS = 30000;
constexpr uint16_t INTERVALO_RECONEXAO_MS = 10000;

// Calibre com analogRead(): sensor no ar = seco e sensor em agua = molhado.
constexpr int LEITURA_SENSOR_SECO = 3200;
constexpr int LEITURA_SENSOR_MOLHADO = 1300;

// A maioria dos módulos relé para ESP32 é acionada em nível baixo.
constexpr uint8_t NIVEL_RELE_LIGADO = LOW;
constexpr uint8_t NIVEL_RELE_DESLIGADO = HIGH;

unsigned long ultimaLeitura = 0;
unsigned long ultimaTentativaWifi = -INTERVALO_RECONEXAO_MS;
bool bombaLigada = false;

void conectarWifi() {
  if (WiFi.status() == WL_CONNECTED) return;
  if (millis() - ultimaTentativaWifi < INTERVALO_RECONEXAO_MS) return;

  ultimaTentativaWifi = millis();
  Serial.printf("Conectando a %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_SENHA);

  unsigned long inicio = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - inicio < 8000) {
    delay(250);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nWi-Fi conectado. IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\nWi-Fi indisponivel; nova tentativa em breve.");
  }
}

int lerUmidade() {
  constexpr uint8_t quantidadeAmostras = 8;
  long soma = 0;

  for (uint8_t indice = 0; indice < quantidadeAmostras; indice++) {
    soma += analogRead(PINO_SENSOR_UMIDADE);
    delay(5);
  }

  const int leituraMedia = soma / quantidadeAmostras;
  const int umidade = map(
      leituraMedia,
      LEITURA_SENSOR_SECO,
      LEITURA_SENSOR_MOLHADO,
      0,
      100);

  return constrain(umidade, 0, 100);
}

void definirBomba(bool ligar) {
  bombaLigada = ligar;
  digitalWrite(
      PINO_RELE_BOMBA,
      bombaLigada ? NIVEL_RELE_LIGADO : NIVEL_RELE_DESLIGADO);
}

bool atualizarBombaPeloServidor() {
  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/status-controle");
  http.setConnectTimeout(3000);
  http.setTimeout(3000);

  const int codigo = http.GET();
  if (codigo != HTTP_CODE_OK) {
    Serial.printf("Falha ao consultar controle: HTTP %d\n", codigo);
    http.end();
    return false;
  }

  const String resposta = http.getString();
  http.end();

  const bool ligar = resposta.indexOf("\"ligar\":true") >= 0;
  definirBomba(ligar);
  return true;
}

bool enviarLeitura(int umidade) {
  HTTPClient http;
  http.begin(String(API_BASE_URL) + "/leituras");
  http.addHeader("Content-Type", "application/json");
  http.setConnectTimeout(3000);
  http.setTimeout(3000);

  const String payload = String("{\"umidade\":") + umidade +
                         ",\"irrigando\":" + (bombaLigada ? "true" : "false") + "}";
  const int codigo = http.POST(payload);
  http.end();

  if (codigo != HTTP_CODE_CREATED) {
    Serial.printf("Falha ao enviar leitura: HTTP %d\n", codigo);
    return false;
  }

  Serial.printf("Leitura enviada: %d%% | bomba: %s\n", umidade,
                bombaLigada ? "ligada" : "desligada");
  return true;
}

void setup() {
  Serial.begin(115200);
  pinMode(PINO_SENSOR_UMIDADE, INPUT);
  pinMode(PINO_RELE_BOMBA, OUTPUT);
  definirBomba(false);
  analogReadResolution(12);
  conectarWifi();
}

void loop() {
  conectarWifi();
  if (WiFi.status() != WL_CONNECTED) {
    delay(250);
    return;
  }

  atualizarBombaPeloServidor();

  if (millis() - ultimaLeitura >= INTERVALO_LEITURA_MS || ultimaLeitura == 0) {
    ultimaLeitura = millis();
    enviarLeitura(lerUmidade());
  }

  delay(250);
}
