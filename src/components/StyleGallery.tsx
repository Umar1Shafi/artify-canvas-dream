import React from "react";

type Style = "cyberpunk" | "cinematic" | "noir" | "anime";

const items: { id: Style; name: string; desc: string; demo: string }[] = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    desc: "Neon, bloom, skin grade",
    demo:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=640&q=60",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    desc: "HED/Depth + teal–orange",
    demo:
      "https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=640&q=60",
  },
  {
    id: "noir",
    name: "Noir",
    desc: "Grayscale, halation, vignette",
    demo:
      "https://images.unsplash.com/photo-1494797710133-75ad43b7f59b?w=640&q=60",
  },
  {
    id: "anime",
    name: "Anime",
    desc: "SD1.5 img2img + HED",
    demo:
      "https://images.unsplash.com/photo-1549849171-09c7f2b27cf3?w=640&q=60",
  },
];

export default function StyleGallery({
  selected,
  onSelect,
}: {
  selected: Style;
  onSelect: (s: Style) => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-purple-200 hover:border-purple-400 transition-colors p-4">
      <div className="mb-3 font-semibold">Choose a Style</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={[
              "text-left rounded-lg border overflow-hidden transition-all group",
              selected === it.id
                ? "border-purple-500 ring-2 ring-purple-300"
                : "border-slate-200 hover:border-slate-300",
            ].join(" ")}
          >
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
              <img src={it.demo} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
            </div>
            <div className="p-3">
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-slate-600">{it.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
