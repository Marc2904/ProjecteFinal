export async function loadMatches(backendUrl, leagueId, seasonYear) {
    try {
        const response = await fetch(`${backendUrl}/matches/${leagueId}/${seasonYear}`);
        if (!response.ok) throw new Error("No s'han trobat partits");
        const matches = await response.json();

        displayMatches(matches);
    } catch (error) {
        console.error("Error carregant els partits:", error);
        document.getElementById("match-results",).innerHTML = "<p class='text-center text-danger'>No s'han trobat partits.</p>";
    }
}

// Funció per mostrar els partits 
function displayMatches(matches) {
    const matchResults = document.getElementById("match-results");
    matchResults.innerHTML = "";

    // Contenidor per al selector de jornades
    let roundSelectorContainer = document.getElementById("round-selector-container");
    if (!roundSelectorContainer) {
        roundSelectorContainer = document.createElement("div");
        roundSelectorContainer.id = "round-selector-container";
        roundSelectorContainer.classList.add("text-center", "mb-3");
        matchResults.before(roundSelectorContainer); // Inserim el selector abans dels partits
    }
    roundSelectorContainer.innerHTML = ""; // Netejem el contingut anterior

    // Crear desplegable
    const roundLabel = document.createElement("label");
    roundLabel.setAttribute("for", "round-selector");
    roundLabel.classList.add("fw-bold");
    roundLabel.textContent = "Selecciona una jornada:";
    
    const roundSelector = document.createElement("select");
    roundSelector.id = "round-selector";
    roundSelector.classList.add("form-select", "w-auto", "d-inline-block", "ms-2");

    // Agrupar partits per jornada
    const matchesByRound = new Map();
    
    matches.forEach(match => {
        const round = match.round || "Jornada desconeguda"; // Si no té jornada, es posa per defecte
        if (!matchesByRound.has(round)) {
            matchesByRound.set(round, []);
        }
        matchesByRound.get(round).push(match);
    });

    // Ordenar les jornades numèricament (si són números)
    const sortedRounds = [...matchesByRound.keys()].sort((a, b) => isNaN(a) ? 1 : a - b);

    // Afegir opcions al desplegable
    sortedRounds.forEach(round => {
        const option = document.createElement("option");
        option.value = round;
        option.textContent = `Jornada ${round}`;
        roundSelector.appendChild(option);
    });

    // Afegim el selector al contenidor
    roundSelectorContainer.appendChild(roundLabel);
    roundSelectorContainer.appendChild(roundSelector);

    // Mostrar la primera jornada per defecte
    if (sortedRounds.length > 0) {
        showRound(matchesByRound, sortedRounds[0]);
    }

    // Event listener per canviar de jornada
    roundSelector.addEventListener("change", () => {
        showRound(matchesByRound, roundSelector.value);
    });
}

// Funció per mostrar una jornada específica
function showRound(matchesByRound, round) {
    const matchResults = document.getElementById("match-results");
    matchResults.innerHTML = ""; // Esborrem la jornada anterior

    matchesByRound.get(round).forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("match-item", "p-3", "border", "rounded", "bg-white", "shadow-sm", "mb-2");

        matchElement.innerHTML = `
            <div class="row align-items-center text-center">
                <div class="col-4 d-flex align-items-center justify-content-end">
                    <span class="me-2">${match.home_team}</span>
                    <img src="${match.home_logo}" alt="${match.home_team}" width="40" height="40">
                </div>
                <div class="col-4">
                    <strong class="fs-5">${match.home_score !== null ? `${match.home_score} - ${match.away_score}` : "VS"}</strong>
                </div>
                <div class="col-4 d-flex align-items-center justify-content-start">
                    <img src="${match.away_logo}" alt="${match.away_team}" width="40" height="40">
                    <span class="ms-2">${match.away_team}</span>
                </div>
            </div>
            <small class="text-muted d-block text-center mt-1">${new Date(match.match_date).toLocaleDateString()}</small>
        `;

        matchResults.appendChild(matchElement);
    });
}

