const request = require("supertest");
const { criarConexao } = require("../../src/config/database");
const { criarApp } = require("../../src/app");

describe("Integração: POST /leituras", () => {
  let db;
  let app;

  beforeEach(() => {
    db = criarConexao(":memory:");
    app = criarApp(db);
  });

  afterEach(() => {
    db.close();
  });

  test("deve retornar 201 e o id ao registrar uma leitura válida", async () => {
    const resposta = await request(app).post("/leituras").send({
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

  test("deve retornar 400 quando a umidade não é informada", async () => {
    const resposta = await request(app).post("/leituras").send({});

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe("Campo 'umidade' é obrigatório.");
  });

  test("a leitura registrada deve existir no banco", async () => {
    // Envia a leitura
    await request(app).post("/leituras").send({ umidade: 22 });

    // Consulta o banco para confirmar a persistência
    const linha = db.prepare("SELECT * FROM leituras WHERE id = 1").get();
    expect(linha).not.toBeNull();
    expect(linha.umidade).toBe(22);
    expect(linha.irrigando).toBe(0);
  });
});

describe("Integração: GET /leituras", () => {
  let db;
  let app;

  beforeEach(() => {
    db = criarConexao(":memory:");
    app = criarApp(db);
  });

  afterEach(() => {
    db.close();
  });

  test("deve retornar array vazio quando não há leituras", async () => {
    const resposta = await request(app).get("/leituras");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual([]);
  });

  test("deve retornar as leituras da mais recente para a mais antiga", async () => {
    await request(app).post("/leituras").send({ umidade: 10 });
    await request(app).post("/leituras").send({ umidade: 90 });

    const resposta = await request(app).get("/leituras");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(2);
    expect(resposta.body[0].umidade).toBe(90);
    expect(resposta.body[0].critica).toBe(false);
  });

  test("deve respeitar o parâmetro ?limite=n", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/leituras").send({ umidade: 50 }).send({ umidade: 50 });
    }

    const resposta = await request(app).get("/leituras?limite=2");

    expect(resposta.body).toHaveLength(2);
  });
});
