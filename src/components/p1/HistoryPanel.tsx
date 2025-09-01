
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Clock } from 'lucide-react';

export const HistoryPanel = () => {
  // Mock history data - in a real app this would come from localStorage or a database
  const recentHistory = [
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=150&h=150&fit=crop',
      style: 'Starry Night',
      createdAt: '2 hours ago'
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=150&h=150&fit=crop',
      style: 'Water Lilies',
      createdAt: '1 day ago'
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&h=150&fit=crop',
      style: 'The Scream',
      createdAt: '3 days ago'
    },
    {
      id: 4,
      thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=150&h=150&fit=crop',
      style: 'Cubist View',
      createdAt: '1 week ago'
    }
  ];

  const handleHistoryItemClick = (item: typeof recentHistory[0]) => {
    console.log('Reapplying style:', item.style);
    // In a real app, this would reload the style and settings
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-amber-200 mt-12">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5 text-amber-600" />
          <span>Recent Creations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => handleHistoryItemClick(item)}
                className="group cursor-pointer space-y-2 p-2 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={`${item.style} artwork`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {item.style}
                  </p>
                  <div className="flex items-center justify-center space-x-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Your recent creations will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
