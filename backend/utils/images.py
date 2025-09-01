from __future__ import annotations
import base64, io
from PIL import Image, ImageOps

def decode_data_uri_to_pil(data_uri: str) -> Image.Image:
    b64 = data_uri.split("base64,", 1)[1] if data_uri.startswith("data:") else data_uri
    data = base64.b64decode(b64)
    img = Image.open(io.BytesIO(data))
    return ImageOps.exif_transpose(img).convert("RGB")

def encode_pil_to_data_uri(img: Image.Image, fmt: str = "JPEG", quality: int = 92) -> str:
    buf = io.BytesIO()
    w, h = img.size
    w = max(8, (w // 8) * 8); h = max(8, (h // 8) * 8)
    if (w, h) != img.size: img = img.resize((w, h), Image.LANCZOS)
    img.save(buf, format=fmt, quality=quality)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    mime = "image/jpeg" if fmt.upper() == "JPEG" else "image/png"
    return f"data:{mime};base64,{b64}"

def resize_max_side(img: Image.Image, max_side: int) -> Image.Image:
    w, h = img.size
    if max(w,h) <= max_side:
        w8, h8 = max(8,(w//8)*8), max(8,(h//8)*8)
        return img.resize((w8,h8), Image.LANCZOS) if (w8,h8)!=(w,h) else img
    s = max_side / float(max(w,h))
    W = max(8, int((w*s)//8)*8); H = max(8, int((h*s)//8)*8)
    return img.resize((W,H), Image.LANCZOS)
