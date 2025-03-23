import { moveTitleAndPromptUp, toggleLoader } from './loader.js';
import { fadeOut, fadeIn } from './fade.js';
import { renderTradesAndStats, renderAllGraphs } from './render.js';
import { setCachedGraphs } from './cache.js';

let cachedGraphs = {
  price_graph: { light: null, dark: null },
  buy_graphs: { light: [], dark: [] },
  sell_graphs: { light: [], dark: [] },
};

export function submitPrompt() {
  const prompt = document.getElementById('prompt').value;
  const llmChoice = document.getElementById('llm-choice').value;

  moveTitleAndPromptUp();
  toggleLoader(true);

  // Disable title click while loading
  document.getElementById('title').style.pointerEvents = 'none';

  // Fade out current results
  const results = document.getElementById('results-section');
  if (!results.classList.contains('hidden')) {
    fadeOut(results);
  }

  fetch('/process_prompt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ prompt, llm_choice: llmChoice })
  })
  .then(response => response.json())
  .then(data => {
    // Fade in new results
    fadeIn(results, 'block');

    renderTradesAndStats(data.trades, data.stats);

    setCachedGraphs(data);

    renderAllGraphs();
    toggleLoader(false);

    document.getElementById('title').style.pointerEvents = 'auto';
  })
  .catch(error => {toggleLoader(false);
  });
}