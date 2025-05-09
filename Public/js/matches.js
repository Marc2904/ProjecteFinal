// Funció asíncrona per carregar els partits d'una lliga i temporada donades
export async function loadMatches(backendUrl, leagueId, seasonYear) {
    try {
        // Fa una petició al backend per obtenir els partits
        const response = await fetch(`${backendUrl}/matches/${leagueId}/${seasonYear}`);

        // Si la resposta no és correcta, llença un error
        if (!response.ok) throw new Error("No s'han trobat partits");

        // Converteix la resposta a JSON
        const matches = await response.json();

        // Crida la funció per mostrar els partits
        displayMatches(matches);
    } catch (error) {
        // Mostra un error si la petició falla
        console.error("Error carregant els partits:", error);
        document.getElementById("match-results").innerHTML =
            "<p class='text-center text-danger'>No s'han trobat partits.</p>";
    }
}

// Funció per mostrar els partits a la pàgina
function displayMatches(matches) {
    const matchResults = document.getElementById("match-results");
    matchResults.innerHTML = ""; // Neteja el contingut anterior

    // Crea o recupera el contenidor del selector de jornades
    let roundSelectorContainer = document.getElementById("round-selector-container");
    if (!roundSelectorContainer) {
        roundSelectorContainer = document.createElement("div");
        roundSelectorContainer.id = "round-selector-container";
        roundSelectorContainer.classList.add("text-center", "mb-3");

        // Col·loca el selector abans dels resultats
        matchResults.before(roundSelectorContainer);
    }
    roundSelectorContainer.innerHTML = ""; // Neteja el contingut anterior

    // Crea etiqueta per al selector
    const roundLabel = document.createElement("label");
    roundLabel.setAttribute("for", "round-selector");
    roundLabel.classList.add("fw-bold");
    roundLabel.textContent = "Selecciona una jornada:";

    // Crea el selector (desplegable) de jornades
    const roundSelector = document.createElement("select");
    roundSelector.id = "round-selector";
    roundSelector.classList.add("form-select", "w-auto", "d-inline-block", "ms-2");

    // Agrupa els partits per jornada
    const matchesByRound = new Map();
    matches.forEach(match => {
        const round = match.round || "Jornada desconeguda";
        if (!matchesByRound.has(round)) {
            matchesByRound.set(round, []);
        }
        matchesByRound.get(round).push(match);
    });

    // Ordena les jornades numèricament (si són números)
    const sortedRounds = [...matchesByRound.keys()].sort((a, b) =>
        isNaN(a) ? 1 : a - b
    );

    // Omple el selector amb les opcions de jornades
    sortedRounds.forEach(round => {
        const option = document.createElement("option");
        option.value = round;
        option.textContent = `Jornada ${round}`;
        roundSelector.appendChild(option);
    });

    // Afegeix el selector i la seva etiqueta al contenidor
    roundSelectorContainer.appendChild(roundLabel);
    roundSelectorContainer.appendChild(roundSelector);

    // Mostra per defecte la primera jornada disponible
    if (sortedRounds.length > 0) {
        showRound(matchesByRound, sortedRounds[0]);
    }

    // Canvia els partits mostrats segons la jornada seleccionada
    roundSelector.addEventListener("change", () => {
        showRound(matchesByRound, roundSelector.value);
    });
}

// Funció per mostrar els partits d'una jornada concreta
function showRound(matchesByRound, round) {
    const matchResults = document.getElementById("match-results");
    matchResults.innerHTML = ""; // Neteja els partits anteriors

    // Itera sobre els partits de la jornada seleccionada
    matchesByRound.get(round).forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add(
            "match-item", "p-3", "border", "rounded",
            "bg-white", "shadow-sm", "mb-2"
        );

        // Dibuixa l'estructura del partit amb equips, logos, resultat i data
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

        // Afegeix el partit al DOM
        matchResults.appendChild(matchElement);
    });
}

