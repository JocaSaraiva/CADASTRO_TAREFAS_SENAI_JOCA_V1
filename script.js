const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoAlternarTema = document.getElementById('botao-alternar-tema');
const botaoLimpar = document.getElementById('botao-limpar');
const relogio = document.getElementById('relogio');

let totalDeTarefas = 0;

// Cria um item na tela (usado ao adicionar e ao carregar as tarefas salvas)
function criarItemTarefa(textoTarefa, concluido = false) {
    const itemLista = document.createElement('li');
    itemLista.className = 'item-tarefa';
    if (concluido) {
        itemLista.classList.add('concluido');
    }

    itemLista.innerHTML = `
        <span></span>
        <div class="acoes-tarefa">
            <button class="botao-acao concluir"><i class="fa-regular fa-circle-check"></i></button>
            <button class="botao-acao excluir"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    itemLista.querySelector('span').textContent = textoTarefa;

    itemLista.querySelector('.concluir').addEventListener('click', () => {
        itemLista.classList.toggle('concluido');
        salvarTarefas();
    });
    itemLista.querySelector('.excluir').addEventListener('click', () => {
        itemLista.remove();
        totalDeTarefas--;
        atualizarContador();
        salvarTarefas();
    });

    listaTarefas.appendChild(itemLista);
    totalDeTarefas++;
}

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    criarItemTarefa(textoTarefa);
    campoTarefa.value = '';
    atualizarContador();
    salvarTarefas();
}
function atualizarContador() {
    contadorTarefas.textContent = `${totalDeTarefas} ${totalDeTarefas === 1 ? 'tarefa' : 'tarefas'} na lista`;
    botaoLimpar.disabled = totalDeTarefas === 0; // só habilita se houver tarefas
}
function limparTarefas() {
    if (totalDeTarefas === 0) {
        return;
    }
    if (!confirm('Tem certeza que deseja limpar todas as tarefas?')) {
        return;
    }
    listaTarefas.innerHTML = '';
    totalDeTarefas = 0;
    atualizarContador();
    salvarTarefas();
}

// Guarda as tarefas (texto + se está concluída) no navegador
function salvarTarefas() {
    try {
        const dados = Array.from(listaTarefas.querySelectorAll('.item-tarefa')).map((item) => ({
            texto: item.querySelector('span').textContent,
            concluido: item.classList.contains('concluido')
        }));
        localStorage.setItem('tarefas', JSON.stringify(dados));
    } catch (erro) {
        // localStorage indisponível: as tarefas só não serão lembradas
    }
}

// Ao carregar a página, recria as tarefas salvas
function carregarTarefas() {
    try {
        const dados = JSON.parse(localStorage.getItem('tarefas') || '[]');
        if (!Array.isArray(dados)) {
            return;
        }
        dados.forEach((tarefa) => {
            if (tarefa && typeof tarefa.texto === 'string' && tarefa.texto !== '') {
                criarItemTarefa(tarefa.texto, tarefa.concluido === true);
            }
        });
        atualizarContador();
    } catch (erro) {
        // dados corrompidos ou sem localStorage: começa com a lista vazia
    }
}
botaoAlternarTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const iconeTema = botaoAlternarTema.querySelector('i');
    iconeTema.classList.toggle('fa-moon');
    iconeTema.classList.toggle('fa-sun');
    salvarTema();
});

// Guarda o tema escolhido no navegador (localStorage)
function salvarTema() {
    try {
        const tema = document.body.classList.contains('modo-escuro') ? 'escuro' : 'claro';
        localStorage.setItem('tema', tema);
    } catch (erro) {
        // localStorage indisponível (ex.: aba privada): o tema só não será lembrado
    }
}

// Ao carregar a página, restaura o tema salvo
function carregarTema() {
    try {
        if (localStorage.getItem('tema') === 'escuro') {
            document.body.classList.add('modo-escuro');
            const iconeTema = botaoAlternarTema.querySelector('i');
            iconeTema.classList.remove('fa-moon');
            iconeTema.classList.add('fa-sun');
        }
    } catch (erro) {
        // sem localStorage: segue no modo claro
    }
}
carregarTema();
botaoAdicionar.addEventListener('click', adicionarTarefa);

campoTarefa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarTarefa();
    }
});
botaoLimpar.addEventListener('click', limparTarefas);

function atualizarRelogio() {
    relogio.textContent = new Date().toLocaleTimeString('pt-BR');
}
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

carregarTarefas();