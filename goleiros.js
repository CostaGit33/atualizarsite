import { apiRequest, calculatePoints } from "./globais.js";

/* ======================================================
   CONFIGURAÇÃO
====================================================== */
const GOLEIROS_ENDPOINT = "/goleiros";

/* ======================================================
   INICIALIZAÇÃO
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  carregarGoleiros();
});

/* ======================================================
   LÓGICA PRINCIPAL
====================================================== */
async function carregarGoleiros() {
  const tbody = document.getElementById("tabela-goleiros");
  const cardsContainer = document.getElementById("cards-goleiros");

  try {
    const dados = await apiRequest(GOLEIROS_ENDPOINT);
    const goleirosProcessados = normalizar(dados);

    if (tbody) renderTabela(goleirosProcessados, tbody);
    if (cardsContainer) renderCards(goleirosProcessados, cardsContainer);

  } catch (err) {
    console.error("Erro ao carregar goleiros:", err);
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:2rem;">
            Erro ao carregar dados dos goleiros.
          </td>
        </tr>
      `;
    }
  }
}

/* ======================================================
   NORMALIZAÇÃO E CÁLCULO
====================================================== */
function normalizar(lista) {
  if (!Array.isArray(lista)) return [];

  return lista
    .map(g => {
      const v = Number(g.vitorias) || 0;
      const e = Number(g.empate) || 0;
      const d = Number(g.defesa) || 0;
      const gols = Number(g.gols) || 0;
      const inf = Number(g.infracoes) || 0;

      return {
        ...g,
        vitorias: v,
        empate: e,
        defesa: d,
        gols: gols,
        infracoes: inf,
        pontos: calculatePoints(v, e, d, gols, inf)
      };
    })
    .sort((a, b) =>
      b.pontos - a.pontos ||
      b.defesa - a.defesa ||
      b.vitorias - a.vitorias
    );
}

/* ======================================================
   FORMATADOR VISUAL DE PONTOS
====================================================== */
function formatarPontos(valor) {
  return String(Math.floor(valor)).padStart(2, "0");
}

/* ======================================================
   RENDERIZAÇÃO DA TABELA
====================================================== */
function renderTabela(lista, tbody) {
  tbody.innerHTML = lista.map((g, i) => `
    <tr>
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td>
        <a href="jogador.html?id=${g.id}" class="player-link">
          ${g.nome}
        </a>
      </td>
      <td><strong>${formatarPontos(g.pontos)}</strong></td>
      <td>${g.vitorias}</td>
      <td>${g.empate}</td>
      <td>${g.gols}</td>
      <td>${g.defesa}</td>
      <td>${g.infracoes}</td>
    </tr>
  `).join("");
}

/* ======================================================
   RENDERIZAÇÃO DOS CARDS
====================================================== */
function renderCards(lista, container) {
  container.innerHTML = "";

  lista.forEach((g, i) => {
    const card = document.createElement("div");
    card.className = "player-card";

    if (i === 0) card.classList.add("top-1");
    if (i === 1) card.classList.add("top-2");
    if (i === 2) card.classList.add("top-3");

    const percentual = Math.min(
      (g.pontos / (lista[0]?.pontos || 1)) * 100,
      100
    );

    card.innerHTML = `
      <div class="player-rank">#${String(i + 1).padStart(2, "0")}</div>
      <div class="player-name">${g.nome}</div>
      <div class="player-points">
        ${formatarPontos(g.pontos)} pts
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentual}%"></div>
      </div>

      <div class="player-stats">
        <span>🧤 ${g.defesa} Defesas</span>
        <span>🏆 ${g.vitorias} Vitórias</span>
      </div>
    `;

    container.appendChild(card);
  });
}
