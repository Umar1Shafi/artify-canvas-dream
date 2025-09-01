import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type HistoryMode = "preview" | "full";
export interface HistoryItem {
  id: string;
  mode: HistoryMode;
  timeISO: string;
  inputImageBase64: string;
  outputImageBase64: string;
  style: "anime" | "cyberpunk" | "cinematic" | "noir";
  subject: "portrait" | "scene";
  control: "auto" | "hed" | "depth" | "canny" | "none";
  strength: number;
  guidance: number;
  steps: number;
  maxSide: number;
  seed: number | null;
  traceId?: string;
}

type Props = {
  items: HistoryItem[];
  onReapply: (item: HistoryItem) => void;
  onClear: () => void;
};

export default function HistoryPanelPhaseE({ items, onReapply, onClear }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">History</CardTitle>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onClear}>Clear</Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((h) => (
          <button
            key={h.id}
            className="text-left rounded-lg overflow-hidden border hover:shadow focus:outline-none"
            onClick={() => onReapply(h)}
            title={`${h.mode.toUpperCase()} · ${h.style} · ${new Date(h.timeISO).toLocaleString()}`}
          >
            <img src={h.outputImageBase64} alt="hist" className="w-full aspect-square object-cover" />
            <div className="px-2 py-1 text-[11px] text-slate-600 flex justify-between">
              <span>{h.style}</span>
              <span>{h.mode}</span>
            </div>
          </button>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-slate-500">No runs yet. Generate a preview or full result.</div>
        )}
      </CardContent>
    </Card>
  );
}
