// import React, { ChangeEvent } from "react";
// import type { Control, Style, Subject } from "@/lib/api";

// type Props = {
//   disabled: boolean;
//   imageDataUri: string | null;

//   style: Style;
//   subject: Subject;
//   control: Control;
//   strength: number;      // α:β -> img2img strength
//   guidance: number;
//   seed: number;

//   // Cyberpunk-only knob (optional)
//   styleStrength: number;

//   onFileSelected: (file: File) => void;
//   onStyleChange: (v: Style) => void;
//   onSubjectChange: (v: Subject) => void;
//   onControlChange: (v: Control) => void;
//   onStrengthChange: (v: number) => void;
//   onGuidanceChange: (v: number) => void;
//   onSeedChange: (v: number) => void;
//   onStyleStrengthChange: (v: number) => void;

//   onQuickPreview: () => void;
//   onFullRes: () => void;

//   isPending: boolean;

//   // NEW: simple Advanced gate
//   advancedOpen: boolean;
//   setAdvancedOpen: (v: boolean) => void;
// };

// export default function ControlPanel(props: Props) {
//   const onFile = (e: ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     // Guard: avoid huge uploads
//     const TEN_MB = 10 * 1024 * 1024;
//     if (f.size > TEN_MB) {
//       alert("Please choose an image ≤ 10 MB.");
//       e.currentTarget.value = "";
//       return;
//     }
//     props.onFileSelected(f);
//   };

//   return (
//     <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 space-y-4 shadow-sm">
//       <h2 className="text-lg font-semibold">1) Upload & Basic Options</h2>

//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Upload */}
//         <div className="flex-1 space-y-2">
//           <div className="font-medium">Upload image (≤10 MB)</div>
//           <input
//             type="file"
//             onChange={onFile}
//             disabled={props.disabled}
//             accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
//           />
//           {props.imageDataUri && (
//             <div className="text-xs text-gray-500">Selected ✓</div>
//           )}
//         </div>

//         {/* Style */}
//         <div className="w-full md:w-56">
//           <label className="block text-sm font-medium mb-1">Style</label>
//           <select
//             className="w-full border rounded px-2 py-1"
//             value={props.style}
//             onChange={(e) => props.onStyleChange(e.target.value as Style)}
//             disabled={props.disabled}
//           >
//             <option value="cyberpunk">Cyberpunk</option>
//             <option value="cinematic">Cinematic</option>
//             <option value="noir">Noir</option>
//             <option value="anime">Anime</option>
//           </select>
//         </div>

//         {/* Subject */}
//         <div className="w-full md:w-56">
//           <label className="block text-sm font-medium mb-1">Subject</label>
//           <select
//             className="w-full border rounded px-2 py-1"
//             value={props.subject}
//             onChange={(e) => props.onSubjectChange(e.target.value as Subject)}
//             disabled={props.disabled}
//           >
//             <option value="scene">Scene</option>
//             <option value="portrait">Portrait</option>
//           </select>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <button
//           onClick={props.onQuickPreview}
//           disabled={props.disabled || !props.imageDataUri || props.isPending}
//           className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
//         >
//           {props.isPending ? "Working…" : "Quick Preview"}
//         </button>
//         <button
//           onClick={props.onFullRes}
//           disabled={props.disabled || !props.imageDataUri || props.isPending}
//           className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50"
//         >
//           {props.isPending ? "Working…" : "Full Resolution"}
//         </button>

//         {/* Advanced toggle */}
//         <button
//           type="button"
//           onClick={() => props.setAdvancedOpen(!props.advancedOpen)}
//           className="px-3 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50"
//         >
//           {props.advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
//         </button>
//       </div>

//       {/* Advanced settings — hidden until user asks */}
//       {props.advancedOpen && (
//         <div className="mt-2 rounded-xl border p-4 bg-slate-50 space-y-4">
//           <h3 className="text-base font-semibold">Advanced settings (tune only if needed)</h3>

//           {/* ControlNet choice */}
//           <div className="w-full md:w-56">
//             <label className="block text-sm font-medium mb-1">Control</label>
//             <select
//               className="w-full border rounded px-2 py-1"
//               value={props.control}
//               onChange={(e) => props.onControlChange(e.target.value as Control)}
//               disabled={props.disabled}
//             >
//               <option value="auto">Auto (recommended)</option>
//               <option value="hed">HED / SoftEdge</option>
//               <option value="depth">Depth</option>
//               <option value="canny">Canny</option>
//               <option value="none">None</option>
//             </select>
//           </div>

//           {/* Strength / Guidance / Seed */}
//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">α:β (Strength)</label>
//               <input
//                 type="range"
//                 min={0.05}
//                 max={0.95}
//                 step={0.01}
//                 value={props.strength}
//                 onChange={(e) => props.onStrengthChange(parseFloat(e.target.value))}
//                 disabled={props.disabled}
//                 className="w-full"
//               />
//               <div className="text-xs text-gray-600">Current: {props.strength.toFixed(2)}</div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Guidance (CFG)</label>
//               <input
//                 type="range"
//                 min={3}
//                 max={12}
//                 step={0.1}
//                 value={props.guidance}
//                 onChange={(e) => props.onGuidanceChange(parseFloat(e.target.value))}
//                 disabled={props.disabled}
//                 className="w-full"
//               />
//               <div className="text-xs text-gray-600">Current: {props.guidance.toFixed(1)}</div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Seed</label>
//               <input
//                 type="number"
//                 className="w-full border rounded px-2 py-1"
//                 value={props.seed}
//                 onChange={(e) => props.onSeedChange(parseInt(e.target.value || "0", 10))}
//                 disabled={props.disabled}
//               />
//             </div>
//           </div>

