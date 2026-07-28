const STORAGE_KEY = 'portal_imoveis_dados';

function getImoveis() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function mostrarContato(nome) {
  alert(`Obrigado pelo interesse em "${nome}". Em breve entraremos em contato.`);
}

function renderizarVitrine() {
  const imoveis = getImoveis().filter(im => im.status !== 'vendido');
  const container = document.getElementById('listaImoveis');

  if (imoveis.length === 0) {
    container.innerHTML = '<p class="sem-imoveis">Nenhum imóvel disponível no momento.</p>';
    return;
  }

  container.innerHTML = imoveis.map(im => `
    <div class="card-imovel">
      <p class="tag-local"><i class="ri-map-pin-line"></i> ${im.localizacao}</p>
      <h3>${im.nome}</h3>
      <p class="descricao">${im.descricao || ''}</p>
      ${im.tamanho ? `<p class="detalhe"><i class="ri-ruler-line"></i> ${im.tamanho} m²</p>` : ''}
      <p class="preco">R$ ${Number(im.valorVenda).toLocaleString('pt-BR')}</p>
      ${im.status === 'alugado' ? '<span class="badge-alugado">ALUGADO</span>' : ''}
      <button onclick="mostrarContato('${im.nome.replace(/'/g, "\\'")}')">Tenho interesse</button>
    </div>
  `).join('');
}

renderizarVitrine();