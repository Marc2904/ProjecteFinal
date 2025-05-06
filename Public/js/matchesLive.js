// Clau de l'API per fer peticions a API-Football
const apiKey = '2b035ec184d8335ba53937a8b7feb43f';
// URL de l'API que retorna tots els partits en directe
const url = 'https://v3.football.api-sports.io/fixtures?live=all';

// Funció per convertir els codis curts d'estat dels partits en text 
function formatStatus(status) {
    const map = {
        '1H': 'Primera Part',
        'HT': 'Descans',
        '2H': 'Segona Part',
        'ET': 'Pròrroga',
        'P': 'Penals',
        'FT': 'Finalitzat',
        'NS': 'No ha començat',
        'LIVE': 'En joc',
        'SUSP': 'Suspès',
        'CANC': 'Cancel·lat',
        'ABD': 'Abandonat',
    };
    return map[status] || status;  // Retorna el text traduït o el codi si no hi ha traducció
}

// Crida a l'API per obtenir les dades dels partits en directe
fetch(url, {
    method: 'GET',
    headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': apiKey
    }
})
.then(response => response.json())  // Converteix la resposta a JSON
.then(data => {
    const fixtures = data.response;  // Llista de partits
    const container = document.getElementById('fixtures'); // Contenidor HTML on es mostraran els partits
    container.innerHTML = '';  // Neteja el contingut anterior

    // Si no hi ha cap partit en viu
    if (fixtures.length === 0) {
        container.innerHTML = `<div class="col-12 text-muted text-center">No hi ha partits en viu</div>`;
        return;
    }

    // Agrupa els partits per país
    const groupedByCountry = {};
    fixtures.forEach(match => {
        const country = match.league.country;
        const flag = match.league.flag || '';
        if (!groupedByCountry[country]) {
            groupedByCountry[country] = { flag, matches: [] };
        }
        groupedByCountry[country].matches.push(match);
    });

    // Ordena els països alfabèticament
    const sortedCountries = Object.keys(groupedByCountry).sort();

    // Per cada país, crea una secció amb els partits
    sortedCountries.forEach(country => {
        const countryFlag = groupedByCountry[country].flag;

        // Títol del país amb bandera
        const header = document.createElement('div');
        header.className = 'col-12 country-header';
        header.innerHTML = `${countryFlag ? `<img src="${countryFlag}" width="20" class="me-2">` : ''}${country}`;
        container.appendChild(header);

        // Per cada partit del país
        groupedByCountry[country].matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';  // Responsive per 3 columnes en pantalles grans

            const statusText = formatStatus(match.fixture.status.short);  // Traducció de l'estat del partit

            // Contingut del partit
            card.innerHTML = `
                <div class="match-card">
                    <!-- Nom de la lliga i logo -->
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted text-truncate">${match.league.name}</small>
                        <img src="${match.league.logo}" class="team-logo" alt="League logo">
                    </div>

                    <!-- Equip local, marcador i equip visitant -->
                    <div class="d-flex justify-content-between align-items-center">
                        <!-- Equip local -->
                        <div class="d-flex align-items-center justify-content-end flex-grow-1 text-end pe-2">
                            <span class="text-truncate me-2">${match.teams.home.name}</span>
                            <img src="${match.teams.home.logo}" class="team-logo" alt="${match.teams.home.name}">
                        </div>

                        <!-- Marcador -->
                        <div class="score-box text-nowrap fw-bold px-2">${match.goals.home} - ${match.goals.away}</div>

                        <!-- Equip visitant -->
                        <div class="d-flex align-items-center justify-content-start flex-grow-1 text-start ps-2">
                            <img src="${match.teams.away.logo}" class="team-logo me-2" alt="${match.teams.away.name}">
                            <span class="text-truncate">${match.teams.away.name}</span>
                        </div>
                    </div>

                    <!-- Estat del partit -->
                    <div class="text-center mt-2 text-muted small">${statusText}</div>
                </div>
            `;
            container.appendChild(card);  // Afegeix la targeta del partit al contenidor
        });
    });
})
// Si hi ha algun error en la crida a l'API, es mostra un missatge
.catch(error => {
    console.error('Error:', error);
    const container = document.getElementById('fixtures');
    container.innerHTML = `<div class="col-12 text-danger text-center">Error al carregar les dades</div>`;
});

