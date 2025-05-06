const express = require('express');
const router = express.Router();
const db = require('../models/db');  // Connexió a la base de dades

const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
const url = 'https://v3.football.api-sports.io/fixtures';

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
        const matches = data.response;

        matches.forEach(matchData => {
            const match = matchData.fixture;
            const teams = matchData.teams;
            const goals = matchData.goals;
            const round = matchData.league.round;

            const matchDate = new Date(match.date)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "); // Format de la data (YYYY-MM-DD HH:MM:SS)

            const sql = `
                INSERT INTO matches (id, league_id, season_year, home_team_id, away_team_id, 
                                     home_score, away_score, match_date, status, round) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                home_score=?, away_score=?, status=?, round=?`;

            const values = [
                match.id, leagueId, seasonYear, 
                teams.home.id, teams.away.id,
                goals.home, goals.away,
                matchDate, match.status.long, round, 
                goals.home, goals.away, match.status.long, round
            ];

            db.query(sql, values, (err) => {
                if (err) {
                    console.error('Error inserint o actualitzant el partit:', err);
                }
            });
        });

        res.json({ message: `Partits per la lliga ${leagueId} i temporada ${seasonYear} actualitzats correctament` });
    } catch (error) {
        console.error('Error carregant partits:', error);
        res.status(500).json({ error: 'Error carregant els partits' });
    }
});



// Obtenir un partit per ID
router.get('/match/:id', (req, res) => {
    const matchId = req.params.id;

    db.query('SELECT * FROM matches WHERE id = ?', [matchId], (err, results) => {
        if (err) {
            console.error('Error carregant dades:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);  // Retorna el partit per ID amb només IDs dels equips
            } else {
                res.status(404).json({ error: 'Partit no trobat' });
            }
        }
    });
});

// Obtenir els partits per Lliga i Temporada
router.get('/:leagueId/:seasonYear', (req, res) => {
    const { leagueId, seasonYear } = req.params;

    const query = `
        SELECT m.home_team_id, m.away_team_id, m.home_score, m.away_score, m.match_date,m.round,
               ht.name AS home_team, aw.name AS away_team, 
               ht.logo AS home_logo, aw.logo AS away_logo
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams aw ON m.away_team_id = aw.id
        WHERE m.league_id = ? AND m.season_year = ?
        ORDER BY m.match_date;
    `;
    
    db.query(query, [leagueId, seasonYear], (err, results) => {
        if (err) {
            console.error("Error en la consulta dels partits:", err);
            res.status(500).send('Error carregant els partits');
        } else {
            if (results.length > 0) {
                res.json(results);  // Retorna tots els partits trobats
            } else {
                res.status(404).json({ error: 'No s\'han trobat partits per aquesta lliga i temporada' });
            }
        }
    });
});

// Obtenir els partits per Equip i Temporada
router.get('/team/:teamId/:seasonYear', (req, res) => {
    const { teamId, seasonYear } = req.params;

    const query = `
        SELECT m.home_team_id, m.away_team_id, m.home_score, m.away_score, m.match_date, m.round,
               ht.name AS home_team, aw.name AS away_team,
               ht.logo AS home_logo, aw.logo AS away_logo
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams aw ON m.away_team_id = aw.id
        WHERE (m.home_team_id = ? OR m.away_team_id = ?) AND m.season_year = ?
        ORDER BY m.match_date;
    `;

    db.query(query, [teamId, teamId, seasonYear], (err, results) => {
        if (err) {
            console.error("Error en la consulta dels partits per equip:", err);
            res.status(500).send('Error carregant els partits');
        } else {
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).json({ error: 'No s\'han trobat partits per aquest equip i temporada' });
            }
        }
    });
});

// Obtenir 3 partits aleatoris
router.get('/random', (req, res) => {
    const query = `
        SELECT m.id, m.home_score, m.away_score, m.match_date, m.round,
               ht.name AS home_team, aw.name AS away_team,
               ht.logo AS home_logo, aw.logo AS away_logo
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams aw ON m.away_team_id = aw.id
        ORDER BY RAND()
        LIMIT 3;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error carregant partits aleatoris:", err);
            res.status(500).json({ error: "Error carregant partits aleatoris" });
        } else {
            res.json(results); 
        }
    });
});




module.exports = router;


