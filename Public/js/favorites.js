document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");
  const backendUrl = "http://localhost:5000";

  // Comprovació de sessió i redirecció si no està iniciada
  if (!userId || userId === "null" || userId.trim() === "") {
    window.location.href = "../html/login.html"; // Redirigeix al login si no hi ha sessió
    return;
  }

  const leaguesContainer = document.getElementById("favorite-leagues");
  const teamsContainer = document.getElementById("favorite-teams");

  try {
    // Lligues favorites
    const leaguesRes = await fetch(`${backendUrl}/favorites/leagues/${userId}`);
    const leagues = await leaguesRes.json();

    if (leagues.length === 0) {
      leaguesContainer.innerHTML = "<p class='text-muted'>No tens cap lliga marcada com a favorita.</p>";
    } else {
      leagues.forEach(league => {
        leaguesContainer.innerHTML += createLeagueCard(league.name, league.logo, league.id);
      });
    }

    // Equips favorits
    const teamsRes = await fetch(`${backendUrl}/favorites/teams/${userId}`);
    const teams = await teamsRes.json();

    if (teams.length === 0) {
      teamsContainer.innerHTML = "<p class='text-muted'>No tens cap equip marcat com a favorit.</p>";
    } else {
      teams.forEach(team => {
        teamsContainer.innerHTML += createTeamCard(team.name, team.logo, team.id);
      });
    }

  } catch (err) {
    console.error("Error carregant favorits:", err);
  }
});

function createTeamCard(name, logoUrl, id) {
  return `
    <div class="col-md-4">
      <a href="team.html?id=${id}" class="text-decoration-none text-dark">
        <div class="card shadow-sm text-center p-4 h-100">
          <img src="${logoUrl}" alt="Logo de ${name}" class="mb-3" style="height: 60px; object-fit: contain;" />
          <h5 class="mb-0">${name}</h5>
        </div>
      </a>
    </div>
  `;
}

function createLeagueCard(name, logoUrl, id) {
  return `
    <div class="col-md-4">
      <a href="league.html?id=${id}" class="text-decoration-none text-dark">
        <div class="card shadow-sm text-center p-4 h-100">
          <img src="${logoUrl}" alt="Logo de ${name}" class="mb-3" style="height: 60px; object-fit: contain;" />
          <h5 class="mb-0">${name}</h5>
        </div>
      </a>
    </div>
  `;
}

