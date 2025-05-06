const express = require('express');
const router = express.Router();
const db = require('../models/db');  // Connexió a la base de dades

const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
const url = 'https://v3.football.api-sports.io/players';

router.get('/updatePlayers/:teamId/:seasonYear', async (req, res) => {
    const { teamId, seasonYear } = req.params;
    let page = 1;
    let allPlayers = [];

    try {
        let morePages = true;

        while (morePages) {
            const apiUrl = `${url}?team=${teamId}&season=${seasonYear}&page=${page}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'x-apisports-key': apiKey }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            const players = data.response;

            // Afegir els jugadors a la llista
            allPlayers = allPlayers.concat(players);

            // Si la resposta té jugadors, incrementem la pàgina
            if (players.length > 0) {
                page++;  // Salta de pàgina sempre que hi hagi jugadors
            } else {
                morePages = false;  // No hi ha més jugadors, aturem la paginació
            }

            console.log(`Pàgina: ${page - 1} - Jugadors carregats: ${players.length}`);
        }

        // Un cop carregats tots els jugadors, els inserim a la base de dades
        allPlayers.forEach(playerData => {
            const player = playerData.player;
            const stats = playerData.statistics[0];
            const position = stats?.games?.position || "Desconeguda";
            const gamesPlayed = stats?.games?.appearences || 0;
            const goals = stats?.goals.total || 0;
            const assists = stats?.goals.assists || 0;
            const nationality = player.nationality || "Desconeguda"; // Afegir nacionalitat

            const sql = `
                INSERT INTO players (id, team_id, name, photo, age, nationality, games_played, goals, assists, position, season_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                name=?, photo=?, age=?, nationality=?, games_played=?, goals=?, assists=?, position=?, season_year=?`;

            const values = [
                player.id, teamId, player.name, player.photo, player.age, nationality, gamesPlayed, goals, assists, position, seasonYear,
                player.name, player.photo, player.age, nationality, gamesPlayed, goals, assists, position, seasonYear
            ];

            db.query(sql, values, (err) => {
                if (err) {
                    console.error('Error inserint o actualitzant el jugador:', err);
                }
            });
        });

        res.json({ message: `Tots els jugadors per l'equip ${teamId} i temporada ${seasonYear} actualitzats correctament` });
    } catch (error) {
        console.error('Error carregant jugadors:', error);
        res.status(500).json({ error: 'Error carregant els jugadors' });
    }
});

// Obtenir jugadors per equip i temporada
router.get('/:teamId/:seasonYear', (req, res) => {
    const { teamId, seasonYear } = req.params;

    db.query('SELECT * FROM players WHERE team_id = ? AND season_year = ?', [teamId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant dades dels jugadors:', err);
            res.status(500).json({ error: 'Error carregant les dades dels jugadors' });
        } else {
            res.json(results);
        }
    });
});
// Obtenir tots els jugadors d'una lliga 
router.get('/league/:leagueId/:seasonYear', (req, res) => {
    const { leagueId, seasonYear } = req.params;

    const sql = `
        SELECT p.* FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.league_id = ? AND p.season_year = ?
    `;

    db.query(sql, [leagueId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant jugadors de la lliga:', err);
            res.status(500).json({ error: 'Error carregant els jugadors de la lliga' });
        } else {
            res.json(results);
        }
    });
});
// Obtenir els màxims golejadors d'una lliga
router.get('/:leagueId/:seasonYear/topscorers', (req, res) => {
    const { leagueId, seasonYear } = req.params;

    const sql = `
        SELECT p.id, p.name AS player_name, p.photo AS player_photo, 
               t.name AS team_name, p.goals, p.season_year 
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.league_id = ? AND p.goals > 0 AND p.season_year = ?
        ORDER BY p.goals DESC
        LIMIT 10
    `;

    db.query(sql, [leagueId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant els golejadors:', err);
            res.status(500).json({ error: 'Error carregant els golejadors' });
        } else {
            res.json(results);
        }
    });
});
// Obtenir els màxims assistents d'una lliga
router.get('/:leagueId/:seasonYear/topassists', (req, res) => {
    const { leagueId, seasonYear } = req.params;

    const sql = `
        SELECT p.id, p.name AS player_name, p.photo AS player_photo, 
               t.name AS team_name, p.assists, p.season_year 
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.league_id = ? AND p.assists > 0 AND p.season_year = ?
        ORDER BY p.assists DESC
        LIMIT 10
    `;

    db.query(sql, [leagueId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant els assistents:', err);
            res.status(500).json({ error: 'Error carregant els assistents' });
        } else {
            res.json(results);
        }
    });
});

// Exportar el router per poder utilitzar-lo al fitxer principal
module.exports = router;





