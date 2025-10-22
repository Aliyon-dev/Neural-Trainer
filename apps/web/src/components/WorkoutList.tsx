import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useWorkouts } from '../hooks/useWorkouts';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const workoutTypeIcons: Record<string, string> = {
  run: '🏃‍♂️',
  cycle: '🚴‍♂️',
  lift: '🏋️‍♂️',
  swim: '🏊‍♂️',
  other: '💪',
};

const workoutTypeLabels: Record<string, string> = {
  run: 'Running',
  cycle: 'Cycling',
  lift: 'Weightlifting',
  swim: 'Swimming',
  other: 'Other',
};

export function WorkoutList() {
  const { user } = useAuth();
  const { workouts, removeWorkout, loading } = useWorkouts(user?.uid || '');

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      const success = await removeWorkout(workoutId);
      if (success) {
        toast.success('Workout deleted successfully');
      } else {
        toast.error('Failed to delete workout');
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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-black/40 border-red-500/30 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">💪</div>
        <h3 className="text-lg font-bold text-white font-manrope mb-2">
          No workouts yet
        </h3>
        <p className="text-gray-400 font-manrope">
          Start tracking your fitness journey by logging your first workout!
        </p>
      </div>
    );
  }

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white font-manrope">
          Recent Workouts
        </h3>
        <Badge variant="secondary" className="bg-red-600/20 text-red-300">
          {workouts.length} total
        </Badge>
      </div>

      <AnimatePresence>
        {recentWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-black/40 border-red-500/30 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {workoutTypeIcons[workout.type]}
                </div>
                <div>
                  <h4 className="font-bold text-white font-manrope">
                    {workoutTypeLabels[workout.type]}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 font-manrope">
                    <span>{formatDuration(workout.duration)}</span>
                    {workout.calories > 0 && (
                      <span>{workout.calories} cal</span>
                    )}
                    <span>{formatDate(workout.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => handleDeleteWorkout(workout.id)}
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
