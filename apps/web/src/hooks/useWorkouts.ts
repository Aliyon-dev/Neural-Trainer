import { useState, useEffect, useCallback } from 'react';
import { Workout } from '@neural-trainer/shared';
import { saveWorkout, getWorkouts, deleteWorkout, getWeeklyWorkouts, getTodayWorkouts } from '../lib/storage';

export const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Load workouts from localStorage
  const loadWorkouts = useCallback(() => {
    try {
      const userWorkouts = getWorkouts(userId);
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add a new workout
  const addWorkout = useCallback((workoutData: Omit<Workout, 'id' | 'userId' | 'timestamp'>) => {
    try {
      const newWorkout = saveWorkout(userId, workoutData);
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  }, [userId]);

  // Delete a workout
  const removeWorkout = useCallback((workoutId: string) => {
    try {
      const success = deleteWorkout(userId, workoutId);
      if (success) {
        setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
      }
      return success;
    } catch (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
  }, [userId]);

  // Get weekly workouts
  const weeklyWorkouts = getWeeklyWorkouts(userId);
  
  // Get today's workouts
  const todayWorkouts = getTodayWorkouts(userId);

  // Calculate statistics
  const stats = {
    total: workouts.length,
    weekly: weeklyWorkouts.length,
    today: todayWorkouts.length,
    totalCalories: workouts.reduce((sum, workout) => sum + workout.calories, 0),
    weeklyCalories: weeklyWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
    todayCalories: todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
    totalDuration: workouts.reduce((sum, workout) => sum + workout.duration, 0),
    weeklyDuration: weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
    todayDuration: todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
  };

  // Get most frequent workout type
  const workoutTypeCounts = workouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentType = Object.entries(workoutTypeCounts).reduce(
    (max, [type, count]) => (count as number) > max.count ? { type, count: count as number } : max,
    { type: 'none', count: 0 }
  );

  // Calculate workout streak
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.timestamp);
      workoutDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  // Load workouts on mount and when userId changes
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  return {
    workouts,
    loading,
    addWorkout,
    removeWorkout,
    weeklyWorkouts,
    todayWorkouts,
    stats,
    mostFrequentType: mostFrequentType.type,
    streak,
  };
};
