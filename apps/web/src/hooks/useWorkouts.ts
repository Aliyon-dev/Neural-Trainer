import { useState, useEffect, useCallback, useMemo } from 'react';
import { Workout } from '@neural-trainer/shared';
import { addWorkout, getWorkouts, deleteWorkout, subscribeToWorkouts } from '../lib/firestore';

export const useWorkouts = (userId: string) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Load workouts from Firestore
  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getWorkouts(userId);
      if (result.success) {
        setWorkouts(result.data || []);
      } else {
        console.error('Error loading workouts:', result.error);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add a new workout
  const addWorkoutToFirestore = useCallback(async (workoutData: Omit<Workout, 'id' | 'userId' | 'timestamp'>) => {
    try {
      const workout = {
        ...workoutData,
        userId,
        timestamp: new Date().toISOString(),
      };
      const result = await addWorkout(userId, workout);
      if (result.success) {
        return { ...workout, id: result.id };
      } else {
        throw new Error('Failed to add workout');
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  }, [userId]);

  // Delete a workout
  const removeWorkout = useCallback(async (workoutId: string) => {
    try {
      const result = await deleteWorkout(userId, workoutId);
      return result.success;
    } catch (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
  }, [userId]);

  // Get weekly workouts
  const weeklyWorkouts = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter(w => new Date(w.timestamp) >= weekAgo);
  }, [workouts]);
  
  // Get today's workouts
  const todayWorkouts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return workouts.filter(w => {
      const date = new Date(w.timestamp);
      return date >= today && date < tomorrow;
    });
  }, [workouts]);

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

  // Set up real-time listener
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribe = subscribeToWorkouts(userId, (workouts) => {
      setWorkouts(workouts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    workouts,
    loading,
    addWorkout: addWorkoutToFirestore,
    removeWorkout,
    weeklyWorkouts,
    todayWorkouts,
    stats,
    mostFrequentType: mostFrequentType.type,
    streak,
  };
};
