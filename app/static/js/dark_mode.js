import { renderAllGraphs } from './render.js';

/**
 * Toggle dark mode for the application:
 * - Adds/removes the 'dark-mode' class on the body.
 * - Stores preference in localStorage.
 * - Re-renders all graphs to match the theme.
 * - Smoothly fades out/in the results section during the transition.
 */
export function toggleDarkMode() {
  const results = document.getElementById('results-section');
  results.style.transition = 'opacity 0.3s ease-out';
  results.style.opacity = '0'; // Start fade out

  setTimeout(() => {
    // Toggle dark mode class and save the new state
    const darkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');

    // Update the icon based on the new mode
    updateDarkModeIcon(darkMode);

    // Re-render graphs to switch between light/dark graph data
    renderAllGraphs();

    // Fade results back in after re-render
    setTimeout(() => {
      document.querySelectorAll('.plotly-graph').forEach(g => Plotly.Plots.resize(g));
      results.style.opacity = '1';
    }, 50);
  }, 300); // Delay to allow fade out
}

/**
 * Update the dark mode toggle button icon to reflect the current mode.
 *
 * @param {boolean} darkMode - True if dark mode is enabled, false otherwise.
 */
export function updateDarkModeIcon(darkMode) {
  document.getElementById('toggle-icon').src = darkMode
    ? 'static/images/light-mode.png'
    : 'static/images/dark-mode.png';
}
