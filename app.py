from flask import Flask, render_template, request
from trading_strategy_tester.strategy.strategy import Strategy

app = Flask(__name__)


@app.route('/', methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        # Get the user's input from the form
        user_input = request.form.get("prompt")

        # Process the input using your library
        strategy_instance = Strategy()
        # Assuming your Strategy class has a method like process_prompt
        result = strategy_instance.process_prompt(user_input)

    return render_template("index.html", result=result)



if __name__ == '__main__':
    app.run()
