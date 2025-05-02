from flask import Flask, render_template, request, jsonify
from trading_strategy_tester.llm_communication.prompt_processor import process_prompt
from trading_strategy_tester.enums.llm_model_enum import LLMModel, llm_model_dict
import plotly
import json

app = Flask(__name__)

@app.route('/')
def index():
    """Render the main index page."""
    return render_template("index.html")

def get_light_dark_graphs(graphs):
    """
    Generate light and dark versions of a list of Plotly graphs.

    Args:
        graphs (list): List of graph objects with a get_plot(dark: bool) method.

    Returns:
        tuple: Two lists containing JSON-serializable graph data for light and dark themes.
    """
    light_graphs = []
    dark_graphs = []

    for graph in graphs:
        light_graphs.append(json.loads(plotly.io.to_json(graph.get_plot(dark=False))))
        dark_graphs.append(json.loads(plotly.io.to_json(graph.get_plot(dark=True))))

    return light_graphs, dark_graphs

@app.route('/process_prompt', methods=["POST"])
def get_results():
    """
    Process the user prompt via LLM, generate trade results and graphs,
    and return structured JSON for front-end consumption.
    """
    user_input = request.json.get("prompt")
    llm_choice = request.json.get("llm_choice")
    llm_model: LLMModel = llm_model_dict[llm_choice]

    try:
        # Main LLM processing: returns trades, graphs, stats, result string, and change log
        trades, graphs, stats, result_string, changes = process_prompt(user_input, llm_model)
    except ValueError as e:
        # Handle validation errors (e.g., bad ticker or date format)
        changes = {'': str(e)}
        trades = None
        result_string = None

    if trades is None:
        # Validation failed: send back error details
        change_values = list(changes.values())
        return jsonify({
            "validation_failed": True,
            "message": "Validation of the object failed.",
            "result_string": result_string,
            "changes": change_values
        })

    # Prepare JSON-serializable graphs for both light and dark themes
    price_graph_light = json.loads(plotly.io.to_json(graphs['PRICE'].get_plot(dark=False)))
    price_graph_dark = json.loads(plotly.io.to_json(graphs['PRICE'].get_plot(dark=True)))

    buy_graphs: list = graphs['BUY']
    sell_graphs: list = graphs['SELL']

    buy_graphs_light, buy_graphs_dark = get_light_dark_graphs(buy_graphs)
    sell_graphs_light, sell_graphs_dark = get_light_dark_graphs(sell_graphs)

    # Summarize trades into dictionaries with units for display
    trades_list = [trade.get_summary_with_units() for trade in trades]

    return jsonify({
        "validation_failed": False,
        "trades": trades_list,
        "price_graph_light": price_graph_light,
        "price_graph_dark": price_graph_dark,
        "buy_graphs_light": buy_graphs_light,
        "buy_graphs_dark": buy_graphs_dark,
        "sell_graphs_light": sell_graphs_light,
        "sell_graphs_dark": sell_graphs_dark,
        "stats": stats,
        "result_string": result_string,
        "changes": changes
    })

if __name__ == '__main__':
    # Run the Flask app in debug mode for development
    app.run(debug=True)
