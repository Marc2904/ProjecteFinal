// Funció asincrònica per carregar la classificació des del backend
export async function loadStandings(backendUrl, leagueId, seasonYear) {
    try {
        // Realitzem una petició GET per obtenir la classificació des del backend
        const response = await fetch(`${backendUrl}/standings/${leagueId}/${seasonYear}`);
        
        // Si la resposta no és correcta (status no 2xx), llançarem un error
        if (!response.ok) throw new Error("No s'ha trobat la classificació");
        
        // Convertim la resposta a JSON
        const standings = await response.json();

        // Cridem la funció per mostrar la classificació al frontend
        displayStandings(standings);
    } catch (error) {
        // Si es produeix un error durant la petició, mostrem un missatge d'error
        console.error("Error carregant la classificació:", error);
        // Mostrem un missatge d'error al frontend si no es poden obtenir les dades
        document.getElementById("standings-results").innerHTML = "<p>No s'han trobat dades de classificació.</p>";
    }
}

// Funció per mostrar la classificació al HTML
function displayStandings(standings) {
    // Obtenim el contenidor on es mostrarà la classificació
    const standingsResults = document.getElementById("standings-results");
    standingsResults.innerHTML = ""; // Neteja el contingut anterior de la classificació

    // Creem una taula per mostrar la classificació
    const table = document.createElement("table");
    table.classList.add("table", "table-hover", "text-center", "shadow-lg", "rounded-3"); // Afegim classes per estilitzar la taula

    // Afegim l'HTML per a l'encapçalament de la taula
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

    // Obtenim el cos de la taula per afegir les files
    const tbody = table.querySelector("#standings-body");

    // Iterem sobre les dades de la classificació i afegim una fila per cada equip
    standings.forEach((team) => {
        const row = document.createElement("tr");
        row.classList.add("align-middle"); // Centrem el contingut de la fila

        // Afegim les dades de la classificació a la fila
        row.innerHTML = `
            <td class="fw-bold">${team.rank}</td> 
            <td class="d-flex align-items-center gap-2">
                <img src="${team.logo}" alt="${team.name}" width="30" height="30">
                <span>${team.name}</span>
            </td>
            <td class="fw-bold">${team.points}</td> 
            <td>${team.matches_played}</td> 
            <td class="text-success">${team.wins}</td> 
            <td class="text-warning">${team.draws}</td> 
            <td class="text-danger">${team.losses}</td> 
            <td class="fw-bold">${team.goals_for}</td> 
            <td class="fw-bold">${team.goals_against}</td> 
            <td class="fw-bold">${team.goal_difference}</td>
        `;

        // Afegim la fila a la taula
        tbody.appendChild(row);
    });

    // Afegim la taula completada al contenidor
    standingsResults.appendChild(table);
}

