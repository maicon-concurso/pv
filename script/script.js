// script.js

// Função para carregar uma página e atualizar apenas o conteúdo
function loadPage(page) {
    console.log(`Carregando a página: ${page}`); // Log para depuração

    // Constrói a URL completa para a página
    const resolvedPage = new URL(page, window.location.origin).href;

    fetch(resolvedPage)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Página não encontrada: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Cria um elemento temporário para manipular o HTML carregado
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Seleciona apenas o conteúdo da nova página (assumindo que #content contém o conteúdo dinâmico)
            const newContent = tempDiv.querySelector('#content');
            if (newContent) {
                document.getElementById('content').innerHTML = newContent.innerHTML;
            } else {
                console.warn('Elemento #content não encontrado na página carregada.');
            }
            window.history.pushState({path: page}, '', resolvedPage);
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

// Função para inicializar eventos do menu (expandir/contrair)
function initializeMenu() {
    const toggleButton = document.querySelector('.toggle-btn');
    const sidebar = document.getElementById('sidebar');
    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Adiciona eventos aos links do menu para carregamento dinâmico
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
