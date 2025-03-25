import { getCachedGraphs } from "./cache.js";

export function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function renderTradesAndStats(trades, stats) {
  const statsSection = document.getElementById('stats-section');
  const tradesSection = document.getElementById('trades-section');

  tradesSection.innerHTML = '';
  statsSection.innerHTML = '';


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
  overviewTab.style.display = 'grid';
  overviewTab.style.gridTemplateColumns = '1fr 1fr';
  overviewTab.style.gridTemplateRows = '1fr 1fr 1fr';
  overviewTab.style.gap = '16px';
  overviewTab.style.flex = '1';
  overviewTab.style.alignItems = 'center';

  const perfTab = document.createElement('div');
  perfTab.className = 'stats-tab-panel';
  perfTab.style.display = 'none';
  perfTab.style.overflowY = 'auto';


  // === Populate Overview with stacked labels + large values ===
  function createMetricBlock(label, value, isPnl = false) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.height = '100%';

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    labelEl.style.fontSize = 'clamp(10px, 0.9vh + 0.3vw, 14px)';
    labelEl.style.color = '#777';
    labelEl.style.marginBottom = '4px';

    const valueEl = document.createElement('div');
    valueEl.textContent = value;
    valueEl.style.fontSize = 'clamp(18px, 2.5vh + 1vw, 60px)';
    valueEl.style.fontWeight = 'bold';
    valueEl.style.lineHeight = '1';
    valueEl.style.textAlign = 'center';
    if (isPnl) {
      const num = parseFloat(stats['P&L']);
      valueEl.style.color = num >= 0 ? 'green' : 'red';
    }

    wrapper.appendChild(labelEl);
    wrapper.appendChild(valueEl);
    return wrapper;
  }

  // Add P&L full-width on top
  overviewTab.appendChild(createMetricBlock('P&L', stats['P&L'], true));
  overviewTab.appendChild(createMetricBlock('P&L(%)', stats['P&L Percentage'], true));

  // 2nd row
  overviewTab.appendChild(createMetricBlock('Total Trades', stats['Total Trades']));
  overviewTab.appendChild(
  createMetricBlock(
    'Profitable Trades',
    `${stats['Number of Winning Trades']} / ${stats['Total Trades']}`
    )
  );

  // 3rd row
  overviewTab.appendChild(createMetricBlock('Max Drawdown', stats['Max Drawdown']));
  overviewTab.appendChild(createMetricBlock('Profit Factor', stats['Profit factor']));

  // === Populate Performance ===
  Object.keys(stats).forEach(key => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.padding = '6px 8px';
    row.style.borderBottom = '1px solid #555';
    row.style.fontSize = 'clamp(12px, 0.9vh + 0.4vw, 16px)';

    const label = document.createElement('span');
    label.textContent = formatLabel(key);
    label.style.color = '#555';

    const value = document.createElement('span');
    value.textContent = stats[key];
    value.style.fontWeight = 'bold';

    row.appendChild(label);
    row.appendChild(value);
    perfTab.appendChild(row);
  });

  // === Tab Switching ===
  overviewBtn.addEventListener('click', () => {
    overviewBtn.classList.add('active');
    perfBtn.classList.remove('active');
    overviewTab.style.display = 'grid';
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
  statsSection.appendChild(tabHeader);
  statsSection.appendChild(tabContent);

  // === RIGHT: Trades Table ===
  const table = document.createElement('table');
  table.className = 'trades-table';

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
    'Drawdown',
    'Current Capital'
  ];

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  trades.forEach((trade, index) => {
    const row = document.createElement('tr');
    columns.forEach(col => {
      const cell = document.createElement('td');
      const value = trade[col] !== undefined ? trade[col] : '-';

      // Check if there's a percentage alternative
      const percentageAlt = trade[`Percentage ${col}`] || trade[`${col} Percentage`];

      if (percentageAlt) {
        const main = document.createElement('div');
        main.textContent = value;

        const sub = document.createElement('div');
        sub.textContent = `(${percentageAlt})`;
        sub.style.fontSize = '0.75em';
        sub.style.color = '#888';
        sub.style.marginTop = '2px';

        if (document.body.classList.contains('dark-mode')) {
          sub.style.color = '#aaa';
        }

        if (col === 'P&L') {
          const numericValue = parseFloat(value.replace(/[^\d.-]/g, '')); // Remove $ sign etc.

          const color = numericValue > 0 ? 'green' :
                        numericValue < 0 ? 'red' :
                        ''; // Neutral or zero

          if (color) {
            main.style.color = color;
            sub.style.color = color;
          }
        }

        cell.appendChild(main);
        cell.appendChild(sub);
      } else {
        cell.textContent = value;
      }

      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tradesSection.appendChild(table);
}


export function renderGraphGroup(container, graphs, groupLabel) {
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
    const graphWrapper = document.createElement('div');
    graphWrapper.className = 'graph-wrapper';
    graphWrapper.style.display = index === 0 ? 'block' : 'none';

    // Store tab metadata
    tabs.push({ tabBtn, contentDiv: graphWrapper, graph, rendered: false });

    Plotly.newPlot(graphWrapper, graph, {}, { responsive: true })
    Plotly.Plots.resize(graphWrapper)

    tabBtn.addEventListener('click', () => {
      // Hide all panels
      tabs.forEach(tab => tab.contentDiv.style.display = 'none');
      // Show selected
      graphWrapper.style.display = 'block';

      // Update button styles
      tabs.forEach(tab => tab.tabBtn.classList.remove('active'));
      tabBtn.classList.add('active');

      Plotly.Plots.resize(graphWrapper);
    });

    tabHeader.appendChild(tabBtn);
    tabContent.appendChild(graphWrapper);
  });

  tabWrapper.appendChild(tabHeader);
  tabWrapper.appendChild(tabContent);
  container.appendChild(tabWrapper);

  // Set first tab active
  tabs[0].tabBtn.classList.add('active');
}


export function renderAllGraphs() {
  const darkMode = document.body.classList.contains('dark-mode');
  const container = document.getElementById('graph-container');
  container.innerHTML = '';

  const cachedGraphs = getCachedGraphs()

  // Always show the price graph
  const priceSection = document.createElement('div');
  priceSection.className = 'graph-row';

  createAndRenderGraph(priceSection, cachedGraphs.price_graph[darkMode ? 'dark' : 'light']);

  const buy = cachedGraphs.buy_graphs[darkMode ? 'dark' : 'light'];
  const sell = cachedGraphs.sell_graphs[darkMode ? 'dark' : 'light'];

  const hasBuy = buy.length > 0;
  const hasSell = sell.length > 0;

  if (!hasBuy && !hasSell) {
    // Render only price graph
    container.appendChild(priceSection);
    return;
  }

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

  container.appendChild(priceSection);
  container.appendChild(row);
}


export function createAndRenderGraph(container, graphData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'graph-wrapper';


  Plotly.newPlot(wrapper, graphData, {}, { responsive: true });
  Plotly.Plots.resize(wrapper);

  container.appendChild(wrapper);
}