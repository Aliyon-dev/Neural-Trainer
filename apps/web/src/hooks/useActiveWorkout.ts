import { useState, useEffect, useCallback } from 'react';
import { Exercise, SetLog, Routine } from '@neural-trainer/shared';
import { addWorkoutLog } from '../lib/exerciseFirestore';

interface ActiveWorkoutState {
  isActive: boolean;
  routine: Routine | null;
  exercises: Array<{
    exercise: Exercise;
    sets: SetLog[];
    plannedSets: number;
    plannedReps: number;
    order: number;
  }>;
  currentExerciseIndex: number;
  startedAt: string | null;
  notes: string;
}

const ACTIVE_WORKOUT_KEY = 'neural-trainer-active-workout';

export const useActiveWorkout = (userId: string) => {
  const [workoutState, setWorkoutState] = useState<ActiveWorkoutState>({
    isActive: false,
    routine: null,
    exercises: [],
    currentExerciseIndex: 0,
    startedAt: null,
    notes: '',
  });

  // Load active workout from localStorage on mount
  useEffect(() => {
    const savedWorkout = localStorage.getItem(ACTIVE_WORKOUT_KEY);
    if (savedWorkout) {
      try {
        const parsed = JSON.parse(savedWorkout);
        setWorkoutState(parsed);
      } catch (error) {
        console.error('Error loading active workout:', error);
        localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      }
    }
  }, []);

  // Save workout state to localStorage whenever it changes
  useEffect(() => {
    if (workoutState.isActive) {
      localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workoutState));
    } else {
      localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, [workoutState]);

  // Start workout with routine
  const startWorkout = useCallback((routine: Routine, exercises: Exercise[]) => {
    const workoutExercises = routine.exercises.map(routineExercise => {
      const exercise = exercises.find(ex => ex.id === routineExercise.exerciseId);
      if (!exercise) throw new Error(`Exercise not found: ${routineExercise.exerciseId}`);
      
      return {
        exercise,
        sets: [],
        plannedSets: routineExercise.plannedSets,
        plannedReps: routineExercise.plannedReps,
        order: routineExercise.order,
      };
    });

    setWorkoutState({
      isActive: true,
      routine,
      exercises: workoutExercises,
      currentExerciseIndex: 0,
      startedAt: new Date().toISOString(),
      notes: '',
    });
  }, []);

  // Start empty workout
  const startEmptyWorkout = useCallback(() => {
    setWorkoutState({
      isActive: true,
      routine: null,
      exercises: [],
      currentExerciseIndex: 0,
      startedAt: new Date().toISOString(),
      notes: '',
    });
  }, []);

  // Add exercise to active workout
  const addExerciseToWorkout = useCallback((exercise: Exercise, plannedSets: number, plannedReps: number) => {
    setWorkoutState(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exercise,
          sets: [],
          plannedSets,
          plannedReps,
          order: prev.exercises.length,
        },
      ],
    }));
  }, []);

  // Log a set
  const logSet = useCallback((exerciseIndex: number, weight: number, reps: number) => {
    const setId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSet: SetLog = {
      id: setId,
      exerciseId: workoutState.exercises[exerciseIndex].exercise.id,
      weight,
      reps,
      order: workoutState.exercises[exerciseIndex].sets.length + 1,
      completedAt: new Date().toISOString(),
    };

    setWorkoutState(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => 
        index === exerciseIndex 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      ),
    }));
  }, [workoutState.exercises]);

  // Remove last set for an exercise
  const removeLastSet = useCallback((exerciseIndex: number) => {
    setWorkoutState(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => 
        index === exerciseIndex 
          ? { ...ex, sets: ex.sets.slice(0, -1) }
          : ex
      ),
    }));
  }, []);

  // Move to next exercise
  const nextExercise = useCallback(() => {
    setWorkoutState(prev => ({
      ...prev,
      currentExerciseIndex: Math.min(prev.currentExerciseIndex + 1, prev.exercises.length - 1),
    }));
  }, []);

  // Move to previous exercise
  const previousExercise = useCallback(() => {
    setWorkoutState(prev => ({
      ...prev,
      currentExerciseIndex: Math.max(prev.currentExerciseIndex - 1, 0),
    }));
  }, []);

  // Update notes
  const updateNotes = useCallback((notes: string) => {
    setWorkoutState(prev => ({ ...prev, notes }));
  }, []);

  // Finish workout
  const finishWorkout = useCallback(async () => {
    if (!userId || !workoutState.startedAt) return { success: false, error: 'No user or start time' };

    try {
      const completedAt = new Date().toISOString();
      const duration = Math.floor((new Date(completedAt).getTime() - new Date(workoutState.startedAt).getTime()) / 1000);

      // Collect all sets from all exercises
      const allSets: SetLog[] = [];
      workoutState.exercises.forEach(exercise => {
        allSets.push(...exercise.sets);
      });

      const workoutLog = {
        routineId: workoutState.routine?.id,
        routineName: workoutState.routine?.name,
        sets: allSets,
        duration,
        startedAt: workoutState.startedAt,
        completedAt,
        notes: workoutState.notes,
      };

      const result = await addWorkoutLog(userId, workoutLog);
      
      if (result.success) {
        // Clear active workout
        setWorkoutState({
          isActive: false,
          routine: null,
          exercises: [],
          currentExerciseIndex: 0,
          startedAt: null,
          notes: '',
        });
        localStorage.removeItem(ACTIVE_WORKOUT_KEY);
      }

      return result;
    } catch (error) {
      console.error('Error finishing workout:', error);
      return { success: false, error };
    }
  }, [userId, workoutState]);

  // Cancel workout
  const cancelWorkout = useCallback(() => {
    setWorkoutState({
      isActive: false,
      routine: null,
      exercises: [],
      currentExerciseIndex: 0,
      startedAt: null,
      notes: '',
    });
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
  }, []);

  // Get current exercise
  const currentExercise = workoutState.exercises[workoutState.currentExerciseIndex];

  // Calculate workout duration
  const workoutDuration = workoutState.startedAt 
    ? Math.floor((Date.now() - new Date(workoutState.startedAt).getTime()) / 1000)
    : 0;

  // Calculate total volume
  const totalVolume = workoutState.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((exerciseTotal, set) => {
      return exerciseTotal + (set.weight * set.reps);
    }, 0);
  }, 0);

  return {
    ...workoutState,
    currentExercise,
    workoutDuration,
    totalVolume,
    startWorkout,
    startEmptyWorkout,
    addExerciseToWorkout,
    logSet,
    removeLastSet,
    nextExercise,
    previousExercise,
    updateNotes,
    finishWorkout,
    cancelWorkout,
  };
};
