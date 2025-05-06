// Clau de NewsAPI
const apiKeyNews = "561354fdecf94a5e958eb81ccc9c5a15";
const urlNews = `https://newsapi.org/v2/everything?q=futbol&domains=marca.com&language=es&sortBy=publishedAt&apiKey=${apiKeyNews}`;

// Funció per obtenir les notícies
function obtenirNoticies() {
fetch(urlNews)
  .then(response => response.json())  // Convertir la resposta en JSON
  .then(data => {
    const noticies = data.articles;

    // Crear la sortida de notícies al format de cartes
    const noticiesList = noticies.slice(0, 12).map((noticia, index) => {
    return `
    <div class="col-6 col-md-4 col-lg-2 mb-3">
    <div class="news-card">
      <img src="${noticia.urlToImage}" >
      <h6>${noticia.title}</h6>
      <p><strong>Font:</strong> ${noticia.source.name}</p>
      <a href="${noticia.url}" target="_blank">Llegir més</a>
    </div>
    </div>
     `;
    }).join('');

    // Mostrar les notícies al contenidor
    document.getElementById("noticies").innerHTML = noticiesList;
    })
.catch(error => {console.error("Error en obtenir les notícies:", error);
  });
}

// Cridem la funció per obtenir les notícies
obtenirNoticies();
