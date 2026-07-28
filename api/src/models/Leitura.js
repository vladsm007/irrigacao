const UMIDADE_CRITICA = 40;

class Leitura {
  constructor({ umidade, irrigando }) {
    if (umidade === undefined || umidade === null) {
      throw new Error("Campo 'umidade' é obrigatório.");
    }

    // Validação: precisa ser um número entre 0 e 100
    const umidadeNum = Number(umidade);
    if (!Number.isFinite(umidadeNum) || umidadeNum < 0 || umidade > 100) {
      throw new Error("Campo 'umidade' deve ser um número entre 0 e 100.");
    }

    this.umidade = umidadeNum;

    // Se "irrigando" não foi informado. assuime false
    this.irrigando = Boolean(irrigando);
  }

  estaCritica() {
    return this.umidade < UMIDADE_CRITICA;
  }
}

module.exports = Leitura;
