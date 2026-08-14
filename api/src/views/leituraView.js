const LIMIAR_CRITICO = 40;

function apresentarUma(leitura) {
  return {
    id: leitura.id,
    umidade: leitura.umidade,
    irrigando: leitura.irrigando,
    critica: leitura.umidade < LIMIAR_CRITICO,
    timestamp: leitura.timestamp,
  };
}

function apresentarMuitas(leituras) {
  return leituras.map(apresentarUma);
}

module.exports = {
  apresentarUma,
  apresentarMuitas,
};
