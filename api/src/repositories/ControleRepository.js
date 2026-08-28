class ControleRepository {
  constructor(db) {
    this.db = db;
  }

  buscarEstadoAtual() {
    const linha = this.db.prepare("SELECT valor FROM controle WHERE id = 1").get();

    return linha.valor === 1;
  }

  atualizar(controle) {
    this.db.prepare("UPDATE controle SET valor = ? WHERE id = 1").run(controle.paraValorNumerico());
  }
}

module.exports = ControleRepository;
