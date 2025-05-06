export async function loadStandings(backendUrl, leagueId, seasonYear) {
    try {
        // Petició GET per obtenir la classificació des del backend
        const response = await fetch(`${backendUrl}/standings/${leagueId}/${seasonYear}`);
        if (!response.ok) throw new Error("No s'ha trobat la classificació");
        const standings = await response.json();

        // Mostrar la classificació al frontend
        displayStandings(standings);
    } catch (error) {
        console.error("Error carregant la classificació:", error);
        document.getElementById("standings-results").innerHTML = "<p>No s'han trobat dades de classificació.</p>";
    }
}

// Funció per mostrar la classificació al HTML
function displayStandings(standings) {
    const standingsResults = document.getElementById("standings-results");
    standingsResults.innerHTML = ""; // Neteja el contingut anterior

    // Crear la taula de classificació
    const table = document.createElement("table");
    table.classList.add("table", "table-hover", "text-center", "shadow-lg", "rounded-3");

    table.innerHTML = `
        <thead class="text-white" style="background: linear-gradient(135deg, #004d00, #00b300);">
            <tr>
                <th class="py-3">#</th>
                <th class="py-3">Equip</th>
                <th class="py-3">Punts</th>
                <th class="py-3">PJ</th>
                <th class="py-3">PG</th>
                <th class="py-3">PE</th>
                <th class="py-3">PP</th>
                <th class="py-3">GF</th>
                <th class="py-3">GC</th>
                <th class="py-3">DG</th>
            </tr>
        </thead>
        <tbody id="standings-body"></tbody>
    `;

    const tbody = table.querySelector("#standings-body");

    standings.forEach((team) => {
        const row = document.createElement("tr");
        row.classList.add("align-middle");

        
        // Afegir les dades de la classificació a cada fila
        row.innerHTML = `
            <td class="fw-bold">${team.rank}</td>
            <td class="d-flex align-items-center gap-2">
                <img src="${team.logo}" alt="${team.name}" width="30" height="30">
                <span>${team.name}</span>
            </td>
            <td class="fw-bold ">${team.points}</td>
            <td>${team.matches_played}</td>
            <td class="text-success">${team.wins}</td>
            <td class="text-warning">${team.draws}</td>
            <td class="text-danger">${team.losses}</td>
            <td class="fw-bold">${team.goals_for}</td>
            <td class="fw-bold">${team.goals_against}</td>
            <td class="fw-bold">${team.goal_difference}</td>
        `;

        tbody.appendChild(row);
    });

    standingsResults.appendChild(table);
}

