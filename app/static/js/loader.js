import { fadeIn, fadeOut } from './fade.js';

/**
 * Show or hide the loading spinner with a fade effect.
 *
 * @param {boolean} show - If true, fades in the loader; if false, fades it out.
 */
export function toggleLoader(show) {
  const loader = document.getElementById('loading-spinner');
  show ? fadeIn(loader, 'block') : fadeOut(loader);
}

/**
 * Move the title and prompt UI elements up the page and reveal the results section.
 * Adds/removes CSS classes to trigger layout/visibility changes.
 */
export function moveTitleAndPromptUp() {
  document.getElementById('title').classList.add('top-left');
  document.getElementById('prompt-section').classList.add('top-center');
  document.getElementById('results-section').classList.remove('hidden');
}
