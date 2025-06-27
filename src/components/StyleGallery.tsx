
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StyleGalleryProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
}

const styles = [
  {
    id: 'starry-night',
    name: 'Starry Night',
    artist: 'Van Gogh Style',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop',
    description: 'Swirling brushstrokes and vibrant blues'
  },
  {
    id: 'water-lilies',
    name: 'Water Lilies',
    artist: 'Monet Style',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    description: 'Impressionist light and color'
  },
  {
    id: 'scream',
    name: 'The Scream',
    artist: 'Munch Style',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=200&fit=crop',
    description: 'Expressionist emotional intensity'
  },
  {
    id: 'persistence',
    name: 'Surreal Dreams',
    artist: 'Dalí Style',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    description: 'Dreamlike surreal elements'
  },
  {
    id: 'picasso',
    name: 'Cubist View',
    artist: 'Picasso Style',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    description: 'Geometric abstraction'
  },
  {
    id: 'hokusai',
    name: 'Great Wave',
    artist: 'Hokusai Style',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=200&fit=crop',
    description: 'Japanese woodblock artistry'
  }
];

export const StyleGallery = ({ selectedStyle, setSelectedStyle }: StyleGalleryProps) => {
  return (
    <Card className="h-full bg-white/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <span>Choose Art Style</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select an artistic style to apply to your photo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {styles.map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                selectedStyle === style.id 
                  ? 'ring-3 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h4 className="text-white text-sm font-medium truncate">
                  {style.name}
                </h4>
                <p className="text-white/80 text-xs truncate">
                  {style.artist}
                </p>
              </div>
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
