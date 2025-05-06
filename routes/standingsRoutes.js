const express = require('express');
const router = express.Router();
const db = require('../models/db');  // Connexió a la base de dades

const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
const url = 'https://v3.football.api-sports.io/standings';

// **Endpoint per actualitzar els standings a la BD**
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
        const standings = data.response[0].league.standings[0];  // Agafem la primera classificació (primera divisió)

        // Inserir o actualitzar els standings a la base de dades
        standings.forEach(teamData => {
            const team = teamData.team;
            const stats = teamData.all;

            const sql = `
                INSERT INTO standings (league_id, season_year, team_id, rank, points, 
                                       matches_played, wins, draws, losses, goals_for, goals_against, goal_difference) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                rank=?, points=?, matches_played=?, wins=?, draws=?, losses=?, 
                goals_for=?, goals_against=?, goal_difference=?`;

            const values = [
                leagueId, seasonYear, team.id, teamData.rank, teamData.points,
                stats.played, stats.win, stats.draw, stats.lose, stats.goals.for, stats.goals.against, teamData.goalsDiff,
                teamData.rank, teamData.points, stats.played, stats.win, stats.draw, stats.lose,
                stats.goals.for, stats.goals.against, teamData.goalsDiff
            ];

            db.query(sql, values, (err) => {
                if (err) {
                    console.error('Error inserint o actualitzant el standing:', err);
                }
            });
        });

        res.json({ message: `Standings per la lliga ${leagueId} i temporada ${seasonYear} actualitzats correctament` });
    } catch (error) {
        console.error('Error carregant standings:', error);
        res.status(500).json({ error: 'Error carregant els standings' });
    }
});

// **Endpoint per obtenir els standings d'una lliga**
router.get('/:leagueId/:seasonYear', (req, res) => {
    const { leagueId, seasonYear } = req.params;
    const query = `
    SELECT s.id, s.rank, s.points, s.matches_played, s.wins, s.draws, s.losses, s.goals_for, s.goals_against, s.goal_difference,
           te.name AS name,
           te.logo AS logo
    FROM standings s
    JOIN teams te ON s.team_id = te.id
    WHERE s.league_id = ? AND s.season_year = ?
    ORDER BY s.rank ASC;
`;



    db.query(query, [leagueId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant standings:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            res.json(results);
        }
    });
});

// **Endpoint per obtenir els standings d'un equip**
router.get('/team/:teamId/:seasonYear', (req, res) => {
    const { teamId, seasonYear } = req.params;

    db.query('SELECT * FROM standings WHERE team_id = ? AND season_year = ?', [teamId, seasonYear], (err, results) => {
        if (err) {
            console.error('Error carregant standing de l\'equip:', err);
            res.status(500).json({ error: 'Error carregant les dades' });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Standing no trobat' });
            }
        }
    });
});

module.exports = router;
