
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye, Download, Play, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlPanelProps {
  stylizationStrength: number;
  setStylizationStrength: (value: number) => void;
  viewMode: 'content' | 'style' | 'output';
  setViewMode: (mode: 'content' | 'style' | 'output') => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  contentImage: string;
  selectedStyle: string;
  setPreviewImage: (image: string | null) => void;
}

export const ControlPanel = ({
  stylizationStrength,
  setStylizationStrength,
  viewMode,
  setViewMode,
  isProcessing,
  setIsProcessing,
  contentImage,
  selectedStyle,
  setPreviewImage
}: ControlPanelProps) => {
  
  const handleGeneratePreview = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      // In a real app, this would be the result from the API
      setPreviewImage(contentImage); // Using content image as placeholder
      setIsProcessing(false);
    }, 3000);
  };

  const handleDownload = () => {
    // In a real app, this would download the generated image
    console.log('Downloading image...');
  };

  return (
    <Card className="mb-8 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-green-600" />
          <span>Style Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stylization Strength */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Style Strength</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Control the balance between your original photo and the artistic style</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[stylizationStrength]}
              onValueChange={(value) => setStylizationStrength(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>More Content</span>
              <span>{Math.round(stylizationStrength * 100)}%</span>
              <span>More Style</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium">View Mode</label>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'content' | 'style' | 'output')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="text-xs">Original</TabsTrigger>
                <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                <TabsTrigger value="output" className="text-xs">Result</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Actions</label>
            <div className="flex space-x-2">
              <Button
                onClick={handleGeneratePreview}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                disabled={isProcessing}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
