import React from "react";
import { X, Sparkles, Upload, Download } from "lucide-react";

export default function HelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-0 flex items-center justify-center px-4"
      >
        <div className="w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">How it works</h3>
            <button
              className="p-1 rounded hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <Upload className="h-5 w-5 mt-0.5 text-teal-700" />
              <div>
                <b>Step 1 — Upload & Style.</b> Drop or pick an image (≤ 10 MB). Choose a style (Cyberpunk, Cinematic, Noir, Anime) and subject (Scene/Portrait).
                We auto-pick safe defaults that usually work.
              </div>
            </li>
            <li className="flex gap-3">
              <Sparkles className="h-5 w-5 mt-0.5 text-purple-700" />
              <div>
                <b>Step 2 — Quick Preview.</b> Runs a smaller, fast pass. If you want to tune params, click <b>Show advanced settings</b> and adjust
                Strength (α:β), Guidance (CFG), Control, and Seed. Close advanced to return to auto-defaults.
              </div>
            </li>
            <li className="flex gap-3">
              <Download className="h-5 w-5 mt-0.5 text-amber-700" />
              <div>
                <b>Step 3 — Full Resolution.</b> Generates the final image with bigger size and more steps. Use <b>Download JPEG</b> to save.
              </div>
            </li>
          </ol>

          <div className="mt-4 text-xs text-slate-500">
            Tip: The very first run per style may be slow — it downloads models once. Next runs are much faster.
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-900 text-white"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
