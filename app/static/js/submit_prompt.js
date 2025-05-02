import { moveTitleAndPromptUp, toggleLoader } from './loader.js';
import { fadeOut, fadeIn } from './fade.js';
import { renderTradesAndStats, renderAllGraphs } from './render.js';
import { setCachedGraphs } from './cache.js';

// Cache to store the latest graphs for reuse (light and dark versions)
let cachedGraphs = {
  price_graph: { light: null, dark: null },
  buy_graphs: { light: [], dark: [] },
  sell_graphs: { light: [], dark: [] },
};

/**
 * Handle submission of the user's prompt:
 * - Sends the prompt and LLM choice to the backend.
 * - Manages UI transitions (loader, errors, results).
 * - Renders graphs and trade statistics upon successful response.
 */
export function submitPrompt() {
  const prompt = document.getElementById('prompt').value;
  const llmChoice = document.getElementById('llm-choice').value;

  moveTitleAndPromptUp();
  toggleLoader(true);

  // Disable title click to prevent interaction during loading
  document.getElementById('title').style.pointerEvents = 'none';

  const resultsSection = document.getElementById('results-section');
  const errorBox = document.getElementById('error-box');
  const splitContainer = document.getElementById('split-container');

  // Hide results section while fetching new data
  resultsSection.classList.add('hidden');

  fetch('/process_prompt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ prompt, llm_choice: llmChoice })
  })
  .then(response => response.json())
  .then(data => {
    fadeIn(resultsSection, 'block');
    const errorList = document.getElementById("error-list");

    toggleLoader(false);
    document.getElementById('title').style.pointerEvents = 'auto';

    // Show result string in tooltip if available
    if (data.result_string) {
        const tooltipBox = document.getElementById("result-tooltip");
        tooltipBox.textContent = data.result_string;
        document.getElementById("result-tooltip-wrapper").classList.remove("hidden");
    } else {
        document.getElementById("result-tooltip-wrapper").classList.add("hidden");
    }

    if (data.validation_failed) {
        // Display validation errors
        errorList.innerHTML = data.changes.map(change => `<li>${change}</li>`).join('');
        errorBox.classList.remove('hidden');
        splitContainer.classList.add('hidden');
        document.getElementById("changes-tooltip-wrapper").classList.add("hidden");
    } else {
        // Valid result: show graphs and stats
        splitContainer.classList.remove('hidden');
        errorBox.classList.add('hidden');

        renderTradesAndStats(data.trades, data.stats);
        setCachedGraphs(data);
        renderAllGraphs();

        // Display changes tooltip if any adjustments were made by the backend
        if (data.changes && Object.keys(data.changes).length > 0) {
            const changesTooltip = document.getElementById("changes-tooltip");
            const bulletPoints = Object.values(data.changes).map(change => `• ${change}`).join('\n');
            changesTooltip.textContent = bulletPoints;
            document.getElementById("changes-tooltip-wrapper").classList.remove("hidden");
        } else {
            document.getElementById("changes-tooltip-wrapper").classList.add("hidden");
        }
    }

  })
  .catch(error => {
    toggleLoader(false);
    console.error('Error:', error);
  });
}

/**
 * Copy the result string (e.g., strategy summary) to the clipboard.
 */
export function copyResultString() {
    const text = document.getElementById("result-tooltip").textContent;
    navigator.clipboard.writeText(text);
}
