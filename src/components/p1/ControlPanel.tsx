import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Settings, Eye, Download, Play, Info, Zap, Image } from 'lucide-react';
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
  setFinalImage: (image: string | null) => void;
  setProcessingTime: (time: number) => void;
  onStepChange: (step: 'upload' | 'stylize' | 'result') => void;
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
  setPreviewImage,
  setFinalImage,
  setProcessingTime,
  onStepChange
}: ControlPanelProps) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [resolution, setResolution] = useState(512);
  const [textureWeight, setTextureWeight] = useState(0.5);
  
  const handleQuickPreview = () => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    // Simulate quick preview processing
    setTimeout(() => {
      setPreviewImage(contentImage); // Using content image as placeholder
      setIsProcessing(false);
      const processingTime = (Date.now() - startTime) / 1000;
      console.log(`Quick preview generated in ${processingTime.toFixed(1)}s`);
    }, 2000);
  };

  const handleFullResolution = () => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    // Simulate full resolution processing
    setTimeout(() => {
      setFinalImage(contentImage); // Using content image as placeholder
      setIsProcessing(false);
      const processingTime = (Date.now() - startTime) / 1000;
      setProcessingTime(processingTime);
      onStepChange('result');
    }, 5000);
  };

  return (
    <Card className="mb-8 bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-teal-600" />
            <span>Stylization Controls</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Advanced Mode</span>
            <Switch
              checked={advancedMode}
              onCheckedChange={setAdvancedMode}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Style Strength Control with enhanced tooltip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">α:β Balance (Content vs Style)</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        <strong>α:β Balance</strong> controls the ratio between your original photo (α) and the artistic style (β). 
                        Lower values preserve more of your original photo's content and structure. 
                        Higher values apply more of the artistic style's colors, textures, and brush strokes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm font-medium text-teal-600">
                {Math.round(stylizationStrength * 100)}%
              </span>
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
              <span>More Original (α)</span>
              <span>Balanced</span>
              <span>More Artistic (β)</span>
            </div>
          </div>

          {/* Advanced Controls */}
          {advancedMode && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Advanced Settings</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resolution Control */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Output Resolution</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Higher resolution takes longer but produces better quality</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <select 
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value={256}>256px (Fast)</option>
                    <option value={512}>512px (Recommended)</option>
                    <option value={1024}>1024px (High Quality)</option>
                  </select>
                </div>

                {/* Texture Weight */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Texture Emphasis</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Controls how much texture detail is preserved from the style image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Slider
                    value={[textureWeight]}
                    onValueChange={(value) => setTextureWeight(value[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Preview Mode</label>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'content' | 'style' | 'output')}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                <TabsTrigger value="content" className="text-xs">Original Photo</TabsTrigger>
                <TabsTrigger value="style" className="text-xs">Style Reference</TabsTrigger>
                <TabsTrigger value="output" className="text-xs">Live Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Action Buttons with improved contrast */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleQuickPreview}
              disabled={isProcessing}
              variant="outline"
              className="flex-1 border-teal-600 text-slate-800 bg-teal-50 hover:bg-teal-100 hover:text-slate-900"
            >
              {isProcessing && viewMode === 'output' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2"></div>
                  Processing Preview...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Quick Preview (2s)
                </>
              )}
            </Button>
            
            <Button
              onClick={handleFullResolution}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-teal-700 to-purple-700 hover:from-teal-800 hover:to-purple-800 text-white"
            >
              {isProcessing && viewMode !== 'output' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Masterpiece...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Generate Full Resolution
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Quick preview: ~2 seconds • Full resolution: ~8-15 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
