from flask import Flask, render_template, request, jsonify
from trading_strategy_tester.llm_communication.prompt_processor import process_prompt
from trading_strategy_tester.enums.llm_model_enum import LLMModel, llm_model_dict
from trading_strategy_tester.trade.trade import Trade
import plotly
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

def get_light_dark_graphs(graphs):
    light_graphs = []
    dark_graphs = []

    for graph in graphs:
        light_graphs.append(json.loads(plotly.io.to_json(graph.get_plot(dark=False))))
        dark_graphs.append(json.loads(plotly.io.to_json(graph.get_plot(dark=True))))

    return light_graphs, dark_graphs

@app.route('/process_prompt', methods=["POST"])
def get_results():
    user_input = request.json.get("prompt")
    llm_choice = request.json.get("llm_choice")
    llm_model: LLMModel = llm_model_dict[llm_choice]

    trades, graphs, stats = process_prompt(user_input, llm_model)

    price_graph_light = json.loads(plotly.io.to_json(graphs['PRICE'].get_plot(dark=False)))
    price_graph_dark = json.loads(plotly.io.to_json(graphs['PRICE'].get_plot(dark=True)))

    buy_graphs : list = graphs['BUY']
    sell_graphs : list = graphs['SELL']

    buy_graphs_light, buy_graphs_dark = get_light_dark_graphs(buy_graphs)
    sell_graphs_light, sell_graphs_dark = get_light_dark_graphs(sell_graphs)

    trades_list = [trade.get_summary() for trade in trades]

    return jsonify({
        "trades": trades_list,
        "price_graph_light": price_graph_light,
        "price_graph_dark": price_graph_dark,
        "buy_graphs_light": buy_graphs_light,
        "buy_graphs_dark": buy_graphs_dark,
        "sell_graphs_light": sell_graphs_light,
        "sell_graphs_dark": sell_graphs_dark,
        "stats": stats
    })

if __name__ == '__main__':
    app.run(debug=True)
