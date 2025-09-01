// src/components/ComparePanel.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/styles/artmorph.css";

type Props = {
  original: string | null;
  stylized: string | null;
};

export default function ComparePanel({ original, stylized }: Props) {
  const [mode, setMode] = useState<"side" | "overlay">("side");
  const [split, setSplit] = useState(50); // 0..100
  const [ratio, setRatio] = useState<number>(16 / 9); // updated from actual image

  const frameRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const canShow = useMemo(() => Boolean(original && stylized), [original, stylized]);

  // Load intrinsic aspect ratio from either image
  useEffect(() => {
    if (!original && !stylized) return;
    const src = stylized || original!;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src;
  }, [original, stylized]);

  // Pointer move helpers
  const setSplitFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current?.querySelector<HTMLDivElement>(".compare-canvas");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.max(0, Math.min(100, pct)));
  }, []);

  // Drag events for the handle (Pointer Events API)
  useEffect(() => {
    const h = handleRef.current;
    if (!h) return;

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      setSplitFromClientX(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      dragging.current = false;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    };

    h.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      h.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setSplitFromClientX]);

  // Keyboard accessibility for the handle (ARIA slider pattern)
  const onHandleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { setSplit((v) => Math.max(0, v - 1)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setSplit((v) => Math.min(100, v + 1)); e.preventDefault(); }
    if (e.key === "Home") { setSplit(0); e.preventDefault(); }
    if (e.key === "End")  { setSplit(100); e.preventDefault(); }
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSplitFromClientX(e.clientX);
  };

  return (
    <div className="am-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">Compare Results</div>
        <div className="compare-toolbar">
          <button
            className={`px-3 py-1.5 text-sm rounded ${mode==="side" ? "bg-white border border-black/10" : "bg-transparent"}`}
            onClick={() => setMode("side")}
          >
            Side by Side
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded ${mode==="overlay" ? "bg-white border border-black/10" : "bg-transparent"}`}
            onClick={() => setMode("overlay")}
          >
            Overlay
          </button>
        </div>
      </div>

      {!canShow ? (
        <div className="compare-frame">
          <div className="compare-canvas" style={{ aspectRatio: ratio }}>
            <div className="grid place-items-center w-full h-full text-sm opacity-60">Render full resolution to compare.</div>
          </div>
        </div>
      ) : mode === "side" ? (
        <div className="compare-frame">
          <div className="grid grid-cols-2 gap-3 w-full">
            <SideImage title="Original Photo" uri={original!} ratio={ratio} />
            <SideImage title="Stylized Artwork" uri={stylized!} ratio={ratio} />
          </div>
        </div>
      ) : (
        <div ref={frameRef} className="compare-frame">
          <div
            className="compare-canvas"
            style={{ aspectRatio: ratio }}
            onClick={onCanvasClick}
          >
            {/* Base = stylized */}
            <img src={stylized!} className="compare-img" alt="Stylized result" />

            {/* Top = original clipped by split percentage */}
            <div
              className="compare-top-clip"
              style={{ width: `${split}%` }}
              aria-hidden="true"
            >
              <img src={original!} className="compare-img" alt="Original photo overlay" />
            </div>

            {/* Draggable + keyboard accessible handle */}
            <div
              ref={handleRef}
              className="compare-handle"
              role="slider"
              aria-label="Reveal original vs stylized"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(split)}
              aria-orientation="horizontal"
              tabIndex={0}
              onKeyDown={onHandleKey}
              style={{ left: `calc(${split}% - 1px)` }}
              title={`${Math.round(split)}% Original`}
            />
          </div>

          {/* Assistive rail for coarse control */}
          <div className="compare-rail mt-3 flex items-center gap-3 w-full max-w-4xl">
            <span className="text-xs opacity-70">Original</span>
            <input
              type="range" min={0} max={100} value={split}
              onChange={(e)=>setSplit(parseInt(e.target.value,10))}
              className="w-full"
              aria-label="Reveal amount"
            />
            <span className="text-xs opacity-70">Stylized</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SideImage({ title, uri, ratio }: { title: string; uri: string; ratio: number }) {
  return (
    <div>
      <div className="text-sm opacity-70 mb-1">{title}</div>
      <div className="compare-canvas" style={{ aspectRatio: ratio }}>
        <img src={uri} className="compare-img" alt={title} />
      </div>
    </div>
  );
}
