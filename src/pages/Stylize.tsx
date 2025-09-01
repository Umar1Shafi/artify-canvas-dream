import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStylize } from "@/hooks/use-stylize";
import type { Mode, Style, Subject, Control, StylizeRequest } from "@/lib/api";
import { loadSession } from "@/lib/session";
import { useNavigate } from "react-router-dom";

// Project-1 UI (named exports)
import { PreviewSection as P1PreviewSection } from "@/components/p1/PreviewSection";
import { ResultSection as P1ResultSection } from "@/components/p1/ResultSection";
import PresetsBar from "@/components/PresetsBar";
import AdvancedControls from "@/components/AdvancedControls";

type Step = "upload" | "stylize" | "result";

// ----- Types to avoid `any` in extras -----
type Scheduler = "dpmpp" | "unipc";
type Extras = Partial<{
  // common-ish
  controlScale: number;

  // shared across styles
  bloom: number; // used by cyberpunk (bloomX) and cinematic (cinBloom)

  // cyberpunk
  styleStrength: number;
  neon: number;
  rimBoost: number;
  scanlines: number;
  edgeQ: number;
  skinSuppress: number;
  skinKeep: number;
  refine: boolean;
  refineStrength: number;
  scheduler: Scheduler;

  // noir
  noirHalation: number;
  noirBloomSigma: number;
  noirBloomThresh: number;
  noirVignette: number;
  noirDither: number;
  noirGamma: number;
  noirGain: number;
  noirLift: number;

  // cinematic
  toneMix: number;
  contrast: number;
  saturation: number;
}>;

