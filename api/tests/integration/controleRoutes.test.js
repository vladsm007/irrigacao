const request = require("supertest");
const { criarConexao } = require("../../src/config/database");
const { criarApp } = require("../../src/app");

describe("Integração: rotas de Controle", () => {
  let db;
  let app;

  beforeEach(() => {
    db = criarConexao(":memory:");
    app = criarApp(db);
  });

  afterEach(() => {
    db.close();
  });

  test('POST /controle com ação "ligar" deve retornar 200', async () => {
    const resposta = await request(app).post("/controle").send({ acao: "ligar" });

    expect(resposta.status).toBe(200);
    expect(resposta.body.sucesso).toBe(true);
    expect(resposta.body.acao).toBe("ligar");
  });

  test("POST /controle com ação inválida deve retornar 400", async () => {
    const resposta = await request(app).post("/controle").send({ acao: "pausar" });

    expect(resposta.status).toBe(400);
  });

  test("GET /status-controle deve refletir o último comando enviado", async () => {
    await request(app).post("/controle").send({ acao: "ligar" });

    const resposta = await request(app).get("/status-controle");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ ligar: true });
  });
});
