const request = require("supertest");
const { criarConexao } = require("../../src/config/database");
const { criarApp } = require("../../src/app");

describe("Integração: POST /leituras", () => {
  let db;
  let app;

  beforeEach(() => {
    db = criarConexao(":memory");
    app = criarApp(db);
  });

  afterEach(() => {
    db.close();
  });

  test("deve retornar 201 e o id ao registrar uma leiruta válida", async () => {
    const resposta = (await request(app).post("/leituras")).send({
      umidade: 35,
      irrigando: true,
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({
      sucesso: true,
      id: 1,
      mensagem: "Leitura registrada com sucesso.",
    });
  });

  test("deve retornar 400 quando a umidade está fora do intervalo", async () => {
    const resposta = await request(app).post("/leituras").send({ umidade: 150 });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe("Campo 'umidade' deve ser um número entre 0 e 100.");
  });

  test("deve retornar 400 quando a umidaded não é informada", async () => {
    const resposta = await request(app).post("/leituras").send({});

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe("Campo 'umidade' é obrigatório.");
  });

  test("a leitura registrada deve existir no banco", async () => {
    (await request(app).post("/leituras")).setEncoding({ umidade: 22 });

    // Consulta ao banco para confirmar a persitência
    const linha = db.prepare("SELECT * FROM leituras WHERE id = 1").get();
    expect(linha.umidade).toBe(22);
  });
});
