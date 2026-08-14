class LeituraRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   *  Persiste uma leitura no banco de dados
   * @param {leitura}
   * @returns {number}
   */
  salvar(leitura) {
    const stmt = this.db.prepare(`
        INSERT INTO leituras (umidade, irrigando)
        VALUES (?, ?)
        `);

    const irrigandoInt = leitura.irrigando ? 1 : 0;

    const resultado = stmt.run(leitura.umidade, irrigandoInt);
    return resultado.lastInsertRowid;
  }

  /**
   * Busca as leituras mais recentes.
   * @param {number}
   * @returns { Array<object>}
   */

  buscarRecentes(limite) {
    const stmt = this.db.prepare(`
        SELECT id, umidade, irrigando, timestamp
        FROM leituras
        ORDER BY id DESC
        LIMIT ?
        `);

    const linhas = stmt.all(limite);

    // Converte inteiro > boolean para cada linha retornada
    return linhas.map((linha) => ({
      ...linha,
      irrigando: linha.irrigando === 1,
    }));
  }
}

module.exports = LeituraRepository;
