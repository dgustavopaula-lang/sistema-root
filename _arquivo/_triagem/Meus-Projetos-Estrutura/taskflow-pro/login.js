// ======================================================
// TASKFLOW PRO — login.js
// Sistema de autenticação local com localStorage
// ======================================================

// ===== HELPERS =====
function toast(msg, tipo = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${tipo} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function setErro(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function limparErros(...ids) {
  ids.forEach(id => setErro(id, ''));
}

function setInputEstado(inputId, estado) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.remove('erro', 'ok');
  if (estado) el.classList.add(estado);
}

function loading(txtId, loaderId, ativo) {
  document.getElementById(txtId).style.display    = ativo ? 'none' : '';
  document.getElementById(loaderId).style.display = ativo ? '' : 'none';
}

// ===== ABAS =====
function mostrarAba(aba) {
  document.getElementById('form-login').style.display     = aba === 'login'    ? '' : 'none';
  document.getElementById('form-cadastro').style.display  = aba === 'cadastro' ? '' : 'none';
  document.getElementById('form-recuperar').style.display = aba === 'recuperar'? '' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    aba === 'login');
  document.getElementById('tab-cadastro').classList.toggle('active', aba === 'cadastro');
}

function mostrarRecuperar() {
  document.getElementById('form-login').style.display     = 'none';
  document.getElementById('form-cadastro').style.display  = 'none';
  document.getElementById('form-recuperar').style.display = '';
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-cadastro').classList.remove('active');
}

// ===== TOGGLE SENHA =====
function toggleSenha(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ===== FORÇA DA SENHA =====
document.getElementById('cad-senha').addEventListener('input', function() {
  const val = this.value;
  const forca = document.getElementById('senha-forca');
  const fill  = document.getElementById('forca-fill');
  const label = document.getElementById('forca-label');

  if (!val) { forca.style.display = 'none'; return; }
  forca.style.display = 'flex';

  let pts = 0;
  if (val.length >= 6)           pts++;
  if (val.length >= 10)          pts++;
  if (/[A-Z]/.test(val))         pts++;
  if (/[0-9]/.test(val))         pts++;
  if (/[^A-Za-z0-9]/.test(val))  pts++;

  const niveis = [
    { pct: '20%', cor: '#ef4444', txt: 'Fraca',   txtCor: '#ef4444' },
    { pct: '40%', cor: '#f97316', txt: 'Razoável', txtCor: '#f97316' },
    { pct: '60%', cor: '#f59e0b', txt: 'Boa',      txtCor: '#f59e0b' },
    { pct: '80%', cor: '#84cc16', txt: 'Forte',    txtCor: '#84cc16' },
    { pct:'100%', cor: '#22c55e', txt: 'Excelente',txtCor: '#22c55e' },
  ];
  const nivel = niveis[Math.min(pts, 4)];
  fill.style.width      = nivel.pct;
  fill.style.background = nivel.cor;
  label.textContent     = nivel.txt;
  label.style.color     = nivel.txtCor;
});

// ===== VALIDAÇÕES =====
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== BANCO LOCAL DE USUÁRIOS =====
function getUsuarios() {
  return JSON.parse(localStorage.getItem('tf_usuarios') || '[]');
}

function salvarUsuarios(users) {
  localStorage.setItem('tf_usuarios', JSON.stringify(users));
}

function salvarSessao(user) {
  localStorage.setItem('tf_sessao', JSON.stringify({
    nome:  user.nome,
    email: user.email,
    plano: user.plano || 'free',
    ts:    Date.now()
  }));
}

// ===== LOGIN =====
async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const lembrar = document.getElementById('lembrar').checked;

  limparErros('err-login-email','err-login-senha');
  let ok = true;

  if (!validarEmail(email)) {
    setErro('err-login-email', 'E-mail inválido.');
    setInputEstado('login-email','erro');
    ok = false;
  }
  if (senha.length < 6) {
    setErro('err-login-senha', 'Senha deve ter ao menos 6 caracteres.');
    setInputEstado('login-senha','erro');
    ok = false;
  }
  if (!ok) return;

  loading('login-txt','login-loader', true);
  await esperar(900); // simula chamada de API

  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  loading('login-txt','login-loader', false);

  if (!user) {
    setErro('err-login-senha', 'E-mail ou senha incorretos.');
    setInputEstado('login-email','erro');
    setInputEstado('login-senha','erro');
    toast('❌ Credenciais incorretas', 'error');
    return;
  }

  setInputEstado('login-email','ok');
  setInputEstado('login-senha','ok');
  salvarSessao(user);
  if (!lembrar) sessionStorage.setItem('tf_sessao_temp','1');

  toast(`✅ Bem-vindo, ${user.nome.split(' ')[0]}!`);
  setTimeout(() => { window.location.href = 'index.html'; }, 900);
}

