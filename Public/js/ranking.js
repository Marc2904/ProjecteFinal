// Funció principal per carregar i mostrar els màxims golejadors i assistents d'una lliga i temporada
export async function loadTopScorersAndAssisters(backendUrl, leagueId, seasonYear) {
    try {
        // 1. Petició per obtenir els màxims golejadors
        const scorersResponse = await fetch(`${backendUrl}/players/${leagueId}/${seasonYear}/topscorers`);
        if (!scorersResponse.ok) throw new Error("No s'han trobat golejadors");
        let topScorers = await scorersResponse.json();

        // 2. Petició per obtenir els màxims assistents
        const assistersResponse = await fetch(`${backendUrl}/players/${leagueId}/${seasonYear}/topassists`);
        if (!assistersResponse.ok) throw new Error("No s'han trobat assistents");
        let topAssists = await assistersResponse.json();

        // 3. Mostrar les dades carregades amb una funció separada
        displayTopScorersAndAssisters(topScorers, topAssists);
    } catch (error) {
        // En cas d'error, mostrar un missatge a l'usuari i a la consola
        console.error("Error carregant els rànquings:", error);
        document.getElementById("rankings-results").innerHTML = 
            "<p class='text-center text-danger'>No s'han trobat dades de rànquing.</p>";
    }
}

// Funció per mostrar visualment les dues taules de dades
function displayTopScorersAndAssisters(topScorers, topAssists) {
    const rankingsResults = document.getElementById("rankings-results");
    rankingsResults.innerHTML = ""; // Neteja el contingut anterior

    // Si no hi ha dades, mostra un missatge
    if (topScorers.length === 0 && topAssists.length === 0) {
        rankingsResults.innerHTML = "<p class='text-center'>No hi ha dades disponibles.</p>";
        return;
    }

    // Crear un contenidor flexible per posar les dues taules una al costat de l’altra
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center", "gap-4", "mt-3", "flex-wrap");

    // Crear taules amb títol i tipus de dada ("goals" o "assists")
    const scorersTable = createTable(" Màxims Golejadors", topScorers, "goals");
    const assistersTable = createTable(" Màxims Assistents", topAssists, "assists");

    // Afegir les taules al contenidor
    container.appendChild(scorersTable);
    container.appendChild(assistersTable);

    // Afegir el contenidor amb taules al DOM
    rankingsResults.appendChild(container);
}

// Funció per generar una taula HTML per a golejadors o assistents
function createTable(title, data, type) {
    // Crear contenidor amb estils
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-responsive", "shadow-sm", "rounded", "p-3", "bg-light");

    // Crear l'element taula amb classes Bootstrap
    const table = document.createElement("table");
    table.classList.add("table", "table-borderless", "text-center", "m-0");

    // Definir el contingut HTML de la taula
    table.innerHTML = `
        <thead>
            <tr class="bg-dark text-white">
                <th colspan="4" class="py-2">${title}</th> <!-- Títol de la taula -->
            </tr>
            <tr class="border-bottom">
                <th>#</th>
                <th>Jugador</th>
                <th>Equip</th>
                <th>${type === "goals" ? " Gols" : " Assistències"}</th> <!-- Canvia segons tipus -->
            </tr>
        </thead>
        <tbody>
            ${data.map((player, index) => `
                <tr>
                    <td class="fw-bold">${index + 1}</td> <!-- Posició -->
                    <td class="text-start">
                        <img src="${player.player_photo}" alt="${player.player_name}" width="30" height="30" class="rounded-circle me-2">
                        ${player.player_name} <!-- Foto i nom del jugador -->
                    </td>
                    <td>${player.team_name}</td> <!-- Equip del jugador -->
                    <td class="fw-bold">${player[type]}</td> <!-- Valor: gols o assistències -->
                </tr>
            `).join("")}
        </tbody>
    `;

    // Afegir la taula al contenidor i retornar
    tableContainer.appendChild(table);
    return tableContainer;
}

