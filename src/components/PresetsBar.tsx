import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Style } from "@/lib/api";

type Props = { style: Style; onPick: (key: string) => void; };

export default function PresetsBar({ style, onPick }: Props) {
  const groups: Record<Style, { key: string; label: string }[]> = {
    anime: [
      { key: "anime_A_faithful_7890", label: "A (faithful) — seed 7890" },
      { key: "anime_A_faithful_1234", label: "A (faithful) — seed 1234" },
      { key: "anime_B_stylized_7890", label: "B (stylized) — seed 7890" },
      { key: "anime_B_stylized_1234", label: "B (stylized) — seed 1234" },
    ],
    cyberpunk: [
      { key: "cyberpunk_portrait_finalBoost", label: "Portrait (Final Boost)" },
      { key: "cyberpunk_street_8p5plus", label: "Street (8.5+)" },
    ],
    noir: [
      { key: "noir_portrait_classic", label: "Portrait — Classic Noir" },
      { key: "noir_scene_classic", label: "Street — Classic Noir" },
    ],
    cinematic: [
      { key: "cinematic_portrait_v5", label: "Obsidian Gold-Portrait" },
      { key: "cinematic_scene_v5", label: "Obsidian Gold-Scene" },
    ],
  };
  const items = groups[style] ?? [];

  return (
    <Card className="mt-4">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Presets</h3>
          <p className="text-xs text-slate-500">Click once → load proven settings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map(p => (
            <Button key={p.key} variant="secondary" size="sm" onClick={()=>onPick(p.key)}>
              {p.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
