# -*- coding: utf-8 -*-
import sys, json, base64, io, os
from PIL import Image

if len(sys.argv) != 3:
    print("usage: python dev/save_result.py <resp.json> <out.jpg>")
    sys.exit(1)

resp_path, out_path = sys.argv[1], sys.argv[2]
data = json.load(open(resp_path, "r", encoding="utf-8"))

b64 = data["resultBase64"].split("base64,",1)[1]
img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
img.save(out_path, "JPEG", quality=92)

print("Saved:", out_path)
print("traceId:", data.get("traceId"))
print("metrics:", json.dumps(data.get("metrics"), indent=2))
if data.get("warnings"):
    print("warnings:", data.get("warnings"))
