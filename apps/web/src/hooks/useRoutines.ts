import { useState, useEffect, useCallback } from 'react';
import { Routine } from '@neural-trainer/shared';
import { 
  addRoutine, 
  getRoutines, 
  updateRoutine, 
  deleteRoutine, 
  subscribeToRoutines 
} from '../lib/exerciseFirestore';

export const useRoutines = (userId: string) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  // Load routines
  useEffect(() => {
    if (!userId) return;

    const loadRoutines = async () => {
      setLoading(true);
      try {
        const result = await getRoutines(userId);
        if (result.success) {
          setRoutines(result.data || []);
        }
      } catch (error) {
        console.error('Error loading routines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutines();
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToRoutines(userId, (routines) => {
      setRoutines(routines);
    });

    return () => unsubscribe();
  }, [userId]);

  // Add routine
  const addRoutineToUser = useCallback(async (routine: Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await addRoutine(userId, routine);
      return result;
    } catch (error) {
      console.error('Error adding routine:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Update routine
  const updateRoutineForUser = useCallback(async (routineId: string, updates: Partial<Routine>) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await updateRoutine(userId, routineId, updates);
      return result;
    } catch (error) {
      console.error('Error updating routine:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Delete routine
  const removeRoutine = useCallback(async (routineId: string) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await deleteRoutine(userId, routineId);
      return result;
    } catch (error) {
      console.error('Error deleting routine:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Get routine by ID
  const getRoutineById = useCallback((routineId: string) => {
    return routines.find(routine => routine.id === routineId);
  }, [routines]);

  return {
    routines,
    loading,
    addRoutine: addRoutineToUser,
    updateRoutine: updateRoutineForUser,
    removeRoutine,
    getRoutineById,
  };
};
