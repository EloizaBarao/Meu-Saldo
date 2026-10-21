const form = document.getElementById("form");
const inputDescricao = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const selectTipo = document.getElementById("tipo");
const lista = document.getElementById("lista");

const elSaldo = document.getElementById("saldo");
const elEntradas = document.getElementById("entradas");
const elSaidas = document.getElementById("saidas");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

function formatarMoeda(numero) {
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function remover(id) {
  transacoes = transacoes.filter(function (t) {
    return t.id !== id;
  });
  salvar();
  render();
}

function render() {
  lista.innerHTML = "";

  transacoes.forEach(function (t) {
    const li = document.createElement("li");
    li.className = t.tipo;

    const nome = document.createElement("span");
    nome.className = "nome";
    nome.textContent = t.descricao;

    const valor = document.createElement("span");
    valor.className = "valor";
    valor.textContent = (t.tipo === "saida" ? "- " : "+ ") + formatarMoeda(t.valor);

    const botao = document.createElement("button");
    botao.textContent = "×";
    botao.addEventListener("click", function () {
      remover(t.id);
    });

    li.append(nome, valor, botao);
    lista.appendChild(li);
  });

  let entradas = 0;
  let saidas = 0;

  transacoes.forEach(function (t) {
    if (t.tipo === "entrada") {
      entradas = entradas + t.valor;
    } else {
      saidas = saidas + t.valor;
    }
  });

  elEntradas.textContent = formatarMoeda(entradas);
  elSaidas.textContent = formatarMoeda(saidas);
  elSaldo.textContent = formatarMoeda(entradas - saidas);
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const descricao = inputDescricao.value.trim();
  const valor = parseFloat(inputValor.value);

  if (descricao === "" || isNaN(valor) || valor <= 0) {
    return;
  }

  transacoes.push({
    id: Date.now(),
    descricao: descricao,
    valor: valor,
    tipo: selectTipo.value
  });

  salvar();
  render();
  form.reset();
});

render();