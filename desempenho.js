import { desempenhoJogadores } from "./desempenho_data.js";

const radarOptions = {
  scales: {
    r: { 
      min: 0, 
      max: 16, 
      ticks: { stepSize: 4, color: '#fff', backdropColor: 'transparent', display: false },
      grid: { color: 'rgba(255,255,255,0.1)' }, 
      angleLines: { color: 'rgba(255,255,255,0.1)' }, 
      pointLabels: { color: '#fff', font: { size: 12 } } 
    }
  },
  plugins: { 
    legend: { display: false }, 
    tooltip: { enabled: true } 
  },
  elements: { line: { tension: 0.2 } }
};

document.addEventListener("DOMContentLoaded", () => {
  renderDesempenho();
});

function renderDesempenho() {
  const container = document.getElementById("desempenhoContainer");
  if (!container) return;

  container.innerHTML = "";

  // Converte o objeto em array para ordenar pela média
  const jogadoresArray = Object.entries(desempenhoJogadores).map(([nome, stats]) => {
    const media = stats.reduce((a, b) => a + b, 0) / 5;
    return { nome, stats, media };
  });

  // Ordena pela média técnica (maior para menor)
  jogadoresArray.sort((a, b) => b.media - a.media);

  jogadoresArray.forEach((j, index) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.style.animation = "fadeUp .4s ease both";
    card.style.animationDelay = `${index * 0.05}s`;

    const canvasId = `chart_desempenho_${index}`;

    card.innerHTML = `
      <div class="media-badge">Média: ${j.media.toFixed(1)}</div>
      <h3 style="color: #00ff88; margin: 10px 0;">${j.nome}</h3>
      <canvas id="${canvasId}"></canvas>
    `;

    container.appendChild(card);

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Defesa', 'Ataque', 'Habilidade', 'Velocidade', 'Passe'],
        datasets: [{
          data: j.stats,
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#00ff88'
        }]
      },
      options: radarOptions
    });
  });
}
