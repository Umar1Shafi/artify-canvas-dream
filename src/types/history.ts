export type HistoryMode = "preview" | "full";

export interface HistoryItem {
  id: string;
  mode: HistoryMode;
  timeISO: string;

  // images
  inputImageBase64: string;     // contentImage at request time
  outputImageBase64: string;    // resultBase64 from backend

  // backend params (so we can re-apply)
  style: "anime" | "cyberpunk" | "cinematic" | "noir";
  subject: "portrait" | "scene";
  control: "auto" | "hed" | "depth" | "canny" | "none";
  strength: number;
  guidance: number;
  steps: number;
  maxSide: number;
  seed: number | null;

  traceId?: string;             // from backend response
}
