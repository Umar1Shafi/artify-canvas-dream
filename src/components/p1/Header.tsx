
import React, { useState } from 'react';
import { Palette, Sparkles, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface HeaderProps {
  currentStep: 'upload' | 'stylize' | 'result';
  onStepChange: (step: 'upload' | 'stylize' | 'result') => void;
}

export const Header = ({ currentStep, onStepChange }: HeaderProps) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const steps = [
    { id: 'upload', label: 'Upload & Style', number: 1 },
    { id: 'stylize', label: 'Stylize', number: 2 },
    { id: 'result', label: 'Download', number: 3 }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl shadow-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-800 bg-clip-text text-transparent">
                  ArtMorph
                </h1>
                <p className="text-sm text-slate-600">AI-Powered Style Transfer</p>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${
                    currentStep === step.id 
                      ? 'bg-teal-100 text-teal-700 font-medium' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === step.id 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.number}
                    </div>
                    <span className="text-sm">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-slate-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Dialog open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  How it works
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    <span>How Neural Style Transfer Works</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-slate-700">
                  <p>
                    Neural Style Transfer uses artificial intelligence to combine the content of your photo 
                    with the artistic style of famous paintings.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                      <h4 className="font-medium">Upload Photo</h4>
                      <p className="text-sm text-slate-600 mt-1">Your content image</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                      <h4 className="font-medium">Choose Style</h4>
                      <p className="text-sm text-slate-600 mt-1">Famous artwork style</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                      <h4 className="font-medium">AI Magic</h4>
                      <p className="text-sm text-slate-600 mt-1">Creates artistic fusion</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    The AI preserves the structure and objects from your photo while applying 
                    the colors, textures, and brush strokes from the chosen artwork.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Professional AI Art Tool</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
