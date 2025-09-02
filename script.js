const TMDB_API_KEY = 'b4d31f50aba10c665dfa02cf7a5cdf16';

const sites = [
  { 
    name: "Goojara", 
    buildUrl: (q) => {
      let modified = q.replace(/(\d{4})$/, '($1)');
      return "https://www.goojara.is/search/" + encodeURIComponent(modified);
    }
  },
  { 
    name: "MoviesHDWatch", 
    buildUrl: (q) => {
      let dashQuery = q.trim().toLowerCase().replace(/\s+/g, "-");
      return "https://movieshdwatch.to/search/" + dashQuery;
    }
  },
  { 
    name: "123MoviesFun", 
    buildUrl: (q) => {
      let cleaned = q.replace(/[^\w\s]/g, '');
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      let encoded = cleaned.replace(/ /g, '+');
      return "https://123moviesfun.is/search/?q=" + encoded;
    }
  },
  { 
    name: "CineVood", 
    buildUrl: (q) => "https://cinevood.bet/?s=" + encodeURIComponent(q)
  },
  { 
    name: "TowKai", 
    buildUrl: (q) => {
      let cleaned = q.replace(/[^a-zA-Z\s]/g, ""); 
      cleaned = cleaned.replace(/\s+/g, " ").trim();
      return "http://mm.towkai.com/search?q=" + encodeURIComponent(cleaned);
    }
  }
];

document.getElementById("search-btn").addEventListener("click", performSearch);

async function fetchPoster(query) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.results && data.results.length > 0 && data.results[0].poster_path) {
      return `https://image.tmdb.org/t/p/w300${data.results[0].poster_path}`;
    }
  } catch (err) {
    console.error("TMDb fetch error:", err);
  }
  return null; // No placeholder
}

async function performSearch() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  if (!query) return;

  const posterUrl = await fetchPoster(query);

  sites.forEach((site) => {
    const url = site.buildUrl(query);

    const card = document.createElement("div");
    card.className = "result-card";

    // Only add image if poster exists
    if (posterUrl) {
      const img = document.createElement("img");
      img.className = "result-thumb";
      img.src = posterUrl;
      img.alt = query + " poster";
      card.appendChild(img);
    }

    const title = document.createElement("a");
    title.className = "result-title";
    title.href = url;
    title.target = "_blank";
    title.textContent = `${query} - ${site.name}`;

    const siteUrl = document.createElement("div");
    siteUrl.className = "result-url";
    siteUrl.textContent = url;

    card.appendChild(title);
    card.appendChild(siteUrl);

    resultsDiv.appendChild(card);
  });
}
