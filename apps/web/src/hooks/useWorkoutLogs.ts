import { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkoutLog } from '@neural-trainer/shared';
import { 
  getWorkoutLogs, 
  deleteWorkoutLog, 
  subscribeToWorkoutLogs,
  getWorkoutLog 
} from '../lib/exerciseFirestore';

export const useWorkoutLogs = (userId: string) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load workout logs
  useEffect(() => {
    if (!userId) return;

    const loadWorkoutLogs = async () => {
      setLoading(true);
      try {
        const result = await getWorkoutLogs(userId);
        if (result.success) {
          setWorkoutLogs(result.data || []);
        }
      } catch (error) {
        console.error('Error loading workout logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutLogs();
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToWorkoutLogs(userId, (logs) => {
      setWorkoutLogs(logs);
    });

    return () => unsubscribe();
  }, [userId]);

  // Delete workout log
  const removeWorkoutLog = useCallback(async (workoutLogId: string) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await deleteWorkoutLog(userId, workoutLogId);
      return result;
    } catch (error) {
      console.error('Error deleting workout log:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Get workout log by ID
  const getWorkoutLogById = useCallback(async (workoutLogId: string) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await getWorkoutLog(userId, workoutLogId);
      return result;
    } catch (error) {
      console.error('Error getting workout log:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWorkouts = workoutLogs.length;
    const totalDuration = workoutLogs.reduce((total, log) => total + log.duration, 0);
    const totalVolume = workoutLogs.reduce((total, log) => {
      return total + log.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0);
    }, 0);
    const totalSets = workoutLogs.reduce((total, log) => total + log.sets.length, 0);

    // This week's workouts
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekWorkouts = workoutLogs.filter(log => 
      new Date(log.completedAt) >= weekAgo
    );

    // This month's workouts
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const thisMonthWorkouts = workoutLogs.filter(log => 
      new Date(log.completedAt) >= monthAgo
    );

    // Average workout duration
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    // Most frequent exercises
    const exerciseFrequency: { [key: string]: number } = {};
    workoutLogs.forEach(log => {
      log.sets.forEach(set => {
        exerciseFrequency[set.exerciseId] = (exerciseFrequency[set.exerciseId] || 0) + 1;
      });
    });

    const mostFrequentExercises = Object.entries(exerciseFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([exerciseId, count]) => ({ exerciseId, count }));

    return {
      totalWorkouts,
      totalDuration,
      totalVolume,
      totalSets,
      thisWeek: thisWeekWorkouts.length,
      thisMonth: thisMonthWorkouts.length,
      avgDuration,
      mostFrequentExercises,
    };
  }, [workoutLogs]);

  // Get recent workouts (last 10)
  const recentWorkouts = useMemo(() => {
    return workoutLogs.slice(0, 10);
  }, [workoutLogs]);

  // Get workouts by date range
  const getWorkoutsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return workoutLogs.filter(log => {
      const logDate = new Date(log.completedAt);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [workoutLogs]);

  // Get workouts by routine
  const getWorkoutsByRoutine = useCallback((routineId: string) => {
    return workoutLogs.filter(log => log.routineId === routineId);
  }, [workoutLogs]);

  return {
    workoutLogs,
    loading,
    removeWorkoutLog,
    getWorkoutLogById,
    stats,
    recentWorkouts,
    getWorkoutsByDateRange,
    getWorkoutsByRoutine,
  };
};
