import os
import subprocess
import sys

# List of model weight filenames to download and register with Ollama
FILES = [
    "llama3-2-1B_tst_ft-end_date.gguf",
    "llama3-2-1B_tst_ft-initial_capital.gguf",
    "llama3-2-1B_tst_ft-interval.gguf",
    "llama3-2-1B_tst_ft-order_size.gguf",
    "llama3-2-1B_tst_ft-period.gguf",
    "llama3-2-1B_tst_ft-position_type.gguf",
    "llama3-2-1B_tst_ft-start_date.gguf",
    "llama3-2-1B_tst_ft-stop_loss.gguf",
    "llama3-2-1B_tst_ft-take_profit.gguf",
    "llama3-2-1B_tst_ft-ticker.gguf",
    "llama3-2-1B_tst_ft-trade_commissions.gguf",
    "llama3-2-3B_tst_ft-all.gguf",
    "llama3-2-3B_tst_ft-conditions.gguf"
]

script_dir = os.path.dirname(os.path.realpath(__file__))
DEST_DIR = os.path.join(script_dir, '_gguf_weights')
MODELFILE_DIR = os.path.join(script_dir, 'modelfiles')

# Ensure the target directories exist
os.makedirs(DEST_DIR, exist_ok=True)
os.makedirs(MODELFILE_DIR, exist_ok=True)

def download_file(download_link, dest_file):
    """
    Download a file from a given URL using curl.

    Args:
        download_link (str): The URL to download from.
        dest_file (str): Local file path to save the downloaded file.
    """
    print(f"\nDownloading {dest_file}...", flush=True)
    try:
        subprocess.run(["curl", "-L", "-o", dest_file, download_link], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Failed to download {dest_file}. Please check your connection or the URL.", flush=True)
        sys.exit(1)

def model_exists(model_name):
    """
    Check if a model is already registered with Ollama.

    Args:
        model_name (str): Name of the Ollama model to check.

    Returns:
        bool: True if the model exists, False otherwise.
    """
    try:
        result = subprocess.run(["ollama", "list"], check=True, capture_output=True, text=True)
        existing_models = result.stdout.lower()
        return model_name.lower() in existing_models
    except subprocess.CalledProcessError as e:
        print("Error checking Ollama models.", flush=True)
        print(e, flush=True)
        sys.exit(1)

def create_ollama_model(gguf_filename):
    """
    Create an Ollama model from a downloaded GGUF file.

    Args:
        gguf_filename (str): The filename of the GGUF model weights.
    """
    model_name = gguf_filename.split(".")[0]
    model_path = os.path.join(DEST_DIR, gguf_filename)

    modelfile_template = os.path.join(MODELFILE_DIR, "Modelfile_llama3")

    # Read the Modelfile template and prepend the FROM line with the model path
    with open(modelfile_template, 'r') as f:
        modelfile_content = f.read()
    modelfile_content = f"FROM {model_path}\n" + modelfile_content

    # Write the full Modelfile to use with the Ollama create command
    final_modelfile = os.path.join(MODELFILE_DIR, 'Modelfile')
    with open(final_modelfile, 'w') as f:
        f.write(modelfile_content)

    print(f"Creating Ollama model '{model_name}'...", flush=True)
    subprocess.run(["ollama", "create", model_name, "-f", final_modelfile], check=True)
    print(f"Ollama model '{model_name}' created.", flush=True)

    # Clean up: delete the GGUF file after successful creation
    try:
        os.remove(model_path)
        print(f"Deleted {gguf_filename} after creating the model.", flush=True)
    except OSError as e:
        print(f"Could not delete {gguf_filename}: {e}", flush=True)

def main():
    """
    Main routine to ensure all models are downloaded and created in Ollama.
    Skips models that are already present.
    """
    print("Checking and downloading model files...", flush=True)

    for filename in FILES:
        model_name = filename.split(".")[0]
        download_link = f"https://huggingface.co/drdanicka/trading-strategy-tester-weights/resolve/main/{filename}"

        if model_exists(model_name):
            print(f"Ollama model '{model_name}' already exists, skipping.", flush=True)
        else:
            print(f"Ollama model '{model_name}' not found. Proceeding to download + create...", flush=True)
            dest_file = os.path.join(DEST_DIR, filename)
            download_file(download_link, dest_file)
            create_ollama_model(filename)

    print("\nAll models are ready.", flush=True)

if __name__ == "__main__":
    main()
