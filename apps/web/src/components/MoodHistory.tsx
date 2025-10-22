import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useMoods } from '../hooks/useMoods';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function MoodHistory() {
  const { user } = useAuth();
  const { moods, removeMood, loading } = useMoods(user?.uid || '');

  const handleDeleteMood = async (moodId: string) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      const success = await removeMood(moodId);
      if (success) {
        toast.success('Mood entry deleted successfully');
      } else {
        toast.error('Failed to delete mood entry');
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'text-red-400';
    if (intensity <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getIntensityBars = (intensity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-3 rounded ${
          i < intensity ? 'bg-red-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-black/40 border-red-500/30 rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (moods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">😊</div>
        <h3 className="text-lg font-bold text-white font-manrope mb-2">
          No mood entries yet
        </h3>
        <p className="text-gray-400 font-manrope">
          Start tracking your mental wellness by logging your first mood!
        </p>
      </div>
    );
  }

  const recentMoods = moods
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white font-manrope">
          Recent Moods
        </h3>
        <Badge variant="secondary" className="bg-red-600/20 text-red-300">
          {moods.length} entries
        </Badge>
      </div>

      <AnimatePresence>
        {recentMoods.map((mood, index) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-black/40 border-red-500/30 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{mood.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-white font-manrope">
                      Mood Entry
                    </span>
                    <div className="flex space-x-1">
                      {getIntensityBars(mood.intensity)}
                    </div>
                    <span className={`text-sm font-manrope ${getIntensityColor(mood.intensity)}`}>
                      {mood.intensity}/5
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 font-manrope">
                    <span>{formatDate(mood.timestamp)}</span>
                    {mood.notes && (
                      <span className="truncate max-w-32" title={mood.notes}>
                        "{mood.notes}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => handleDeleteMood(mood.id)}
                className="px-3 py-1 text-sm bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30 font-manrope"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
