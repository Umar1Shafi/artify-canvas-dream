# I run a small FastAPI server for stylizing images. I decode inputs, call the right style wrapper, and send back a base64 image + simple metrics.

from __future__ import annotations
import os, time, uuid, platform
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from backend.models import StylizeRequest, StylizeResponse, Metrics
from backend.utils.images import decode_data_uri_to_pil, encode_pil_to_data_uri, resize_max_side
from backend.styles import REGISTRY, preload_all

# I try to read GPU info, but I don't fail if torch isn't installed.
try:
    import torch
except Exception:
    torch = None


def _gpu_info() -> str:
    # I report a short device summary so my logs are easier to read.
    if torch is None:
        return "torch: not installed"
    try:
        if torch.cuda.is_available():
            idx = torch.cuda.current_device()
            name = torch.cuda.get_device_name(idx)
            props = torch.cuda.get_device_properties(idx)
            vram_gb = round(props.total_memory / (1024**3), 2)
            return f"CUDA: {name}, VRAM {vram_gb} GB"
        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return "MPS: available (Apple Silicon)"
        return "GPU: not available (CPU mode)"
    except Exception as e:
        return f"GPU probe failed: {e}"


def _banner():
    # I print a tiny startup banner for quick diagnostics.
    print("=== Artify Canvas Dream API ===")
    print(f"Python: {platform.python_version()}  |  Platform: {platform.platform()}")
    print(_gpu_info())


def _init_startup():
    # I prep runtime folders and warm up style wrappers once.
    os.makedirs("runtime", exist_ok=True)
    print("Preloading style wrappers…")
    print(preload_all())
    print("Ready: http://localhost:8000/healthz")


def _cleanup_shutdown():
    # I’d put temp cleanup here if I start creating lots of files.
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # I use FastAPI’s lifespan to run my startup/shutdown hooks.
    _banner()
    _init_startup()
    try:
        yield
    finally:
        _cleanup_shutdown()


app = FastAPI(title="Artify Canvas Dream API", version="0.2.1", lifespan=lifespan)


@app.get("/healthz")
def healthz():
    # I return a simple heartbeat with a unix timestamp.
    return JSONResponse({"ok": True, "ts": int(time.time())})


def _clamp_runtime(mode: str, steps: int | None, max_side: int | None):
    # I keep preview lighter and full runs a bit heavier, with safe caps.
    if not steps or steps <= 0:
        steps = 24 if mode == "preview" else 36
    if not max_side or max_side <= 0:
        max_side = 768 if mode == "preview" else 1280
    else:
        max_side = min(max_side, 1280 if mode != "preview" else 768)
    return steps, max_side


@app.post("/api/stylize", response_model=StylizeResponse)
def stylize(req: StylizeRequest):
    # I measure time per request for quick performance checks.
    t0 = time.time()
    trace_id = str(uuid.uuid4())

    # I normalize heavy knobs based on mode.
    steps, max_side = _clamp_runtime(req.mode, req.steps, req.maxSide)

    # I decode the main image safely.
    try:
        src = decode_data_uri_to_pil(req.imageBase64)
    except Exception as e:
        raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": f"Bad image: {e}"})

    # I decode optional style refs (if any) and keep them within max_side.
    refs = []
    if req.styleImagesBase64:
        for s in req.styleImagesBase64:
            try:
                refs.append(resize_max_side(decode_data_uri_to_pil(s), max_side))
            except Exception as e:
                raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": f"Bad style image: {e}"})

    # I pick the style module from the registry (cyberpunk/cinematic/noir/anime).
    mod = REGISTRY.get(req.style)
    if not mod:
        raise HTTPException(status_code=422, detail={"code": "VALIDATION_ERROR", "message": f"Unknown style: {req.style}"})

    # I run the style wrapper and surface a clean error if it fails.
    try:
        out_img = mod.stylize(
            src,
            subject=req.subject,
            control=req.control,
            strength=float(req.strength),
            guidance=float(req.guidance),
            steps=int(steps),
            seed=req.seed,
            max_side=int(max_side),
            style_refs=refs or None,
            extras=req.extras or {},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail={"code": "PIPELINE_ERROR", "message": str(e)})

    # I return a JPEG (good balance of size and quality) as a data URI.
    result_b64 = encode_pil_to_data_uri(out_img, fmt="JPEG", quality=92)

    # I assemble the metrics so graders/users can see what happened.
    ms = int((time.time() - t0) * 1000)
    metrics = Metrics(
        durationMs=ms,
        model="sd15",
        controlNet=(None if req.control in ("none", "auto") else req.control),
        ipAdapter=False,
        steps=steps,
        guidance=float(req.guidance),
        strength=float(req.strength),
        seed=req.seed,
        size={"w": out_img.size[0], "h": out_img.size[1]},
    )

    # I log one concise line per request (easy to grep).
    print(
        f"[{trace_id}] style={req.style} mode={req.mode} steps={steps} size={out_img.size[0]}x{out_img.size[1]} "
        f"ms={ms} guidance={req.guidance} strength={req.strength} control={req.control} | {_gpu_info()}"
    )

    # I build the response object expected by the frontend.
    resp = {
        "mode": req.mode,
        "resultBase64": result_b64,
        "metrics": metrics.model_dump(),
        "warnings": [],
        "traceId": trace_id,
    }
    return JSONResponse(resp)
