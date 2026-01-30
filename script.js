let pedido = [];
let total = 0;
let formaPagamento = '';

const produtosLanches = [
  ['Burger Clássico',20],
  ['Burger Bacon',24],
  ['Burger Duplo',28],
  ['Burger Premium',32],
  ['Burger Salada',22],
  ['Burger de Frango',24]
];

const produtosBebidas = [
  ['Refrigerante Lata',6],
  ['Refrigerante 600ml',8],
  ['Refrigerante 2L',12],
  ['Água',4]
];

function mostrarCategoria(id, btn) {
  document.querySelectorAll('.categoria').forEach(c => c.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function getQtd(nome) {
  const item = pedido.find(i => i.nome === nome);
  return item ? item.quantidade : 0;
}

function add(nome, preco) {
  const item = pedido.find(i => i.nome === nome);
  if (item) item.quantidade++;
  else pedido.push({ nome, preco, quantidade: 1 });
  atualizarTudo();
}

function remover(nome) {
  const item = pedido.find(i => i.nome === nome);
  if (!item) return;
  item.quantidade--;
  if (item.quantidade <= 0) {
    pedido = pedido.filter(i => i.nome !== nome);
  }
  atualizarTudo();
}

function renderProdutos(id, lista) {
  const area = document.getElementById(id);
  area.innerHTML = '';

  lista.forEach(p => {
    const qtd = getQtd(p[0]);

    area.innerHTML += `
      <div class="card">
        <h3>${p[0]}</h3>
        <p>R$ ${p[1]}</p>

        ${qtd === 0 ? `
          <button onclick="add('${p[0]}',${p[1]})">Adicionar</button>
        ` : `
          <div class="controle">
            <button onclick="remover('${p[0]}')">−</button>
            <span>${qtd}</span>
            <button onclick="add('${p[0]}',${p[1]})">+</button>
          </div>
        `}
      </div>
    `;
  });
}

function renderPedido() {
  const area = document.getElementById('lista-pedido');
  area.innerHTML = '';
  total = 0;

  pedido.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    area.innerHTML += `
      <div class="pedido-item">
        <strong>${item.nome}</strong><br>
        R$ ${item.preco} x ${item.quantidade} = R$ ${subtotal}
        <div class="controle">
          <button onclick="remover('${item.nome}')">−</button>
          <span>${item.quantidade}</span>
          <button onclick="add('${item.nome}',${item.preco})">+</button>
        </div>
      </div>
    `;
  });

  document.getElementById('total').innerText = total;
}

function atualizarTudo() {
  renderProdutos('lanches', produtosLanches);
  renderProdutos('bebidas', produtosBebidas);
  renderPedido();
}

function selecionarPagamento(tipo) {
  formaPagamento = tipo;

  document.getElementById('pix-info').style.display = 'none';
  document.getElementById('troco-info').style.display = 'none';

  if (tipo === 'pix') {
    document.getElementById('pix-info').style.display = 'block';
  }

  if (tipo === 'dinheiro') {
    document.getElementById('troco-info').style.display = 'block';
  }
}

function finalizarPedido() {
  const nome = nomeCliente.value.trim();
  const whats = whatsCliente.value.trim();
  const endereco = enderecoCliente.value.trim();
  const obs = observacao.value.trim();
  const troco = document.getElementById('troco').value;

  if (!nome || !whats || endereco.length < 10) {
    alert('Preencha nome, WhatsApp e endereço corretamente.');
    return;
  }

  if (pedido.length === 0) {
    alert('Adicione pelo menos um item ao pedido.');
    return;
  }

  if (!formaPagamento) {
    alert('Selecione a forma de pagamento.');
    return;
  }

  let msg = `NOVO PEDIDO%0A`;
  msg += `Cliente: ${nome}%0A`;
  msg += `WhatsApp: ${whats}%0A`;
  msg += `Endereco: ${endereco}%0A%0A`;
  msg += `ITENS:%0A`;

  pedido.forEach(i => {
    msg += `- ${i.nome} ${i.quantidade}x R$ ${i.preco * i.quantidade}%0A`;
  });

  msg += `%0ATotal: R$ ${total}%0A`;
  msg += `Pagamento: ${formaPagamento.toUpperCase()}%0A`;

  if (formaPagamento === 'dinheiro' && troco) {
    msg += `Troco para: R$ ${troco}%0A`;
  }

  if (obs) {
    msg += `%0AObservacoes:%0A${obs}%0A`;
  }

  if (formaPagamento === 'pix') {
    msg += `%0AChave Pix: pix@fazarte.com%0AEnvie o comprovante neste WhatsApp.%0A`;
  }

  window.open(`https://wa.me/5524992201032?text=${msg}`);
}

// inicializa
atualizarTudo();
