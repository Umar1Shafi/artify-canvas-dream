import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { UploadSection } from '@/components/UploadSection';
import { StyleGallery } from '@/components/StyleGallery';
import { PreviewSection } from '@/components/PreviewSection';
import { ControlPanel } from '@/components/ControlPanel';
import { ResultSection } from '@/components/ResultSection';
import { HistoryPanel } from '@/components/HistoryPanel';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Upload, Palette, Download } from 'lucide-react';

const Index = () => {
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [stylizationStrength, setStylizationStrength] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'content' | 'style' | 'output'>('output');
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'stylize' | 'result'>('upload');

  const handleStepChange = (step: 'upload' | 'stylize' | 'result') => {
    setCurrentStep(step);
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-50 to-purple-50">
      <Header onStepChange={handleStepChange} currentStep={currentStep} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Step 1: Upload & Style Selection */}
        {currentStep === 'upload' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Transform Your Photos</h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-4">
                Upload your photo and choose an artistic style to create stunning artwork in seconds
              </p>
              <button
                onClick={scrollToHowItWorks}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all duration-200"
              >
                How It Works →
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UploadSection 
                contentImage={contentImage}
                setContentImage={setContentImage}
              />
              <StyleGallery 
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
              />
            </div>

            {contentImage && selectedStyle && (
              <div className="text-center">
                <button
                  onClick={() => handleStepChange('stylize')}
                  className="bg-gradient-to-r from-teal-700 to-purple-700 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-800 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Stylization →
                </button>
              </div>
            )}

            {/* How It Works Section */}
            <div id="how-it-works" className="mt-16 scroll-mt-20">
              <Card className="bg-white/70 backdrop-blur-sm border-teal-200">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center space-x-2">
                      <Lightbulb className="h-6 w-6 text-amber-500" />
                      <span>How Neural Style Transfer Works</span>
                    </h3>
                    <p className="text-slate-600 max-w-3xl mx-auto">
                      Our AI combines the content of your photo with the artistic style of famous paintings, 
                      creating unique artwork that preserves your image while applying artistic techniques.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-teal-50 rounded-lg border border-teal-100">
                      <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">1. Upload Your Photo</h4>
                      <p className="text-sm text-slate-600">
                        Choose any photo - portraits, landscapes, or objects. 
                        The AI will preserve the structure and content of your image.
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Palette className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">2. Choose Artistic Style</h4>
                      <p className="text-sm text-slate-600">
                        Select from famous artworks like Van Gogh's Starry Night or Monet's Water Lilies. 
                        Each style brings unique colors, textures, and brush techniques.
                      </p>
                    </div>
                    
                    <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">3. AI Creates Your Artwork</h4>
                      <p className="text-sm text-slate-600">
                        Our neural network analyzes both images and creates a fusion that maintains 
                        your photo's content while applying the artistic style's visual characteristics.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Stylization Controls */}
        {currentStep === 'stylize' && (
          <div className="space-y-8">
            <ControlPanel
              stylizationStrength={stylizationStrength}
              setStylizationStrength={setStylizationStrength}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              contentImage={contentImage}
              selectedStyle={selectedStyle}
              setPreviewImage={setPreviewImage}
              setFinalImage={setFinalImage}
              setProcessingTime={setProcessingTime}
              onStepChange={handleStepChange}
            />

            <PreviewSection
              contentImage={contentImage}
              selectedStyle={selectedStyle}
              previewImage={previewImage}
              viewMode={viewMode}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 'result' && (
          <div className="space-y-8">
            <ResultSection
              originalImage={contentImage}
              finalImage={finalImage}
              processingTime={processingTime}
              onStartOver={() => {
                setCurrentStep('upload');
                setContentImage(null);
                setSelectedStyle('');
                setPreviewImage(null);
                setFinalImage(null);
              }}
              onTryDifferentStyle={() => {
                setCurrentStep('upload');
                setSelectedStyle('');
                setPreviewImage(null);
                setFinalImage(null);
              }}
            />
          </div>
        )}

        {/* History Panel - Always visible at bottom */}
        <HistoryPanel />
      </main>

      <HowItWorksModal />
    </div>
  );
};

export default Index;
