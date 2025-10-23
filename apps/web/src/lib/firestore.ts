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
  where,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Workout, Mood } from '@neural-trainer/shared';

// Collection references
const getUsersCollection = () => collection(db, 'users');
const getWorkoutsCollection = (userId: string) => collection(db, 'users', userId, 'workouts');
const getMoodsCollection = (userId: string) => collection(db, 'users', userId, 'moods');

// User Profile Operations
export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(getUsersCollection(), userId);
    const profile = {
      ...profileData,
      createdAt: Timestamp.now().toString(),
      updatedAt: Timestamp.now().toString(),
    };
    await setDoc(userRef, profile);
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(getUsersCollection(), userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() as UserProfile };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(getUsersCollection(), userId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now().toString(),
    };
    await updateDoc(userRef, updateData);
    return { success: true, data: updateData };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// Workout Operations
export const addWorkout = async (userId: string, workout: Omit<Workout, 'id'>) => {
  try {
    const workoutsRef = getWorkoutsCollection(userId);
    const workoutData = {
      ...workout,
      timestamp: Timestamp.fromDate(new Date(workout.timestamp)),
    };
    const docRef = await addDoc(workoutsRef, workoutData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding workout:', error);
    return { success: false, error };
  }
};

export const getWorkouts = async (userId: string) => {
  try {
    const workoutsRef = getWorkoutsCollection(userId);
    const q = query(workoutsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const workouts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString(),
    })) as Workout[];
    
    return { success: true, data: workouts };
  } catch (error) {
    console.error('Error getting workouts:', error);
    return { success: false, error };
  }
};

export const deleteWorkout = async (userId: string, workoutId: string) => {
  try {
    const workoutRef = doc(getWorkoutsCollection(userId), workoutId);
    await deleteDoc(workoutRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting workout:', error);
    return { success: false, error };
  }
};

export const subscribeToWorkouts = (userId: string, callback: (workouts: Workout[]) => void) => {
  const workoutsRef = getWorkoutsCollection(userId);
  const q = query(workoutsRef, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const workouts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString(),
    })) as Workout[];
    callback(workouts);
  });
};

// Mood Operations
export const addMood = async (userId: string, mood: Omit<Mood, 'id'>) => {
  try {
    const moodsRef = getMoodsCollection(userId);
    const moodData = {
      ...mood,
      timestamp: Timestamp.fromDate(new Date(mood.timestamp)),
    };
    const docRef = await addDoc(moodsRef, moodData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding mood:', error);
    return { success: false, error };
  }
};

export const getMoods = async (userId: string) => {
  try {
    const moodsRef = getMoodsCollection(userId);
    const q = query(moodsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const moods = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString(),
    })) as Mood[];
    
    return { success: true, data: moods };
  } catch (error) {
    console.error('Error getting moods:', error);
    return { success: false, error };
  }
};

export const deleteMood = async (userId: string, moodId: string) => {
  try {
    const moodRef = doc(getMoodsCollection(userId), moodId);
    await deleteDoc(moodRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting mood:', error);
    return { success: false, error };
  }
};

export const subscribeToMoods = (userId: string, callback: (moods: Mood[]) => void) => {
  const moodsRef = getMoodsCollection(userId);
  const q = query(moodsRef, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const moods = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString(),
    })) as Mood[];
    callback(moods);
  });
};

// Data Migration Utilities
export const migrateLocalStorageData = async (userId: string) => {
  try {
    // Check if user has localStorage data
    const workoutKey = `neural-trainer-workouts-${userId}`;
    const moodKey = `neural-trainer-moods-${userId}`;
    
    const storedWorkouts = localStorage.getItem(workoutKey);
    const storedMoods = localStorage.getItem(moodKey);
    
    if (storedWorkouts) {
      const workouts = JSON.parse(storedWorkouts);
      for (const workout of workouts) {
        await addWorkout(userId, workout);
      }
      localStorage.removeItem(workoutKey);
    }
    
    if (storedMoods) {
      const moods = JSON.parse(storedMoods);
      for (const mood of moods) {
        await addMood(userId, mood);
      }
      localStorage.removeItem(moodKey);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
    return { success: false, error };
  }
};
