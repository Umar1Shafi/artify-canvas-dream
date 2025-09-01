// src/lib/api.ts
// Frontend API contract + helpers (frontend only; backend untouched)

export type Mode = "preview" | "full";
export type Style = "cyberpunk" | "cinematic" | "noir" | "anime";
export type Subject = "portrait" | "scene";
export type Control = "auto" | "hed" | "depth" | "canny" | "none";

export type Size = { w: number; h: number };

export interface Metrics {
  durationMs: number;
  model: "sd15";
  controlNet: "hed" | "depth" | "canny" | null;
  ipAdapter: boolean;
  steps: number;
  guidance: number;
  strength: number;
  seed?: number | null;         // <-- seed is OPTIONAL (fixes your TS error)
  size: Size;
}

export interface StylizeRequest {
  mode: Mode;
  style: Style;
  subject: Subject;
  imageBase64: string;
  control: Control;
  strength: number;
  guidance: number;
  steps: number;
  maxSide: number;
  seed?: number;                 // optional = backend will randomize
  styleImagesBase64?: string[];  // for Cyberpunk IP-Adapter refs
  extras?: Record<string, unknown>;
}

export interface StylizeResponse {
  mode: Mode;
  resultBase64: string;
  metrics: Metrics | null;
  warnings?: string[];
  traceId: string;
}

export async function stylize(payload: StylizeRequest): Promise<StylizeResponse> {
  const r = await fetch("/api/stylize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Stylize failed (${r.status}): ${text}`);
  }
  return r.json();
}

// Helper: read a File → data: URL (base64). Standard way via FileReader.  :contentReference[oaicite:7]{index=7}
export async function fileToDataURI(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Max image size is 10MB.");
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
