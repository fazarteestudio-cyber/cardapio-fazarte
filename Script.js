// ===============================
// ESTADO GLOBAL
// ===============================
let pedido = [];
let total = 0;
let formaPagamento = '';

// ===============================
// ADICIONAR ITEM
// ===============================
function adicionarItem(nome, preco) {
  const item = pedido.find(p => p.nome === nome);

  if (item) {
    item.quantidade++;
  } else {
    pedido.push({
      nome: nome,
      preco: preco,
      quantidade: 1
    });
  }

  calcularTotal();
  atualizarResumo();
}

// ===============================
// CONTROLE DE QUANTIDADE
// ===============================
function aumentarQuantidade(index) {
  pedido[index].quantidade++;
  calcularTotal();
  atualizarResumo();
}

function diminuirQuantidade(index) {
  if (pedido[index].quantidade > 1) {
    pedido[index].quantidade--;
  } else {
    pedido.splice(index, 1);
  }

  calcularTotal();
  atualizarResumo();
}

// ===============================
// CALCULAR TOTAL
// ===============================
function calcularTotal() {
  total = 0;
  pedido.forEach(item => {
    total += item.preco * item.quantidade;
  });
}

// ===============================
// ATUALIZAR RESUMO NA TELA
// ===============================
function atualizarResumo() {
  const lista = document.getElementById('lista-pedido');
  const totalSpan = document.getElementById('total');

  lista.innerHTML = '';

  pedido.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.nome}</strong> — R$ ${item.preco * item.quantidade}
      <div style="margin-top:6px;">
        <button onclick="diminuirQuantidade(${index})">−</button>
        <span style="margin:0 12px;">${item.quantidade}</span>
        <button onclick="aumentarQuantidade(${index})">+</button>
      </div>
    `;
    lista.appendChild(li);
  });

  totalSpan.textContent = total;
}

// ===============================
// FORMA DE PAGAMENTO
// ===============================
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

// ===============================
// FINALIZAR PEDIDO (WHATSAPP)
// ===============================
function finalizarPedido() {
  const nome = document.getElementById('nomeCliente').value.trim();
  const whatsappCliente = document.getElementById('whatsCliente').value.trim();
  const observacao = document.getElementById('observacao').value.trim();

  if (!nome || !whatsappCliente) {
    alert('Informe seu nome e WhatsApp.');
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

  let mensagem = `🧾 *NOVO PEDIDO*%0A`;
  mensagem += `──────────────────%0A`;
  mensagem += `👤 *Cliente:* ${nome}%0A`;
  mensagem += `📱 *WhatsApp:* ${whatsappCliente}%0A`;
  mensagem += `──────────────────%0A%0A`;

  mensagem += `🍔 *ITENS DO PEDIDO*%0A`;
  pedido.forEach(item => {
    mensagem += `• ${item.nome} | ${item.quantidade}x | R$ ${item.preco * item.quantidade}%0A`;
  });

  mensagem += `%0A──────────────────%0A`;
  mensagem += `💰 *TOTAL:* R$ ${total}%0A`;
  mensagem += `💳 *PAGAMENTO:* ${formaPagamento.toUpperCase()}%0A`;

  if (formaPagamento === 'dinheiro') {
    const troco = document.getElementById('troco').value;
    if (troco) {
      mensagem += `🔄 *Troco para:* R$ ${troco}%0A`;
    }
  }

  if (observacao) {
    mensagem += `%0A📝 *OBSERVAÇÕES:*%0A${observacao}%0A`;
  }

  if (formaPagamento === 'pix') {
    mensagem += `%0A📌 _Após realizar o Pix, envie o comprovante neste WhatsApp._%0A`;
  }

  const telefoneLoja = '5524992201032';
  const url = `https://wa.me/${telefoneLoja}?text=${mensagem}`;

  window.open(url, '_blank');
}
