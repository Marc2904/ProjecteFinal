// Importem les funcions necessàries de fitxers externs
import { loadMatches } from './matches.js';
import { loadStandings } from './standings.js';
import { loadTeams } from './teams.js';
import { loadTopScorersAndAssisters } from './ranking.js';

// Funció Toast per mostrar missatges emergents a l'usuari
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";  // Afegeix la classe per mostrar el Toast
    setTimeout(() => {
        toast.className = toast.className.replace("show", ""); // Oculta el Toast després de 5 segons
    }, 5000); 
}

// Espera a que el DOM estigui carregat per executar el codi
document.addEventListener('DOMContentLoaded', async function () {
    // Obtenim l'ID de la lliga de la URL
    const leagueId = new URLSearchParams(window.location.search).get('id');

    // Assignem els elements del DOM que mostrarem o manipularem
    const leagueName = document.getElementById('league-name');
    const leagueLogo = document.getElementById('league-logo');
    const leagueCountry = document.getElementById('league-country');
    const favoriteBtn = document.getElementById('favorite-btn');

    const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:5000"
    : "https://projectefinal-lafz.onrender.com";  // URL del backend
    const seasonYear = 2023;  // Temporada actual

    try {
        // Petició GET al backend per obtenir les dades de la lliga
        const response = await fetch(`${backendUrl}/leagues/${leagueId}`);

        if (!response.ok) {
            throw new Error('No s\'han trobat dades per aquesta lliga');
        }

        const league = await response.json();  // Convertim la resposta en JSON

        // Actualitzem el DOM amb la informació de la lliga
        leagueName.textContent = league.name;
        leagueLogo.src = league.logo;
        leagueLogo.alt = `Logo de ${league.name}`;
        leagueCountry.textContent = `País: ${league.country}`;

        // Comprovem si l'usuari està loguejat
        const userId = localStorage.getItem("user_id");

        if (!userId || userId === "null" || userId.trim() === "") {
            // Amaguem el botó de favorits si no hi ha usuari
            favoriteBtn.style.display = "none";
        } else {
            // Mostrem el botó de favorits
            favoriteBtn.style.display = "inline-block";

            // Comprovem si aquesta lliga és ja un favorit
            const checkFavoriteResponse = await fetch(`${backendUrl}/favorites/league/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, leagueId })
            });

            const checkResult = await checkFavoriteResponse.json();
            let isFavorite = checkResult.isFavorite;

            // Canviem el text del botó segons si és favorit o no
            favoriteBtn.textContent = isFavorite ? "Eliminar de Favorits" : "Afegir a Favorits";

            // Afegim l'event de clic al botó per afegir o eliminar dels favorits
            favoriteBtn.addEventListener('click', async () => {
                const url = `${backendUrl}/favorites/league`;
                const method = isFavorite ? "DELETE" : "POST";

                const res = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, leagueId })
                });

                const result = await res.json();

                // Si l'acció té èxit, canviem l'estat del botó i mostrem Toast
                if (result.success) {
                    isFavorite = !isFavorite;
                    favoriteBtn.textContent = isFavorite ? "Eliminar de favorits" : "Afegir a favorits";
                    showToast(isFavorite ? "Afegit als favorits!" : "Eliminat dels favorits!");
                } else {
                    alert("Error al actualitzar favorits");
                }
            });
        }

        // Funció per marcar com activa la pestanya seleccionada
        function setActiveTab(activeTabId) {
            document.querySelectorAll(".nav-link").forEach(tab => {
                tab.classList.remove("active");  // Eliminem la classe active de totes les pestanyes
            });
            const activeTab = document.getElementById(activeTabId);
            if (activeTab) {
                activeTab.classList.add("active");  // Afegim la classe active a la seleccionada
            }
        }

        // Funció per mostrar o amagar el selector de jornada
        function toggleRoundSelector(visible) {
            const roundSelectorContainer = document.getElementById("round-selector-container");
            if (roundSelectorContainer) {
                roundSelectorContainer.style.display = visible ? "block" : "none";
            }
        }

        // Assignem els esdeveniments de clic a cada pestanya

        // Pestanya: Partits
        document.getElementById("tab-matches").addEventListener("click", function () {
            setActiveTab("tab-matches");
            document.getElementById("match-results").style.display = "block";
            document.getElementById("standings-results").style.display = "none";
            document.getElementById("teams-results").style.display = "none";
            document.getElementById("rankings-results").style.display = "none";
            loadMatches(backendUrl, leagueId, seasonYear);  // Carreguem els partits
            toggleRoundSelector(true);  // Mostrem selector de jornada
        });

        // Pestanya: Classificació
        document.getElementById("tab-standings").addEventListener("click", function () {
            setActiveTab("tab-standings");
            document.getElementById("match-results").style.display = "none";
            document.getElementById("standings-results").style.display = "block";
            document.getElementById("teams-results").style.display = "none";
            document.getElementById("rankings-results").style.display = "none";
            loadStandings(backendUrl, leagueId, seasonYear);  // Carreguem classificació
            toggleRoundSelector(false);  // Amaguem selector de jornada
        });

        // Pestanya: Equips
        document.getElementById("tab-teams").addEventListener("click", function () {
            setActiveTab("tab-teams");
            document.getElementById("match-results").style.display = "none";
            document.getElementById("standings-results").style.display = "none";
            document.getElementById("teams-results").style.display = "block";
            document.getElementById("rankings-results").style.display = "none";
            loadTeams(backendUrl, leagueId);  // Carreguem els equips
            toggleRoundSelector(false);
        });

        // Pestanya: Rankings (golejadors/assistents)
        document.getElementById("tab-rankings").addEventListener("click", function () {
            setActiveTab("tab-rankings");
            document.getElementById("match-results").style.display = "none";
            document.getElementById("standings-results").style.display = "none";
            document.getElementById("teams-results").style.display = "none";
            document.getElementById("rankings-results").style.display = "block";
            loadTopScorersAndAssisters(backendUrl, leagueId, seasonYear);  // Carreguem golejadors i assistents
            toggleRoundSelector(false);
        });

    } catch (error) {
        // Mostrem l'error a la consola si hi ha algun problema
        console.error('Error carregant la lliga:', error);
    }
});
