// ==========================================
// COFRE DIGITAL - JAVASCRIPT
// Gerenciador de Senhas Seguro
// ==========================================

// CONSTANTES E CONFIGURAÇÃO
const CONFIG = {
    KEY_COFRE: 'cofre_digital_data',
    KEY_MASTER: 'cofre_digital_master',
    MAX_SENHAS_GRATUITO: 5,
    VERSAO: '1.0.0'
};

// ESTADO GLOBAL
let estadoGlobal = {
    logado: false,
    senhaMestre: null,
    senhas: [],
    premiumAtivo: false
};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    verificarSeExisteCofre();
    setupEventListeners();
});

function setupEventListeners() {
    // Event listeners estão no HTML
}

// ==========================================
// LOGIN E AUTENTICAÇÃO
// ==========================================

function handleLogin(event) {
    event.preventDefault();
    
    const senha = document.getElementById('senhaMestre').value;
    const cofreEncriptado = localStorage.getItem(CONFIG.KEY_COFRE);
    
    if (!cofreEncriptado) {
        mostrarErroLogin('Nenhum cofre encontrado. Crie um novo cofre primeiro.');
        return;
    }

    try {
        const cofre = descriptografar(cofreEncriptado, senha);
        
        if (!cofre) {
            mostrarErroLogin('Senha mestra incorreta!');
            return;
        }

        // Login bem-sucedido
        estadoGlobal.logado = true;
        estadoGlobal.senhaMestre = senha;
        estadoGlobal.senhas = cofre.senhas || [];
        estadoGlobal.premiumAtivo = cofre.premiumAtivo || false;

        // Mudar para dashboard
        document.getElementById('telaLogin').style.display = 'none';
        document.getElementById('telaDashboard').style.display = 'flex';
        
        renderizarSenhas();
        atualizarContador();

    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        mostrarErroLogin('Erro ao acessar o cofre.');
    }
}

function handleCriarCofre(event) {
    event.preventDefault();
    
    const novaSenha = document.getElementById('novaSenhaMestre').value;
    const confirmaSenha = document.getElementById('confirmaSenhaMestre').value;

    if (novaSenha !== confirmaSenha) {
        mostrarErroCriarCofre('As senhas não correspondem!');
        return;
    }

    if (novaSenha.length < 8) {
        mostrarErroCriarCofre('A senha mestra deve ter no mínimo 8 caracteres.');
        return;
    }

    // Criar novo cofre
    const cofreInicial = {
        senhas: [],
        premiumAtivo: false,
        dataCriacao: new Date().toISOString()
    };

    const cofreEncriptado = criptografar(cofreInicial, novaSenha);
    localStorage.setItem(CONFIG.KEY_COFRE, cofreEncriptado);

    // Login automático
    estadoGlobal.logado = true;
    estadoGlobal.senhaMestre = novaSenha;
    estadoGlobal.senhas = [];
    estadoGlobal.premiumAtivo = false;

    // Mudar para dashboard
    document.getElementById('telaLogin').style.display = 'none';
    document.getElementById('telaDashboard').style.display = 'flex';
    
    renderizarSenhas();
    atualizarContador();
}

function logout() {
    estadoGlobal.logado = false;
    estadoGlobal.senhaMestre = null;
    estadoGlobal.senhas = [];

    document.getElementById('telaLogin').style.display = 'flex';
    document.getElementById('telaDashboard').style.display = 'none';

    // Limpar formulários
    document.getElementById('formLogin').reset();
    document.getElementById('formCriarCofre').reset();
    document.getElementById('formNovasenha').reset();
    document.getElementById('erroLogin').style.display = 'none';
    document.getElementById('criarCofreContent').style.display = 'none';
    document.getElementById('loginContent').style.display = 'block';
}

function verificarSeExisteCofre() {
    const cofreExiste = localStorage.getItem(CONFIG.KEY_COFRE);
    if (cofreExiste) {
        document.getElementById('loginContent').style.display = 'block';
    } else {
        document.getElementById('loginContent').style.display = 'none';
    }
}

// ==========================================
// CRIPTOGRAFIA BÁSICA
// ==========================================

function criptografar(dados, chave) {
    const json = JSON.stringify(dados);
    const encoded = btoa(json);
    return JSON.stringify({
        v: 1,
        data: encoded,
        checksum: gerarChecksum(chave)
    });
}

