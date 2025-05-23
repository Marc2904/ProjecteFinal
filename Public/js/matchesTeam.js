// Funció asíncrona per carregar els partits d'un equip en una temporada específica
export async function loadMatchesTeam(backendUrl, teamID, seasonYear) {
    try {
        // Fa una crida a l'API per obtenir els partits d’un equip concret
        const response = await fetch(`${backendUrl}/matches/team/${teamID}/${seasonYear}`);

        // Si la resposta no és correcta, llença un error
        if (!response.ok) throw new Error("No s'han trobat partits");

        // Converteix la resposta en JSON
        const matches = await response.json();

        // Mostra els partits a la pàgina
        displayMatches(matches);
    } catch (error) {
        // En cas d'error, mostra un missatge per pantalla i escriu l'error a la consola
        console.error("Error carregant els partits:", error);
        document.getElementById("match-results").innerHTML = 
            "<p class='text-center text-danger'>No s'han trobat partits.</p>";
    }
}

// Funció per mostrar els partits en ordre cronològic
function displayMatches(matches) {
    const matchResults = document.getElementById("match-results");
    matchResults.innerHTML = ""; // Neteja els partits anteriors

    // Ordena els partits per data (de més antic a més nou)
    matches.sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

    // Per cada partit, crea un element HTML per mostrar-lo
    matches.forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("match-item", "p-3", "border", "rounded", "bg-white", "shadow-sm", "mb-2");

        matchElement.innerHTML = `
            <div class="row align-items-center text-center">
                <div class="col-4 d-flex align-items-center justify-content-end">
                    <span class="me-2">${match.home_team}</span>
                    <img src="${match.home_logo}" alt="${match.home_team}" width="40" height="40">
                </div>

                <div class="col-4">
                    <strong class="fs-5">
                        ${match.home_score !== null ? `${match.home_score} - ${match.away_score}` : "VS"}
                    </strong>
                </div>

                <div class="col-4 d-flex align-items-center justify-content-start">
                    <img src="${match.away_logo}" alt="${match.away_team}" width="40" height="40">
                    <span class="ms-2">${match.away_team}</span>
                </div>
            </div>

            <small class="text-muted d-block text-center mt-1">
                ${new Date(match.match_date).toLocaleDateString()}
            </small>
        `;

        // Afegeix el partit al contenidor
        matchResults.appendChild(matchElement);
    });
}
