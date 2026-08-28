const Leitura = require("../models/Leitura");
const leituraView = require("../views/leituraView");

class LeituraController {
  constructor(leituraRepository) {
    this.leituraRepository = leituraRepository;
  }

  criar(req, res) {
    try {
      // O Model valida os dados - se algo estiver errado, ele lança um Error aqui
      const leitura = new Leitura(req.body);

      // dados são válidados
      const id = this.leituraRepository.salvar(leitura);

      return res.status(201).json({
        sucesso: true,
        id: id,
        mensagem: "Leitura registrada com sucesso.",
      });
    } catch (erro) {
      // Qualquer erro de validação do Model vira um resposta 400
      return res.status(400).json({ erro: erro.message });
    }
  }

  listar(req, res) {
    const limite = parseInt(req.query.limite) || 50;
    const limiteSeguro = Math.min(Math.max(limite, 1), 500);

    const leituras = this.leituraRepository.buscarRecentes(limiteSeguro);
    const leiturasFormatadas = leituraView.apresentarMuitas(leituras);

    return res.status(200).json(leiturasFormatadas);
  }
}

module.exports = LeituraController;
