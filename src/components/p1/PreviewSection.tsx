import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Sparkles } from "lucide-react";

interface PreviewSectionProps {
  contentImage: string;
  selectedStyle: string;
  previewImage: string | null;
  viewMode: "content" | "style" | "output";
  isProcessing: boolean;
}

const styleImages: Record<string, string> = {
  "starry-night":
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900",
  "water-lilies":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900",
  scream: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=900",
  persistence:
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900",
  picasso: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900",
  hokusai: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=900",
};

export const PreviewSection = ({
  contentImage,
  selectedStyle,
  previewImage,
  viewMode,
  isProcessing,
}: PreviewSectionProps) => {
  // decide which image to show
  const src = useMemo(() => {
    if (viewMode === "output" && previewImage) return previewImage;
    if (viewMode === "style") return styleImages[selectedStyle] || contentImage;
    return contentImage;
  }, [viewMode, previewImage, selectedStyle, contentImage]);

  const title = useMemo(() => {
    if (viewMode === "output") return "Stylized Result";
    if (viewMode === "style") return "Reference Style";
    return "Original Photo";
  }, [viewMode]);

  // capture intrinsic resolution for the footer
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-amber-600" />
          <span>{title}</span>
          {viewMode === "output" && !isProcessing && previewImage && (
            <Sparkles className="h-4 w-4 text-amber-500" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative bg-slate-100 rounded-lg overflow-hidden">
          {/* Busy overlay */}
          {isProcessing && viewMode === "output" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-medium text-slate-100">
                  Creating your masterpiece…
                </p>
                <p className="text-xs text-slate-300">
                  This may take a few moments
                </p>
              </div>
              <div className="w-40">
                <Progress value={66} className="h-2" />
              </div>
            </div>
          )}

          {/* The image itself: keep full photo, no crop */}
          <img
            src={src}
            alt={title}
            onLoad={(e) =>
              setDims({
                w: e.currentTarget.naturalWidth,
                h: e.currentTarget.naturalHeight,
              })
            }
            className="w-full h-auto max-h-[70vh] object-contain bg-black"
          />
        </div>

        {/* Info row */}
        <div className="mt-3 flex justify-between items-center text-sm text-slate-600">
          <span>
            {dims ? `Resolution: ${dims.w}×${dims.h}px` : "Resolution: —"}
          </span>
          {viewMode === "output" && previewImage && !isProcessing && (
            <span className="text-green-600 font-medium">
              ✓ Ready for download
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
