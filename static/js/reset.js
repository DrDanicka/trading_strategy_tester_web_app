import {fadeOut} from "./fade.js";

export function resetToInitialState() {
  // Prevent reset while loading
  if (document.getElementById('loading-spinner').classList.contains('hidden') === false) {
    return; // Do nothing if loading
  }

  // Scroll to top (optional)
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset title and prompt to center
  document.getElementById('title').classList.remove('top-left');
  document.getElementById('prompt-section').classList.remove('top-center');

  // Fade out results section if visible
  const results = document.getElementById('results-section');
  fadeOut(results);

  document.getElementById("result-tooltip-wrapper").classList.add("hidden");

}