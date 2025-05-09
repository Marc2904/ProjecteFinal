// Importem les funcions per carregar jugadors i partits d'un equip
import { loadPlayers } from "./players.js";
import { loadMatchesTeam } from "./matchesTeam.js";

// Funció Toast per mostrar missatges emergents al frontend
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;  // Estableix el missatge dins del toast
    toast.className = "toast show";  // Mostra el toast
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");  // Amaga el toast després de 5 segons
    }, 5000); 
}

// Quan el document està completament carregat, s'executa el codi
document.addEventListener("DOMContentLoaded", async function () {
    // Obtenim l'ID de l'equip des de la URL
    const teamId = new URLSearchParams(window.location.search).get("id");
    // Obtenim els elements del DOM on es mostrarà la informació de l'equip
    const teamName = document.getElementById('team-name');
    const teamLogo = document.getElementById('team-logo');
    const teamCountry = document.getElementById('team-country');
    const favoriteBtn = document.getElementById('favorite-btn');

    // Definim l'URL del backend segons si estem en localhost o en producció
    const backendUrl = window.location.hostname.includes("localhost")
        ? "http://localhost:5000"
        : "https://projectefinal-lafz.onrender.com";  // URL del backend per a local i servidor hosting

    const seasonYear = 2023;  // Any de la temporada

    try {
        // Realitzem una petició per obtenir les dades de l'equip
        const response = await fetch(`${backendUrl}/teams/team/${teamId}`);

        if (!response.ok) {
            throw new Error("No s'han trobat dades per aquest equip");  // Si no hi ha resposta correcta, llança un error
        }

        const team = await response.json();  // Obtenim les dades de l'equip en format JSON

        // Actualitzem el contingut al frontend amb la informació de l'equip
        teamName.textContent = team.name;
        teamLogo.src = team.logo;
        teamLogo.alt = `Logo de ${team.name}`;
        teamCountry.textContent = `País: ${team.country}`;

        // Comprovació de sessió per veure si l'usuari està loguejat
        const userId = localStorage.getItem("user_id");

        if (!userId || userId === "null" || userId.trim() === "") {
            // Si l'usuari no està loguejat, amaga el botó de favorits
            favoriteBtn.style.display = "none"; 
        } else {
            // Si l'usuari està loguejat, mostra el botó de favorits
            favoriteBtn.style.display = "inline-block"; 

            // Verifica si l'equip ja és favorit de l'usuari
            const checkFavoriteResponse = await fetch(`${backendUrl}/favorites/check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, teamId })  // Enviem les dades de l'usuari i l'equip
            });

            const checkResult = await checkFavoriteResponse.json();
            let isFavorite = checkResult.isFavorite;  // Obtenim si l'equip és favorit

            // Actualitzem el text del botó de favorits segons si l'equip és favorit
            favoriteBtn.textContent = isFavorite ? "Eliminar de Favorits" : "Afegir a Favorits";

            // Afegim un event listener al botó de favorits
            favoriteBtn.addEventListener('click', async () => {
                const url = `${backendUrl}/favorites`;
                const method = isFavorite ? "DELETE" : "POST";  // Establim el mètode segons si és favorit o no

                // Realitzem la petició per afegir o eliminar de favorits
                const res = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, teamId })  // Enviem les dades de l'usuari i l'equip
                });

                const result = await res.json();

                if (result.success) {
                    isFavorite = !isFavorite;  // Invertim l'estat de si és favorit o no
                    favoriteBtn.textContent = isFavorite ? "Eliminar de favorits" : "Afegir a favorits"; // Actualitzem el text del botó
                    showToast(isFavorite ? "Afegit als favorits!" : "Eliminat dels favorits!"); // Mostrem un missatge toast
                } else {
                    alert("Error al actualitzar favorits");  // Si hi ha error, mostrem un missatge d'error
                }
            });
        }

        // Funció per establir la pestanya activa en la navegació
        function setActiveTab(activeTabId) {
            document.querySelectorAll(".nav-link").forEach(tab => {
                tab.classList.remove("active");  // Treiem l'estil actiu de totes les pestanyes
            });
            const activeTab = document.getElementById(activeTabId);
            if (activeTab) {
                activeTab.classList.add("active");  // Afegim l'estil actiu a la pestanya seleccionada
            }
        }

        // Event listener per canviar a la pestanya de jugadors
        document.getElementById("tab-players").addEventListener("click", function () {
            setActiveTab("tab-players");  // Estableix la pestanya activa
            document.getElementById("players-results").style.display = "block";  // Mostra la secció de jugadors
            document.getElementById("match-results").style.display = "none";  // Amaga la secció de partits
            loadPlayers(backendUrl, teamId, seasonYear);  // Carrega els jugadors de l'equip
        });

        // Event listener per canviar a la pestanya de partits
        document.getElementById("tab-matches").addEventListener("click", function () {
            setActiveTab("tab-matches");  // Estableix la pestanya activa
            document.getElementById("players-results").style.display = "none";  // Amaga la secció de jugadors
            document.getElementById("match-results").style.display = "block";  // Mostra la secció de partits
            loadMatchesTeam(backendUrl, teamId, seasonYear);  // Carrega els partits de l'equip
        });

    } catch (error) {
        // Si hi ha un error durant el procés de càrrega de les dades de l'equip, ho capturem i mostrem per consola
        console.error("Error carregant l'equip:", error);
    }

});


