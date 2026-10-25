# 🎬 Spatial 3D Cinematic Search

An interactive, high-performance **Single Page Application (SPA)** and **Progressive Web App (PWA)** built with modern web technologies. Designed with a **Spatial Glassmorphism 3D UI**, this application allows users to search across multiple streaming platforms simultaneously with real-time TMDb poster fetching, multi-layered 3D depth tilt physics, an orbital cursor system, and interactive audio feedback.

🚀 **Live Demo:** [https://SAHimu369.github.io](https://SAHimu369.github.io)

---

## ✨ Features

- 🌌 **Spatial Glassmorphism 3D Theme:** Fluid glass aesthetic with dynamic background glowing orbs and specular spotlight reflection overlays.
- 🧊 **Multi-Layered 3D Card Physics:** Independent Z-axis element extrusion where thumbnails, badges, and text blocks elevate separately during mouse hover.
- 🎯 **Custom Orbital Cursor System:** Precise inner dot core with a smooth, fluid trailing glass outer ring (`lerp` physics) that locks onto interactive targets on desktop.
- 🌓 **Day & Night Mode Switcher:** Instant theme toggling supporting high-contrast day and dark night modes with adaptive glass variables.
- 🔍 **Multi-Site Search Discovery:** Direct query mapping across 7 active streaming provider platforms:
  - Goojara
  - MoviesHDWatch
  - 123MoviesFun
  - CineVood
  - TowKai
  - MovieLinkBD (`movienestbd.asia`)
  - Cinedoze
- 🖼️ **Real-Time TMDb Poster Integration:** Dynamically fetches official movie/TV series posters from The Movie Database (TMDb) API.
- 📱 **Mobile & Touch Optimized:** Device capability checks (`@media (hover: hover)`) automatically adjust 3D physics and hide custom cursors on touch screens to ensure smooth 60fps performance on mobile.
- 🔊 **Interactive Audio Feedback:** Preloaded round-robin audio feedback for hover interactions and button clicks.
- ⚡ **Offline-Ready Progressive Web App (PWA):** Service worker integration (`sw.js`) and Web App Manifest (`manifest.json`) supporting app installation on desktop and mobile.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic architecture, accessible web elements, and modern meta tag configurations.
- **CSS3:** Custom CSS variables, Flexbox, Grid, 3D CSS Transforms (`transform-style: preserve-3d`), Perspective viewport, and CSS Glassmorphism gradients.
- **Vanilla JavaScript (ES6+):** Async/Await API fetching, DOM MutationObserver, smooth mouse physics, audio round-robin system, and Service Worker registration.
- **TMDb REST API:** Automated poster art resolution.

---

## 📂 Project Structure

```text
├── index.html       # Primary HTML layout & structural containers
├── style.css        # Glassmorphism design system, 3D transforms & responsiveness
├── script.js        # Search logic, TMDb API integration, 3D tilt & cursor physics
├── manifest.json    # PWA configuration for mobile & desktop installation
├── sw.js            # Service worker for caching core static assets
├── favicon.ico      # Application brand icon
└── click.mp3        # Hover and click audio feedback sound asset
