"use client";

import { useEffect, useState } from "react";

type Leitura = {
  id: number;
  umidade: number;
  irrigando: boolean;
  critica: boolean;
  timestamp: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function formatarData(timestamp: string) {
  return new Date(timestamp.replace(" ", "T")).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [ligar, setLigar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const ultimaLeitura = leituras[0];

  async function carregarDados() {
    try {
      setErro("");
      const [leiturasResposta, statusResposta] = await Promise.all([
        fetch(`${API_URL}/leituras?limite=12`),
        fetch(`${API_URL}/status-controle`),
      ]);
      if (!leiturasResposta.ok || !statusResposta.ok) throw new Error();
      setLeituras(await leiturasResposta.json());
      setLigar((await statusResposta.json()).ligar);
    } catch {
      setErro("Não foi possível alcançar a central de irrigação.");
    } finally {
      setCarregando(false);
    }
  }

  async function alterarControle(acao: "ligar" | "desligar") {
    try {
      const resposta = await fetch(`${API_URL}/controle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao }),
      });
      if (!resposta.ok) throw new Error();
      setLigar(acao === "ligar");
    } catch {
      setErro("O comando não foi enviado. Tente novamente.");
    }
  }

  useEffect(() => {
    const cargaInicial = setTimeout(carregarDados, 0);
    const intervalo = setInterval(carregarDados, 30000);
    return () => {
      clearTimeout(cargaInicial);
      clearInterval(intervalo);
    };
  }, []);

  return (
    <main className="dashboard page-reveal">
      <header className="topbar reveal-item">
        <div>
          <p className="eyebrow">Estufa norte / monitoramento</p>
          <h1>Irrigação inteligente</h1>
        </div>
        <button className="refresh" onClick={carregarDados} type="button">
          Atualizar dados
        </button>
      </header>
      {erro && <p className="alert">{erro}</p>}
      <section className="overview" aria-label="Resumo do sistema">
        <article className="hero-stat reveal-item">
          <div className="stat-heading">
            <span>Umidade atual</span>
            <span className="signal">
              {ultimaLeitura ? "Sensor online" : "Aguardando sensor"}
            </span>
          </div>
          <strong>{ultimaLeitura ? `${ultimaLeitura.umidade}%` : "--"}</strong>
          <p>
            {ultimaLeitura?.critica
              ? "Solo abaixo do nível recomendado"
              : "Faixa adequada para o cultivo"}
          </p>
        </article>
        <article className="stat-card reveal-item">
          <span>Estado da bomba</span>
          <strong className={ligar ? "active" : "idle"}>
            {ligar ? "Ligada" : "Desligada"}
          </strong>
          <small>Controle manual</small>
        </article>
        <article className="stat-card reveal-item">
          <span>Leituras recebidas</span>
          <strong>{leituras.length}</strong>
          <small>Últimas 12 amostras</small>
        </article>
      </section>
      <section className="content-grid">
        <article className="panel control-panel reveal-item">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Ação rápida</p>
              <h2>Controle da irrigação</h2>
            </div>
            <span className={`pump ${ligar ? "pump-on" : ""}`} />
          </div>
          <p className="muted">Acione a bomba manualmente quando necessário.</p>
          <div className="control-actions">
            <button
              className="button primary"
              onClick={() => alterarControle("ligar")}
              type="button"
            >
              Ligar bomba
            </button>
            <button
              className="button secondary"
              onClick={() => alterarControle("desligar")}
              type="button"
            >
              Desligar
            </button>
          </div>
        </article>
        <article className="panel readings-panel reveal-item">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Histórico recente</p>
              <h2>Leituras do solo</h2>
            </div>
            <span className="unit">% umidade</span>
          </div>
          {carregando ? (
            <p className="muted">Carregando leituras...</p>
          ) : leituras.length === 0 ? (
            <p className="muted">Nenhuma leitura registrada ainda.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Umidade</th>
                    <th>Irrigação</th>
                  </tr>
                </thead>
                <tbody>
                  {leituras.map((leitura) => (
                    <tr key={leitura.id}>
                      <td>{formatarData(leitura.timestamp)}</td>
                      <td>
                        <b className={leitura.critica ? "critical" : ""}>
                          {leitura.umidade}%
                        </b>
                      </td>
                      <td>
                        <span
                          className={`tag ${leitura.irrigando ? "tag-on" : ""}`}
                        >
                          {leitura.irrigando ? "Ativa" : "Parada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
