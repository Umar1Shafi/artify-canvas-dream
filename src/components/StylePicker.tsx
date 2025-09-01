// src/components/StylePicker.tsx
import React from "react";
import "@/styles/artmorph.css";

export type StyleKey = "cyberpunk" | "cinematic" | "noir" | "anime";

type Item = {
  key: StyleKey;
  title: string;
  subtitle: string;
  thumb?: string; // /public path, optional
};

const ITEMS: Item[] = [
  { key: "cyberpunk", title: "Cyberpunk Neon", subtitle: "IP-Adapter + Depth", thumb: "/styles/cyberpunk_thumb.jpg" },
  { key: "cinematic", title: "Cinematic", subtitle: "Teal–Orange Grade",     thumb: "/styles/cinematic_thumb.jpg" },
  { key: "noir",      title: "Noir Classic", subtitle: "Grain + Halation",     thumb: "/styles/noir_thumb.jpg" },
  { key: "anime",     title: "Anime", subtitle: "HED / Softedge",              thumb: "/styles/anime_thumb.jpg" },
];

export default function StylePicker({
  selected, onSelect,
}: { selected: StyleKey; onSelect: (s: StyleKey) => void }) {
  return (
    <div className="am-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-lg font-semibold">Choose Artistic Style</div>
        <span className="text-xs opacity-60">(IP-Adapter refs auto for Cyberpunk)</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {ITEMS.map((it) => (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={`group text-left rounded-xl overflow-hidden border ${selected === it.key ? "border-teal-400 ring-2 ring-teal-200" : "border-black/10"}`}
          >
            <div className="h-28 bg-black/5">
              {it.thumb ? (
                <img src={it.thumb} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
              )}
            </div>
            <div className="p-2">
              <div className="font-medium">{it.title}</div>
              <div className="text-xs opacity-60">{it.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
