// Funció per carregar els jugadors d'un equip en una temporada específica
export async function loadPlayers(backendUrl, teamId, seasonYear) {
    try {
        // Fa una petició al backend per obtenir els jugadors de l'equip i la temporada especificada
        const response = await fetch(`${backendUrl}/players/${teamId}/${seasonYear}`);
        
        // Si la resposta no és correcta, llança un error
        if (!response.ok) throw new Error("No s'han trobat jugadors");

        // Converteix la resposta a format JSON
        const players = await response.json();

        // Precarrega les imatges dels jugadors abans de mostrar la informació
        preloadImages(players).then(() => {
            displayPlayers(players); // Un cop carregades, mostra els jugadors
        });

    } catch (error) {
        // En cas d'error, mostra un missatge i l'error a la consola
        console.error("Error carregant els jugadors:", error);
        document.getElementById("players-results").innerHTML = "<p>No s'han trobat dades dels jugadors.</p>";
    }
}

// Funció per carregar les imatges abans de mostrar-les a la pantalla
function preloadImages(players) {
    return new Promise((resolve) => {
        let loaded = 0; // Comptador d'imatges carregades

        if (players.length === 0) {
            resolve();
            return;
        }

        // Carrega cada imatge abans de mostrar-la
        players.forEach(player => {
            const img = new Image();
            img.src = player.photo;
            img.onload = () => {
                loaded++;
                if (loaded === players.length) {
                    resolve(); 
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded === players.length) {
                    resolve();
                }
            };
        });
    });
}

// Funció per mostrar els jugadors a la pantalla
function displayPlayers(players) {
    const playersResults = document.getElementById("players-results");
    playersResults.innerHTML = ""; // Neteja contingut previ

    // Objecte per agrupar jugadors per posició
    const positions = {
        "Porter": [],
        "Defensa": [],
        "Migcampista": [],
        "Davanter": []
    };

    // Traduir les posicions de l'anglès al català
    const positionTranslation = {
        "Goalkeeper": "Porter",
        "Defender": "Defensa",
        "Midfielder": "Migcampista",
        "Attacker": "Davanter"
    };

    // Classificar els jugadors per posició
    players.forEach(player => {
        const pos = positionTranslation[player.position] || "Desconegut"; // Si la posició és nul·la, assigna "Desconegut"
        if (positions[pos]) {
            positions[pos].push(player);
        }
    });

    // Definir l'ordre de les posicions
    const positionOrder = ["Porter", "Defensa", "Migcampista", "Davanter"];

    positionOrder.forEach(position => {
        const playersList = positions[position];
        if (playersList.length > 0) {
            // Crear un títol per la posició
            const title = document.createElement("h3");
            title.classList.add("text-center", "mt-3", "text-uppercase", "fw-bold");
            title.innerText = position;
            playersResults.appendChild(title);

            // Crear la graella de jugadors
            const row = document.createElement("div");
            row.classList.add("row", "g-3");

            // Ordenar per partits jugats (de més a menys)
            playersList.sort((a, b) => b.games_played - a.games_played);

            playersList.forEach(player => {
                const col = document.createElement("div");
                col.classList.add("col-md-4");

                col.innerHTML = `
                    <div class="p-3 bg-white shadow-sm rounded text-center player-card" data-player-id="${player.id}">
                        <img src="${player.photo}" width="60" class="mb-2 rounded-circle" alt="${player.name}">
                        <h5 class="fw-semibold">${player.name}</h5>
                        <p class="text-muted mb-1"><strong>Posició:</strong> ${position}</p>
                        <p class="text-muted"><strong>Edat:</strong> ${player.age}</p>
                        <p class="text-muted"><strong>Partits jugats:</strong> ${player.games_played}</p>
                        <p class="text-muted"><strong>Gols:</strong> ${player.goals}</p>
                        <p class="text-muted"><strong>Assistències:</strong> ${player.assists}</p>
                    </div>
                `;
                row.appendChild(col);
            });

            playersResults.appendChild(row);
        }
    });
}
