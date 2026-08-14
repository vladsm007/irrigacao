const { criarConexao } = require("../../../src/config/database");
const LeituraRepository = require("../../../src/repositories/LeituraRepository.js");
const Leitura = require("../../../src/models/Leitura");

describe("Repository: LeituraRepository", () => {
  let db;
  let repository;

  beforeEach(() => {
    db = criarConexao(":memory:");
    repository = new LeituraRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  test("salvar() deve inserir uma leitura e retornar o id gerado", () => {
    const leitura = new Leitura({ umidade: 35, irrigando: true });

    const id = repository.salvar(leitura);

    expect(id).toBe(1); // Primeira incersão
  });

  test("buscarRecentes() deve retornar leituras de mais nova para a mais antiga", () => {
    repository.salvar(new Leitura({ umidade: 10, irrigando: true }));
    repository.salvar(new Leitura({ umidade: 90, irrigando: false }));

    const resultado = repository.buscarRecentes(10);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].umidade).toBe(90);
    expect(resultado[1].umidade).toBe(10);
  });

  test("buscarRecentes() deve respeitar o limite informado", () => {
    for (let i = 1; i <= 5; i++) {
      repository.salvar(new Leitura({ umidade: i * 10 }));
    }

    const resultado = repository.buscarRecentes(2);

    expect(resultado).toHaveLength(2);
  });

  test("buscarRecentes() deve retornar irrigando como booleano", () => {
    repository.salvar(new Leitura({ umidade: 30, irrigando: true }));

    const [resultado] = repository.buscarRecentes(1);

    expect(typeof resultado.irrigando).toBe("boolean");
    expect(resultado.irrigando).toBe(true);
  });

  test("buscarRecentes() deve retornar array vazio quando não há leituras", () => {
    const resultado = repository.buscarRecentes(10);
    expect(resultado).toEqual([]);
  });
});
