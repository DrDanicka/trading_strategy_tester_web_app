import { renderAllGraphs } from './render.js';

export function toggleDarkMode() {
  const results = document.getElementById('results-section');
  results.style.transition = 'opacity 0.3s ease-out';
  results.style.opacity = '0';

  setTimeout(() => {
    const darkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
    updateDarkModeIcon(darkMode);
    renderAllGraphs();

    setTimeout(() => {
      document.querySelectorAll('.plotly-graph').forEach(g => Plotly.Plots.resize(g));
      results.style.opacity = '1';
    }, 50);
  }, 300);
}

export function updateDarkModeIcon(darkMode) {
  document.getElementById('toggle-icon').src = darkMode
    ? 'static/images/light-mode.png'
    : 'static/images/dark-mode.png';
}