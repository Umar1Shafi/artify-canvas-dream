// I make the "Download Artwork" button actually save the image (works for base64, data:URI, or http URL).

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  RotateCcw,
  Share2,
  Clock,
  CheckCircle,
  Eye,
  Palette,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResultSectionProps {
  originalImage: string | null;
  finalImage: string | null; // can be data:URI or plain base64 (from backend) or http(s) URL
  processingTime: number | null;
  onStartOver: () => void;
  onTryDifferentStyle: () => void;
}

// --- tiny helpers ---
function dataUriOrBase64ToBlob(src: string, fallbackMime = "image/jpeg"): Blob {
  // I accept either "data:image/xxx;base64,AAAA..." or just "AAAA..."
  let mime = fallbackMime;
  let base64 = src;

  if (src.startsWith("data:")) {
    const [head, body] = src.split(",", 2);
    base64 = body || "";
    const m = head.match(/^data:([^;]+)/);
    if (m) mime = m[1];
  }
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function forceDownloadFromUrl(url: string, filename = "artwork.jpg") {
  // I fetch as blob (handles CORS-enabled URLs)
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  const obj = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = obj;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(obj);
}

function triggerBlobDownload(blob: Blob, filename = "artwork.jpg") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const ResultSection = ({
  originalImage,
  finalImage,
  processingTime,
  onStartOver,
  onTryDifferentStyle,
}: ResultSectionProps) => {
  const [comparisonMode, setComparisonMode] = useState<
    "side-by-side" | "overlay"
  >("side-by-side");
  const [overlayPosition, setOverlayPosition] = useState(50);

  const handleDownload = async () => {
    try {
      if (!finalImage) {
        toast({ title: "No Image", description: "Generate an artwork first." });
        return;
      }

      const filename = `artwork_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.jpg`;

      // I support three cases
      if (
        finalImage.startsWith("http://") ||
        finalImage.startsWith("https://")
      ) {
        await forceDownloadFromUrl(finalImage, filename);
      } else {
        const blob = dataUriOrBase64ToBlob(finalImage);
        triggerBlobDownload(blob, filename);
      }

      toast({
        title: "Download Started",
        description: "Saving your stylized image…",
      });
      console.log("Downloading image…");
    } catch (e) {
      console.error(e);
      toast({
        title: "Download Failed",
        description: "Could not save the image. Try again.",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Share link copied to clipboard!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Your Artwork is Ready!</h2>
        </div>

        {processingTime && (
          <div className="flex items-center justify-center space-x-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Processed in {processingTime.toFixed(1)} seconds
            </span>
          </div>
        )}
      </div>

      {/* Comparison Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span>Compare Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={comparisonMode}
            onValueChange={(value) =>
              setComparisonMode(value as "side-by-side" | "overlay")
            }
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="overlay">Overlay</TabsTrigger>
            </TabsList>

            <TabsContent value="side-by-side" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 text-center">
                    Original Photo
                  </h4>
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    {originalImage && (
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 text-center">
                    Stylized Artwork
                  </h4>
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 border-teal-200">
                    {finalImage && (
                      <img
                        src={finalImage}
                        alt="Stylized"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overlay" className="mt-6">
              <div className="space-y-4">
                <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden mx-auto max-w-lg">
                  {originalImage && finalImage && (
                    <>
                      <img
                        src={originalImage}
                        alt="Original"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          clipPath: `inset(0 ${100 - overlayPosition}% 0 0)`,
                        }}
                      >
                        <img
                          src={finalImage}
                          alt="Stylized"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                        style={{ left: `${overlayPosition}%` }}
                      />
                    </>
                  )}
                </div>

                <div className="max-w-md mx-auto">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlayPosition}
                    onChange={(e) => setOverlayPosition(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Original</span>
                    <span>Stylized</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleDownload}
          size="lg"
          className="bg-gradient-to-r from-teal-700 to-purple-700 hover:from-teal-800 hover:to-purple-800 text-white px-8"
          disabled={!finalImage}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Artwork
        </Button>

        <Button
          onClick={onTryDifferentStyle}
          variant="outline"
          size="lg"
          className="border-purple-600 text-slate-800 bg-purple-50 hover:bg-purple-100 hover:text-slate-900 px-8"
        >
          <Palette className="h-5 w-5 mr-2" />
          Try Different Style
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="border-teal-600 text-slate-800 bg-teal-50 hover:bg-teal-100 hover:text-slate-900 px-8"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>

        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="border-slate-400 text-slate-800 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 px-8"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  );
};
