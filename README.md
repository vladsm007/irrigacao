# Irrigação Inteligente

Sistema de monitoramento e controle de irrigação com ESP32, sensor de umidade do solo, API REST, banco SQLite e dashboard web.

O projeto recebe leituras do sensor, armazena o histórico e permite controlar uma bomba de irrigação manualmente pelo dashboard ou pela API.

## Arquitetura

```text
ESP32 + sensor de umidade
          |
          | POST /leituras
          v
API Node.js + Express + SQLite
          ^
          | GET /status-controle
          | POST /controle
          |
Dashboard Next.js
```

## Estrutura

```text
api/       API REST em Node.js, Express, SQLite e Jest
frontend/  Dashboard em Next.js, React e TypeScript
hardware/  Firmware Arduino para ESP32 e guia de ligação
specs/     Especificações e status do desenvolvimento
.github/   Pipeline de integração contínua
 data/     Banco SQLite persistente quando usado com Docker
```

## Requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose, para execução em containers
- Arduino IDE ou PlatformIO, para gravar o firmware
- ESP32 e sensor capacitivo de umidade, para o teste físico

## Configuração da API

O arquivo `api/.env.example` contém a configuração padrão. Para configurar uma instalação local:

```bash
cp api/.env.example api/.env
```

Configuração padrão:

```env
NODE_ENV=development
PORT=3000
DB_PATH=./data/irrigacao.db
```

O arquivo `api/.env` é local e não deve ser versionado.

## Execução local

Instale as dependências:

```bash
npm --prefix api install
npm --prefix frontend install
```

Inicie a API na porta `3000`:

```bash
npm --prefix api run dev
```

Em outro terminal, inicie o dashboard na porta `3001`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000 \
npm --prefix frontend run dev -- --port 3001
```

Acesse:

- Dashboard: http://localhost:3001
- API: http://localhost:3000
- Leituras: http://localhost:3000/leituras
- Status do controle: http://localhost:3000/status-controle

A API deve ocupar a porta `3000`. O frontend local usa `3001` para evitar conflito.

## Docker Compose

Na raiz do projeto:

```bash
docker compose up --build api frontend
```

Acesse:

- Dashboard: http://localhost:5500
- API: http://localhost:3000

Para executar os testes no container:

```bash
docker compose run --rm test
```

O Compose mantém o banco em `./data`, garantindo persistência entre reinícios dos containers.

## Testes e qualidade

```bash
npm --prefix api test
npm --prefix api run lint
npm --prefix api run format:check
npm --prefix frontend run lint
npm --prefix frontend run build
```

A pipeline do GitHub Actions está em `.github/workflows/ci.yml` e executa testes, ESLint e Prettier a cada push ou pull request para `main`.

## API

### Registrar leitura

```bash
curl -X POST http://localhost:3000/leituras \
  -H "Content-Type: application/json" \
  -d '{"umidade":58,"irrigando":false}'
```

Resposta esperada:

```json
{ "sucesso": true, "id": 1, "mensagem": "Leitura registrada com sucesso." }
```

### Listar leituras

```bash
curl "http://localhost:3000/leituras?limite=12"
```

### Ligar ou desligar a bomba

```bash
curl -X POST http://localhost:3000/controle \
  -H "Content-Type: application/json" \
  -d '{"acao":"ligar"}'

curl -X POST http://localhost:3000/controle \
  -H "Content-Type: application/json" \
  -d '{"acao":"desligar"}'
```

### Consultar o estado da bomba

```bash
curl http://localhost:3000/status-controle
```

Resposta:

```json
{ "ligar": true }
```

## ESP32 e sensor

O firmware está em [hardware/irrigacao_inteligente.ino](hardware/irrigacao_inteligente.ino). As ligações padrão são:

| Componente                | ESP32                       |
| ------------------------- | --------------------------- |
| Saída analógica do sensor | GPIO 34                     |
| Sinal do módulo relé      | GPIO 26                     |
| VCC                       | 3V3 ou 5V conforme o módulo |
| GND                       | GND                         |

Antes de gravar o firmware, ajuste `WIFI_SSID`, `WIFI_SENHA` e `API_BASE_URL`. Use o IP do computador na rede local, por exemplo:

```cpp
const char* API_BASE_URL = "http://192.168.1.50:3000";
```

O ESP32 e o computador precisam estar na mesma rede Wi-Fi. Não use `localhost` no firmware.

O firmware consulta o estado do controle e envia uma nova leitura a cada 30 segundos. O guia completo de montagem e calibração está em [hardware/README.md](hardware/README.md).

Nunca conecte a bomba diretamente ao ESP32. O GPIO deve controlar somente um módulo relé adequado, com fonte e isolamento dimensionados para a bomba.

## Fluxo de teste completo

1. Inicie a API na porta `3000`.
2. Teste `GET /status-controle` com `curl`.
3. Configure o IP da API no firmware.
4. Grave o firmware no ESP32.
5. Abra o monitor serial em `115200 baud`.
6. Confirme o envio de leituras em `GET /leituras`.
7. Acione a bomba pelo dashboard ou `POST /controle`.
8. Confirme o acionamento do relé antes de conectar a bomba real.

## Licença

Projeto acadêmico de irrigação inteligente. Consulte o responsável pelo projeto antes de reutilizar o código em produção.
