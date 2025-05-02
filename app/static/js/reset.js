import { fadeOut } from "./fade.js";

/**
 * Reset the UI to its initial state:
 * - Moves title and prompt back to center.
 * - Hides the results section and tooltips.
 * - Prevents reset if a loading spinner is active.
 */
export function resetToInitialState() {
  // Prevent reset if loading is in progress
  if (document.getElementById('loading-spinner').classList.contains('hidden') === false) {
    return; // Do nothing if loading
  }

  // Smoothly scroll to top (optional UX enhancement)
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset title and prompt positions (remove "moved up" classes)
  document.getElementById('title').classList.remove('top-left');
  document.getElementById('prompt-section').classList.remove('top-center');

  // Fade out the results section
  const results = document.getElementById('results-section');
  fadeOut(results);

  // Hide tooltips
  document.getElementById("result-tooltip-wrapper").classList.add("hidden");
  document.getElementById("changes-tooltip-wrapper").classList.add("hidden");
}
