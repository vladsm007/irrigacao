const Controle = require("../../../src/models/Controle");

describe("Model: Controle", () => {
  test("deve criar um controle com ação 'ligar'", () => {
    const controle = new Controle({ acao: "ligar" });
    expect(controle.acao).toBe("ligar");
    expect(controle.paraValorNumerico()).toBe(1);
  });

  test("deve criar um controle com ação 'deslgiar'", () => {
    const controle = new Controle({ acao: "desligar" });
    expect(controle.acao).toBe("desligar");
    expect(controle.paraValorNumerico()).toBe(0);
  });

  test("deve lançar erro para uma ação inválida", () => {
    expect(() => {
      new Controle({});
    }).toThrow("Campo 'acao' deve ser 'ligar' ou 'desligar'.");
  });
});
