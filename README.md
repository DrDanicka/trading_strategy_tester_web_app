# Trading Strategy Tester Web Application

This project provides an interactive web-based interface for testing and visualizing trading strategies using LLM-powered prompt processing. Users can input a natural language prompt describing a trading strategy, and the system will validate it, simulate trades, and display results through dynamic graphs and stats panels.

It uses [`Trading Strategy Tester`](https://github.com/DrDanicka/trading_strategy_tester) package for backend processing and `Llama 3.2` models for `Strategy` generation from natural language prompts.

## Features
- **Prompt Processing**: Submit trading strategies as natural language prompts; the backend parses and validates them using a large language model.
- **Interactive Graphs**: View **price**, **buy**, and **sell** graphs with light/dark mode support.
- **Trade Stats and Table**: See detailed trade breakdowns and performance metrics with tabbed views.
- **Dark Mode**: Toggle between light and dark themes; graphs and UI adapt automatically.
- **Clipboard Support**: Copy `Strategy` objects to the clipboard for easy reuse and modification.
- **Responsive**: All graphs resize dynamically on window resize or when adjusting panes.

## How to Write a Prompt

Detailed instructions on how to write prompts for the trading strategy tester can be found in the [Prompting Guide](https://drdanicka.github.io/trading_strategy_tester/llm/how_to_write_prompt/). This guide provides examples and best practices for creating effective prompts that yield accurate and useful results.

## Installation

For running the application locally, you need to have `Python 3.10` or higher installed and you have to install `Ollama` for the platform you are using. You can download `Ollama` [here](https://ollama.com/download).

Once you download and install `Ollama`, you can run the following commands:

1. Clone the repository:
   ```bash
   git clone https://github.com/DrDanicka/trading_strategy_tester_web_app
   ```
   
2. Navigate to the project directory:
   ```bash
    cd trading_strategy_tester_web_app
    ```
3. Initialize the `Ollama` models:
   ```bash
   python init_ollama.py
   ```
   This will download the weights for the `Llama 3.2` that are needed to create `Ollama` models. It's required to have at least `50GB` of free space on your disk. Right after the weights are downloaded, `Ollama` models are created and the weights are deleted. The models are stored in the `~/.ollama/models` directory. After all the models are created, you can continue with the next step.
4. Start the application with docker:
   ```bash
   docker-compose up --build
   ```
   Run this command in the root directory of the project (`trading_strategy_tester_web_app`). It will build the docker image and start the application. The application will be available at [`http://localhost:5001`](http://localhost:5001).

## Layout

You can learn more about the layout of the website and how to read it in the [Layout Guide](https://drdanicka.github.io/trading_strategy_tester_web_app/layout/). This guide provides an overview of the different components and how they interact with each other.
