// Afegeix un event listener al formulari de login perquè escolti quan s’envia
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que el formulari recarregui la pàgina

  // Recull els valors dels camps de correu electrònic i contrasenya
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Defineix l’URL del backend segons si estàs en local o en producció (Render)
  const backendUrl = window.location.hostname === "localhost"
    ? "http://localhost:5000"                        
    : "https://projectefinal-lafz.onrender.com";         

  // Envia una petició POST al backend amb les dades d’usuari
  fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",            
    },
    body: JSON.stringify({ email, password }),       
  })
  .then(response => response.json())                 
  .then(data => {
    if (data.token) {                               
      // Desa el token d'autenticació al localStorage
      localStorage.setItem("auth_token", data.token);

      // Desa també el nom d’usuari i l’ID, si existeixen
      if (data.user) {
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("username", data.user.username);
      }

      // Mostra al console si s'han desat correctament
      console.log("Token:", localStorage.getItem("auth_token"));
      console.log("User ID:", localStorage.getItem("user_id"));
      console.log("Username:", localStorage.getItem("username"));

      // Mostra un avís i redirigeix a la pàgina d'inici
      alert("Login correcte!");
      window.location.href = "../html/Inici.html";
    } else {
      // Mostra un error si les credencials no són vàlides
      alert(data.error || "Error en el login");
    }
  })
  .catch(err => {
    // Mostra un error si hi ha problemes amb la connexió al servidor
    alert("Error en el servidor");
    console.error(err);
  });
});

