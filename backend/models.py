# I define the request/response shapes for the stylize API here using Pydantic.
# My goal is to keep types strict but the comments simple so future me can read it fast.

from __future__ import annotations
from typing import List, Literal, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

# I lock these to known strings so the UI and backend agree.
Mode = Literal["preview", "full"]
Style = Literal["cyberpunk", "cinematic", "noir", "anime"]
Subject = Literal["portrait", "scene"]
Control = Literal["auto", "hed", "depth", "canny", "none"]

# I cap incoming images to avoid crashes and huge memory spikes.
MAX_IMAGE_MB = 10

class StylizeRequest(BaseModel):
    # I keep all knobs the frontend can send for one stylize call.
    mode: Mode
    style: Style
    subject: Subject
    imageBase64: str
    control: Control = "auto"
    strength: float = 0.3
    guidance: float = 6.5
    steps: int = 30
    maxSide: int = 1024
    seed: Optional[int] = None
    styleImagesBase64: Optional[List[str]] = None
    extras: Optional[Dict[str, Any]] = None

    @field_validator("imageBase64")
    @classmethod
    def _size_guard(cls, v: str) -> str:
        # I estimate size from base64 length (roughly 3/4 of chars become bytes).
        payload = v.split("base64,", 1)[1] if "base64," in v else v
        approx_bytes = len(payload) * 3 // 4
        if approx_bytes > MAX_IMAGE_MB * 1024 * 1024:
            raise ValueError(f"imageBase64 exceeds {MAX_IMAGE_MB} MB limit")
        return v

    @field_validator("styleImagesBase64")
    @classmethod
    def _size_guard_refs(cls, v: Optional[List[str]]):
        # I apply the same size check to each optional style reference image.
        if not v:
            return v
        for s in v:
            payload = s.split("base64,", 1)[1] if "base64," in s else s
            approx_bytes = len(payload) * 3 // 4
            if approx_bytes > MAX_IMAGE_MB * 1024 * 1024:
                raise ValueError(f"One style image exceeds {MAX_IMAGE_MB} MB limit")
        return v

class Size(BaseModel):
    # I report final output size so callers don’t have to decode to know it.
    w: int
    h: int

class Metrics(BaseModel):
    # I attach simple run metrics for debugging and grading.
    durationMs: int
    model: str = "sd15"
    controlNet: Optional[Literal["hed", "depth", "canny"]] = None
    ipAdapter: bool = False
    steps: int
    guidance: float
    strength: float
    seed: Optional[int] = None
    size: Size

class StylizeResponse(BaseModel):
    # I send back the result image and the metrics in a single object.
    mode: Mode
    resultBase64: str
    metrics: Metrics
    warnings: List[str] = Field(default_factory=list)
    traceId: str
