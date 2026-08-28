# Firmware do controlador de irrigacao

Firmware Arduino para ESP32, sensor capacitivo de umidade do solo e modulo rele.

## Ligacoes padrao

| Componente                | ESP32                       |
| ------------------------- | --------------------------- |
| Saida analogica do sensor | GPIO 34                     |
| Sinal do rele             | GPIO 26                     |
| VCC do sensor/rele        | 3V3 ou 5V conforme o modulo |
| GND                       | GND                         |

O GPIO 26 controla apenas o sinal do rele. A bomba deve usar fonte e circuito de potencia adequados; nunca ligue a bomba diretamente ao ESP32.

## Configuracao

Abra `irrigacao_inteligente.ino` e ajuste:

- `WIFI_SSID` e `WIFI_SENHA`;
- `API_BASE_URL` para o IP do computador na mesma rede do ESP32;
- `LEITURA_SENSOR_SECO` e `LEITURA_SENSOR_MOLHADO` apos medir o seu sensor;
- os pinos caso a montagem use outra pinagem.

O firmware assume que o rele e ativo em nivel baixo. Para modulos ativos em nivel alto, inverta `NIVEL_RELE_LIGADO` e `NIVEL_RELE_DESLIGADO`.

## Comunicacao

A cada 30 segundos o ESP32:

1. consulta `GET /status-controle`;
2. atualiza o rele com o estado retornado pelo dashboard;
3. mede a umidade com oito amostras;
4. envia `POST /leituras` com `umidade` e `irrigando`.

Inicie a API com `npm --prefix api start` e descubra o IP do computador com `ip addr` ou `hostname -I`. A porta publicada pela API precisa estar acessivel na rede local.

O firmware usa somente bibliotecas que acompanham o core ESP32: `WiFi.h`, `HTTPClient.h` e `Arduino.h`.
