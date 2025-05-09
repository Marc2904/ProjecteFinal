document.addEventListener("DOMContentLoaded", function () {
    // Carreguem el fitxer header.html de manera dinàmica
    fetch("/Html/header.html") 
        .then(response => response.text()) // Convertim la resposta en text (HTML)
        .then(data => {
            // Inserim el contingut del fitxer HTML carregat dins de l'element amb id "header-container"
            document.getElementById("header-container").innerHTML = data;

            // Després de carregar el header, cridem la funció d'autenticació per gestionar l'estat del login
            initAuth(); // Cridem la funció per gestionar el login/logout
        })
        .catch(error => console.error("Error carregant el header:", error)); // En cas d'error, el mostrem a la consola
});

// Funció que gestiona l'autenticació i el comportament del botó d'iniciar/tencar sessió
function initAuth() {
    const authButton = document.getElementById("auth-button"); // Obtenim l'element on s'ha de mostrar el botó d'autenticació
    const userToken = localStorage.getItem("auth_token"); // Obtenim el token d'autenticació des de localStorage
    const username = localStorage.getItem("username"); // Obtenim el nom d'usuari des de localStorage

    if (authButton) { // Comprovem que l'element authButton existeixi
        if (userToken) { // Si el token d'autenticació existeix (l'usuari està loguejat)
            // Mostrem el nom d'usuari i el botó per tancar sessió
            authButton.innerHTML = `
            <div class="d-flex align-items-center">
                <a href="../Html/favorites.html" class="nav-link text-white me-2">Hola, ${username}</a>
                <a href="../Html/inici.html" class="nav-link text-success" id="logout-btn">Tanca sessió</a>
            </div>
        `;

            // Afegim l'escoltador d'esdeveniments per al botó de tancar sessió
            document.getElementById("logout-btn").addEventListener("click", function () {
                // Eliminem el token, el nom d'usuari i l'user_id del localStorage
                localStorage.removeItem("auth_token");
                localStorage.removeItem("username");
                localStorage.removeItem("user_id");
                window.location.reload(); // Recarguem la pàgina per actualitzar l'estat
            });

        } else {
            // Si l'usuari no està loguejat, mostrem el botó per iniciar sessió
            authButton.innerHTML = `
                <a href="../Html/login.html" class="nav-link text-success">Inicia sessió</a>
            `;
        }
    }
}