// ===== CADASTRO =====
async function fazerCadastro() {
  const nome      = document.getElementById('cad-nome').value.trim();
  const email     = document.getElementById('cad-email').value.trim();
  const senha     = document.getElementById('cad-senha').value;
  const confirmar = document.getElementById('cad-confirmar').value;
  const termos    = document.getElementById('aceitar-termos').checked;

  limparErros('err-cad-nome','err-cad-email','err-cad-senha','err-cad-confirmar','err-termos');
  let ok = true;

  if (nome.length < 3) {
    setErro('err-cad-nome', 'Nome deve ter ao menos 3 letras.');
    setInputEstado('cad-nome','erro'); ok = false;
  } else { setInputEstado('cad-nome','ok'); }

  if (!validarEmail(email)) {
    setErro('err-cad-email', 'E-mail inválido.');
    setInputEstado('cad-email','erro'); ok = false;
  } else { setInputEstado('cad-email','ok'); }

  if (senha.length < 6) {
    setErro('err-cad-senha', 'Senha deve ter ao menos 6 caracteres.');
    setInputEstado('cad-senha','erro'); ok = false;
  } else { setInputEstado('cad-senha','ok'); }

  if (senha !== confirmar) {
    setErro('err-cad-confirmar', 'As senhas não coincidem.');
    setInputEstado('cad-confirmar','erro'); ok = false;
  } else if (confirmar) { setInputEstado('cad-confirmar','ok'); }

  if (!termos) {
    setErro('err-termos', 'Você precisa aceitar os termos para continuar.');
    ok = false;
  }

  if (!ok) return;

  const usuarios = getUsuarios();
  if (usuarios.find(u => u.email === email)) {
    setErro('err-cad-email', 'Este e-mail já está cadastrado.');
    setInputEstado('cad-email','erro');
    toast('⚠ E-mail já cadastrado', 'warning');
    return;
  }

  loading('cad-txt','cad-loader', true);
  await esperar(1000);

  const novoUser = { nome, email, senha, plano: 'free', criadoEm: new Date().toISOString() };
  usuarios.push(novoUser);
  salvarUsuarios(usuarios);
  salvarSessao(novoUser);

  loading('cad-txt','cad-loader', false);
  toast(`🎉 Conta criada! Bem-vindo, ${nome.split(' ')[0]}!`);
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// ===== RECUPERAR SENHA =====
async function recuperarSenha() {
  const email = document.getElementById('rec-email').value.trim();
  limparErros('err-rec-email');

  if (!validarEmail(email)) {
    setErro('err-rec-email', 'Informe um e-mail válido.');
    setInputEstado('rec-email','erro');
    return;
  }

  await esperar(800);

  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.email === email);

  if (user) {
    // Em produção: envia e-mail real via backend
    toast(`📧 Instruções enviadas para ${email}`, 'success');
  } else {
    // Não revelar se o e-mail existe (segurança)
    toast(`📧 Se este e-mail existir, você receberá as instruções.`, 'warning');
  }

  setTimeout(() => mostrarAba('login'), 2500);
}

// ===== LOGIN DEMO =====nfunction loginDemo() {
  const usuarios = getUsuarios();
  let demo = usuarios.find(u => u.email === 'demo@taskflow.com');

  if (!demo) {
    demo = { nome: 'Usuário Demo', email: 'demo@taskflow.com', senha: 'demo123', plano: 'pro' };
    usuarios.push(demo);
    salvarUsuarios(usuarios);
  }

  salvarSessao(demo);
  toast('🎯 Entrando como Demo (Plano Pro)...');
  setTimeout(() => { window.location.href = 'index.html'; }, 800);
}

// ===== HELPER DELAY =====
function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ===== VERIFICAR SE JÁ ESTÁ LOGADO =====
(function checarSessao() {
  const sessao = localStorage.getItem('tf_sessao');
  if (sessao) {
    const dados = JSON.parse(sessao);
    const umDia = 24 * 60 * 60 * 1000;
    // Se sessão válida há menos de 1 dia, redireciona
    if (Date.now() - dados.ts < umDia) {
      window.location.href = 'index.html';
    }
  }
})();

// ===== ENTER NOS INPUTS =====
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginVisivel = document.getElementById('form-login').style.display !== 'none';
  const cadVisivel   = document.getElementById('form-cadastro').style.display !== 'none';
  const recVisivel   = document.getElementById('form-recuperar').style.display !== 'none';
  if (loginVisivel) fazerLogin();
  if (cadVisivel)   fazerCadastro();
  if (recVisivel)   recuperarSenha();
});

// ===== CRIAR CONTA DEMO PADRÃO (para testes) =====
(function criarDemoPadrao() {
  const usuarios = getUsuarios();
  if (!usuarios.find(u => u.email === 'admin@taskflow.com')) {
    usuarios.push({ nome: 'Admin TaskFlow', email: 'admin@taskflow.com', senha: '123456', plano: 'business' });
    salvarUsuarios(usuarios);
  }
})();
