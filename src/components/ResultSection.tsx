// src/components/ResultSection.tsx
import React from "react";
import type { Metrics } from "@/lib/api";

type Props = {
  resultDataUri: string | null;
  isPending: boolean;
  metrics: Metrics | null;
  traceId: string | null;
};

export default function ResultSection({ resultDataUri, isPending, metrics, traceId }: Props) {
  return (
    <div>
      <div className="text-lg font-semibold mb-2">Stylized Result</div>
      <div className="aspect-video border border-black/10 rounded-lg bg-white grid place-items-center relative overflow-hidden">
        {resultDataUri ? (
          <img src={resultDataUri} className="w-full h-full object-contain" />
        ) : (
          <div className="text-sm opacity-60">Run “Generate Full Resolution” to see result here.</div>
        )}
        {isPending && (
          <div className="absolute inset-0 bg-white/70 grid place-items-center text-sm">
            Generating full resolution…
          </div>
        )}
      </div>
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