function descriptografar(cofreEncriptado, chave) {
    try {
        const obj = JSON.parse(cofreEncriptado);
        
        if (obj.v !== 1) {
            return null;
        }

        if (obj.checksum !== gerarChecksum(chave)) {
            return null;
        }

        const json = atob(obj.data);
        return JSON.parse(json);
    } catch (erro) {
        console.error('Erro ao descriptografar:', erro);
        return null;
    }
}

function gerarChecksum(chave) {
    let hash = 0;
    for (let i = 0; i < chave.length; i++) {
        const char = chave.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// ==========================================
// GERENCIAMENTO DE SENHAS
// ==========================================

function handleAdicionarSenha(event) {
    event.preventDefault();

    if (!estadoGlobal.premiumAtivo && estadoGlobal.senhas.length >= CONFIG.MAX_SENHAS_GRATUITO) {
        mostrarErroAdicionar(`Limite de ${CONFIG.MAX_SENHAS_GRATUITO} senhas atingido. Upgrade para Premium para adicionar mais.`);
        return;
    }

    const servico = document.getElementById('servico').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('novaSenha').value;
    const notas = document.getElementById('notas').value.trim();

    if (!servico || !usuario || !senha) {
        mostrarErroAdicionar('Preencha todos os campos obrigatórios.');
        return;
    }

    const novaSenhaObj = {
        id: gerarID(),
        servico,
        usuario,
        senha,
        notas,
        dataCriacao: new Date().toISOString(),
        dataAlteracao: new Date().toISOString()
    };

    estadoGlobal.senhas.push(novaSenhaObj);
    salvarCofre();
    renderizarSenhas();
    atualizarContador();

    document.getElementById('formNovasenha').reset();
    document.getElementById('erroAdicionar').style.display = 'none';
}

function deletarSenha(id) {
    if (!confirm('Tem certeza que deseja deletar esta senha?')) {
        return;
    }

    estadoGlobal.senhas = estadoGlobal.senhas.filter(s => s.id !== id);
    salvarCofre();
    renderizarSenhas();
    atualizarContador();
}

function renderizarSenhas() {
    const container = document.getElementById('listaSenhas');
    
    if (estadoGlobal.senhas.length === 0) {
        container.innerHTML = '<p class="sem-senhas">Nenhuma senha guardada ainda. Adicione sua primeira senha acima!</p>';
        return;
    }

    container.innerHTML = estadoGlobal.senhas.map(senha => `
        <div class="senha-card">
            <div class="senha-info">
                <div class="senha-servico">${escapeHtml(senha.servico)}</div>
                <div class="senha-usuario">👤 ${escapeHtml(senha.usuario)}</div>
                <div class="senha-display" id="display-${senha.id}">••••••••</div>
                ${senha.notas ? `<div class="senha-notas">📝 ${escapeHtml(senha.notas)}</div>` : ''}
            </div>
            <div class="senha-actions">
                <button class="btn-copiar" onclick="copiarSenha('${senha.id}', '${senha.senha}')">
                    📋 Copiar
                </button>
                <button class="btn-deletar" onclick="deletarSenha('${senha.id}')">
                    🗑️ Deletar
                </button>
            </div>
        </div>
    `).join('');
}

const CLIPBOARD_TIMEOUT_MS = 20000; // 20 segundos
let clipboardTimeoutId = null;

function copiarSenha(id, senha) {
    navigator.clipboard.writeText(senha).then(() => {
        const display = document.getElementById(`display-${id}`);
        const textoOriginal = display.textContent;
        
        display.textContent = '✓ Copiado! (limpa em 20s)';
        display.style.backgroundColor = 'rgba(46, 204, 113, 0.3)';
        
        setTimeout(() => {
            display.textContent = textoOriginal;
            display.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        }, 2000);

        if (clipboardTimeoutId) {
            clearTimeout(clipboardTimeoutId);
        }

        clipboardTimeoutId = setTimeout(async () => {
            try {
                const clipboardAtual = await navigator.clipboard.readText();
                if (clipboardAtual === senha) {
                    await navigator.clipboard.writeText('');
                    console.log('Clipboard limpo automaticamente por segurança.');
                }
            } catch (err) {
                console.warn('Não foi possível verificar/limpar o clipboard automaticamente:', err);
            }
        }, CLIPBOARD_TIMEOUT_MS);

    }).catch(err => {
        alert('Erro ao copiar: ' + err);
    });
}

// ==========================================
// GERADOR DE SENHAS
// ==========================================

function gerarSenhaForte() {
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const todos = maiusculas + minusculas + numeros + simbolos;
    const tamanho = 16;
    
    let senha = '';
    
    senha += maiusculas.charAt(Math.floor(Math.random() * maiusculas.length));
    senha += minusculas.charAt(Math.floor(Math.random() * minusculas.length));
    senha += numeros.charAt(Math.floor(Math.random() * numeros.length));
    senha += simbolos.charAt(Math.floor(Math.random() * simbolos.length));
    
    for (let i = senha.length; i < tamanho; i++) {
        senha += todos.charAt(Math.floor(Math.random() * todos.length));
    }
    
    senha = senha.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('novaSenha').value = senha;
}

// ==========================================
// IMPORT/EXPORT
// ==========================================

function exportarBackup() {
    const cofre = {
        senhas: estadoGlobal.senhas,
        dataExportacao: new Date().toISOString(),
        versao: CONFIG.VERSAO
    };

    const json = JSON.stringify(cofre, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cofre-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

function importarBackup(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const conteudo = JSON.parse(e.target.result);
            
            if (!Array.isArray(conteudo.senhas)) {
                alert('Arquivo de backup inválido.');
                return;
            }

            if (!estadoGlobal.premiumAtivo && conteudo.senhas.length > CONFIG.MAX_SENHAS_GRATUITO) {
                alert(`Você pode importar no máximo ${CONFIG.MAX_SENHAS_GRATUITO} senhas na versão gratuita.`);
                return;
            }

            if (!confirm('Importar as senhas do backup? Isso substituirá as senhas atuais.')) {
                return;
            }

            estadoGlobal.senhas = conteudo.senhas;
            salvarCofre();
            renderizarSenhas();
            atualizarContador();

            alert('Backup importado com sucesso!');
        } catch (erro) {
            console.error('Erro ao importar:', erro);
            alert('Erro ao importar o backup.');
        }
    };

    reader.readAsText(file);
    event.target.value = '';
}

// ==========================================
// PERSISTÊNCIA
// ==========================================

function salvarCofre() {
    const cofre = {
        senhas: estadoGlobal.senhas,
        premiumAtivo: estadoGlobal.premiumAtivo,
        dataAlteracao: new Date().toISOString()
    };

    const cofreEncriptado = criptografar(cofre, estadoGlobal.senhaMestre);
    localStorage.setItem(CONFIG.KEY_COFRE, cofreEncriptado);
}

// ==========================================
// UI HELPERS
// ==========================================

function toggleCriarCofre() {
    const criarContent = document.getElementById('criarCofreContent');
    const loginContent = document.getElementById('loginContent');

    criarContent.style.display = criarContent.style.display === 'none' ? 'block' : 'none';
    loginContent.style.display = loginContent.style.display === 'none' ? 'block' : 'none';

    document.getElementById('erroCreateCofre').style.display = 'none';
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const tipo = input.type === 'password' ? 'text' : 'password';
    input.type = tipo;
}

function mostrarErroLogin(mensagem) {
    const erro = document.getElementById('erroLogin');
    erro.textContent = mensagem;
    erro.style.display = 'block';
}

function mostrarErroCriarCofre(mensagem) {
    const erro = document.getElementById('erroCreateCofre');
    erro.textContent = mensagem;
    erro.style.display = 'block';
}

function mostrarErroAdicionar(mensagem) {
    const erro = document.getElementById('erroAdicionar');
    erro.textContent = mensagem;
    erro.style.display = 'block';
}

function atualizarContador() {
    const count = estadoGlobal.senhas.length;
    const max = estadoGlobal.premiumAtivo ? '∞' : CONFIG.MAX_SENHAS_GRATUITO;
    
    document.getElementById('countSenhas').textContent = count;
    document.getElementById('maxSenhas').textContent = max;
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function gerarID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(texto) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return texto.replace(/[&<>"']/g, m => map[m]);
}

console.log('Cofre Digital v' + CONFIG.VERSAO + ' carregado.');
