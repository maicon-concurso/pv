document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar páginas
    function loadPage(url, pushState = true) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
                if (pushState) {
                    history.pushState({page: url}, "", url);
                }
            })
            .catch(error => console.error('Erro ao carregar a página:', error));
    }

    // Buscar o HTML do menu e inseri-lo na div com id "menu"
    fetch('/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu').innerHTML = data;

            const hamBurger = document.querySelector(".toggle-btn");
            hamBurger.addEventListener("click", function () {
                console.log('Menu toggle clicked');
                document.querySelector("#sidebar").classList.toggle("expand");
                document.querySelector(".main").classList.toggle("expanded");
                console.log('Sidebar expanded:', document.querySelector("#sidebar").classList.contains("expand"));
                console.log('Main expanded:', document.querySelector(".main").classList.contains("expanded"));
            });

            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const page = this.getAttribute('data-page');
                    loadPage(page);
                });
            });

           loadPage('index.html', false);

            window.addEventListener('popstate', function(event) {
                if (event.state && event.state.page) {
                    loadPage(event.state.page, false);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));
});
document.querySelector('.fas').addEventListener('click', function() {
    alert('Sincronizando dados...');
});
