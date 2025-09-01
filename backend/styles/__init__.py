# -*- coding: utf-8 -*-
"""
Style registry for the FastAPI server.

server.py imports:
  from backend.styles import REGISTRY, preload_all

REGISTRY maps:
  "anime" | "cyberpunk" | "cinematic" | "noir"  -> module with (preload, stylize)
"""
from __future__ import annotations

# Import the per-style wrapper modules (these must define preload() and stylize())
from . import anime, cyberpunk, cinematic, noir

REGISTRY = {
    "anime": anime,
    "cyberpunk": cyberpunk,
    "cinematic": cinematic,
    "noir": noir,
}

def preload_all():
    """
    Preload all styles at server startup.
    Returns a dict of { style: preload_result_or_error_dict }.
    """
    results = {}
    for name, mod in REGISTRY.items():
        try:
            if hasattr(mod, "preload"):
                results[name] = mod.preload()
            else:
                results[name] = {"ok": False, "error": "missing preload()"}
        except Exception as e:
            results[name] = {"ok": False, "error": f"{type(e).__name__}: {e}"}
    return results
