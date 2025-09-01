export type PhaseSession = {
  contentImage: string; // data URI from upload
  style: "anime" | "cyberpunk" | "cinematic" | "noir";
  subject: "portrait" | "scene";
  control: "auto" | "hed" | "depth" | "canny" | "none";
};

const KEY = "artmorph_session_v1";

export function saveSession(s: PhaseSession) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function loadSession(): PhaseSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PhaseSession) : null;
  } catch { return null; }
}
