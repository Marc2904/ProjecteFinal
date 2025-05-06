export async function loadTeams(backendUrl, leagueId) {
    try {
        // Petició GET per obtenir la classificació des del backend
        const response = await fetch(`${backendUrl}/teams/${leagueId}`);
        if (!response.ok) throw new Error("No s'han trobat equips");
        const teams = await response.json();

        // Ordenar els equips per nom en ordre alfabètic
        teams.sort((a, b) => a.name.localeCompare(b.name));

        // Mostrar els equips al frontend
        displayTeams(teams);
    } catch (error) {
        console.error("Error carregant els equips:", error);
        document.getElementById("teams-results").innerHTML = "<p>No s'han trobat dades dels equips.</p>";
    }
}

function displayTeams(teams) {
    const teamsResults = document.getElementById("teams-results");
    teamsResults.innerHTML = ""; // Netejar contingut previ

    const row = document.createElement("div");
    row.classList.add("row", "g-3"); // Dues columnes per fila

    teams.forEach(team => {
        const col = document.createElement("div");
        col.classList.add("col-md-6");


        col.innerHTML = `
            <div class="p-3 bg-white shadow-sm rounded text-center team-card" data-team-id="${team.id}">
                <img src="${team.logo}" width="60" class="mb-2">
                <h5 class="fw-semibold">${team.name}</h5>
                <p class="text-muted mb-1"><strong>Estadi:</strong> ${team.venue_name}</p>
                <p class="text-muted"><strong>Ciutat:</strong> ${team.venue_city}</p>
            </div>
        `;

        // Afegim l'escoltador per redirigir a la pàgina de l'equip
        col.querySelector(".team-card").addEventListener("click", function() {
            window.location.href = `team.html?id=${team.id}`; 
        });

        row.appendChild(col);
    });

    teamsResults.appendChild(row);
}


