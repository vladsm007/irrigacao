const Controle = require("../models/Controle");

class ControleController {
  constructor(controleRepository) {
    this.controleRepository = controleRepository;
  }

  atualizar(req, res) {
    try {
      const controle = new Controle(req.body);
      this.controleRepository.atualizar(controle);

      return res.status(200).json({
        sucesso: true,
        acao: controle.acao,
      });
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  buscarStatus(req, res) {
    const ligar = this.controleRepository.buscarEstadoAtual();
    return res.status(200).json({ ligar });
  }
}

module.exports = ControleController;
