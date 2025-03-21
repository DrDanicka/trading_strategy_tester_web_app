let cachedGraphs = {
  price_graph: { light: null, dark: null },
  buy_graphs: { light: [], dark: [] },
  sell_graphs: { light: [], dark: [] },
};

function fadeOut(element) {
  element.style.transition = "opacity 0.5s ease-out";
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, 500);
}

function fadeIn(element, display = "block") {
  element.style.opacity = 0;
  element.style.display = display;
  element.style.transition = "opacity 0.5s ease-in";
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10); // delay to apply transition
}


document.addEventListener('DOMContentLoaded', () => {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
  document.body.classList.toggle('dark-mode', darkModeEnabled);
  updateDarkModeIcon(darkModeEnabled);
});

function submitPrompt() {
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

    // Cache both light and dark graphs
    cachedGraphs.price_graph.light = data.price_graph_light;
    cachedGraphs.price_graph.dark = data.price_graph_dark;
    cachedGraphs.buy_graphs.light = data.buy_graphs_light;
    cachedGraphs.buy_graphs.dark = data.buy_graphs_dark;
    cachedGraphs.sell_graphs.light = data.sell_graphs_light;
    cachedGraphs.sell_graphs.dark = data.sell_graphs_dark;

    renderAllGraphs();
    toggleLoader(false);

    // Enable title click after loading
    document.getElementById('title').style.pointerEvents = 'auto';
  })
  .catch(error => {
    console.error('Error:', error);
    toggleLoader(false);
  });
}

function toggleDarkMode() {
  const darkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
  updateDarkModeIcon(darkMode);

  // Instantly update graphs with cached data
  renderAllGraphs();
}

function updateDarkModeIcon(darkMode) {
  document.getElementById('toggle-icon').src = darkMode
    ? 'static/images/light-mode.png'
    : 'static/images/dark-mode.png';
}

function moveTitleAndPromptUp() {
  document.getElementById('title').classList.add('top-left');
  document.getElementById('prompt-section').classList.add('top-center');
  document.getElementById('results-section').classList.remove('hidden');
}

function toggleLoader(show) {

  const loader = document.getElementById('loading-spinner');
  show ? fadeIn(loader, 'block') : fadeOut(loader);
}


