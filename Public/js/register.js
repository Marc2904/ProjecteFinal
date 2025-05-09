// Afegim un event listener al formulari de registre
document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitem que es faci l'enviament per defecte del formulari

    // Obtenim les dades introduïdes pels usuaris
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Defineix l'URL del backend segons si estem en local o en producció (Render)
    const backendUrl = window.location.hostname === "localhost"
        ? "http://localhost:5000" 
        : "https://projectefinal-lafz.onrender.com";

    // Enviar les dades al servidor per registrar l'usuari
    fetch(`${backendUrl}/auth/register`, {
        method: "POST", // Enviament mitjançant el mètode POST
        headers: {
            "Content-Type": "application/json", // Indiquem que estem enviant JSON
        },
        body: JSON.stringify({
            username: username, // Username introduït per l'usuari
            email: email, // Correu electrònic introduït per l'usuari
            password: password, // Contrasenya introduïda per l'usuari
        }),
    })
    .then(response => response.json()) // Convertim la resposta a JSON
    .then(data => {
        if (data.message) { 
            // Si el backend retorna un missatge de registre correcte
            alert(data.message); // Mostrem el missatge
            window.location.href = "login.html"; // Redirigim a la pàgina de login
        } else {
            // Si hi ha un error, el mostrem
            alert(data.error || "Error en el registre");
        }
    })
    .catch(err => {
        // Captura d'errors en la connexió amb el servidor
        alert("Error en el servidor");
        console.error(err); // Mostrem l'error a la consola
    });
});
