import { fadeIn, fadeOut } from './fade.js';

export function toggleLoader(show) {
  const loader = document.getElementById('loading-spinner');
  show ? fadeIn(loader, 'block') : fadeOut(loader);
}

export function moveTitleAndPromptUp() {
  document.getElementById('title').classList.add('top-left');
  document.getElementById('prompt-section').classList.add('top-center');
  document.getElementById('results-section').classList.remove('hidden');
}