import { Workout, Mood } from '@neural-trainer/shared';

// Storage keys
const getWorkoutKey = (userId: string) => `neural-trainer-workouts-${userId}`;
const getMoodKey = (userId: string) => `neural-trainer-moods-${userId}`;

// Workout storage functions
export const saveWorkout = (userId: string, workout: Omit<Workout, 'id' | 'userId' | 'timestamp'>): Workout => {
  const newWorkout: Workout = {
    id: crypto.randomUUID(),
    userId,
    timestamp: new Date().toISOString(),
    ...workout,
  };

  const existingWorkouts = getWorkouts(userId);
  const updatedWorkouts = [...existingWorkouts, newWorkout];
  
  localStorage.setItem(getWorkoutKey(userId), JSON.stringify(updatedWorkouts));
  return newWorkout;
};

export const getWorkouts = (userId: string): Workout[] => {
  try {
    const data = localStorage.getItem(getWorkoutKey(userId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading workouts:', error);
    return [];
  }
};

export const deleteWorkout = (userId: string, workoutId: string): boolean => {
  try {
    const workouts = getWorkouts(userId);
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
    localStorage.setItem(getWorkoutKey(userId), JSON.stringify(updatedWorkouts));
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

// Mood storage functions
export const saveMood = (userId: string, mood: Omit<Mood, 'id' | 'userId' | 'timestamp'>): Mood => {
  const newMood: Mood = {
    id: crypto.randomUUID(),
    userId,
    timestamp: new Date().toISOString(),
    ...mood,
  };

  const existingMoods = getMoods(userId);
  const updatedMoods = [...existingMoods, newMood];
  
  localStorage.setItem(getMoodKey(userId), JSON.stringify(updatedMoods));
  return newMood;
};

export const getMoods = (userId: string): Mood[] => {
  try {
    const data = localStorage.getItem(getMoodKey(userId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading moods:', error);
    return [];
  }
};

export const deleteMood = (userId: string, moodId: string): boolean => {
  try {
    const moods = getMoods(userId);
    const updatedMoods = moods.filter(mood => mood.id !== moodId);
    localStorage.setItem(getMoodKey(userId), JSON.stringify(updatedMoods));
    return true;
  } catch (error) {
    console.error('Error deleting mood:', error);
    return false;
  }
};

// Utility functions
export const getWeeklyWorkouts = (userId: string): Workout[] => {
  const workouts = getWorkouts(userId);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return workouts.filter(workout => 
    new Date(workout.timestamp) >= oneWeekAgo
  );
};

export const getWeeklyMoods = (userId: string): Mood[] => {
  const moods = getMoods(userId);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return moods.filter(mood => 
    new Date(mood.timestamp) >= oneWeekAgo
  );
};

export const getTodayWorkouts = (userId: string): Workout[] => {
  const workouts = getWorkouts(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return workouts.filter(workout => {
    const workoutDate = new Date(workout.timestamp);
    return workoutDate >= today && workoutDate < tomorrow;
  });
};

export const getTodayMoods = (userId: string): Mood[] => {
  const moods = getMoods(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return moods.filter(mood => {
    const moodDate = new Date(mood.timestamp);
    return moodDate >= today && moodDate < tomorrow;
  });
};
