export async function loadTopScorersAndAssisters(backendUrl, leagueId, seasonYear) {
    try {
        // Carregar golejadors
        const scorersResponse = await fetch(`${backendUrl}/players/${leagueId}/${seasonYear}/topscorers`);
        if (!scorersResponse.ok) throw new Error("No s'han trobat golejadors");
        let topScorers = await scorersResponse.json();

        // Carregar assistents
        const assistersResponse = await fetch(`${backendUrl}/players/${leagueId}/${seasonYear}/topassists`);
        if (!assistersResponse.ok) throw new Error("No s'han trobat assistents");
        let topAssists = await assistersResponse.json();

        // Mostrar les taules
        displayTopScorersAndAssisters(topScorers, topAssists);
    } catch (error) {
        console.error("Error carregant els rànquings:", error);
        document.getElementById("rankings-results").innerHTML = 
            "<p class='text-center text-danger'>No s'han trobat dades de rànquing.</p>";
    }
}

function displayTopScorersAndAssisters(topScorers, topAssists) {
    const rankingsResults = document.getElementById("rankings-results");
    rankingsResults.innerHTML = ""; // Netejar contingut anterior

    if (topScorers.length === 0 && topAssists.length === 0) {
        rankingsResults.innerHTML = "<p class='text-center'>No hi ha dades disponibles.</p>";
        return;
    }

    // Contenidor per tenir les dues taules en una fila amb separació
    const container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-center", "gap-4", "mt-3", "flex-wrap");

    // Crear les dues taules
    const scorersTable = createTable(" Màxims Golejadors", topScorers, "goals");
    const assistersTable = createTable(" Màxims Assistents", topAssists, "assists");

    // Afegir les taules al contenidor
    container.appendChild(scorersTable);
    container.appendChild(assistersTable);

    // Afegir el contenidor al HTML
    rankingsResults.appendChild(container);
}

function createTable(title, data, type) {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-responsive", "shadow-sm", "rounded", "p-3", "bg-light");

    const table = document.createElement("table");
    table.classList.add("table", "table-borderless", "text-center", "m-0");

    table.innerHTML = `
        <thead>
            <tr class="bg-dark text-white">
                <th colspan="4" class="py-2">${title}</th>
            </tr>
            <tr class="border-bottom">
                <th>#</th>
                <th>Jugador</th>
                <th>Equip</th>
                <th>${type === "goals" ? " Gols" : " Assistències"}</th>
            </tr>
        </thead>
        <tbody>
            ${data.map((player, index) => `
                <tr>
                    <td class="fw-bold">${index + 1}</td>
                    <td class="text-start">
                        <img src="${player.player_photo}" alt="${player.player_name}" width="30" height="30" class="rounded-circle me-2">
                        ${player.player_name}
                    </td>
                    <td>${player.team_name}</td>
                    <td class="fw-bold">${player[type]}</td>
                </tr>
            `).join("")}
        </tbody>
    `;

    tableContainer.appendChild(table);
    return tableContainer;
}
