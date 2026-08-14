const leituraView = require("../../../src/views/leituraView.js");

describe("View: leituraView", () => {
  test("apresentarUma() deve formatar uma leitura para exibição", () => {
    const leituraDoBanco = {
      id: 1,
      umidade: 25,
      irrigando: true,
      timestamp: "2025-06-18 14:32:05",
    };

    const resultado = leituraView.apresentarUma(leituraDoBanco);

    expect(resultado).toEqual({
      id: 1,
      umidade: 25,
      irrigando: true,
      critica: true,
      timestamp: "2025-06-18 14:32:05",
    });
  });

  test("apresentarUma() deve marcar critica=false quando umidade >= 40", () => {
    const resultado = leituraView.apresentarUma({
      id: 2,
      umidade: 55,
      irrigando: false,
      timestamp: "2025-06-18 14:33:00",
    });

    expect(resultado.critica).toBe(false);
  });

  test("apresentarMuitas() deve formatar um array de leitura", () => {
    const leituras = [
      { id: 1, umidade: 20, irrigando: true, timestamp: "a" },
      { id: 2, umidade: 80, irrigando: false, timestamp: "b" },
    ];

    const resultado = leituraView.apresentarMuitas(leituras);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].critica).toBe(true);
    expect(resultado[1].critica).toBe(false);
  });
});
