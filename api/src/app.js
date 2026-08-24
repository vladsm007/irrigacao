const express = require("express");
const cors = require("cors");

/**
 * @param {Database}
 */

function criarApp(db) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  return app;
}

module.exports = { criarApp };
