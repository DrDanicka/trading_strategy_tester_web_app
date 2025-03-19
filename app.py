from flask import Flask, render_template, request, jsonify
from trading_strategy_tester.llm_communication.prompt_processor import process_prompt
from trading_strategy_tester.enums.llm_model_enum import LLMModel
from trading_strategy_tester.trade.trade import Trade
import plotly
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/process_prompt', methods=["POST"])
def get_results():
    user_input = request.json.get("prompt")
    trades, graphs, stats = process_prompt(user_input, LLMModel.LLAMA_1B)

    graph_json = []
    for _, plots in graphs.items():
        if isinstance(plots, list):
            for plot_obj in plots:
                fig = plot_obj.get_plot()
                graph_json.append(json.loads(plotly.io.to_json(fig)))
        else:
            fig = plots.get_plot()
            graph_json.append(json.loads(plotly.io.to_json(fig)))

    trades_str = [str(trade) for trade in trades]

    return jsonify({"trades": trades_str, "graphs": graph_json, "stats": stats})

if __name__ == '__main__':
    app.run(debug=True)
