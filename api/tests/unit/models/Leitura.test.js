const Leitura = require("../../../src/models/Leitura");

describe("Model: Leitura", () => {
  describe("criação válida", () => {
    test("deve criar uma leitura com umidade e irrigando válidos", () => {
      const leitura = new Leitura({ umidade: 45, irrigando: true });

      expect(leitura.umidade).toBe(45);
      expect(leitura.irrigando).toBe(true);
    });

    test("deve assumir irrigando = false quando não informado", () => {
      const leitura = new Leitura({ umidade: 60 });

      expect(leitura.irrigando).toBe(false);
    });
  });

  describe("validação de umidade", () => {
    test("deve lançar erro se umidade não for informada", () => {
      expect(() => {
        new Leitura({});
      }).toThrow("Campo 'umidade' é obrigatório.");
    });

    test("deve lançar erro se umidade for menor que 0", () => {
      expect(() => {
        new Leitura({ umidade: -5 });
      }).toThrow("Campo 'umidade' deve ser um número entre 0 e 100.");
    });

    test("deve lançar erro se umidade for maior que 100", () => {
      expect(() => {
        new Leitura({ umidade: 150 });
      }).toThrow("Campo 'umidade' deve ser um número entre 0 e 100.");
    });

    test("deve lançar erro se umidade não for um número", () => {
      expect(() => {
        new Leitura({ umidade: "muito seco" });
      }).toThrow("Campo 'umidade' deve ser um número");
    });
  });

  describe("regra de negócio: solo crítico", () => {
    test("estaCritica() deve retornar true quando umidade < 40", () => {
      const leitura = new Leitura({ umidade: 25 });
      expect(leitura.estaCritica()).toBe(true);
    });

    test("estaCritica() deve retornar false quando umidade >= 40", () => {
      const leitura = new Leitura({ umidade: 40 });
      expect(leitura.estaCritica()).toBe(false);
    });
  });
});
