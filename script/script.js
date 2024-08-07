// script.js

// Função para carregar uma página e atualizar apenas o conteúdo
function loadPage(page) {
    const resolvedPage = page.startsWith('/') ? page : '/' + page;

    fetch(resolvedPage)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Página não encontrada: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const contentElement = document.getElementById('content');
            if (contentElement) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById('content');
                if (newContent) {
                    contentElement.innerHTML = newContent.innerHTML;
                }
                initializeAvatars(); // Inicializa eventos dos avatares após carregar a nova página
            }
            window.history.pushState({ path: resolvedPage }, '', resolvedPage);
        })
        .catch(error => {
            console.error('Erro ao carregar a página:', error);
            document.getElementById('content').innerHTML = `
                <div style="color: red;">
                    <p>Página não encontrada. Verifique se o caminho está correto e tente novamente.</p>
                </div>`;
        });
}

// Função para carregar o menu uma única vez
function loadMenu() {
    // Sempre usa o caminho relativo para páginas dentro de /paginas/
    const pathToMenu = '../menu.html';

    fetch(pathToMenu)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Menu não encontrado: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const menuElement = document.getElementById('menu');
            if (menuElement) {
                menuElement.innerHTML = html;
                initializeMenu(); // Inicializa eventos do menu
            } else {
                console.error('Elemento #menu não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o menu:', error);
        });
}

// Função para inicializar eventos do menu
function initializeMenu() {
    const toggleButton = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const menu = document.querySelector('.p-3')
    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menu.classList.toggle('recolher');
        });
    }

    // Eventos de clique nos links do menu
    document.querySelectorAll('#sidebar .sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = link.getAttribute('href');
            if (page) {
                loadPage(page);
            }
        });
    });
}

// Função para inicializar eventos dos avatares
function initializeAvatars() {
    const chatModalLabel = document.getElementById('chatModalLabel');
    const chatMessage = document.getElementById('chatMessage');
    const sendButton = document.querySelector('.btn-primary');
    const messageArea = document.createElement('div');
    messageArea.className = 'message-container';

    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            chatModalLabel.innerHTML = `<strong>Chat com ${name}</strong>`; // Atualiza o título do modal

            // Evento de clique para enviar mensagem
            sendButton.onclick = function() {
                const messageContent = chatMessage.value;
                if (messageContent.trim() !== '') {
                    const newMessage = document.createElement('p');
                    newMessage.innerHTML = `<strong>${name}:</strong> ${messageContent}`;
                    messageArea.appendChild(newMessage);
                    chatMessage.value = ''; // Limpa o campo de mensagem
                    chatMessage.focus(); // Mantém o foco no campo de mensagem após enviar
                }
            };
        });
    });

    // Certifique-se de que apenas uma área de mensagem seja anexada
    if (!document.querySelector('.modal-body .message-container')) {
        document.querySelector('.modal-body').appendChild(messageArea); // Anexa a área de mensagem ao corpo do modal
    }
}

// Eventos de navegação
window.onpopstate = function(event) {
    if (event.state) {
        loadPage(event.state.path);
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadMenu(); // Carrega o menu na inicialização
    initializeAvatars(); // Inicializa eventos dos avatares na carga inicial
});
