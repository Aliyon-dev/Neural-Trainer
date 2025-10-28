import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Exercise, Routine, WorkoutLog, SetLog } from '@neural-trainer/shared';

// Collection references
const getExercisesCollection = (userId: string) => collection(db, 'users', userId, 'exercises');
const getRoutinesCollection = (userId: string) => collection(db, 'users', userId, 'routines');
const getWorkoutLogsCollection = (userId: string) => collection(db, 'users', userId, 'workoutLogs');

// Exercise Operations
export const addCustomExercise = async (userId: string, exercise: Omit<Exercise, 'id'>) => {
  try {
    const exercisesRef = getExercisesCollection(userId);
    const exerciseData = {
      ...exercise,
      isCustom: true,
      userId,
    };
    const docRef = await addDoc(exercisesRef, exerciseData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding custom exercise:', error);
    return { success: false, error };
  }
};

export const getCustomExercises = async (userId: string) => {
  try {
    const exercisesRef = getExercisesCollection(userId);
    const querySnapshot = await getDocs(exercisesRef);
    
    const exercises = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[];
    
    return { success: true, data: exercises };
  } catch (error) {
    console.error('Error getting custom exercises:', error);
    return { success: false, error };
  }
};

export const deleteCustomExercise = async (userId: string, exerciseId: string) => {
  try {
    const exerciseRef = doc(getExercisesCollection(userId), exerciseId);
    await deleteDoc(exerciseRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting custom exercise:', error);
    return { success: false, error };
  }
};

export const subscribeToCustomExercises = (userId: string, callback: (exercises: Exercise[]) => void) => {
  const exercisesRef = getExercisesCollection(userId);
  
  return onSnapshot(exercisesRef, (querySnapshot) => {
    const exercises = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Exercise[];
    callback(exercises);
  });
};

// Routine Operations
export const addRoutine = async (userId: string, routine: Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const routinesRef = getRoutinesCollection(userId);
    const routineData = {
      ...routine,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(routinesRef, routineData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding routine:', error);
    return { success: false, error };
  }
};

export const getRoutines = async (userId: string) => {
  try {
    const routinesRef = getRoutinesCollection(userId);
    const q = query(routinesRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const routines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Routine[];
    
    return { success: true, data: routines };
  } catch (error) {
    console.error('Error getting routines:', error);
    return { success: false, error };
  }
};

export const updateRoutine = async (userId: string, routineId: string, updates: Partial<Routine>) => {
  try {
    const routineRef = doc(getRoutinesCollection(userId), routineId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(routineRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating routine:', error);
    return { success: false, error };
  }
};

export const deleteRoutine = async (userId: string, routineId: string) => {
  try {
    const routineRef = doc(getRoutinesCollection(userId), routineId);
    await deleteDoc(routineRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting routine:', error);
    return { success: false, error };
  }
};

export const subscribeToRoutines = (userId: string, callback: (routines: Routine[]) => void) => {
  const routinesRef = getRoutinesCollection(userId);
  const q = query(routinesRef, orderBy('updatedAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const routines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Routine[];
    callback(routines);
  });
};

// Workout Log Operations
export const addWorkoutLog = async (userId: string, workoutLog: Omit<WorkoutLog, 'id' | 'userId'>) => {
  try {
    const workoutLogsRef = getWorkoutLogsCollection(userId);
    const workoutLogData = {
      ...workoutLog,
      userId,
    };
    const docRef = await addDoc(workoutLogsRef, workoutLogData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding workout log:', error);
    return { success: false, error };
  }
};

export const getWorkoutLogs = async (userId: string) => {
  try {
    const workoutLogsRef = getWorkoutLogsCollection(userId);
    const q = query(workoutLogsRef, orderBy('completedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const workoutLogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as WorkoutLog[];
    
    return { success: true, data: workoutLogs };
  } catch (error) {
    console.error('Error getting workout logs:', error);
    return { success: false, error };
  }
};

export const deleteWorkoutLog = async (userId: string, workoutLogId: string) => {
  try {
    const workoutLogRef = doc(getWorkoutLogsCollection(userId), workoutLogId);
    await deleteDoc(workoutLogRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting workout log:', error);
    return { success: false, error };
  }
};

export const subscribeToWorkoutLogs = (userId: string, callback: (workoutLogs: WorkoutLog[]) => void) => {
  const workoutLogsRef = getWorkoutLogsCollection(userId);
  const q = query(workoutLogsRef, orderBy('completedAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const workoutLogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as WorkoutLog[];
    callback(workoutLogs);
  });
};

// Get workout log by ID
export const getWorkoutLog = async (userId: string, workoutLogId: string) => {
  try {
    const workoutLogRef = doc(getWorkoutLogsCollection(userId), workoutLogId);
    const workoutLogSnap = await getDoc(workoutLogRef);
    
    if (workoutLogSnap.exists()) {
      return { success: true, data: workoutLogSnap.data() as WorkoutLog };
    } else {
      return { success: false, error: 'Workout log not found' };
    }
  } catch (error) {
    console.error('Error getting workout log:', error);
    return { success: false, error };
  }
};
