const express = require('express');
const router = express.Router();
const db = require('../models/db');  

router.post('/', (req, res) => {
    const { userId, teamId } = req.body;

    const sql = `INSERT IGNORE INTO favorite_teams (user_id, team_id) VALUES (?, ?)`;

    db.query(sql, [userId, teamId], (err, result) => {
        if (err) {
            console.error("Error afegint favorit:", err);
            res.status(500).json({ error: "Error afegint favorit" });
        } else {
            res.json({ success: true });
        }
    });
});

router.delete('/', (req, res) => {
    const { userId, teamId } = req.body;

    const sql = `DELETE FROM favorite_teams WHERE user_id = ? AND team_id = ?`;

    db.query(sql, [userId, teamId], (err, result) => {
        if (err) {
            console.error("Error eliminant favorit:", err);
            res.status(500).json({ error: "Error eliminant favorit" });
        } else {
            res.json({ success: true });
        }
    });
});
// Ruta per verificar si un equip és favorit per a un usuari
router.post('/check', (req, res) => {
    const { userId, teamId } = req.body;

    // Consulta per verificar si aquest equip ja està afegit als favorits
    const sql = `SELECT 1 FROM favorite_teams WHERE user_id = ? AND team_id = ?`;

    db.query(sql, [userId, teamId], (err, result) => {
        if (err) {
            console.error("Error al comprovar els favorits:", err);
            res.status(500).json({ error: "Error al comprovar els favorits" });
        } else {
            // Si trobem alguna fila, l'equip és favorit
            if (result.length > 0) {
                res.json({ isFavorite: true });
            } else {
                res.json({ isFavorite: false });
            }
        }
    });
});

// Afegir una lliga als favorits
router.post('/league', (req, res) => {
    const { userId, leagueId } = req.body;

    const sql = `INSERT IGNORE INTO favorite_leagues (user_id, league_id) VALUES (?, ?)`;

    db.query(sql, [userId, leagueId], (err, result) => {
        if (err) {
            console.error("Error afegint lliga favorita:", err);
            res.status(500).json({ error: "Error afegint lliga favorita" });
        } else {
            res.json({ success: true });
        }
    });
});

// Eliminar una lliga dels favorits
router.delete('/league', (req, res) => {
    const { userId, leagueId } = req.body;

    const sql = `DELETE FROM favorite_leagues WHERE user_id = ? AND league_id = ?`;

    db.query(sql, [userId, leagueId], (err, result) => {
        if (err) {
            console.error("Error eliminant lliga favorita:", err);
            res.status(500).json({ error: "Error eliminant lliga favorita" });
        } else {
            res.json({ success: true });
        }
    });
});

// Comprovar si una lliga és als favorits d’un usuari
router.post('/league/check', (req, res) => {
    const { userId, leagueId } = req.body;

    const sql = `SELECT 1 FROM favorite_leagues WHERE user_id = ? AND league_id = ?`;

    db.query(sql, [userId, leagueId], (err, result) => {
        if (err) {
            console.error("Error al comprovar la lliga favorita:", err);
            res.status(500).json({ error: "Error al comprovar la lliga favorita" });
        } else {
            res.json({ isFavorite: result.length > 0 });
        }
    });
});


router.get('/leagues/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT l.id, l.name, l.logo, l.country
        FROM favorite_leagues fl
        JOIN leagues l ON fl.league_id = l.id
        WHERE fl.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error obtenint lligues favorites:", err);
            res.status(500).json({ error: "Error intern del servidor" });
        } else {
            res.json(results);
        }
    });
});

router.get('/teams/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT t.id, t.name, t.logo
        FROM favorite_teams ft
        JOIN teams t ON ft.team_id = t.id
        WHERE ft.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error obtenint equips favorits:", err);
            res.status(500).json({ error: "Error intern del servidor" });
        } else {
            res.json(results);
        }
    });
});



module.exports = router;