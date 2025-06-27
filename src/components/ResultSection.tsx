
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RotateCcw, Share2, Clock, CheckCircle, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResultSectionProps {
  originalImage: string | null;
  finalImage: string | null;
  processingTime: number | null;
  onStartOver: () => void;
}

export const ResultSection = ({
  originalImage,
  finalImage,
  processingTime,
  onStartOver
}: ResultSectionProps) => {
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [overlayPosition, setOverlayPosition] = useState(50);

  const handleDownload = () => {
    // In a real app, this would download the generated image
    toast({
      title: "Download Started",
      description: "Your stylized artwork is being downloaded!",
    });
    console.log('Downloading image...');
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
            <span className="text-sm">Processed in {processingTime.toFixed(1)} seconds</span>
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
          <Tabs value={comparisonMode} onValueChange={(value) => setComparisonMode(value as 'side-by-side' | 'overlay')}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="overlay">Overlay</TabsTrigger>
            </TabsList>
            
            <TabsContent value="side-by-side" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700 text-center">Original Photo</h4>
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
                  <h4 className="font-medium text-slate-700 text-center">Stylized Artwork</h4>
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
                        style={{ clipPath: `inset(0 ${100 - overlayPosition}% 0 0)` }}
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
          className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 text-white px-8"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Artwork
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
        
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Create Another
        </Button>
      </div>
    </div>
  );
};
