# -*- coding: utf-8 -*-
# I use this thin wrapper to save the input, call the Noir script, and load the result.

from __future__ import annotations
import os, sys, uuid, subprocess
from typing import Optional, List, Dict, Any
from PIL import Image

# I set up common paths once.
HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(os.path.dirname(HERE))
SCRIPTS_DIR = os.path.join(ROOT, "scripts")
RUNTIME_DIR = os.path.join(ROOT, "runtime")
os.makedirs(RUNTIME_DIR, exist_ok=True)

SCRIPT = os.path.join(SCRIPTS_DIR, "noir_stylize.py")
prefix = "noir"

# I only accept these control modes.
NOIR_ACCEPTS = {"auto", "hed", "depth", "canny", "none"}

def _save_png(img: Image.Image, path: str) -> None:
    # I save as PNG with light compression for speed + lossless quality.
    img.save(path, format="PNG", compress_level=4)

def _resolve_control_for_noir(control: str, subject: str) -> str:
    # I normalize UI control names to Noir CLI; for "auto" I pick per subject.
    c = (control or "auto").lower()
    if c in ("softedge", "lineart_anime"):
        return "hed"
    if c not in NOIR_ACCEPTS:
        c = "auto"
    if c == "auto":
        return "none" if subject == "portrait" else "canny"
    return c

def stylize(
    image: Image.Image,
    subject: str,                # "portrait" | "scene"
    steps: int,
    guidance: float,
    strength: float,
    max_side: int,
    control: str,
    seed: Optional[int] = None,
    style_refs: Optional[List[Image.Image]] = None,   # unused here (kept for API shape)
    extras: Optional[Dict[str, Any]] = None,
) -> str:  # TODO: I actually return a PIL.Image; keeping the annotation as-is to avoid refactors.
    # I use unique names so parallel runs don't clash.
    tid = uuid.uuid4().hex[:8]
    in_path  = os.path.join(RUNTIME_DIR, f"{prefix}_in_{tid}.png")
    out_path = os.path.join(RUNTIME_DIR, f"{prefix}_out_{tid}.png")
    _save_png(image, in_path)

    ctrl = _resolve_control_for_noir(control, subject)

    # I build the CLI call (Noir supports --control).
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

    # I pass optional tweaks only when present.
    e = extras or {}
    if e.get("controlScale") is not None: args += ["--control-scale", str(e["controlScale"])]
    if e.get("filmGrain")    is not None: args += ["--film-grain",    str(e["filmGrain"])]
    if e.get("vignette")     is not None: args += ["--vignette",      str(e["vignette"])]
    if e.get("glow")         is not None: args += ["--glow",          str(e["glow"])]

    # I only forward a scheduler I know about.
    sched = e.get("scheduler")
    if sched in ("unipc", "dpmpp"):
        args += ["--scheduler", sched]

    # I print the exact command for easy debugging.
    import shlex
    print("DEBUG ARGS[noir]:", " ".join(shlex.quote(a) for a in args))

    # I force UTF-8 so logs/paths behave.
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    env.setdefault("PYTHONUTF8", "1")

    try:
        subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, text=True, env=env)
    except subprocess.CalledProcessError as ecp:
        tail = ((ecp.stderr or "") + "\n" + (ecp.stdout or ""))[-4000:]
        raise RuntimeError(f"noir script failed.\n{tail}") from ecp

    # I expect an output image here; if missing, I fail fast.
    if not os.path.isfile(out_path):
        raise RuntimeError("noir script did not produce an output image.")
    return Image.open(out_path).convert("RGB")

def preload() -> dict:
    # I keep a tiny preload hook for symmetry.
    return {"ok": True, "message": "preload noop"}

# I expose a consistent entry point.
run = stylize
