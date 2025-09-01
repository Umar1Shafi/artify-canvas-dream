import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Style } from "@/lib/api";

interface StyleGalleryProps {
  /** backend style key */
  selected: Style;
  /** set backend style key */
  onSelect: (s: Style) => void;
}

type StyleCard = {
  id: Style;          // must be one of: "anime" | "cyberpunk" | "cinematic" | "noir"
  title: string;      // nice display name
  subtitle: string;   // short tagline
  img: string;        // /public path
  description?: string;
};

// Use 4 backend styles directly so no extra mapping is needed.
const STYLES: StyleCard[] = [
  {
    id: "cinematic",
    title: "Cinematic",
    subtitle: "Bold, filmic grading",
    img: "/styles/cinematic.webp",
    description: "Rich contrast and dramatic tones for a movie-like finish.",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk",
    subtitle: "Neon, futuristic vibe",
    img: "/styles/cyberpunk.webp",
    description: "Neon highlights and sci-fi aesthetics with crisp detail.",
  },
  {
    id: "anime",
    title: "Anime",
    subtitle: "Clean, illustrative lines",
    img: "/styles/anime.webp",
    description: "Flat shading and punchy colors for a stylized cartoon look.",
  },
  {
    id: "noir",
    title: "Noir",
    subtitle: "Moody B/W contrast",
    img: "/styles/noir.webp",
    description: "High contrast, gritty texture—classic film noir energy.",
  },
];

export const StyleGallery = ({ selected, onSelect }: StyleGalleryProps) => {
  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <span>Choose Artistic Style</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Pick a style. We’ll keep all the backend logic intact.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {STYLES.map((style) => {
            const isSelected = selected === style.id;
            return (
              <button
                type="button"
                key={style.id}
                onClick={() => onSelect(style.id)}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 text-left ${
                  isSelected
                    ? "ring-2 ring-purple-500 shadow-lg scale-[1.02]"
                    : "ring-1 ring-slate-200 hover:shadow-md hover:scale-[1.02]"
                }`}
              >
                <img
                  src={style.img}
                  alt={style.title}
                  className="w-full h-28 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white text-sm font-semibold truncate">
                    {style.title}
                  </h4>
                  <p className="text-white/90 text-xs truncate">
                    {style.subtitle}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg" />
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>Selected:</strong>{" "}
              {STYLES.find((s) => s.id === selected)?.title}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {STYLES.find((s) => s.id === selected)?.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
