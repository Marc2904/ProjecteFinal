import { loadPlayers } from "./players.js";
import { loadMatchesTeam } from "./matchesTeam.js";

// Funció Toast per mostrar missatges emergents
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 5000); 
}

document.addEventListener("DOMContentLoaded", async function () {
    const teamId = new URLSearchParams(window.location.search).get("id");
    const teamName = document.getElementById('team-name');
    const teamLogo = document.getElementById('team-logo');
    const teamCountry = document.getElementById('team-country');
    const favoriteBtn = document.getElementById('favorite-btn');

    const backendUrl = "http://localhost:5000"; // URL del servidor backend
    const seasonYear = 2023; // Any de la temporada

    try {
        const response = await fetch(`${backendUrl}/teams/team/${teamId}`);

        if (!response.ok) {
            throw new Error("No s'han trobat dades per aquest equip");
        }

        const team = await response.json();

        teamName.textContent = team.name;
        teamLogo.src = team.logo;
        teamLogo.alt = `Logo de ${team.name}`;
        teamCountry.textContent = `País: ${team.country}`;

        // Comprovació de sessió
        const userId = localStorage.getItem("user_id");

        if (!userId || userId === "null" || userId.trim() === "") {
            favoriteBtn.style.display = "none"; // Amaga el botó de favorits si no està loguejat
        } else {
            favoriteBtn.style.display = "inline-block"; // Mostra el botó de favorits si està loguejat

            // Verifica si aquest equip ja és favorit de l'usuari
            const checkFavoriteResponse = await fetch(`${backendUrl}/favorites/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, teamId })
            });

            const checkResult = await checkFavoriteResponse.json();
            let isFavorite = checkResult.isFavorite;

            favoriteBtn.textContent = isFavorite ? "Eliminar de Favorits" : "Afegir a Favorits";

            favoriteBtn.addEventListener('click', async () => {
                const url = `${backendUrl}/favorites`;
                const method = isFavorite ? "DELETE" : "POST";

                const res = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, teamId })
                });

                const result = await res.json();

                if (result.success) {
                    isFavorite = !isFavorite;
                    favoriteBtn.textContent = isFavorite ? "Eliminar de favorits" : "Afegir a favorits";
                    showToast(isFavorite ? "Afegit als favorits!" : "Eliminat dels favorits!");
                } else {
                    alert("Error al actualitzar favorits");
                }
            });
        }

        // Funció per establir la pestanya activa
        function setActiveTab(activeTabId) {
            document.querySelectorAll(".nav-link").forEach(tab => {
                tab.classList.remove("active");
            });
            const activeTab = document.getElementById(activeTabId);
            if (activeTab) {
                activeTab.classList.add("active");
            }
        }

        document.getElementById("tab-players").addEventListener("click", function () {
            setActiveTab("tab-players");
            document.getElementById("players-results").style.display = "block";
            document.getElementById("match-results").style.display = "none";
            loadPlayers(backendUrl, teamId, seasonYear);
        });

        document.getElementById("tab-matches").addEventListener("click", function () {
            setActiveTab("tab-matches");
            document.getElementById("players-results").style.display = "none";
            document.getElementById("match-results").style.display = "block";
            loadMatchesTeam(backendUrl, teamId, seasonYear);
        });

    } catch (error) {
        console.error("Error carregant l'equip:", error);
    }

    
});

