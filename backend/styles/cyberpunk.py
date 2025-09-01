# -*- coding: utf-8 -*-
# I use this as a tiny wrapper that saves the input image, chooses a control mode,
# calls the external cyberpunk script, and then loads the result back as a PIL image.

from __future__ import annotations
import os, sys, uuid, subprocess
from typing import Optional, List, Dict, Any
from PIL import Image

# I set up paths once so every call can reuse them.
HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(os.path.dirname(HERE))
SCRIPTS_DIR = os.path.join(ROOT, "scripts")
RUNTIME_DIR = os.path.join(ROOT, "runtime")
os.makedirs(RUNTIME_DIR, exist_ok=True)

SCRIPT = os.path.join(SCRIPTS_DIR, "cyberpunk_stylize_v3.py")
prefix = "cyberpunk"

# I keep a small whitelist of accepted control flags.
CYBER_ACCEPTS = {"auto", "hed", "depth", "canny", "none"}

def _save_png(img: Image.Image, path: str) -> None:
    # I save as PNG with light compression so it’s fast and lossless.
    img.save(path, format="PNG", compress_level=4)

def _resolve_control_for_cyberpunk(control: str, subject: str) -> str:
    # I normalize control names and pick a sensible default per subject.
    c = (control or "auto").lower()
    if c in ("softedge", "lineart_anime"):  # I map other detectors to what this script expects.
        return "hed"
    if c not in CYBER_ACCEPTS:
        c = "auto"
    if c == "auto":
        return "hed" if subject == "portrait" else "depth"
    return c

def stylize(
    image: Image.Image,
    subject: str,
    steps: int,
    guidance: float,
    strength: float,
    max_side: int,
    control: str,
    seed: Optional[int] = None,
    style_refs: Optional[List[Image.Image]] = None,
    extras: Optional[Dict[str, Any]] = None,
) -> Image.Image:
    # I create unique temp names so parallel runs don’t clash.
    tid = uuid.uuid4().hex[:8]
    in_path  = os.path.join(RUNTIME_DIR, f"{prefix}_in_{tid}.png")
    out_path = os.path.join(RUNTIME_DIR, f"{prefix}_out_{tid}.png")
    _save_png(image, in_path)

    # I optionally pass style reference images to the script.
    style_arg = None
    if style_refs:
        ref_paths = []
        for i, ref in enumerate(style_refs):
            rp = os.path.join(RUNTIME_DIR, f"{prefix}_ref_{tid}_{i+1}.png")
            _save_png(ref, rp)
            ref_paths.append(rp)
        if ref_paths:
            style_arg = ",".join(ref_paths)

    ctrl = _resolve_control_for_cyberpunk(control, subject)

    # I build the CLI as a list to avoid quoting issues.
    args = [
        sys.executable, SCRIPT,
        "-i", in_path, "-o", out_path,
        "--subject", subject,
        "--control", ctrl,
        "--steps", str(steps),
        "--guidance", str(guidance),
        "--strength", str(strength),
        "--max-side", str(max_side),
    ]
    if seed is not None:
        args += ["--seed", str(seed)]
    if style_arg:
        args += ["--style-image", style_arg]

    # I forward optional extras only when they exist.
    e = extras or {}
    if e.get("controlScale")  is not None: args += ["--control-scale",  str(e["controlScale"])]
    if e.get("styleStrength") is not None: args += ["--style-strength", str(e["styleStrength"])]

    # I only pass schedulers I know the script supports.
    sched = e.get("scheduler")
    if sched in ("unipc", "dpmpp"):
        args += ["--scheduler", sched]

    # I print the final command so I can copy/paste it when debugging.
    import shlex
    print("DEBUG ARGS[cyberpunk]:", " ".join(shlex.quote(a) for a in args))

    # I enforce UTF-8 so logs and paths behave on all platforms.
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    env.setdefault("PYTHONUTF8", "1")

    try:
        subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, text=True, env=env)
    except subprocess.CalledProcessError as ecp:
        # I only keep the tail of logs to make errors readable.
        tail = ((ecp.stderr or "") + "\n" + (ecp.stdout or ""))[-4000:]
        raise RuntimeError(f"cyberpunk script failed.\n{tail}") from ecp

    # I fail fast if the expected output image is missing.
    if not os.path.isfile(out_path):
        raise RuntimeError("cyberpunk script did not produce an output image.")
    return Image.open(out_path).convert("RGB")

def preload() -> dict:
    # I keep a simple preload hook for symmetry with other modules.
    return {"ok": True, "message": "preload noop"}

# I expose a uniform entry point used elsewhere in the app.
run = stylize
