/* ============================================
   GPS.dev — app.js
   Autenticação, sidebar, utilitários globais
   ============================================ */

const GPS = {

  /* --- Config --- */
  config: {
    appName:  'GPS.dev Sistema',
    version:  '1.0.0',
    // Senha padrão — alterar antes de entregar ao cliente
    senha:    'gps2025',
    loginKey: 'gps_auth',
  },

  /* ============================================
     AUTH
     ============================================ */
  auth: {
    login(senha) {
      if (senha === GPS.config.senha) {
        sessionStorage.setItem(GPS.config.loginKey, 'ok');
        return true;
      }
      return false;
    },
    logout() {
      sessionStorage.removeItem(GPS.config.loginKey);
      window.location.href = 'index.html';
    },
    check() {
      if (!sessionStorage.getItem(GPS.config.loginKey)) {
        window.location.href = 'index.html';
      }
    },
  },

  /* ============================================
     SIDEBAR
     ============================================ */
  sidebar: {
    init() {
      const sidebar  = document.querySelector('.sidebar');
      const overlay  = document.querySelector('.overlay');
      const hamburger = document.querySelector('.hamburger');
      if (!sidebar) return;

      hamburger?.addEventListener('click', () => GPS.sidebar.toggle());
      overlay?.addEventListener('click',   () => GPS.sidebar.close());

      // Marca item ativo pelo href
      const path = window.location.pathname.split('/').pop();
      document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        if (item.dataset.page === path) item.classList.add('active');
        item.addEventListener('click', () => {
          document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          GPS.sidebar.close();
        });
      });
    },
    toggle() {
      document.querySelector('.sidebar')?.classList.toggle('open');
      document.querySelector('.overlay')?.classList.toggle('open');
    },
    close() {
      document.querySelector('.sidebar')?.classList.remove('open');
      document.querySelector('.overlay')?.classList.remove('open');
    },
  },

  /* ============================================
     TOAST — notificações rápidas
     ============================================ */
  toast: {
    show(msg, tipo = 'success', duracao = 3000) {
      const t = document.createElement('div');
      t.className = `alert alert-${tipo}`;
      t.style.cssText = `
        position:fixed; bottom:1.25rem; right:1.25rem;
        min-width:260px; max-width:360px;
        z-index:9999; animation: fadeIn .2s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      `;
      const icons = { success: 'ri-checkbox-circle-line', danger: 'ri-error-warning-line', warning: 'ri-alert-line' };
      t.innerHTML = `<i class="${icons[tipo] || icons.success}"></i><span>${msg}</span>`;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), duracao);
    },
  },

  /* ============================================
     FORMATAÇÃO
     ============================================ */
  fmt: {
    moeda(valor, moeda = 'BRL') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda }).format(valor);
    },
    data(dateStr) {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    },
    numero(n) {
      return new Intl.NumberFormat('pt-BR').format(n);
    },
  },

  /* ============================================
     STORAGE — localStorage helpers
     ============================================ */
  storage: {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
    del(key) {
      localStorage.removeItem(key);
    },
  },

  /* ============================================
     INIT
     ============================================ */
  init() {
    GPS.sidebar.init();
    console.log(`%c GPS.dev ${GPS.config.version} `, 'background:#F97316;color:#fff;font-weight:bold;border-radius:4px;padding:2px 6px;');
  },
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => GPS.init());