function renderTradesAndStats(trades, stats) {
  const tradesSection = document.getElementById('trades-section');
  const statsSection = document.getElementById('stats-section');

  tradesSection.innerHTML = '';
  statsSection.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'stats-trades-wrapper';

  // === LEFT: Stats with Tabs ===
  const statsLeft = document.createElement('div');
  statsLeft.className = 'stats-left';

  const tabHeader = document.createElement('div');
  tabHeader.className = 'stats-tab-header';

  const overviewBtn = document.createElement('button');
  overviewBtn.textContent = 'Overview';
  overviewBtn.className = 'tab-button active';

  const perfBtn = document.createElement('button');
  perfBtn.textContent = 'Performance';
  perfBtn.className = 'tab-button';

  const tabContent = document.createElement('div');
  tabContent.className = 'stats-tab-content';

  const overviewTab = document.createElement('div');
  overviewTab.className = 'stats-tab-panel';
  const perfTab = document.createElement('div');
  perfTab.className = 'stats-tab-panel';
  perfTab.style.display = 'none';

  // === Populate Overview ===
  const overviewFields = ['total_pnl', 'total_trades', 'win_rate', 'avg_pnl', 'max_drawdown'];
  overviewFields.forEach(key => {
    if (key in stats) {
      const row = document.createElement('div');
      row.textContent = `${formatLabel(key)}: ${stats[key]}`;
      overviewTab.appendChild(row);
    }
  });

  // === Populate Performance ===
  Object.keys(stats).forEach(key => {
    if (!overviewFields.includes(key)) {
      const row = document.createElement('div');
      row.textContent = `${formatLabel(key)}: ${stats[key]}`;
      perfTab.appendChild(row);
    }
  });

  // === Tab Switching ===
  overviewBtn.addEventListener('click', () => {
    overviewBtn.classList.add('active');
    perfBtn.classList.remove('active');
    overviewTab.style.display = 'block';
    perfTab.style.display = 'none';
  });

  perfBtn.addEventListener('click', () => {
    perfBtn.classList.add('active');
    overviewBtn.classList.remove('active');
    overviewTab.style.display = 'none';
    perfTab.style.display = 'block';
  });

  tabHeader.appendChild(overviewBtn);
  tabHeader.appendChild(perfBtn);
  tabContent.appendChild(overviewTab);
  tabContent.appendChild(perfTab);
  statsLeft.appendChild(tabHeader);
  statsLeft.appendChild(tabContent);


  // === RIGHT: Trades Table ===
  const tradesRight = document.createElement('div');
  tradesRight.className = 'trades-right';

  const table = document.createElement('table');
  table.className = 'trades-table';

  // Define columns you want to display (in order)
  const columns = [
    'ID',
    'Type',
    'Entry Signal',
    'Exit Signal',
    'Entry Date',
    'Exit Date',
    'Entry Price',
    'Exit Price',
    'Contracts',
    'P&L',
    'Cumulative P&L',
    'Run-up',
    'Drawdown'
  ];

  // Table Head
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table Body
  const tbody = document.createElement('tbody');
  trades.forEach((trade, index) => {
    const row = document.createElement('tr');
    columns.forEach(col => {
      const cell = document.createElement('td');
      cell.textContent = trade[col] !== undefined ? trade[col] : '-';
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tradesRight.appendChild(table);


  wrapper.appendChild(statsLeft);
  wrapper.appendChild(tradesRight);
  statsSection.appendChild(wrapper);
}

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function parseTradeString(tradeStr) {
  // 👇 Example expected format: "Entry: 2023-01-01 @ 100, Exit: 2023-01-05 @ 120, PNL: 20"
  const match = tradeStr.match(/Entry: (.+?) @ ([\d.]+), Exit: (.+?) @ ([\d.]+), PNL: ([-\d.]+)/);
  return match ? {
    entry_date: match[1],
    entry_price: match[2],
    exit_date: match[3],
    exit_price: match[4],
    pnl: match[5]
  } : {
    entry_date: '-', entry_price: '-', exit_date: '-', exit_price: '-', pnl: '-'
  };
}


function renderGraphGroup(container, graphs, groupLabel) {
  if (graphs.length === 1) {
    createAndRenderGraph(container, graphs[0]);
    return;
  }

  const tabWrapper = document.createElement('div');
  tabWrapper.className = 'tab-wrapper';

  const tabHeader = document.createElement('div');
  tabHeader.className = 'tab-header';

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  const tabs = [];

  graphs.forEach((graph, index) => {
    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-button';
    tabBtn.textContent = `${groupLabel} ${index + 1}`;

    // Create panel container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'tab-panel';
    contentDiv.style.display = index === 0 ? 'block' : 'none';

    // Store tab metadata
    tabs.push({ tabBtn, contentDiv, graph, rendered: false });

    // First one gets rendered right away
    if (index === 0) {
      Plotly.newPlot(contentDiv, graph, {}, { responsive: true }).then(() => {
        setTimeout(() => {
          Plotly.Plots.resize(contentDiv);
        }, 50);
      });
      tabs[index].rendered = true;
    }


    tabBtn.addEventListener('click', () => {
      // Hide all panels
      tabs.forEach(tab => tab.contentDiv.style.display = 'none');
      // Show selected
      contentDiv.style.display = 'block';

      // Update button styles
      tabs.forEach(tab => tab.tabBtn.classList.remove('active'));
      tabBtn.classList.add('active');

      // Lazy render if not done yet
      if (!tabs[index].rendered) {
        Plotly.newPlot(contentDiv, graph, {}, { responsive: true });
        tabs[index].rendered = true;
      } else {
        // If already rendered, just resize
        setTimeout(() => {
          Plotly.Plots.resize(contentDiv);
        }, 50);
      }
    });

    tabHeader.appendChild(tabBtn);
    tabContent.appendChild(contentDiv);
  });

  tabWrapper.appendChild(tabHeader);
  tabWrapper.appendChild(tabContent);
  container.appendChild(tabWrapper);

  // Set first tab active
  tabs[0].tabBtn.classList.add('active');
}



function renderAllGraphs() {
  const darkMode = document.body.classList.contains('dark-mode');
  const container = document.getElementById('graph-container');
  container.innerHTML = '';

  // Always show the price graph
  createAndRenderGraph(container, cachedGraphs.price_graph[darkMode ? 'dark' : 'light'], 'Price Graph');

  const buy = cachedGraphs.buy_graphs[darkMode ? 'dark' : 'light'];
  const sell = cachedGraphs.sell_graphs[darkMode ? 'dark' : 'light'];

  const hasBuy = buy.length > 0;
  const hasSell = sell.length > 0;

  if (!hasBuy && !hasSell) return;

  const row = document.createElement('div');
  row.className = 'graph-row';

  if (hasBuy) {
    const buyCol = document.createElement('div');
    buyCol.className = hasSell ? 'graph-column' : 'graph-column full-width';
    renderGraphGroup(buyCol, buy, 'Buy');
    row.appendChild(buyCol);
  }

  if (hasSell) {
    const sellCol = document.createElement('div');
    sellCol.className = hasBuy ? 'graph-column' : 'graph-column full-width';
    renderGraphGroup(sellCol, sell, 'Sell');
    row.appendChild(sellCol);
  }

  container.appendChild(row);
}


function createAndRenderGraph(container, graphData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'graph-wrapper';

  const plotDiv = document.createElement('div');
  plotDiv.style.width = '100%';
  plotDiv.className = 'plotly-graph';
  wrapper.appendChild(plotDiv);
  container.appendChild(wrapper);

  // Initial render
  Plotly.newPlot(plotDiv, graphData, {}, { responsive: true }).then(() => {
    // Force resize once it's been added to the DOM
    setTimeout(() => {
      Plotly.Plots.resize(plotDiv);
    }, 50); // short delay gives DOM time to settle
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('prompt');

    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        submitPrompt();
      }
    });
  });


window.addEventListener('resize', () => {
  const graphs = document.querySelectorAll('.graph-wrapper > div');
  graphs.forEach(g => Plotly.Plots.resize(g));
});


function resetToInitialState() {
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
}
