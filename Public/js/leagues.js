// Esperem que el contingut de la pàgina es carregui abans d'executar aquest codi
document.addEventListener('DOMContentLoaded', async function () {
    // Seleccionem el contenidor on es mostraran les lligues
    const leaguesContainer = document.getElementById('leagues');

    try {
        // Fem una petició GET al servidor per obtenir les lligues emmagatzemades
        const response = await fetch('/leagues');
        
        // Comprovem si la resposta del servidor és correcta
        if (!response.ok) throw new Error('Error carregant les dades');

        // Convertim la resposta a JSON
        const leagues = await response.json();
        
        // Netejem el contenidor abans d'afegir les noves lligues
        leaguesContainer.innerHTML = '';

        // Iterem per cada lligua que hem obtingut
        leagues.forEach(league => {
            // Creem una nova "targeta" HTML per mostrar les dades de la lligua
            const leagueCard = document.createElement('div');
            leagueCard.className = "col-6 col-md-4 col-lg-2 mb-3"; // Apliquem classes CSS per l'estil

            // Afegim el contingut HTML de la targeta, incloent el logo, nom i país de la lligua
            leagueCard.innerHTML = `
                <div class="league-card bg-white p-3 shadow-sm" data-id="${league.id}">
                    <img src="${league.logo}" alt="${league.name}" class="img-fluid">
                    <h6 class="mt-2">${league.name}</h6>
                    <p class="text-muted">${league.country}</p>
                </div>`;

            // Afegim un esdeveniment de clic a la targeta per redirigir a una nova pàgina
            leagueCard.addEventListener('click', function() {
                const leagueId = league.id;  // Obtenim l'ID de la lligua seleccionada
                // Redirigim a una nova pàgina que mostra informació detallada de la lligua
                window.location.href = `league.html?id=${leagueId}`;
            });

            // Afegim la targeta creada al contenidor de lligues a la pàgina
            leaguesContainer.appendChild(leagueCard);
        });
        

    } catch (error) {
        // Si hi ha un error el mostrem per la consola
        console.error('Error carregant les lligues:', error);
    }
    
});