//           {/* Cyberpunk-only knob */}
//           {props.style === "cyberpunk" && (
//             <div>
//               <label className="block text-sm font-medium mb-1">Style Strength (IP-Adapter)</label>
//               <input
//                 type="range"
//                 min={0.0}
//                 max={1.0}
//                 step={0.01}
//                 value={props.styleStrength}
//                 onChange={(e) => props.onStyleStrengthChange(parseFloat(e.target.value))}
//                 disabled={props.disabled}
//                 className="w-full"
//               />
//               <div className="text-xs text-gray-600">Current: {props.styleStrength.toFixed(2)}</div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }











// src/components/ControlPanel.tsx
import React from "react";
import type { Control, Style, Subject } from "@/lib/api";

type Props = {
  disabled: boolean;
  imageDataUri: string | null;

  // selection
  style: Style;
  subject: Subject;
  control: Control;

  // core knobs
  strength: number;
  guidance: number;
  seed: number | undefined;

  // cyberpunk-only
  styleStrength: number;

  // callbacks
  onFileSelected: (file: File) => void;
  onStyleChange: (s: Style) => void;
  onSubjectChange: (s: Subject) => void;
  onControlChange: (c: Control) => void;
  onStrengthChange: (n: number) => void;
  onGuidanceChange: (n: number) => void;
  onSeedChange: (n: number | undefined) => void;
  onStyleStrengthChange: (n: number) => void;

  // actions
  onQuickPreview: () => void;
  onFullRes: () => void;
  isPending: boolean;

  // advanced toggle
  advancedOpen: boolean;
  setAdvancedOpen: (b: boolean) => void;
};

export default function ControlPanel(p: Props) {
  const {
    disabled, imageDataUri, style, subject, control,
    strength, guidance, seed, styleStrength,
    onFileSelected, onStyleChange, onSubjectChange, onControlChange,
    onStrengthChange, onGuidanceChange, onSeedChange, onStyleStrengthChange,
    onQuickPreview, onFullRes, isPending, advancedOpen, setAdvancedOpen,
  } = p;

  const canRun = Boolean(imageDataUri) && !isPending && !disabled;

  return (
    <div className="space-y-4">
      {/* α:β headline + Advanced switch */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Stylization Controls</div>
          <div className="text-xs opacity-60">α:β Balance controls content vs. style</div>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <span>Advanced Mode</span>
          <input
            type="checkbox"
            checked={advancedOpen}
            onChange={(e) => setAdvancedOpen(e.target.checked)}
          />
        </label>
      </div>

      {/* α:β slider (always visible) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm opacity-70">α:β Balance (Content ↔ Style)</span>
          <span className="text-sm">{Math.round(strength * 100)}%</span>
        </div>
        <input
          type="range"
          min={0} max={100} value={Math.round(strength * 100)}
          onChange={(e) => onStrengthChange(Number(e.target.value) / 100)}
          className="w-full"
        />
        <div className="flex justify-between text-xs opacity-60 mt-1">
          <span>More Original (α)</span>
          <span>Balanced</span>
          <span>More Artistic (β)</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          className="am-btn-ghost"
          disabled={!canRun}
          onClick={onQuickPreview}
        >
          👁️ Quick Preview
        </button>
        <button
          className="am-btn-primary"
          disabled={!canRun}
          onClick={onFullRes}
        >
          ⬆️ Generate Full Resolution
        </button>
      </div>

      {/* Advanced */}
      {advancedOpen && (
        <div className="rounded-lg border border-black/10 p-3 space-y-3 bg-white">
          {/* Selection row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs opacity-70">Style</label>
              <select
                value={style}
                onChange={(e) => onStyleChange(e.target.value as Style)}
                className="block w-full rounded-md border border-black/10 px-2 py-1.5 bg-white"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="cinematic">Cinematic</option>
                <option value="noir">Noir</option>
                <option value="anime">Anime</option>
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70">Subject</label>
              <select
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value as Subject)}
                className="block w-full rounded-md border border-black/10 px-2 py-1.5 bg-white"
              >
                <option value="scene">Scene</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70">Control</label>
              <select
                value={control}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onControlChange(e.currentTarget.value as Control)
                }
                className="block w-full rounded-md border border-black/10 px-2 py-1.5 bg-white"
              >
                <option value="auto">Auto</option>
                <option value="hed">HED</option>
                <option value="depth">Depth</option>
                <option value="canny">Canny</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70">Guidance (CFG)</label>
              <input
                type="range" min={1} max={12} step={0.1}
                value={guidance}
                onChange={(e) => onGuidanceChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs opacity-70 mt-1">{guidance.toFixed(1)}</div>
            </div>
            <div>
              <label className="text-xs opacity-70">Seed (blank = random)</label>
              <input
                type="number"
                placeholder="random"
                value={seed ?? ""}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  onSeedChange(v === "" ? undefined : Number(v));
                }}
                className="block w-full rounded-md border border-black/10 px-2 py-1.5 bg-white"
              />
            </div>
          </div>

          {/* Style-specific */}
          {style === "cyberpunk" && (
            <div>
              <label className="text-xs opacity-70">Style Strength (IP-Adapter β)</label>
              <input
                type="range" min={0} max={1} step={0.01}
                value={styleStrength}
                onChange={(e) => onStyleStrengthChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs opacity-70 mt-1">{styleStrength.toFixed(2)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
