const TMDB_API_KEY = 'b4d31f50aba10c665dfa02cf7a5cdf16';

// Preload multiple audio instances for rapid hovers
const audioInstances = [];
for (let i = 0; i < 5; i++) {
  const audio = new Audio();
  audio.src = "click.mp3";
  audio.volume = 0.3; // Lower volume for hover
  audioInstances.push(audio);
}
let currentAudioIndex = 0;

// Main click audio
const clickAudio = new Audio();
clickAudio.src = "click.mp3";

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
  },
  {
    name: "Cinedoze",
    buildUrl: (q) => {
      const formattedQuery = q.replace(/\s+/g, '+');
      return `https://cinedoze.com/?s=${encodeURIComponent(formattedQuery)}`;
    }
  }
];

// Add Enter key functionality to search input
document.getElementById("query").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    performSearch();
  }
});

// Event listener for the search button
document.getElementById("search-btn").addEventListener("click", performSearch);

// Play click sound function
function playSound() {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(e => console.log("Audio play failed:", e));
}

// Play hover sound using round-robin approach
function playHoverSound() {
  const audio = audioInstances[currentAudioIndex];
  audio.currentTime = 0;
  audio.play().catch(e => console.log("Hover audio play failed:", e));
  currentAudioIndex = (currentAudioIndex + 1) % audioInstances.length;
}

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
  return null;
}

// Function to simulate cinematic loading progress
function simulateCinematicLoading() {
  const progressBar = document.getElementById('cinematic-progress');
  const loadingScreen = document.getElementById('cinematic-loading');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Animate out the loading screen
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'translateY(-20px)';
        
        // Hide loading screen completely after animation
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }, 300);
    }
    progressBar.style.width = progress + '%';
  }, 200);
}

// Initialize cinematic loading when page loads
window.addEventListener('load', function() {
  simulateCinematicLoading();
});

async function performSearch() {
  const query = document.getElementById("query").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  
  if (!query) {
    resultsDiv.innerHTML = "<p class='error-message'>Please enter a search query</p>";
    return;
  }

  // Show loading state
  resultsDiv.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Searching...</p>
    </div>
  `;
  
  const posterUrl = await fetchPoster(query);

  // Clear loading state
  resultsDiv.innerHTML = "";

  sites.forEach((site) => {
    const url = site.buildUrl(query);

    const card = document.createElement("a");
    card.className = "result-card";
    card.href = url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    // Add click sound
    card.addEventListener('click', (e) => {
      e.preventDefault();
      playSound();
      setTimeout(() => {
        window.open(url, '_blank');
      }, 100);
    });

    // Add instant hover sound
    card.addEventListener('mouseenter', () => {
      playHoverSound();
    });

    // Create image container
    const imgContainer = document.createElement("div");
    imgContainer.className = "result-thumb";
    
    if (posterUrl) {
      const img = document.createElement("img");
      img.src = posterUrl;
      img.alt = query + " poster";
      img.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement("div");
        placeholder.className = "poster-placeholder";
        placeholder.textContent = "No poster available";
        imgContainer.appendChild(placeholder);
      };
      imgContainer.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "poster-placeholder";
      placeholder.textContent = "No poster available";
      imgContainer.appendChild(placeholder);
    }

    card.appendChild(imgContainer);

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = `${query} - ${site.name}`;

    const siteUrl = document.createElement("div");
    siteUrl.className = "result-url";
    siteUrl.textContent = url;

    card.appendChild(title);
    card.appendChild(siteUrl);

    resultsDiv.appendChild(card);
  });
}
