document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // Emmagatzema el token
      localStorage.setItem("auth_token", data.token);

      // Guarda el nom i ID
      if (data.user) {
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("username", data.user.username);
      }

      // Afegir comprovació per veure si les dades s'han guardat correctament
      console.log("Token:", localStorage.getItem("auth_token"));
      console.log("User ID:", localStorage.getItem("user_id"));
      console.log("Username:", localStorage.getItem("username"));

      alert("Login correcte!");
      window.location.href = "../html/Inici.html"; // Redirecciona
    } else {
      alert(data.error || "Error en el login");
    }
  })
  .catch(err => {
    alert("Error en el servidor");
    console.error(err);
  });
});
