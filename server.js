require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Servir arxius estàtics de la carpeta "Public"
app.use(express.static("Public"));

// Rutes d'autenticació
app.use("/auth", require("./routes/authRoutes"));
// Importar i utilitzar les rutes 
app.use("/leagues", require("./routes/leaguesRoutes"));
app.use('/teams',require("./routes/teamsRoutes"));
app.use('/matches',require("./routes/matchesRoutes"));
app.use('/standings',require("./routes/standingsRoutes"));
app.use('/players',require("./routes/playersRoutes"));
app.use('/favorites',require("./routes/favRoutes"));

// Redirigir a la pàgina d'inici
app.get("/", (req, res) => {
    res.redirect("/Html/Inici.html");
});


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
