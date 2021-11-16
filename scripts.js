let url = "https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/";

let nome;
let ultimoMomento;
let remetente = "Todos";
let tipoDeMensagem = "message";

function entrarSala() {
  nome = prompt("Qual o seu nome?");

  const promessa = axios.post(`${url}participants`, {
    name: nome,
  });

  promessa.then(iniciarChat);
  promessa.catch(resetarPagina);
}

function iniciarChat() {
    carrregarMensagens();
    obterUsuarios();
  
    setInterval(carrregarMensagens, 3000);
    setInterval(validarStatus, 5000);
    setInterval(obterUsuarios, 10000);
  
    document.addEventListener("keyup", enviarMensagemEnter);
}
function resetarPagina() {
    window.location.reload();
}

function carrregarMensagens() {
    const promessa = axios.get(`${url}messages`);
    promessa.then(exibirMensagens);
    
}
function validarStatus() {
    axios.post(`${url}status`, {
      name: nome,
    });
}
function obterUsuarios() {
    const promessa = axios.get(`${url}participants`);
    promessa.then(exibirUsuarios);

}
  
function exibirMensagens(resposta) {
    const ul = document.querySelector(".caixa-mensagens");
    ul.innerHTML = "";
  
    for (let i = 0; i < resposta.data.length; i++) {
      if (resposta.data[i].type === "status") {
        ul.innerHTML += `<li data-identifier="message" class="entrada-saida">
              <span class="horario">(${resposta.data[i].time})</span>
              <strong>${resposta.data[i].from}</strong>
              <span>${resposta.data[i].text}</span>
            </li>`;
      }
      if (resposta.data[i].type === "message") {
        ul.innerHTML += `<li data-identifier="message" class="conversa-publica">
              <span class="horario">(${resposta.data[i].time})</span>
              <strong>${resposta.data[i].from}</strong>
              <span> para </span>
              <strong>${resposta.data[i].to}</strong>
              <span>${resposta.data[i].text}</span>
            </li>`;
      }
      if (
        resposta.data[i].type === "private_message" &&
        (resposta.data[i].to === nome || resposta.data[i].from === nome)
      ) {
        ul.innerHTML += `<li data-identifier="message" class="conversa-privada">
              <span class="horario">(${resposta.data[i].time})</span>
              <strong>${resposta.data[i].from}</strong>
              <span> reservadamente para </span>
              <strong>${resposta.data[i].to}</strong>
              <span>${resposta.data[i].text}</span>
              </li>`;
      }
  
      const ultimaMensagem = resposta.data[resposta.data.length - 1].time;
  
      rolarChatFinal(ultimaMensagem);
    }
}
  
function rolarChatFinal(ultimaMensagem) {
    if (ultimaMensagem !== ultimoMomento) {
        const ultimaMensagem = document.querySelector(
          ".caixa-mensagens li:last-child"
        );
        ultimaMensagem.scrollIntoView();
        ultimoMomento = ultimaMensagem;
    }
}

function exibirUsuarios(resposta) {
    let listaUsuarios = document.querySelector(".contatos");
  
    let tipoUsuario = "";
  
    if (remetente === "Todos") {
      tipoUsuario = "selecionado";
    }
  
    listaUsuarios.innerHTML = `<li class="visibilidade-publico ${tipoUsuario}" onclick="selecionarRemetente(this)">
    <ion-icon name="people"></ion-icon><span class="nome">Todos</span><ion-icon class="check" name="checkmark-outline">
    </ion-icon>
    </li>`;
  
    for (let i = 0; i < resposta.data.length; i++) {
      if (remetente === resposta.data[i].name) {
        tipoUsuario = "selecionado";
      } else {
        tipoUsuario = "";
      }
      listaUsuarios.innerHTML += `<li class="visibilidade-publico ${tipoUsuario}" onclick="selecionarRemetente(this)">
       <ion-icon name="person-circle"></ion-icon>
       <span class="nome">${resposta.data[i].name}</span><ion-icon class="check" name="checkmark-outline">
       </ion-icon>
     </li>`;
    }
}


function enviarMensagem() {
    const input = document.querySelector(".input-mensagem");
  
    const texto = input.value;
    const message = {
      to: remetente,
      from: nome,
      text: texto,
      type: tipoDeMensagem,
    };
  
    input.value = "";
  
    const promise = axios.post(`${url}messages`, message);
    promise.then(carrregarMensagens);
    promise.catch(resetarPagina);
}
  
function enviarMensagemEnter(evento) {
      if (evento.key === "Enter") {
        enviarMensagem();
      }
}


function abrirMenu() {
    const menu = document.querySelector(".menu");
    const fundoChat = document.querySelector(".fundo-menu");
  
    menu.classList.toggle("escondido");
    fundoChat.classList.toggle("fundo-escondido");
}
function selecionarRemetente(elemento) {
  remetente = elemento.querySelector(".nome").innerHTML;

  const messagem = document.querySelector(".enviando");

  if (tipoDeMensagem === "message") {
    messagem.innerHTML = `Enviando para ${remetente}`;
  } else {
    messagem.innerHTML = `Enviando para ${remetente} (reservadamente)`;
  }
  obterUsuarios();
}
function selecionarVisibilidade(elemento, tipo) {
  document.querySelector(".visibilidade .selecionado").classList.remove("selecionado");
  elemento.classList.add("selecionado");

  tipoDeMensagem = tipo;
}
entrarSala();