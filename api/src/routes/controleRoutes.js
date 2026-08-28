const express = require("express");
const ControleRepository = require("../repositories/ControleRepository");
const ControleController = require("../controllers/controleController");

function criarRotasControle(db) {
  const router = express.Router();
  const repository = new ControleRepository(db);
  const controller = new ControleController(repository);

  router.post("/controle", controller.atualizar.bind(controller));
  router.get("/status-controle", controller.buscarStatus.bind(controller));

  return router;
}

module.exports = criarRotasControle;
