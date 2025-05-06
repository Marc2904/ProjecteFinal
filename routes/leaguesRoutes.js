const express = require('express');
const router = express.Router();
const db = require('../models/db');

const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
const url = 'https://v3.football.api-sports.io/leagues';
const topLeagues = [39, 140, 135, 78, 61];

// Endpoint per obtenir i guardar les lligues a la BD
router.get('/update', async (req, res) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'x-apisports-key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const leagues = data.response.filter(league => topLeagues.includes(league.league.id));

        leagues.forEach(league => {
            const { id, name, logo } = league.league;
            const country = league.country.name;

            const sql = `
                INSERT INTO leagues (id, name, country, logo) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE name=?, country=?, logo=?`;
            const values = [id, name, country, logo, name, country, logo];

            db.query(sql, values, (err) => {
                if (err) console.error('Error inserint dades:', err);
            });
        });

        res.json({ message: 'Lligues actualitzades correctament' });
    } catch (error) {
        console.error('Error carregant les lligues:', error);
        res.status(500).json({ error: 'Error carregant les lligues' });
    }
});

// Endpoint per obtenir les lligues de la BD
router.get('/', (req, res) => {
    db.query('SELECT * FROM leagues', (err, results) => {
        if (err) {
            console.error('Error carregant dades:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            res.json(results);
        }
    });
});
// Ruta per obtenir una lliga per ID
router.get('/:id', (req, res) => {
    const leagueId = req.params.id;  // Obtenim l'ID de la lliga des de la URL

    db.query('SELECT * FROM leagues WHERE id = ?', [leagueId], (err, results) => {
        if (err) {
            console.error('Error carregant dades:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);  // Enviem la primera lliga trobada
            } else {
                res.status(404).json({ error: 'Lliga no trobada' });
            }
        }
    });
});




module.exports = router;
