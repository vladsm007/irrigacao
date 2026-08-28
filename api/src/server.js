const path = require("path");
require("dotenv").config();
const { criarConexao } = require("./config/database");
const { criarApp } = require("./app");

const caminhoBancoConfigurado = process.env.DB_PATH || "./data/irrigacao.db";
const caminhoBanco = path.isAbsolute(caminhoBancoConfigurado)
  ? caminhoBancoConfigurado
  : path.resolve(__dirname, "..", caminhoBancoConfigurado);
const porta = process.env.PORT || 3000;
const fs = require("fs");
fs.mkdirSync(path.dirname(caminhoBanco), { recursive: true });
const db = criarConexao(caminhoBanco);
const app = criarApp(db);

app.listen(porta, () => {
  console.log(`Servidor MVC rodando em http://localhost:${porta}`);
  console.log(`Banco de dados: ${caminhoBanco}`);
});
