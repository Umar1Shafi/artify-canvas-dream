// src/components/PreviewSection.tsx
import React from "react";
import type { Metrics } from "@/lib/api";

type Props = {
  inputDataUri: string | null;
  previewDataUri: string | null;
  isPending: boolean;
  metrics: Metrics | null;
  traceId: string | null;
};

export default function PreviewSection(props: Props) {
  const { inputDataUri, previewDataUri, isPending, metrics, traceId } = props;

  return (
    <div>
      <div className="text-lg font-semibold mb-2">Live Preview</div>
      <div className="aspect-video border border-black/10 rounded-lg bg-white grid place-items-center relative overflow-hidden">
        {previewDataUri ? (
          <img src={previewDataUri} className="w-full h-full object-contain" />
        ) : (
          <img src={inputDataUri || ""} className="w-full h-full object-contain opacity-70" />
        )}
        {isPending && (
          <div className="absolute inset-0 bg-white/70 grid place-items-center text-sm">
            Generating preview…
          </div>
        )}
      </div>

      {/* metrics */}
      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        {metrics && (
          <>
            <Chip label={`steps: ${metrics.steps}`} />
            <Chip label={`guidance: ${metrics.guidance}`} />
            <Chip label={`strength: ${metrics.strength}`} />
            {metrics.seed != null && <Chip label={`seed: ${metrics.seed}`} />}
            <Chip label={`control: ${metrics.controlNet ?? "—"}`} />
            <Chip label={`size: ${metrics.size.w}×${metrics.size.h}`} />
            <Chip label={`t: ${(metrics.durationMs / 1000).toFixed(1)}s`} />
          </>
        )}
        {traceId && <Chip label={`trace: ${traceId}`} />}
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return <span className="am-chip">{label}</span>;
}
