# tests/backend/test_utils.py
import base64, io
from PIL import Image

def make_data_uri(w=64, h=64, color=(128,128,128), fmt="JPEG"):
    im = Image.new("RGB", (w, h), color)
    buf = io.BytesIO()
    im.save(buf, format=fmt)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    mime = "image/jpeg" if fmt.upper()=="JPEG" else "image/png"
    return f"data:{mime};base64,{b64}"
