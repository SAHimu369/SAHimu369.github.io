const TMDB_API_KEY = 'b4d31f50aba10c665dfa02cf7a5cdf16';

// Detect Desktop Mouse vs Touch Device
const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Audio Feedback System
const audioInstances = [];
for (let i = 0; i < 5; i++) {
    const audio = new Audio("click.mp3");
    audio.volume = 0.25;
    audioInstances.push(audio);
}
let currentAudioIndex = 0;

const clickAudio = new Audio("click.mp3");

function playSound() {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => console.log("Audio play suppressed:", e));
}

function playHoverSound() {
    if (!isHoverDevice) return;
    const audio = audioInstances[currentAudioIndex];
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Hover audio suppressed:", e));
    currentAudioIndex = (currentAudioIndex + 1) % audioInstances.length;
}

// Configured Streaming Providers
const sites = [
    { 
        name: "Goojara", active: true,
        buildUrl: (q) => "https://www.goojara.is/search/" + encodeURIComponent(q.replace(/(\d{4})$/, '($1)'))
    },
    { 
        name: "MoviesHDWatch", active: true,
        buildUrl: (q) => "https://movieshdwatch.to/search/" + q.trim().toLowerCase().replace(/\s+/g, "-")
    },
    { 
        name: "123MoviesFun", active: true,
        buildUrl: (q) => "https://123moviesfun.is/search/?q=" + q.replace(/[^\w\s]/g, '').replace(/\s+/g, '+')
    },
    { 
        name: "CineVood", active: true,
        buildUrl: (q) => "https://cinevood.bet/?s=" + encodeURIComponent(q)
    },
    { 
        name: "TowKai", active: true,
        buildUrl: (q) => "https://mm.towkai.com/search?q=" + encodeURIComponent(q.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim())
    },
    { 
        name: "MovieLinkBD", active: true,
        buildUrl: (q) => "https://movienestbd.asia/search?q=" + encodeURIComponent(q)
    },
    {
        name: "Cinedoze", active: true,
        buildUrl: (q) => `https://cinedoze.com/?s=${encodeURIComponent(q.replace(/\s+/g, '+'))}`
    }
];

// Custom Orbital Cursor (Desktop only)
function initCustomCursor() {
    if (!isHoverDevice) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const attachHoverHandlers = () => {
        document.querySelectorAll('a, button, input, .result-card, .filter-chip').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('active'));
            el.addEventListener('mouseleave', () => ring.classList.remove('active'));
        });
    };
    attachHoverHandlers();

    const observer = new MutationObserver(attachHoverHandlers);
    observer.observe(document.getElementById('results'), { childList: true });
}

// 3D Tilt Physics (Desktop Mouse only)
function init3DTilt(card) {
    if (!isHoverDevice) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -18;
        const rotateY = ((x - centerX) / centerX) * 18;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}

// Day / Night Theme Switcher
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    btn.addEventListener('click', () => {
        playSound();
        document.body.classList.toggle('day-mode');
        const isDay = document.body.classList.contains('day-mode');
        icon.textContent = isDay ? 'dark_mode' : 'light_mode';
        text.textContent = isDay ? 'Night Mode' : 'Day Mode';
    });
}

// Filter Chips Setup
function renderFilterChips() {
    const filterContainer = document.getElementById("filter-container");
    if (!filterContainer) return;
    filterContainer.innerHTML = "";

    sites.forEach((site) => {
        const chip = document.createElement("button");
        chip.className = `filter-chip ${site.active ? "active" : ""}`;
        chip.textContent = site.name;
        chip.addEventListener("click", () => {
            site.active = !site.active;
            chip.classList.toggle("active", site.active);
            playHoverSound();
            const query = document.getElementById("query").value.trim();
            if (query) performSearch();
        });
        filterContainer.appendChild(chip);
    });
}

// TMDb Poster Fetching
async function fetchPoster(query) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
            return `https://image.tmdb.org/t/p/w400${data.results[0].poster_path}`;
        }
    } catch (err) {
        console.error("TMDb fetch error:", err);
    }
    return null;
}

// Intro Loading Screen
function simulateCinematicLoading() {
    const progressBar = document.getElementById('cinematic-progress');
    const loadingScreen = document.getElementById('cinematic-loading');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'translateY(-20px)';
                setTimeout(() => loadingScreen.style.display = 'none', 800);
            }, 300);
        }
        progressBar.style.width = progress + '%';
    }, 150);
}

// Search Logic
async function performSearch() {
    const queryInput = document.getElementById("query");
    const query = queryInput.value.trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    
    if (!query) {
        resultsDiv.innerHTML = "<p class='error-message'>Please enter a search query</p>";
        return;
    }

    queryInput.blur();

    const activeSites = sites.filter(s => s.active);
    if (activeSites.length === 0) {
        resultsDiv.innerHTML = "<p class='no-results'>Please select at least one provider to search.</p>";
        return;
    }

    resultsDiv.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Scanning spatial databases...</p>
        </div>
    `;
    
    const posterUrl = await fetchPoster(query);
    resultsDiv.innerHTML = "";

    activeSites.forEach((site) => {
        const url = site.buildUrl(query);

        const cardWrapper = document.createElement("div");
        cardWrapper.className = "result-card-3d-wrapper";

        const card = document.createElement("a");
        card.className = "result-card";
        card.href = url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        init3DTilt(card);

        card.addEventListener('click', (e) => {
            e.preventDefault();
            playSound();
            setTimeout(() => window.open(url, '_blank'), 100);
        });

        card.addEventListener('mouseenter', playHoverSound);

        // 1. Thumbnail Container
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

        // 2. Badge (Appended directly to card for independent 3D Z-plane)
        const badge = document.createElement("div");
        badge.className = "result-badge";
        badge.textContent = site.name;

        // 3. Info Block
        const info = document.createElement("div");
        info.className = "result-info";

        const title = document.createElement("div");
        title.className = "result-title";
        title.textContent = `${query}`;

        const siteUrl = document.createElement("div");
        siteUrl.className = "result-url";
        siteUrl.textContent = url;

        info.appendChild(title);
        info.appendChild(siteUrl);

        // Append all 3 as independent direct children of card
        card.appendChild(badge);
        card.appendChild(imgContainer);
        card.appendChild(info);

        cardWrapper.appendChild(card);
        resultsDiv.appendChild(cardWrapper);
    });
}

// Startup Event Handlers
window.addEventListener('load', () => {
    simulateCinematicLoading();
    renderFilterChips();
    initCustomCursor();
    initThemeToggle();
});

document.getElementById("query").addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
});

document.getElementById("search-btn").addEventListener("click", performSearch);
