"""
I use this module as a thin launcher around the external `scripts/anime_stylize_v2.py`.
My job here is to:
  1) Save the incoming PIL image to a temp/runtime folder,
  2) Decide which ControlNet detector the anime script should use (based on `subject` and `control`),
  3) Build a safe subprocess command (Python exe + script + flags),
  4) Run it and return the resulting PIL image.

Inputs/Outputs (in my own words):
- Input: a PIL.Image plus knobs like steps/guidance/strength/max_side, and a few extras.
- Output: a new PIL.Image (RGB) produced by the external anime stylizer.
- Assumptions: the `anime_stylize_v2.py` script is present in `scripts/` and understands the flags I pass.

Why I keep this wrapper tiny:
- I want the heavy ML code to live in the script; this file stays small, testable, and easy to replace.
- All file IO happens in `runtime/` with unique names so parallel requests won't collide.
"""

from __future__ import annotations
import os, sys, uuid, subprocess
from typing import Optional, List, Dict, Any
from PIL import Image

# I compute a few important paths once so every call can reuse them.
HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(os.path.dirname(HERE))
SCRIPTS_DIR = os.path.join(ROOT, "scripts")
RUNTIME_DIR = os.path.join(ROOT, "runtime")
os.makedirs(RUNTIME_DIR, exist_ok=True)  # I ensure the runtime folder exists for temp PNGs.

# I keep the external script and a short prefix here so they’re easy to tweak in one place.
SCRIPT = os.path.join(SCRIPTS_DIR, "anime_stylize_v2.py")
prefix = "anime"

# These are the control detector names I allow the caller to request explicitly.
ANIME_ACCEPTS = {"auto", "lineart_anime", "softedge", "canny", "none"}


def _save_png(img: Image.Image, path: str) -> None:
    """
    I always write inputs as PNG to avoid JPEG artifacts and keep things deterministic.
    I also use a modest compression level so writing is fast but files aren’t huge.
    """
    img.save(path, format="PNG", compress_level=4)


def _resolve_control_for_anime(control: str, subject: str) -> str:
    """
    I map the user-friendly `control` + `subject` to the detector name the anime script expects.

    Mental model:
    - If the caller says "hed" or "depth", I translate them to the script’s actual detectors.
    - If they say "auto", I pick based on subject:
        - portraits → lineart_anime (keeps clean line edges for faces)
        - scenes    → softedge (depth/edge blend works nicer for busy scenes)
    - If they pass anything unknown, I fall back to "auto" so they still get a sensible result.
    """
    c = (control or "auto").lower()
    if c == "hed":
        return "lineart_anime"
    if c == "depth":
        return "softedge"
    if c not in ANIME_ACCEPTS:
        c = "auto"
    if c == "auto":
        return "lineart_anime" if subject == "portrait" else "softedge"
    return c


def stylize(
    image: Image.Image,
    subject: str,           # I only use this to choose detectors ("portrait" vs "scene").
    steps: int,
    guidance: float,
    strength: float,
    max_side: int,
    control: str,
    seed: Optional[int] = None,
    style_refs: Optional[List[Image.Image]] = None,  # Not used by the anime script; I keep it for API compatibility.
    extras: Optional[Dict[str, Any]] = None,
) -> Image.Image:
    """
    I’m the main entry point:
    - I create unique file names so multiple requests don’t clash.
    - I translate friendly parameters into the CLI flags for `anime_stylize_v2.py`.
    - I run the subprocess and turn its output back into a PIL.Image.

    Errors:
    - If the subprocess fails, I raise RuntimeError with the end of stdout/stderr to help me debug.
    - If the script doesn’t write the expected output file, I raise a clear error.
    """
    # I generate short unique ids so temp file names are predictable but non-colliding.
    tid = uuid.uuid4().hex[:8]
    in_path  = os.path.join(RUNTIME_DIR, f"{prefix}_in_{tid}.png")
    out_path = os.path.join(RUNTIME_DIR, f"{prefix}_out_{tid}.png")
    _save_png(image, in_path)

    # I decide the actual detector the script should use.
    ctrl = _resolve_control_for_anime(control, subject)

    # I build the command as a list (not a single string) to avoid shell quoting issues.
    args = [
        sys.executable, SCRIPT,
        "--input", in_path, "--output", out_path,
        "--control", ctrl,
        "--steps", str(steps),
        "--guidance", str(guidance),
        "--strength", str(strength),
        "--max-side", str(max_side),
    ]
    if seed is not None:
        args += ["--seed", str(seed)]

    # I pass a few optional extras through to the script if present.
    e = extras or {}
    if e.get("controlScale") is not None:
        args += ["--control-scale", str(float(e["controlScale"]))]
    if e.get("model") in ("primary", "trinart", "sd15"):
        args += ["--model", e["model"]]
    if e.get("fastDetector"):
        args += ["--fast-detector"]

    # I print the final args in a debug-friendly way so I can copy-paste the exact command locally.
    import shlex
    print("DEBUG ARGS[anime]:", " ".join(shlex.quote(a) for a in args))

    # I enforce UTF-8 so the child process won’t choke on paths or logs with non-ASCII chars.
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    env.setdefault("PYTHONUTF8", "1")

    try:
        # I capture both stdout and stderr; `check=True` lets me surface non-zero exits as exceptions.
        subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, text=True, env=env)
    except subprocess.CalledProcessError as ecp:
        # I keep only the tail of the combined logs to avoid giant error blobs, but enough to diagnose.
        tail = ((ecp.stderr or "") + "\n" + (ecp.stdout or ""))[-4000:]
        raise RuntimeError(f"anime script failed.\n{tail}") from ecp

    # I expect the external script to write the out file; if not, I report it explicitly.
    if not os.path.isfile(out_path):
        raise RuntimeError("anime script did not produce an output image.")

    # I normalize to RGB so downstream code doesn’t have to handle palette/alpha edge cases.
    return Image.open(out_path).convert("RGB")


def preload() -> dict:
    """
    I expose a lightweight preload hook to fit the app’s ‘preload’ contract.
    For anime, there’s nothing heavy to warm up here, so I just return a success flag.
    """
    return {"ok": True, "message": "anime preload noop"}


# I export `run` as an alias so other parts of the app can call this module uniformly.
run = stylize
