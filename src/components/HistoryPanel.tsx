import React from "react";
import { History, X } from "lucide-react";

export type HistoryItem = {
  thumb: string;         // data URI
  style: "cyberpunk" | "cinematic" | "noir" | "anime";
  mode: "preview" | "full";
  traceId: string | null;
  ts: number;            // Date.now()
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPanel({
  items,
  open,
  setOpen,
}: {
  items: HistoryItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full border bg-white/90 px-3 py-2 shadow hover:bg-white"
        aria-label="Open history"
      >
        <History className="h-4 w-4" />
        <span className="text-sm">History</span>
      </button>

      {/* Drawer */}
      <div
        className={[
          "fixed right-4 bottom-16 z-40 w-[320px] max-h-[60vh] overflow-auto rounded-2xl border bg-white/95 shadow-lg transition-transform",
          open ? "translate-y-0" : "translate-y-[calc(100%+1rem)] pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b bg-slate-50">
          <div className="text-sm font-medium">Recent results</div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-slate-100"
            aria-label="Close history"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-3 text-xs text-slate-600">No items yet. Generate a preview or full result.</div>
        ) : (
          <div className="p-3 grid grid-cols-3 gap-2">
            {items.map((it, idx) => (
              <div key={idx} className="text-center">
                <img src={it.thumb} className="w-full h-20 object-cover rounded border" />
                <div className="mt-1 text-[10px] text-slate-600">
                  {it.style} · {it.mode}<br/>{fmt(it.ts)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
