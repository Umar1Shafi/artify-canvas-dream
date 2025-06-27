
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { UploadSection } from '@/components/UploadSection';
import { StyleGallery } from '@/components/StyleGallery';
import { PreviewSection } from '@/components/PreviewSection';
import { ControlPanel } from '@/components/ControlPanel';

const Index = () => {
  const [contentImage, setContentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [stylizationStrength, setStylizationStrength] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'content' | 'style' | 'output'>('output');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Upload and Style Selection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UploadSection 
            contentImage={contentImage}
            setContentImage={setContentImage}
          />
          <StyleGallery 
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
          />
        </div>

        {/* Control Panel */}
        {contentImage && selectedStyle && (
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
          />
        )}

        {/* Preview Section */}
        {contentImage && selectedStyle && (
          <PreviewSection
            contentImage={contentImage}
            selectedStyle={selectedStyle}
            previewImage={previewImage}
            viewMode={viewMode}
            isProcessing={isProcessing}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
