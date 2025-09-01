# -*- coding: utf-8 -*-
import argparse, base64, io, json, os
from PIL import Image, ImageOps

def to_data_uri(img_path: str) -> str:
    img = Image.open(img_path).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=92)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{b64}"

parser = argparse.ArgumentParser()
parser.add_argument("--style", required=True, choices=["cyberpunk","cinematic","noir","anime"])
parser.add_argument("--mode", required=True, choices=["preview","full"])
parser.add_argument("--subject", default="scene", choices=["scene","portrait"])
parser.add_argument("--control", default="auto", choices=["auto","hed","depth","canny","none"])
parser.add_argument("--infile", default="dev/in.jpg")
args = parser.parse_args()

# Sensible defaults
if args.mode == "preview":
    steps = 25
    max_side = 720
else:
    steps = 36
    max_side = 1152

payload = {
    "mode": args.mode,
    "style": args.style,
    "subject": args.subject,
    "imageBase64": to_data_uri(args.infile),
    "control": args.control,
    "strength": 0.32,
    "guidance": 6.6,
    "steps": steps,
    "maxSide": max_side,
    "seed": 77,
    "styleImagesBase64": [],
    "extras": {}
}

os.makedirs("dev", exist_ok=True)
out = f"dev/payload_{args.style}_{args.mode}.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)
print(f"Wrote {out}")
