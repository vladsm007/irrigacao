const Database = require("better-sqlite3");

/**
 * Cria e inicializa uma conexão com o banco de dados.
 * @param {string}
 * @returns {Database}
 */

function criarConexao(caminho) {
  const db = new Database(caminho);

  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS leituras (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    umidade   INTEGER NOT NULL,
    irrigando INTEGER NOT NULL DEFAULT 0,
    timestamp TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
    `);

  db.exec(`
      CREATE TABLE IF NOT EXISTS controle (
      id    INTEGER PRIMARY KEY,
      valor INTEGER NOT NULL DEFAULT 0
      )
      `);

  db.prepare("INSERT OR IGNORE INTO controle (id, valor) VALUES (1, 0)").run();

  return db;
}

module.exports = { criarConexao };
