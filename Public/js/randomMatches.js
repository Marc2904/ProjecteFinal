// Quan el document estigui completament carregat
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fa una petició per obtenir partits aleatoris del backend
        const response = await fetch("/matches/random");

        // Converteix la resposta a format JSON
        const matches = await response.json();

        // Selecciona el contenidor on es mostraran les targetes dels partits
        const container = document.getElementById("match-cards");

        // Itera sobre cada partit i genera una targeta (card) visual
        matches.forEach(match => {
            // Crea una columna per la graella Bootstrap
            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4";

            // Defineix l'estructura HTML de la targeta del partit
            card.innerHTML = `
                <div class="card shadow rounded-4 p-3 h-100">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="text-center">
                            <img src="${match.home_logo}" alt="${match.home_team}" class="img-fluid" style="height: 40px;">
                            <p class="mb-0">${match.home_team}</p>
                        </div>

                        <div class="text-center fw-bold fs-4">
                            ${match.home_score} - ${match.away_score}
                        </div>

                        <div class="text-center">
                            <img src="${match.away_logo}" alt="${match.away_team}" class="img-fluid" style="height: 40px;">
                            <p class="mb-0">${match.away_team}</p>
                        </div>
                    </div>

                    <p class="text-muted text-center mb-1">
                        ${new Date(match.match_date).toLocaleString("ca-ES", { dateStyle: "short", timeStyle: "short" })}
                    </p>

                    <p class="text-center">
                        <span class="badge bg-success">${match.round}</span>
                    </p>
                </div>
            `;

            // Afegeix la targeta al contenidor.
            container.appendChild(card);
        });

    } catch (error) {
        // Si hi ha algun error, es mostra per consola
        console.error("Error carregant partits aleatoris:", error);
    }

    // Recupera dades d'autenticació emmagatzemades en localStorage
    const token = localStorage.getItem("auth_token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");

    // Mostra les dades a la consola (només per depuració)
    console.log("Token guardat:", token);
    console.log("User ID guardat:", userId);
    console.log("Username guardat:", username);
});
