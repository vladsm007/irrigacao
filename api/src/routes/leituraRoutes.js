const express = require("express");
const LeituraRepository = require("../repositories/LeituraRepository");
const LeituraController = require("../controllers/leituraController");

function criarRotasLeitura(db) {
  const router = express.Router();

  // Monta a cadeia de dependências: Repository -> Controller
  const repository = new LeituraRepository(db);
  const controller = new LeituraController(repository);

  router.post("/", controller.criar.bind(controller));
  router.get("/", controller.listar.bind(controller));

  return router;
}

module.exports = criarRotasLeitura;
