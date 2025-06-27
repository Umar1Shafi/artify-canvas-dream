
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, Sparkles } from 'lucide-react';

interface PreviewSectionProps {
  contentImage: string;
  selectedStyle: string;
  previewImage: string | null;
  viewMode: 'content' | 'style' | 'output';
  isProcessing: boolean;
}

const styleImages: Record<string, string> = {
  'starry-night': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop',
  'water-lilies': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
  'scream': 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=300&fit=crop',
  'persistence': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop',
  'picasso': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
  'hokusai': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=300&fit=crop',
};

export const PreviewSection = ({
  contentImage,
  selectedStyle,
  previewImage,
  viewMode,
  isProcessing
}: PreviewSectionProps) => {
  
  const getCurrentImage = () => {
    switch (viewMode) {
      case 'content':
        return contentImage;
      case 'style':
        return styleImages[selectedStyle] || contentImage;
      case 'output':
        return previewImage || contentImage;
      default:
        return contentImage;
    }
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'content':
        return 'Original Photo';
      case 'style':
        return 'Reference Style';
      case 'output':
        return 'Stylized Result';
      default:
        return 'Preview';
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-amber-600" />
          <span>{getTitle()}</span>
          {viewMode === 'output' && !isProcessing && previewImage && (
            <Sparkles className="h-4 w-4 text-amber-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-slate-100 rounded-lg overflow-hidden">
          {isProcessing && viewMode === 'output' ? (
            <div className="aspect-video flex flex-col items-center justify-center space-y-4 p-8">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-slate-700">Creating your masterpiece...</p>
                <p className="text-sm text-slate-500">This may take a few moments</p>
              </div>
              <div className="w-full max-w-xs">
                <Progress value={66} className="h-2" />
                <p className="text-xs text-slate-400 mt-1 text-center">Processing high-resolution image</p>
              </div>
            </div>
          ) : (
            <img
              src={getCurrentImage()}
              alt={getTitle()}
              className="w-full aspect-video object-cover"
            />
          )}
          
          {/* Overlay for processing state */}
          {isProcessing && viewMode === 'output' && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          )}
        </div>
        
        {/* Image Info */}
        <div className="mt-4 flex justify-between items-center text-sm text-slate-600">
          <span>Resolution: 512x512px</span>
          {viewMode === 'output' && previewImage && !isProcessing && (
            <span className="text-green-600 font-medium">✓ Ready for download</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
