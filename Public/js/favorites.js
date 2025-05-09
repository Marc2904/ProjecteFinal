// Quan el document estigui carregat completament...
document.addEventListener("DOMContentLoaded", async () => {
  // Obtenim l'ID de l'usuari del localStorage
  const userId = localStorage.getItem("user_id");
  
  const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:5000"
    : "https://projectefinal-lafz.onrender.com";  // URL del backend per a local host y servidor Hosting

  // Comprovem si hi ha sessió iniciada (és a dir, si existeix l'user_id)
  if (!userId || userId === "null" || userId.trim() === "") {
    // Si no hi ha sessió, redirigim a la pàgina de login
    window.location.href = "../html/login.html";
    return;
  }

  // Agafem els contenidors on es mostraran les lligues i els equips favorits
  const leaguesContainer = document.getElementById("favorite-leagues");
  const teamsContainer = document.getElementById("favorite-teams");

  try {
    // Sol·licitem les lligues favorites de l'usuari al backend
    const leaguesRes = await fetch(`${backendUrl}/favorites/leagues/${userId}`);
    const leagues = await leaguesRes.json();

    // Si no hi ha cap lliga, mostrem un missatge informatiu
    if (leagues.length === 0) {
      leaguesContainer.innerHTML = "<p class='text-muted'>No tens cap lliga marcada com a favorita.</p>";
    } else {
      // Si n'hi ha, les afegim al contenidor amb la funció createLeagueCard
      leagues.forEach(league => {
        leaguesContainer.innerHTML += createLeagueCard(league.name, league.logo, league.id);
      });
    }

    // Sol·licitem els equips favorits de l'usuari al backend
    const teamsRes = await fetch(`${backendUrl}/favorites/teams/${userId}`);
    const teams = await teamsRes.json();

    // Si no hi ha cap equip, mostrem un missatge
    if (teams.length === 0) {
      teamsContainer.innerHTML = "<p class='text-muted'>No tens cap equip marcat com a favorit.</p>";
    } else {
      // Si n'hi ha, els afegim al contenidor amb la funció createTeamCard
      teams.forEach(team => {
        teamsContainer.innerHTML += createTeamCard(team.name, team.logo, team.id);
      });
    }

  } catch (err) {
    // Si hi ha algun error en el procés, el mostrem per consola
    console.error("Error carregant favorits:", err);
  }
});

// Funció que genera el codi HTML per mostrar un equip favorit com a targeta
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

// Funció que genera el codi HTML per mostrar una lliga favorita com a targeta
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

