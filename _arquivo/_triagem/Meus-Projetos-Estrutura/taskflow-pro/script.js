// ======================================================
// TASKFLOW PRO — script.js
// ======================================================

// ===== ESTADO GLOBAL =====
let planoAtual = localStorage.getItem('tf_plano') || 'free'; // 'free' | 'pro' | 'business'
const LIMITE_FREE = 5;

let tarefas = JSON.parse(localStorage.getItem('tf_tarefas') || '[]');

// Se não houver tarefas salvas, cria exemplos
if (tarefas.length === 0) {
  tarefas = [
    { id: 1, titulo: "Revisar relatório do mês",    categoria: "Trabalho",   prioridade: "alta",  status: "pendente",   data: hoje() },
    { id: 2, titulo: "Responder e-mails",            categoria: "Trabalho",   prioridade: "media", status: "concluida",  data: hoje() },
    { id: 3, titulo: "Ligar para cliente",           categoria: "Trabalho",   prioridade: "alta",  status: "pendente",   data: hoje() },
    { id: 4, titulo: "Estudar JavaScript",           categoria: "Estudo",     prioridade: "media", status: "concluida",  data: hoje() },
    { id: 5, titulo: "Academia",                     categoria: "Saúde",      prioridade: "baixa", status: "concluida",  data: hoje() },
  ];
  salvar();
}

let filtroAtual = 'todas';

// ===== HELPERS =====
function hoje() {
  return new Date().toISOString().split('T')[0];
}

function salvar() {
  localStorage.setItem('tf_tarefas', JSON.stringify(tarefas));
  localStorage.setItem('tf_plano', planoAtual);
}

