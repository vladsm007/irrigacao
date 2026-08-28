const express = require("express");
const cors = require("cors");
const criarRotasLeitura = require("./routes/leituraRoutes");
const criarRotasControle = require("./routes/controleRoutes");

function criarApp(db) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/leituras", criarRotasLeitura(db));
  app.use("/", criarRotasControle(db));

  return app;
}

module.exports = { criarApp };
