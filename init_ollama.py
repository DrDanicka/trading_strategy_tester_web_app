import os
import subprocess
import sys

FILES = {
    "llama3-2-1B_tst_ft-end_date.gguf": "1Eo96z_nHFNYoafyLslPVOK8GC_hxKKAE",
    "llama3-2-1B_tst_ft-initial_capital.gguf": "1E0jGYnm8gJOgitrgIJxTtGlTZpeslx75",
    "llama3-2-1B_tst_ft-interval.gguf": "1Nn58Xo95_F1lBq7HHhyMtG_XVeFp9lr7",
    "llama3-2-1B_tst_ft-order_size.gguf": "1m9CW3jkJgt0ps4dVeCqlplExWrU07qrN",
    "llama3-2-1B_tst_ft-period.gguf": "1m9CW3jkJgt0ps4dVeCqlplExWrU07qrN",
    "llama3-2-1B_tst_ft-position_type.gguf": "1hNnOfObBY4HHv-Z8_exhJD1gLQcdVMqn",
    "llama3-2-1B_tst_ft-start_date.gguf": "1f4Xsuk4wzT_B1gGushpROqhZe2ltAjpN",
    "llama3-2-1B_tst_ft-stop_loss.gguf": "1FeM6ng-xr4tQXoD4mWpLlf97nPK5LeCl",
    "llama3-2-1B_tst_ft-take_profit.gguf": "1shxvVamvqLcwF_oswSwzJHIszJdkRRk7",
    "llama3-2-1B_tst_ft-ticker.gguf": "1-hSN_TSizdtzTYSL90XPDhzW8-hz4ISK",
    "llama3-2-1B_tst_ft-trade_commissions.gguf": "1UNP-w2Cxe_VsV15wgVqKdEfie6Bl87vf",
    "llama3-2-3B_tst_ft-all.gguf": "1O3cy35Fz193gyZ9eBccA71f7aVfASNI2",
    "llama3-2-3B_tst_ft-conditions.gguf": "1fwc8Svx7psEJm3ZWEhQOKrAj2a9xVaQF"
}

script_dir = os.path.dirname(os.path.realpath(__file__))
DEST_DIR = os.path.join(script_dir, '_gguf_weights')
MODELFILE_DIR = os.path.join(script_dir, 'modelfiles')

os.makedirs(DEST_DIR, exist_ok=True)
os.makedirs(MODELFILE_DIR, exist_ok=True)

def ensure_gdown():
    try:
        import gdown
        print("'gdown' is already installed.")
    except ImportError:
        print("'gdown' is not installed. Installing now...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
        print("'gdown' has been installed successfully.")

def download_file(file_id, dest_file):
    print(f"\nDownloading {dest_file}...")
    subprocess.run(["gdown", "--id", file_id, "-O", dest_file], check=True)

def model_exists(model_name):
    try:
        result = subprocess.run(["ollama", "list"], check=True, capture_output=True, text=True)
        existing_models = result.stdout.lower()
        return model_name.lower() in existing_models
    except subprocess.CalledProcessError as e:
        print("Error checking Ollama models.")
        print(e)
        sys.exit(1)

def create_ollama_model(gguf_filename):
    model_name = gguf_filename.split(".")[0]
    model_path = os.path.join(DEST_DIR, gguf_filename)

    modelfile_template = os.path.join(MODELFILE_DIR, "Modelfile_llama3")

    # Read template and prepend FROM line
    with open(modelfile_template, 'r') as f:
        modelfile_content = f.read()
    modelfile_content = f"FROM {model_path}\n" + modelfile_content

    # Write to modelfiles/Modelfile
    final_modelfile = os.path.join(MODELFILE_DIR, 'Modelfile')
    with open(final_modelfile, 'w') as f:
        f.write(modelfile_content)

    # Run Ollama create
    print(f"Creating Ollama model '{model_name}'...")
    subprocess.run(["ollama", "create", model_name, "-f", final_modelfile], check=True)
    print(f"Ollama model '{model_name}' created.")

    # Delete the .gguf file
    try:
        os.remove(model_path)
        print(f"Deleted {gguf_filename} after creating the model.")
    except OSError as e:
        print(f"Could not delete {gguf_filename}: {e}")

def main():
    print("Checking for gdown...")
    ensure_gdown()

    print("Checking and downloading model files...")

    for filename, file_id in FILES.items():
        model_name = filename.split(".")[0]

        if model_exists(model_name):
            print(f"Ollama model '{model_name}' already exists, skipping.")
        else:
            print(f"Ollama model '{model_name}' not found. Proceeding to download + create...")
            dest_file = os.path.join(DEST_DIR, filename)
            download_file(file_id, dest_file)
            create_ollama_model(filename)

    print("\nAll models are ready.")

if __name__ == "__main__":
    main()
