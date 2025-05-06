const express = require("express");
const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../models/user");

const router = express.Router();

// registrar un usuari
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  registerUser(username, email, password, (err, result) => {
    if (err) {
      console.error("Error en el registro:", err);
      return res.status(500).json({ error: "Error en el registre" })
    };
    res.json({ message: "Usuari registrat correctament!" });
  });
});

// fer login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  loginUser(email, password, (err, user) => {
    if (err) return res.status(500).json({ error: "Error al fer login" });
    if (!user) return res.status(400).json({ error: "Credencials incorrectes" });

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login correcte!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  });
});

module.exports = router;
