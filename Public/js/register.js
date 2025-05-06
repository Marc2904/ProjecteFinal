document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Enviar dades al servidor per registrar l'usuari
    fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message); // Mostra el missatge de registre correcte
        window.location.href = "login.html"; // Redirigeix a la pàgina de login
      } else {
        alert(data.error || "Error en el registre");
      }
    })
    .catch(err => {
      alert("Error en el servidor");
      console.error(err);
    });
  });
  