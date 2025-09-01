# dev/download_all.py
# Simple, robust: just snapshot each repo (no listing).
# Uses your hardcoded token and resumes partial downloads.

from huggingface_hub import snapshot_download
from huggingface_hub.utils import HfHubHTTPError
import os

TOKEN = "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"

REPOS = [
    "runwayml/stable-diffusion-v1-5",
    "lllyasviel/sd-controlnet-hed",
    "lllyasviel/sd-controlnet-depth",
    "lllyasviel/sd-controlnet-canny",
    "lllyasviel/Annotators",
]

def main():
    # Keep cache inside the project (optional; comment out to use OS default)
    hf_home = os.path.join(os.getcwd(), "hf_cache")
    os.makedirs(hf_home, exist_ok=True)
    os.environ["HF_HOME"] = hf_home
    os.environ["TRANSFORMERS_CACHE"] = hf_home
    os.environ["DIFFUSERS_CACHE"] = hf_home
    os.environ.setdefault("HF_HUB_ENABLE_HF_TRANSFER", "1")

    print("Using HF cache at:", hf_home)
    print("Downloading all required models (first time can take 6–8 GB)…\n")

    for rid in REPOS:
        print(f"→ {rid}")
        try:
            snapshot_download(
                repo_id=rid,
                token=TOKEN,
                resume_download=True,   # resume if interrupted
                local_files_only=False, # actually download if missing
            )
            print(f"  ✓ Done {rid}\n")
        except HfHubHTTPError as e:
            print(f"  ✗ Failed {rid}: {e}\n")

    print("✅ Finished. Run again if any item failed — it resumes and only fetches what’s missing.")

if __name__ == "__main__":
    main()
