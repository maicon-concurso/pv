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
            }
            window.history.pushState({path: resolvedPage}, '', resolvedPage);
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
    fetch('menu.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Menu não encontrado: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('menu').innerHTML = html;
            initializeMenu(); // Inicializa eventos do menu
        })
        .catch(error => {
            console.error('Erro ao carregar o menu:', error);
        });
}

// Função para inicializar eventos do menu
function initializeMenu() {
    const toggleButton = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('sidebar');
    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active');
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

// Eventos de navegação
window.onpopstate = function(event) {
    if (event.state) {
        loadPage(event.state.path);
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadMenu(); // Carrega o menu na inicialização
});
