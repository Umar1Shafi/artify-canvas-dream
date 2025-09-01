// src/lib/presets.ts
// EXACT presets you discovered. Full mode uses your exact steps & sizes.
// Preview stays small for speed, unless you later ask me to mirror Full.

export type Style = "cyberpunk" | "cinematic" | "noir" | "anime";
export type Subject = "portrait" | "scene";

export type Preset = {
  control: "auto" | "hed" | "depth" | "canny" | "none";
  strength: number;
  guidance: number;
  seed: number;
  extras: Record<string, number | string | boolean>;
  // steps & maxSide for each mode
  previewSteps: number;
  previewMaxSide: number;
  fullSteps: number;
  fullMaxSide: number;
  // style reference images (auto-attached when empty)
  styleRefUrls?: string[];
};

export type AnimeVariant = "A_faithful" | "B_stylized";
export type AnimeSeedPreset = 7890 | 1234;

export function getPreset(
  style: Style,
  subject: Subject,
  opts?: { animeVariant?: AnimeVariant; animeSeed?: AnimeSeedPreset }
): Preset {
  const variant = opts?.animeVariant ?? "A_faithful";
  const animeSeed: AnimeSeedPreset = opts?.animeSeed ?? 7890;

  if (style === "anime") {
    // A (faithful) — steps 34; B (stylized) — steps 32; control-scale 0.85; model primary
    if (variant === "A_faithful") {
      return {
        control: "auto",
        strength: 0.65,
        guidance: 8.0,
        seed: animeSeed,
        extras: { controlScale: 0.85, model: "primary" },
        previewSteps: 25, previewMaxSide: 720,
        fullSteps: 34,  fullMaxSide: 1152,
      };
    } else {
      return {
        control: "auto",
        strength: 0.70,
        guidance: 8.5,
        seed: animeSeed,
        extras: { controlScale: 0.85, model: "primary" },
        previewSteps: 25, previewMaxSide: 720,
        fullSteps: 32,  fullMaxSide: 1152,
      };
    }
  }

  if (style === "cyberpunk") {
    if (subject === "portrait") {
      // Your CLI portrait: steps 44, max-side 1024, with refs & grading knobs
      return {
        control: "depth",
        strength: 0.21,
        guidance: 6.2,
        seed: 101,
        extras: {
          controlScale: 0.36,
          scheduler: "dpmpp",
          refine: true,
          refineStrength: 0.14,
          autoMaskPerson: true,
          forceInpaint: true,
          edgeQ: 0.987,
          skinSuppress: 0.95,
          skinKeep: 0.25,
          neon: 0.40,
          bloom: 0.44,
          rimBoost: 0.42,
          scanlines: 0.0,
          styleStrength: 0.50,
        },
        previewSteps: 25, previewMaxSide: 720,
        fullSteps: 44,  fullMaxSide: 1024,
        styleRefUrls: [
          "/styles/neon_street_photo1.jpg",
          "/styles/neon_street_photo2.jpg",
          "/styles/neon_portrait_photo.jpg",
        ],
      };
    } else {
      // Your CLI scene/street: steps 60, max-side 1280, with refs
      return {
        control: "canny",
        strength: 0.32,
        guidance: 6.8,
        seed: 77,
        extras: {
          controlScale: 0.42,
          scheduler: "dpmpp",
          refine: true,
          refineStrength: 0.20,
          forceInpaint: true,      // you had it in your scene CLI
          edgeQ: 0.930,
          neon: 0.90,
          bloom: 0.80,
          rimBoost: 0.62,
          scanlines: 0.10,
          styleStrength: 0.88,
        },
        previewSteps: 28, previewMaxSide: 768,
        fullSteps: 60,  fullMaxSide: 1280,
        styleRefUrls: [
          "/styles/neon_street_photo1.jpg",
          "/styles/neon_street_photo2.jpg",
        ],
      };
    }
  }

  if (style === "noir") {
    if (subject === "portrait") {
      return {
        control: "none",
        strength: 0.18,
        guidance: 6.0,
        seed: 77,
        extras: {
          noirHalation: 0.20,
          noirBloomSigma: 1.9,
          noirBloomThresh: 0.80,
          noirVignette: 0.12,
          noirDither: 0.003,
          noirGamma: 1.02,
          noirGain: 1.01,
          noirLift: 0.01,
        },
        previewSteps: 25, previewMaxSide: 720,
        fullSteps: 34,  fullMaxSide: 1152,
      };
    } else {
      return {
        control: "canny",
        strength: 0.74,
        guidance: 6.8,
        seed: 77,
        extras: {
          controlScale: 0.62,
          noirHalation: 0.16,
          noirBloomSigma: 1.7,
          noirBloomThresh: 0.88,
          noirVignette: 0.15,
          noirDither: 0.0035,
          noirGamma: 1.02,
          noirGain: 1.0,
          noirLift: 0.01,
        },
        previewSteps: 28, previewMaxSide: 768,
        fullSteps: 42,  fullMaxSide: 1152,
      };
    }
  }

  if (style === "cinematic") {
    if (subject === "portrait") {
      return {
        control: "auto",
        strength: 0.24,
        guidance: 6.2,
        seed: 77,
        extras: {
          controlScale: 0.30,
          toneMix: 0.22,
          bloom: 0.22,
          contrast: 0.18,
          saturation: 1.06,
        },
        previewSteps: 25, previewMaxSide: 720,
        fullSteps: 34,  fullMaxSide: 1152,
      };
    } else {
      return {
        control: "auto",
        strength: 0.40,
        guidance: 6.6,
        seed: 77,
        extras: {
          controlScale: 0.50,
          toneMix: 0.40,
          bloom: 0.42,
          contrast: 0.24,
          saturation: 1.06,
        },
        previewSteps: 28, previewMaxSide: 768,
        fullSteps: 36,  fullMaxSide: 1152,
      };
    }
  }

  // Fallback
  return {
    control: "auto",
    strength: 0.32,
    guidance: 6.6,
    seed: 77,
    extras: {},
    previewSteps: 25, previewMaxSide: 720,
    fullSteps: 36,  fullMaxSide: 1152,
  };
}
