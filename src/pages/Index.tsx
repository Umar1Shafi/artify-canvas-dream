
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { UploadSection } from '@/components/UploadSection';
import { StyleGallery } from '@/components/StyleGallery';
import { PreviewSection } from '@/components/PreviewSection';
import { ControlPanel } from '@/components/ControlPanel';
import { ResultSection } from '@/components/ResultSection';
import { HistoryPanel } from '@/components/HistoryPanel';
import { HowItWorksModal } from '@/components/HowItWorksModal';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-50 to-purple-50">
      <Header onStepChange={handleStepChange} currentStep={currentStep} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Step 1: Upload & Style Selection */}
        {currentStep === 'upload' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Transform Your Photos</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Upload your photo and choose an artistic style to create stunning artwork in seconds
              </p>
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
                  className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Stylization →
                </button>
              </div>
            )}
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
