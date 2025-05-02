// Cache to store the latest graphs (light and dark themes) for reuse without re-fetching
let cachedGraphs = {
  price_graph: { light: null, dark: null },
  buy_graphs: { light: [], dark: [] },
  sell_graphs: { light: [], dark: [] },
};

/**
 * Update the cached graphs with new data from the backend response.
 *
 * @param {Object} data - Contains light and dark graph data for price, buy, and sell graphs.
 */
export function setCachedGraphs(data) {
  cachedGraphs.price_graph.light = data.price_graph_light;
  cachedGraphs.price_graph.dark = data.price_graph_dark;

  cachedGraphs.buy_graphs.light = data.buy_graphs_light;
  cachedGraphs.buy_graphs.dark = data.buy_graphs_dark;

  cachedGraphs.sell_graphs.light = data.sell_graphs_light;
  cachedGraphs.sell_graphs.dark = data.sell_graphs_dark;
}

/**
 * Retrieve the current cached graphs object.
 *
 * @returns {Object} The cachedGraphs object.
 */
export function getCachedGraphs() {
  return cachedGraphs;
}
