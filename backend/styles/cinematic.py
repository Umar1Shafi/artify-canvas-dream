# -*- coding: utf-8 -*-
from __future__ import annotations
import os, sys, re, uuid, subprocess
from typing import Optional, List, Dict, Any
from PIL import Image

# I keep paths ready so I don't recompute them for every call.
HERE = os.path.dirname(__file__)
ROOT = os.path.dirname(os.path.dirname(HERE))
SCRIPTS_DIR = os.path.join(ROOT, "scripts")
RUNTIME_DIR = os.path.join(ROOT, "runtime")
os.makedirs(RUNTIME_DIR, exist_ok=True)

prefix = "cinematic"

def _save_png(img: Image.Image, path: str) -> None:
    # I write inputs as PNG for predictable quality and fast saving.
    img.save(path, format="PNG", compress_level=4)

def _find_script(basename: str) -> str:
    # I pick the newest versioned script (…_vN.py). If none, I fall back to basename.py.
    candidates: List[tuple[int, str]] = []
    if not os.path.isdir(SCRIPTS_DIR):
        raise FileNotFoundError(f"SCRIPTS_DIR missing: {SCRIPTS_DIR}")
    for fname in os.listdir(SCRIPTS_DIR):
        m = re.fullmatch(rf"{re.escape(basename)}_v(\d+)\.py", fname)
        if m:
            candidates.append((int(m.group(1)), fname))
        elif fname == f"{basename}.py":
            candidates.append((0, fname))
    if not candidates:
        raise FileNotFoundError(f"No script found matching {basename}[_vN].py in {SCRIPTS_DIR}")
    candidates.sort(reverse=True)
    return os.path.join(SCRIPTS_DIR, candidates[0][1])

SCRIPT = _find_script("cinematic_stylize")

def stylize(
    image: Image.Image,
    subject: str,           # I pass this straight through ('portrait' | 'scene').
    steps: int,
    guidance: float,
    strength: float,
    max_side: int,
    control: str,           # I ignore this here because v5 doesn’t use a control flag.
    seed: Optional[int] = None,
    style_refs: Optional[List[Image.Image]] = None,  # kept for API shape; unused here.
    extras: Optional[Dict[str, Any]] = None,
) -> Image.Image:
    # I give each run unique file names so parallel calls don't clash.
    tid = uuid.uuid4().hex[:8]
    in_path  = os.path.join(RUNTIME_DIR, f"{prefix}_in_{tid}.png")
    out_path = os.path.join(RUNTIME_DIR, f"{prefix}_out_{tid}.png")
    _save_png(image, in_path)

    # I build the CLI for the external cinematic script (v5 has no --control).
    args = [
        sys.executable, SCRIPT,
        "-i", in_path, "-o", out_path,
        "--subject", subject,
        "--steps", str(steps),
        "--guidance", str(guidance),
        "--strength", str(strength),
        "--max-side", str(max_side),
    ]
    if seed is not None:
        args += ["--seed", str(seed)]

    # I forward optional tweaks only when present.
    e = extras or {}
    if e.get("controlScale") is not None: args += ["--control-scale", str(e["controlScale"])]
    if e.get("toneMix")      is not None: args += ["--tone-mix",      str(e["toneMix"])]
    if e.get("bloom")        is not None: args += ["--bloom",         str(e["bloom"])]
    if e.get("contrast")     is not None: args += ["--contrast",      str(e["contrast"])]
    if e.get("saturation")   is not None: args += ["--saturation",    str(e["saturation"])]

    # I only pass a scheduler if it’s one of the supported options.
    sched = e.get("scheduler")
    if sched in ("unipc", "dpmpp"):
        args += ["--scheduler", sched]

    import shlex
    print("DEBUG ARGS[cinematic]:", " ".join(shlex.quote(a) for a in args))

    # I force UTF-8 so logs and paths behave.
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    env.setdefault("PYTHONUTF8", "1")

    try:
        subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, text=True, env=env)
    except subprocess.CalledProcessError as ecp:
        # I surface just the tail of logs to keep errors readable.
        tail = ((ecp.stderr or "") + "\n" + (ecp.stdout or ""))[-4000:]
        raise RuntimeError(f"cinematic script failed.\n{tail}") from ecp

    # I expect the script to produce the image here; if not, I fail fast.
    if not os.path.isfile(out_path):
        raise RuntimeError("cinematic script did not produce an output image.")
    return Image.open(out_path).convert("RGB")

def preload() -> dict:
    # I keep a preload hook for symmetry with other modules.
    return {"ok": True, "message": "preload noop"}

# I expose the common entry name used by the caller.
run = stylize
