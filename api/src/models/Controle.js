const ACOES_VALIDAS = ["ligar", "desligar"];

class Controle {
  constructor({ acao }) {
    if (!ACOES_VALIDAS.includes(acao)) {
      throw new Error("Campo 'acao' deve ser 'ligar' ou 'desligar'.");
    }
    this.acao = acao;
  }
  paraValorNumerico() {
    return this.acao === "ligar" ? 1 : 0;
  }
}

module.exports = Controle;
