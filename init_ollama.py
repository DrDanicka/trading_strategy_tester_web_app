import os
import subprocess
import sys

FILES = {
    "llama3-2-1B_tst_ft-end_date.gguf": "https://drive.google.com/file/d/1Eo96z_nHFNYoafyLslPVOK8GC_hxKKAE/view?usp=share_link",
    "lama3-2-1B_tst_ft-initial_capital.gguf": "https://drive.google.com/file/d/1E0jGYnm8gJOgitrgIJxTtGlTZpeslx75/view?usp=sharing",
    "llama3-2-1B_tst_ft-interval.gguf": "https://drive.google.com/file/d/1Nn58Xo95_F1lBq7HHhyMtG_XVeFp9lr7/view?usp=sharing",
    "llama3-2-1B_tst_ft-order_size.gguf": "https://drive.google.com/file/d/1m9CW3jkJgt0ps4dVeCqlplExWrU07qrN/view?usp=sharing",
    "llama3-2-1B_tst_ft-period.gguf": "https://drive.google.com/file/d/1m9CW3jkJgt0ps4dVeCqlplExWrU07qrN/view?usp=sharing",
    "llama3-2-1B_tst_ft-position_type.gguf": "https://drive.google.com/file/d/1hNnOfObBY4HHv-Z8_exhJD1gLQcdVMqn/view?usp=sharing",
    "llama3-2-1B_tst_ft-start_date.gguf": "https://drive.google.com/file/d/1f4Xsuk4wzT_B1gGushpROqhZe2ltAjpN/view?usp=sharing",
    "llama3-2-1B_tst_ft-stop_loss.gguf": "https://drive.google.com/file/d/1FeM6ng-xr4tQXoD4mWpLlf97nPK5LeCl/view?usp=sharing",
    "llama3-2-1B_tst_ft-take_profit.gguf": "https://drive.google.com/file/d/1shxvVamvqLcwF_oswSwzJHIszJdkRRk7/view?usp=sharing",
    "llama3-2-1B_tst_ft-ticker.gguf": "https://drive.google.com/file/d/1-hSN_TSizdtzTYSL90XPDhzW8-hz4ISK/view?usp=sharing",
    "lama3-2-1B_tst_ft-trade_commissions.gguf": "https://drive.google.com/file/d/1UNP-w2Cxe_VsV15wgVqKdEfie6Bl87vf/view?usp=sharing",
    "llama3-2-3B_tst_ft-all.gguf": "https://drive.google.com/file/d/1O3cy35Fz193gyZ9eBccA71f7aVfASNI2/view?usp=sharing",
    "llama3-2-3B_tst_ft-conditions.gguf": "https://drive.google.com/file/d/1fwc8Svx7psEJm3ZWEhQOKrAj2a9xVaQF/view?usp=sharing"
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

def download_file(file_link, dest_file):
    print(f"\nDownloading {dest_file}...")
    subprocess.run(["gdown", "--fuzzy", file_link, "-O", dest_file], check=True)

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

def main():
    print("Checking for gdown...")
    ensure_gdown()

    print("Checking and downloading model files...")

    for filename, file_link in FILES.items():
        dest_file = os.path.join(DEST_DIR, filename)
        if os.path.isfile(dest_file):
            print(f"{filename} already exists, skipping download.")
        else:
            download_file(file_link, dest_file)

        # Create Ollama model after download (or if file already exists)
        create_ollama_model(filename)

    print("\nAll models are ready.")

if __name__ == "__main__":
    main()
