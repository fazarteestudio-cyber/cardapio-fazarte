let pedido=[];
let total=0;
let formaPagamento='';

const produtosLanches=[
['Burger Clássico',20],
['Burger Bacon',24],
['Burger Duplo',28],
['Burger Premium',32],
['Burger Salada',22],
['Burger de Frango',24]
];

const produtosBebidas=[
['Refrigerante Lata',6],
['Refrigerante 600ml',8],
['Refrigerante 2L',12],
['Água',4]
];

function mostrarCategoria(id,btn){
document.querySelectorAll('.categoria').forEach(c=>c.classList.remove('active'));
document.getElementById(id).classList.add('active');
document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
}

function renderProdutos(){
render('lanches',produtosLanches);
render('bebidas',produtosBebidas);
}

function render(id,lista){
const area=document.getElementById(id);
area.innerHTML='';
lista.forEach(p=>{
const qtd=getQtd(p[0]);
area.innerHTML+=`
<div class="card">
<h3>${p[0]}</h3>
<p>R$ ${p[1]}</p>
${qtd==0?
`<button onclick="add('${p[0]}',${p[1]})">Adicionar</button>`:
`<div class="controle">
<button onclick="remover('${p[0]}')">-</button>
<span>${qtd}</span>
<button onclick="add('${p[0]}',${p[1]})">+</button>
</div>`
}
</div>`;
});
}

function getQtd(nome){
const item=pedido.find(i=>i.nome===nome);
return item?item.quantidade:0;
}

function add(nome,preco){
const item=pedido.find(i=>i.nome===nome);
if(item)item.quantidade++;
else pedido.push({nome,preco,quantidade:1});
atualizar();
}

function remover(nome){
const item=pedido.find(i=>i.nome===nome);
if(!item)return;
item.quantidade--;
if(item.quantidade<=0)pedido=pedido.filter(i=>i.nome!==nome);
atualizar();
}

function atualizar(){
renderProdutos();
const lista=document.getElementById('lista-pedido');
lista.innerHTML='';
total=0;
pedido.forEach(i=>{
total+=i.preco*i.quantidade;
lista.innerHTML+=`<li>${i.nome} ${i.quantidade}x</li>`;
});
document.getElementById('total').innerText=total;
}

function selecionarPagamento(t){
formaPagamento=t;
document.getElementById('troco-info').style.display=t==='dinheiro'?'block':'none';
}

function finalizarPedido(){
const nome=nomeCliente.value.trim();
const whats=whatsCliente.value.trim();
const end=enderecoCliente.value.trim();
if(!nome||!whats||end.length<10)return alert("Preencha os dados corretamente");

let msg=`NOVO PEDIDO%0ACliente:${nome}%0AWhats:${whats}%0AEndereco:${end}%0A%0A`;

pedido.forEach(i=>{
msg+=`- ${i.nome} ${i.quantidade}x R$${i.preco*i.quantidade}%0A`;
});

msg+=`%0ATotal:R$${total}`;

window.open(`https://wa.me/5524992201032?text=${msg}`);
}

renderProdutos();