export default function StylizePage() {
  const navigate = useNavigate();

  // stepper
    const [currentStep, setCurrentStep] = useState<Step>("stylize");
    const [showAdvanced, setShowAdvanced] = useState(false);

  // session from Phase A
  const sess = loadSession();
  const [contentImage] = useState<string>(sess?.contentImage || "");
  const [style, setStyle] = useState<Style>(
    (sess?.style as Style) || "cinematic"
  );
  const [subject, setSubject] = useState<Subject>(
    (sess?.subject as Subject) || "scene"
  );
  const [control, setControl] = useState<Control>(
    (sess?.control as Control) || "auto"
  );

  // common
  const [strength, setStrength] = useState(0.3);
  const [guidance, setGuidance] = useState(6.5);
  const [seed, setSeed] = useState(0);
  const [maxSide, setMaxSide] = useState(1024);
  const [stepsPreview, setStepsPreview] = useState(18);
  const [stepsFull, setStepsFull] = useState(36);
  const [controlScale, setControlScale] = useState(0.3);

  // cyberpunk
  const [styleStrength, setStyleStrength] = useState(0.5);
  const [neon, setNeon] = useState(0.4);
  const [bloomX, setBloomX] = useState(0.44); // cyberpunk bloom
  const [rimBoost, setRimBoost] = useState(0.42);
  const [scanlines, setScanlines] = useState(0.0);
  const [edgeQ, setEdgeQ] = useState(0.987);
  const [skinSuppress, setSkinSuppress] = useState(0.95);
  const [skinKeep, setSkinKeep] = useState(0.25);
  const [refine, setRefine] = useState(true);
  const [refineStrength, setRefineStrength] = useState(0.14);
  const [scheduler, setScheduler] = useState<Scheduler>("dpmpp");
  const [styleRefs, setStyleRefs] = useState<string[]>([]); // optional ref images

  // noir
  const [noirHalation, setNoirHalation] = useState(0.2);
  const [noirBloomSigma, setNoirBloomSigma] = useState(1.9);
  const [noirBloomThresh, setNoirBloomThresh] = useState(0.8);
  const [noirVignette, setNoirVignette] = useState(0.12);
  const [noirDither, setNoirDither] = useState(0.003);
  const [noirGamma, setNoirGamma] = useState(1.02);
  const [noirGain, setNoirGain] = useState(1.01);
  const [noirLift, setNoirLift] = useState(0.01);

  // cinematic
  const [toneMix, setToneMix] = useState(0.22);
  const [cinBloom, setCinBloom] = useState(0.22);
  const [contrast, setContrast] = useState(0.18);
  const [saturation, setSaturation] = useState(1.06);

  // images + timing
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"content" | "style" | "output">(
    "content"
  );
  const [finalProcessingMs, setFinalProcessingMs] = useState<number>(0);

  const { mutateAsync, isPending } = useStylize();

  useEffect(() => {
    if (!sess || !sess.contentImage) {
      alert("No image found. Please start from the Upload page.");
    }
  }, [sess]);

  // turn FileList → data URIs (optional, for cyberpunk style refs)
  async function filesToDataUris(files: FileList): Promise<string[]> {
    const read = (f: File) =>
      new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result || ""));
        fr.onerror = rej;
        fr.readAsDataURL(f);
      });
    return Promise.all([...files].map(read));
  }

  // extras object (style-specific) — NO `any`
  function buildExtras(): Extras {
    const base: Extras = { controlScale };

    if (style === "cyberpunk") {
      base.styleStrength = styleStrength;
      base.neon = neon;
      base.bloom = bloomX;
      base.rimBoost = rimBoost;
      base.scanlines = scanlines;
      base.edgeQ = edgeQ;
      base.skinSuppress = skinSuppress;
      base.skinKeep = skinKeep;
      base.refine = refine;
      base.refineStrength = refineStrength;
      base.scheduler = scheduler;
    }
    if (style === "noir") {
      base.noirHalation = noirHalation;
      base.noirBloomSigma = noirBloomSigma;
      base.noirBloomThresh = noirBloomThresh;
      base.noirVignette = noirVignette;
      base.noirDither = noirDither;
      base.noirGamma = noirGamma;
      base.noirGain = noirGain;
      base.noirLift = noirLift;
    }
    if (style === "cinematic") {
      base.toneMix = toneMix;
      base.bloom = cinBloom;
      base.contrast = contrast;
      base.saturation = saturation;
    }
    return base;
  }

  function buildPayload(mode: Mode, steps: number): StylizeRequest {
    // 👇 smaller preview for heavy styles
    const size =
      mode === "preview" && (style === "anime" || style === "cyberpunk")
        ? Math.min(maxSide, 768) // try 640 if your GPU is very small
        : maxSide;

    return {
      mode,
      style,
      subject,
      imageBase64: contentImage,
      control,
      strength,
      guidance,
      steps,
      maxSide: size, // 👈 use the preview-friendly size
      seed,
      styleImagesBase64:
        style === "cyberpunk" && styleRefs.length ? styleRefs : undefined,
      extras: buildExtras(),
    };
  }

  async function onQuickPreview() {
    console.log("Stylize payload:", {
      style,
      mode: "preview",
      subject,
      control,
      steps: stepsPreview,
    });
    try {
      const r = await mutateAsync(buildPayload("preview", stepsPreview));
      // accept several common keys
      const raw =
        (
          r as unknown as {
            resultBase64?: string;
            imageBase64?: string;
            result?: string;
          }
        ).resultBase64 ??
        (
          r as unknown as {
            resultBase64?: string;
            imageBase64?: string;
            result?: string;
          }
        ).imageBase64 ??
        (
          r as unknown as {
            resultBase64?: string;
            imageBase64?: string;
            result?: string;
          }
        ).result ??
        "";

      if (!raw) {
        console.warn("No preview image found in response:", r);
        return;
      }

      // ensure data URL format
      const uri = raw.startsWith("data:")
        ? raw
        : `data:image/png;base64,${raw}`;
      setPreviewImage(uri);
      setViewMode("output");
    } catch (e) {
      console.error("Preview failed:", e);
    }
  }


  async function onFullResolution() {
    const t0 = performance.now();
    const resp = await mutateAsync(buildPayload("full", stepsFull));
    const t1 = performance.now();

    setFinalImage(resp.resultBase64);
    setFinalProcessingMs(Math.max(0, Math.round((t1 - t0) / 1000)));
    setViewMode("output");
    setCurrentStep("result");
  }

  // one-click presets
  function applyPreset(key: string) {
    switch (key) {
      // ANIME
      case "anime_A_faithful_7890":
        setStyle("anime");
        setControl("auto");
        setControlScale(0.85);
        setStrength(0.65);
        setGuidance(8.0);
        setStepsPreview(18);
        setStepsFull(34);
        setSeed(7890);
        break;
      case "anime_A_faithful_1234":
        setStyle("anime");
        setControl("auto");
        setControlScale(0.85);
        setStrength(0.65);
        setGuidance(8.0);
        setStepsPreview(18);
        setStepsFull(34);
        setSeed(1234);
        break;
      case "anime_B_stylized_7890":
        setStyle("anime");
        setControl("auto");
        setControlScale(0.85);
        setStrength(0.7);
        setGuidance(8.5);
        setStepsPreview(16);
        setStepsFull(32);
        setSeed(7890);
        break;
      case "anime_B_stylized_1234":
        setStyle("anime");
        setControl("auto");
        setControlScale(0.85);
        setStrength(0.7);
        setGuidance(8.5);
        setStepsPreview(16);
        setStepsFull(32);
        setSeed(1234);
        break;

      // CYBERPUNK
      case "cyberpunk_portrait_finalBoost":
        setStyle("cyberpunk");
        setSubject("portrait");
        setControl("depth");
        setControlScale(0.36);
        setStyleStrength(0.5);
        setStrength(0.21);
        setGuidance(6.2);
        setStepsPreview(20);
        setStepsFull(44);
        setEdgeQ(0.987);
        setSkinSuppress(0.95);
        setSkinKeep(0.25);
        setNeon(0.4);
        setBloomX(0.44);
        setRimBoost(0.42);
        setScanlines(0.0);
        setScheduler("dpmpp");
        setRefine(true);
        setRefineStrength(0.14);
        setMaxSide(1024);
        setSeed(101);
        break;

      case "cyberpunk_street_8p5plus":
        setStyle("cyberpunk");
        setSubject("scene");
        setControl("canny");
        setControlScale(0.42);
        setStyleStrength(0.88);
        setStrength(0.32);
        setGuidance(6.8);
        setStepsPreview(24);
        setStepsFull(60);
        setEdgeQ(0.93);
        setNeon(0.9);
        setBloomX(0.8);
        setRimBoost(0.62);
        setScanlines(0.1);
        setRefine(true);
        setRefineStrength(0.2);
        setScheduler("dpmpp");
        setMaxSide(1280);
        setSeed(77);
        break;

      // NOIR
      case "noir_portrait_classic":
        setStyle("noir");
        setSubject("portrait");
        setControl("auto");
        setStrength(0.18);
        setGuidance(6.0);
        setStepsPreview(18);
        setStepsFull(34);
        setNoirHalation(0.2);
        setNoirBloomSigma(1.9);
        setNoirBloomThresh(0.8);
        setNoirVignette(0.12);
        setNoirDither(0.003);
        setNoirGamma(1.02);
        setNoirGain(1.01);
        setNoirLift(0.01);
        setSeed(77);
        break;

      case "noir_scene_classic":
        setStyle("noir");
        setSubject("scene");
        setControl("canny");
        setControlScale(0.62);
        setStrength(0.74);
        setGuidance(6.8);
        setStepsPreview(22);
        setStepsFull(42);
        setNoirHalation(0.16);
        setNoirBloomSigma(1.7);
        setNoirBloomThresh(0.88);
        setNoirVignette(0.15);
        setNoirDither(0.0035);
        setNoirGamma(1.02);
        setNoirGain(1.0);
        setNoirLift(0.01);
        setSeed(77);
        break;

      // CINEMATIC
      case "cinematic_portrait_v5":
        setStyle("cinematic");
        setSubject("portrait");
        setControlScale(0.3);
        setStrength(0.24);
        setGuidance(6.2);
        setStepsPreview(18);
        setStepsFull(34);
        setToneMix(0.22);
        setCinBloom(0.22);
        setContrast(0.18);
        setSaturation(1.06);
        setSeed(77);
        break;

      case "cinematic_scene_v5":
        setStyle("cinematic");
        setSubject("scene");
        setControlScale(0.5);
        setStrength(0.4);
        setGuidance(6.6);
        setStepsPreview(20);
        setStepsFull(36);
        setToneMix(0.4);
        setCinBloom(0.42);
        setContrast(0.24);
        setSaturation(1.06);
        setSeed(77);
        break;
    }
    setViewMode("content");
    setFinalImage(null);
    setPreviewImage(null);
  }

  // required by ResultSection
  function handleStartOver() {
    try {
      localStorage.removeItem("artmorph_session_v1");
    } catch {
      // ignore storage errors
    }
    setPreviewImage(null);
    setFinalImage(null);
    setCurrentStep("upload");
    navigate("/");
  }

  function handleTryDifferentStyle() {
    setFinalImage(null);
    setCurrentStep("stylize");
    setViewMode("style");
    // keep contentImage & current sliders so user dials a new look
  }

  if (!contentImage) {
    return (
      <div className="min-h-screen bg-artmorph">
        <Header currentStep={currentStep} onStepChange={setCurrentStep} />
        <div className="max-w-3xl mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <p>Please go back to the Upload page and choose an image.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artmorph">
      <Header currentStep={currentStep} onStepChange={setCurrentStep} />

      {/* Presets */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <PresetsBar style={style} onPick={applyPreset} />
      </section>

      {/* Advanced settings toggle */}
      <section className="max-w-7xl mx-auto px-4 pt-3">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-controls"
        >
          {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
        </Button>
      </section>

      {/* Advanced controls */}
      {showAdvanced && (
        <section id="advanced-controls" className="max-w-7xl mx-auto px-4 pt-4">
          {/* Advanced controls */}
          <section className="max-w-7xl mx-auto px-4 pt-4">
            <AdvancedControls
              style={style}
              subject={subject}
              onSubject={setSubject}
              control={control}
              onControl={setControl}
              strength={strength}
              onStrength={setStrength}
              guidance={guidance}
              onGuidance={setGuidance}
              stepsPreview={stepsPreview}
              onStepsPreview={setStepsPreview}
              stepsFull={stepsFull}
              onStepsFull={setStepsFull}
              maxSide={maxSide}
              onMaxSide={setMaxSide}
              seed={seed}
              onSeed={setSeed}
              controlScale={controlScale}
              onControlScale={setControlScale}
              styleStrength={styleStrength}
              onStyleStrength={setStyleStrength}
              neon={neon}
              onNeon={setNeon}
              bloom={bloomX}
              onBloom={setBloomX}
              rimBoost={rimBoost}
              onRimBoost={setRimBoost}
              scanlines={scanlines}
              onScanlines={setScanlines}
              edgeQ={edgeQ}
              onEdgeQ={setEdgeQ}
              skinSuppress={skinSuppress}
              onSkinSuppress={setSkinSuppress}
              skinKeep={skinKeep}
              onSkinKeep={setSkinKeep}
              refine={refine}
              onRefine={setRefine}
              refineStrength={refineStrength}
              onRefineStrength={setRefineStrength}
              scheduler={scheduler}
              onScheduler={setScheduler}
              noirHalation={noirHalation}
              onNoirHalation={setNoirHalation}
              noirBloomSigma={noirBloomSigma}
              onNoirBloomSigma={setNoirBloomSigma}
              noirBloomThresh={noirBloomThresh}
              onNoirBloomThresh={setNoirBloomThresh}
              noirVignette={noirVignette}
              onNoirVignette={setNoirVignette}
              noirDither={noirDither}
              onNoirDither={setNoirDither}
              noirGamma={noirGamma}
              onNoirGamma={setNoirGamma}
              noirGain={noirGain}
              onNoirGain={setNoirGain}
              noirLift={noirLift}
              onNoirLift={setNoirLift}
              toneMix={toneMix}
              onToneMix={setToneMix}
              cinBloom={cinBloom}
              onCinBloom={setCinBloom}
              contrast={contrast}
              onContrast={setContrast}
              saturation={saturation}
              onSaturation={setSaturation}
            />
          </section>
        </section>
      )}

      {/* Optional: style reference images (cyberpunk) */}
      {style === "cyberpunk" && (
        <section className="max-w-7xl mx-auto px-4 pt-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm mb-2">
                Style references (optional): add 1–3 images
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  if (!e.target.files) return;
                  const arr = await filesToDataUris(e.target.files);
                  setStyleRefs(arr);
                }}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Preview */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <P1PreviewSection
          contentImage={contentImage}
          selectedStyle={style}
          previewImage={previewImage}
          viewMode={viewMode}
          isProcessing={isPending}
        />
      </section>

      {/* Buttons */}
      <section className="max-w-7xl mx-auto px-4 pt-4 flex gap-3">
        <Button
          onClick={onQuickPreview}
          disabled={isPending}
          variant="secondary"
        >
          {isPending ? "Working…" : "Quick Preview"}
        </Button>
        <Button onClick={onFullResolution} disabled={isPending}>
          {isPending ? "Working…" : "Generate Full Resolution"}
        </Button>
      </section>

      {/* Final result */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {/* Render ResultSection only when we have a final image */}
        {finalImage && (
          <P1ResultSection
            finalImage={finalImage}
            originalImage={contentImage}
            processingTime={finalProcessingMs} // milliseconds
            onStartOver={handleStartOver}
            onTryDifferentStyle={handleTryDifferentStyle}
          />
        )}
      </section>
    </div>
  );
}
