
import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadSectionProps {
  contentImage: string | null;
  setContentImage: (image: string | null) => void;
}

export const UploadSection = ({ contentImage, setContentImage }: UploadSectionProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setContentImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setContentImage]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContentImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setContentImage(null);
  };

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-teal-200 hover:border-teal-400 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-teal-600" />
          <span>Upload Your Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contentImage ? (
          <div className="relative group">
            <img
              src={contentImage}
              alt="Content"
              className="w-full h-72 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                Click to change photo
              </span>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center hover:border-teal-400 hover:bg-teal-50/50 transition-colors cursor-pointer h-72 flex flex-col items-center justify-center"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Drop your image here
            </h3>
            <p className="text-slate-500 mb-2">or click to browse from your device</p>
            <p className="text-sm text-slate-400">
              Supports JPG, PNG, WebP • Max size: 10MB
            </p>
          </div>
        )}
        
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {contentImage && (
          <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-sm text-teal-800">
              <strong>Photo uploaded!</strong> Ready to apply artistic style.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
