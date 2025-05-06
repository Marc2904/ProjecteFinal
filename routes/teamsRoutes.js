const express = require('express');
const router = express.Router();
const db = require('../models/db');  // La connexió a la base de dades

const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
const url = 'https://v3.football.api-sports.io/teams';

// Endpoint per actualitzar els equips a la base de dades
router.get('/update/:leagueId/:seasonYear', async (req, res) => {
    const { leagueId, seasonYear } = req.params;

    const apiUrl = `${url}?league=${leagueId}&season=${seasonYear}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'x-apisports-key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const teams = data.response;

        // Insertar o actualitzar els equips a la base de dades
        teams.forEach(teamData => {
            const team = teamData.team;
            const venue = teamData.venue;

            // SQL per insertar o actualitzar l'equip
            const sql = `
                INSERT INTO teams (id, name, logo, venue_name, venue_city, league_id) 
                VALUES (?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE name=?, logo=?, venue_name=?, venue_city=?`;

            const values = [
                team.id, team.name, team.logo, venue.name, venue.city, leagueId,
                team.name, team.logo, venue.name, venue.city
            ];

            db.query(sql, values, (err) => {
                if (err) {
                    console.error('Error inserint o actualitzant l\'equip:', err);
                }
            });
        });

        res.json({ message: `Equips per la lliga ${leagueId} i temporada ${seasonYear} actualitzats correctament` });
    } catch (error) {
        console.error('Error carregant equips:', error);
        res.status(500).json({ error: 'Error carregant els equips' });
    }
});

// Endpoint per obtenir tots els equips d'una lliga
router.get('/:leagueId', (req, res) => {
    const leagueId = req.params.leagueId;

    // Obtenir equips per lliga
    db.query('SELECT * FROM teams WHERE league_id = ?', [leagueId], (err, results) => {
        if (err) {
            console.error('Error carregant dades:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            res.json(results);  // Retornem tots els equips d'aquesta lliga
        }
    });
});

// Ruta per obtenir un equip per ID
router.get('/team/:id', (req, res) => {
    const teamId = req.params.id;  // Obtenim l'ID de l'equip des de la URL
    const query = `
    SELECT te.id, te.name, te.logo, te.venue_name, te.venue_city, 
           le.country AS country
    FROM teams te
    JOIN leagues le ON le.id = te.league_id
    WHERE te.id = ?;
`;


    db.query(query, [teamId], (err, results) => {
        if (err) {
            console.error('Error carregant dades:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);  // Enviem l'equip trobat
            } else {
                res.status(404).json({ error: 'Equip no trobat' });
            }
        }
    });
});

module.exports = router;
