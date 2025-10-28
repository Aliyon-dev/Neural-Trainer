import { useState, useEffect, useCallback, useMemo } from 'react';
import { Exercise } from '@neural-trainer/shared';
import { defaultExercises } from '../data/defaultExercises';
import { 
  addCustomExercise, 
  getCustomExercises, 
  deleteCustomExercise, 
  subscribeToCustomExercises 
} from '../lib/exerciseFirestore';

export const useExercises = (userId: string) => {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Get all exercises (default + custom)
  const allExercises = useMemo(() => {
    return [...defaultExercises, ...customExercises];
  }, [customExercises]);

  // Load custom exercises
  useEffect(() => {
    if (!userId) return;

    const loadCustomExercises = async () => {
      setLoading(true);
      try {
        const result = await getCustomExercises(userId);
        if (result.success) {
          setCustomExercises(result.data || []);
        }
      } catch (error) {
        console.error('Error loading custom exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomExercises();
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToCustomExercises(userId, (exercises) => {
      setCustomExercises(exercises);
    });

    return () => unsubscribe();
  }, [userId]);

  // Add custom exercise
  const addExercise = useCallback(async (exercise: Omit<Exercise, 'id'>) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await addCustomExercise(userId, exercise);
      return result;
    } catch (error) {
      console.error('Error adding exercise:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Delete custom exercise
  const removeExercise = useCallback(async (exerciseId: string) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const result = await deleteCustomExercise(userId, exerciseId);
      return result;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      return { success: false, error };
    }
  }, [userId]);

  // Filter exercises by muscle group
  const getExercisesByMuscleGroup = useCallback((muscleGroup: string) => {
    return allExercises.filter(exercise => exercise.muscleGroup === muscleGroup);
  }, [allExercises]);

  // Filter exercises by equipment
  const getExercisesByEquipment = useCallback((equipment: string) => {
    return allExercises.filter(exercise => exercise.equipment === equipment);
  }, [allExercises]);

  // Search exercises by name
  const searchExercises = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return allExercises.filter(exercise => 
      exercise.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [allExercises]);

  // Get unique muscle groups
  const muscleGroups = useMemo(() => {
    const groups = [...new Set(allExercises.map(exercise => exercise.muscleGroup))];
    return groups.sort();
  }, [allExercises]);

  // Get unique equipment types
  const equipmentTypes = useMemo(() => {
    const types = [...new Set(allExercises.map(exercise => exercise.equipment))];
    return types.sort();
  }, [allExercises]);

  return {
    exercises: allExercises,
    customExercises,
    loading,
    addExercise,
    removeExercise,
    getExercisesByMuscleGroup,
    getExercisesByEquipment,
    searchExercises,
    muscleGroups,
    equipmentTypes,
  };
};
