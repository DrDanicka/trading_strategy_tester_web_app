let cachedGraphs = {
  price_graph: { light: null, dark: null },
  buy_graphs: { light: [], dark: [] },
  sell_graphs: { light: [], dark: [] },
};

export function setCachedGraphs(data) {
  cachedGraphs.price_graph.light = data.price_graph_light;
  cachedGraphs.price_graph.dark = data.price_graph_dark;

  cachedGraphs.buy_graphs.light = data.buy_graphs_light;
  cachedGraphs.buy_graphs.dark = data.buy_graphs_dark;

  cachedGraphs.sell_graphs.light = data.sell_graphs_light;
  cachedGraphs.sell_graphs.dark = data.sell_graphs_dark;
}

export function getCachedGraphs() {
  return cachedGraphs;
}