function toast(msg, tipo = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${tipo} show`;
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== RELÓGIO E DATA =====
function atualizarRelogio() {
  const a = new Date();
  const h = String(a.getHours()).padStart(2,'0');
  const m = String(a.getMinutes()).padStart(2,'0');
  const s = String(a.getSeconds()).padStart(2,'0');
  document.getElementById('relogio').textContent = `${h}:${m}:${s}`;
}

function atualizarData() {
  const a = new Date();
  document.getElementById('data-atual').textContent =
    a.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

// ===== NAVEGAÇÃO =====
function navegarPara(pagina, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + pagina).classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  const titulos = { dashboard: 'Dashboard', relatorio: 'Relatórios', planos: 'Planos e Preços' };
  document.getElementById('page-title').textContent = titulos[pagina] || pagina;
  document.getElementById('btn-nova-tarefa').style.display = pagina === 'dashboard' ? '' : 'none';

  if (pagina === 'relatorio') renderizarRelatorio();
}

// ===== RENDERIZAR TAREFAS =====
function renderizar() {
  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';

  const filtradas = tarefas.filter(t => {
    if (filtroAtual === 'todas') return true;
    return t.status === filtroAtual;
  });

  if (filtradas.length === 0) {
    lista.innerHTML = `<li style="text-align:center;color:var(--muted);padding:28px 0;font-size:13px;">
      Nenhuma tarefa aqui 🎉
    </li>`;
  }

  filtradas.forEach(t => {
    const li = document.createElement('li');
    li.className = `task-item ${t.status === 'concluida' ? 'concluida' : ''}`;
    li.innerHTML = `
      <button class="task-check ${t.status === 'concluida' ? 'checked' : ''}"
              onclick="toggleStatus(${t.id})" title="Concluir">
        ${t.status === 'concluida' ? '✓' : ''}
      </button>
      <div class="task-info">
        <div class="task-title">${t.titulo}</div>
        <div class="task-meta">📁 ${t.categoria}</div>
      </div>
      <span class="badge ${t.prioridade}">
        ${t.prioridade === 'alta' ? '🔴 Alta' : t.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}
      </span>
      <button class="task-delete" onclick="deletarTarefa(${t.id})" title="Remover">✕</button>
    `;
    lista.appendChild(li);
  });

  atualizarKPIs();
  atualizarSidebarFreemium();
}

// ===== KPIs =====
function atualizarKPIs() {
  const total = tarefas.length;
  const conc  = tarefas.filter(t => t.status === 'concluida').length;
  const pend  = tarefas.filter(t => t.status === 'pendente').length;
  const alta  = tarefas.filter(t => t.prioridade === 'alta').length;

  document.getElementById('kpi-total').textContent     = total;
  document.getElementById('kpi-concluidas').textContent = conc;
  document.getElementById('kpi-pendentes').textContent  = pend;
  document.getElementById('kpi-alta').textContent       = alta;

  document.getElementById('bar-conc').style.width = total ? (conc/total*100)+'%' : '0%';
  document.getElementById('bar-pend').style.width = total ? (pend/total*100)+'%' : '0%';
  document.getElementById('bar-alta').style.width = total ? (alta/total*100)+'%' : '0%';

  const pct = total ? Math.round(conc/total*100) : 0;
  document.getElementById('ring-fill').style.strokeDashoffset = 314 - (pct/100)*314;
  document.getElementById('pct-valor').textContent = pct + '%';
}

// ===== SIDEBAR FREEMIUM =====
function atualizarSidebarFreemium() {
  const uso = tarefas.length;
  const isPro = planoAtual !== 'free';

  document.getElementById('uso-tarefas').textContent = uso;
  document.getElementById('plano-nome-sidebar').textContent =
    planoAtual === 'free' ? 'Plano Grátis' : planoAtual === 'pro' ? '⭐ Plano Pro' : '💼 Business';
  document.getElementById('plano-fill').style.width =
    isPro ? '100%' : Math.min((uso / LIMITE_FREE) * 100, 100) + '%';
  document.getElementById('user-plan-display').textContent =
    planoAtual === 'free' ? 'Plano Grátis' : planoAtual === 'pro' ? 'Plano Pro' : 'Business';

  // Card bloqueio no dashboard
  const fcCard = document.getElementById('freemium-card');
  if (fcCard) fcCard.style.display = isPro ? 'none' : '';

  // Trava de uso
  const usoEl = document.getElementById('uso-tarefas');
  if (usoEl) usoEl.textContent = isPro ? uso : `${uso}`;
}

// ===== AÇÕES DE TAREFA =====
function toggleStatus(id) {
  const t = tarefas.find(t => t.id === id);
  if (!t) return;
  t.status = t.status === 'concluida' ? 'pendente' : 'concluida';
  salvar();
  renderizar();
  toast(t.status === 'concluida' ? '✅ Tarefa concluída!' : '↩ Tarefa reaberta', t.status === 'concluida' ? 'success' : 'warning');
}

function deletarTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvar();
  renderizar();
  toast('🗑 Tarefa removida', 'warning');
}

function filtrar(tipo, btn) {
  filtroAtual = tipo;
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderizar();
}

// ===== MODAL =====
function abrirModal() {
  if (planoAtual === 'free' && tarefas.length >= LIMITE_FREE) {
    toast(`🔒 Limite de ${LIMITE_FREE} tarefas no plano grátis. Faça upgrade!`, 'error');
    setTimeout(() => navegarPara('planos', document.querySelector('.nav-item:nth-child(3)')), 1000);
    return;
  }
  document.getElementById('modal').classList.add('open');
  document.getElementById('input-titulo').focus();
}

function fecharModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('input-titulo').value = '';
}

function fecharModalFora(e) {
  if (e.target.id === 'modal') fecharModal();
}

function adicionarTarefa() {
  const titulo = document.getElementById('input-titulo').value.trim();
  if (!titulo) {
    document.getElementById('input-titulo').style.borderColor = 'var(--red)';
    setTimeout(() => document.getElementById('input-titulo').style.borderColor = '', 1500);
    return;
  }
  tarefas.unshift({
    id:         Date.now(),
    titulo,
    categoria:  document.getElementById('input-categoria').value,
    prioridade: document.getElementById('input-prioridade').value,
    status:     'pendente',
    data:       hoje()
  });
  salvar();
  fecharModal();
  renderizar();
  toast('✅ Tarefa adicionada!');
}

// ===== PLANOS =====
function ativarPlano(plano) {
  if (plano === planoAtual) return;
  planoAtual = plano;
  salvar();
  atualizarBotoesPlan();
  renderizar();
  const nomes = { free: 'Grátis', pro: 'Pro ⭐', business: 'Business 💼' };
  toast(`🎉 Plano ${nomes[plano]} ativado!`, 'success');
}

function atualizarBotoesPlan() {
  ['free','pro','business'].forEach(p => {
    const btn = document.getElementById('btn-' + p);
    if (!btn) return;
    if (p === planoAtual) {
      btn.textContent = 'Plano atual ✓';
      btn.className = 'btn-plano ' + (p === 'free' ? 'ativo' : 'ativo-pro');
    } else {
      btn.className = 'btn-plano';
      btn.textContent = p === 'free' ? 'Usar Free' : p === 'pro' ? 'Assinar Pro' : 'Assinar Business';
    }
  });
}

// ===== LOGOUT =====
function fazerLogout() {
  localStorage.removeItem('tf_sessao');
  sessionStorage.removeItem('tf_sessao_temp');
  toast('🔒 Sessão encerrada', 'success');
  setTimeout(() => {
    // Redirect to login page if exists, otherwise reload
    if (location.pathname.endsWith('index.html') || location.pathname === '/') {
      // try to go to login.html (may be added separately)
      location.href = 'login.html';
    } else {
      location.reload();
    }
  }, 700);
}

// ===== RELATÓRIOS =====
const CORES = ['#6366f1','#22c55e','#f59e0b','#ef4444','#a78bfa','#06b6d4'];

function renderizarRelatorio() {
  const isPro = planoAtual !== 'free';
  document.getElementById('relatorio-gate').style.display    = isPro ? 'none' : '';
  document.getElementById('relatorio-conteudo').style.display = isPro ? '' : 'none';
  if (!isPro) return;

  // KPIs
  const total = tarefas.length;
  const conc  = tarefas.filter(t => t.status === 'concluida').length;
  document.getElementById('rel-taxa').textContent   = total ? Math.round(conc/total*100)+'%' : '0%';
  document.getElementById('rel-semana').textContent = total;
  document.getElementById('rel-meta').textContent   = total ? (conc/total*100 >= 70 ? '✅ Atingida' : '⚠ Abaixo') : '--';

  // Gráfico de barras — últimos 7 dias (simulado)
  const dias = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const barChart = document.getElementById('bar-chart');
  const labelsEl = document.getElementById('chart-labels');
  barChart.innerHTML = '';
  labelsEl.innerHTML = '';

  const maxVal = 8;
  dias.forEach((dia, i) => {
    const concDia = Math.floor(Math.random() * 6);
    const pendDia = Math.floor(Math.random() * 4);
    const hConc = Math.round((concDia / maxVal) * 120);
    const hPend = Math.round((pendDia / maxVal) * 120);

    barChart.innerHTML += `
      <div class="bar-col">
        <span class="bar-val">${concDia + pendDia}</span>
        <div class="bar-conc" style="height:${hConc}px"></div>
        <div class="bar-pend" style="height:${hPend}px"></div>
      </div>`;
    labelsEl.innerHTML += `<span>${dia}</span>`;
  });

  // Gráfico donut — por categoria
  const cats = {};
  tarefas.forEach(t => {
    cats[t.categoria] = (cats[t.categoria] || 0) + 1;
  });
  const catArr = Object.entries(cats);
  const totalCat = catArr.reduce((s,[,v]) => s + v, 0) || 1;

  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  svg.innerHTML = '';
  legend.innerHTML = '';

  let offset = 0;
  const r = 50, cx = 80, cy = 80, circ = 2 * Math.PI * r;

  catArr.forEach(([nome, qtd], i) => {
    const frac = qtd / totalCat;
    const dash = frac * circ;
    const cor  = CORES[i % CORES.length];
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', cor);
    circle.setAttribute('stroke-width', '28');
    circle.setAttribute('stroke-dasharray', `${dash} ${circ - dash}`);
    circle.setAttribute('stroke-dashoffset', -offset * circ / 1);
    circle.style.transform = 'rotate(-90deg)';
    circle.style.transformOrigin = `${cx}px ${cy}px`;
    circle.style.strokeDashoffset = -(offset * circ);
    svg.appendChild(circle);
    offset += frac;

    legend.innerHTML += `
      <div class="legend-item">
        <div class="legend-dot" style="background:${cor}"></div>
        <span>${nome} (${qtd})</span>
      </div>`;
  });

  if (catArr.length === 0) {
    svg.innerHTML = `<circle cx="80" cy="80" r="50" fill="none" stroke="var(--border)" stroke-width="28"/>`;
    legend.innerHTML = `<span style="color:var(--muted);font-size:12px">Nenhuma tarefa</span>`;
  }

  // Tabela histórico
  const tbody = document.getElementById('hist-tbody');
  tbody.innerHTML = tarefas.map(t => `
    <tr>
      <td>${t.titulo}</td>
      <td><span style="color:var(--muted)">${t.categoria}</span></td>
      <td><span class="badge ${t.prioridade}">${t.prioridade === 'alta' ? '🔴 Alta' : t.prioridade === 'media' ? '🟡 Média' : '🟢 Baixa'}</span></td>
      <td><span style="color:${t.status === 'concluida' ? 'var(--green)' : 'var(--yellow)'}">
        ${t.status === 'concluida' ? '✅ Concluída' : '⏳ Pendente'}
      </span></td>
    </tr>
  `).join('');
}

// ===== EXPORTAR CSV =====
function exportarCSV() {
  const header = 'Título,Categoria,Prioridade,Status,Data\n';
  const rows   = tarefas.map(t =>
    `"${t.titulo}","${t.categoria}","${t.prioridade}","${t.status}","${t.data || hoje()}"`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `taskflow-export-${hoje()}.csv`;
  a.click();
  toast('📥 CSV exportado!', 'success');
}

// ===== DICAS =====
const dicas = [
  "Concentre-se nas 3 tarefas mais importantes antes do meio-dia.",
  "Use a regra dos 2 minutos: se leva menos de 2 min, faça agora.",
  "Descansos curtos aumentam a produtividade — tente a técnica Pomodoro.",
  "Revise suas prioridades no início de cada semana.",
  "Agrupe tarefas similares para reduzir troca de contexto.",
  "Um ambiente organizado reduz distrações e aumenta o foco."
];

// ===== TECLADO =====
document.addEventListener('keydown', e => {
  const modal = document.getElementById('modal');
  if (e.key === 'Enter' && modal.classList.contains('open')) adicionarTarefa();
  if (e.key === 'Escape') fecharModal();
});

// ===== INICIALIZAR =====
atualizarData();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);
document.getElementById('dica-texto').textContent = dicas[Math.floor(Math.random() * dicas.length)];
atualizarBotoesPlan();
renderizar();