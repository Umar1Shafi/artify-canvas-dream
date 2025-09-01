export type BackendStyle = "anime" | "cyberpunk" | "cinematic" | "noir";

// Map the gallery card IDs/slugs to backend styles.
// Adjust freely to your taste.
const MAP: Record<string, BackendStyle> = {
  "starry-night": "cinematic",
  "water-lilies": "cinematic",
  "the-scream": "noir",
  "cubist-view": "cyberpunk",
  "great-wave": "anime",
  "surreal-dreams": "noir",
  "abstract-colors": "cyberpunk",
  "paint-splash": "cyberpunk",
};

export function toBackendStyle(uiId: string): BackendStyle {
  return MAP[uiId] ?? "cinematic";
}
