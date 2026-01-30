let pedido = [];
let total = 0;
let formaPagamento = '';

function mostrarCategoria(id, btn) {
  document.querySelectorAll('.categoria').forEach(c => c.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function adicionarItem(nome, preco) {
  const item = pedido.find(p => p.nome === nome);

  if (item) {
    item.quantidade++;
  } else {
    pedido.push({ nome, preco, quantidade: 1 });
  }

  atualizarPedido();
}

function atualizarPedido() {
  const lista = document.getElementById('lista-pedido');
  lista.innerHTML = '';
  total = 0;

  pedido.forEach((item, index) => {
    total += item.preco * item.quantidade;

    lista.innerHTML += `
      <li>
        ${item.nome} — ${item.quantidade}x
        <button onclick="pedido[${index}].quantidade++; atualizarPedido()">+</button>
        <button onclick="pedido[${index}].quantidade--; if(pedido[${index}].quantidade<=0) pedido.splice(${index},1); atualizarPedido()">-</button>
      </li>
    `;
  });

  document.getElementById('total').innerText = total;
}

function selecionarPagamento(tipo) {
  formaPagamento = tipo;
  document.getElementById('troco-info').style.display = tipo === 'dinheiro' ? 'block' : 'none';
}

function finalizarPedido() {
  const nome = nomeCliente.value.trim();
  const whats = whatsCliente.value.trim();
  const endereco = enderecoCliente.value.trim();

  if (!nome || !whats || endereco.length < 10) {
    alert('Preencha nome, WhatsApp e endereço corretamente.');
    return;
  }

  let mensagem = `NOVO PEDIDO%0A`;
  mensagem += `Cliente: ${nome}%0A`;
  mensagem += `WhatsApp: ${whats}%0A`;
  mensagem += `Endereco: ${endereco}%0A%0A`;
  mensagem += `ITENS:%0A`;

  pedido.forEach(item => {
    mensagem += `- ${item.nome} ${item.quantidade}x R$ ${item.preco * item.quantidade}%0A`;
  });

  mensagem += `%0ATotal: R$ ${total}%0A`;
  mensagem += `Pagamento: ${formaPagamento}`;

  window.open(`https://wa.me/5524992201032?text=${mensagem}`);
}
