const STORAGE_KEY = 'portal_imoveis_dados';

function getImoveis() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarImoveis(imoveis) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(imoveis));
}

function renderizarImoveis() {
  const imoveis = getImoveis();
  const container = document.getElementById('listaImoveis');
  document.getElementById('contador').textContent = imoveis.length;

  if (imoveis.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8">Nenhum imóvel cadastrado.</p>';
    return;
  }

  container.innerHTML = imoveis.map((im, index) => `
    <div class="imovel-item">
      <h3>${im.nome}</h3>
      <p><i class="ri-map-pin-line"></i> ${im.localizacao}</p>
      <p><i class="ri-ruler-line"></i> ${im.tamanho ? im.tamanho + ' m² — ' : ''}${im.tipo}</p>
      <p><i class="ri-money-dollar-circle-line"></i> Venda: R$ ${Number(im.valorVenda).toLocaleString('pt-BR')}</p>
      ${im.valorAluguel ? `<p><i class="ri-home-4-line"></i> Aluguel: R$ ${Number(im.valorAluguel).toLocaleString('pt-BR')}</p>` : ''}
      ${im.descricao ? `<p>${im.descricao}</p>` : ''}
      <span class="status-badge status-${im.status}">${im.status.toUpperCase()}</span>
      <br>
      <button class="btn-excluir" onclick="excluirImovel(${index})"><i class="ri-delete-bin-line"></i> Excluir</button>
    </div>
  `).join('');
}

function excluirImovel(index) {
  const imoveis = getImoveis();
  imoveis.splice(index, 1);
  salvarImoveis(imoveis);
  renderizarImoveis();
}

document.getElementById('formImovel').addEventListener('submit', function(e) {
  e.preventDefault();

  const novoImovel = {
    nome: document.getElementById('nome').value,
    localizacao: document.getElementById('localizacao').value,
    tipo: document.getElementById('tipo').value,
    tamanho: document.getElementById('tamanho').value,
    valorVenda: document.getElementById('valorVenda').value,
    valorAluguel: document.getElementById('valorAluguel').value,
    status: document.getElementById('status').value,
    descricao: document.getElementById('descricao').value,
    dataCadastro: new Date().toISOString()
  };

  const imoveis = getImoveis();
  imoveis.push(novoImovel);
  salvarImoveis(imoveis);

  this.reset();
  renderizarImoveis();
});

renderizarImoveis();