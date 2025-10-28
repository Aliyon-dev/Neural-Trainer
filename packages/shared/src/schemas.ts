import { z } from 'zod';

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  createdAt: z.string(),
});

export const workoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['run', 'cycle', 'lift', 'swim', 'other']),
  duration: z.number().int().positive(),
  calories: z.number().int().nonnegative(),
  timestamp: z.string(),
});

export const moodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  emoji: z.string(),
  intensity: z.number().int().min(1).max(5),
  timestamp: z.string(),
  notes: z.string().optional(),
});

export const motivationSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  tag: z.string().optional(),
  createdAt: z.string(),
});

export const userProfileSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(13).max(120).optional(),
  fitnessGoals: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  photoURL: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Exercise definition
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  muscleGroup: z.enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'other']),
  equipment: z.enum(['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other']),
  isCustom: z.boolean().default(false),
  userId: z.string().optional(), // Only for custom exercises
});

// Routine (saved workout template)
export const routineSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    plannedSets: z.number().int().positive(),
    plannedReps: z.number().int().positive(),
    order: z.number().int(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Set log (individual set within a workout)
export const setLogSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  weight: z.number().nonnegative(),
  reps: z.number().int().positive(),
  order: z.number().int(),
  completedAt: z.string(),
});

// Workout log (completed workout session)
export const workoutLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  routineId: z.string().optional(),
  routineName: z.string().optional(),
  sets: z.array(setLogSchema),
  duration: z.number().int().positive(), // in seconds
  startedAt: z.string(),
  completedAt: z.string(),
  notes: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type Motivation = z.infer<typeof motivationSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type Routine = z.infer<typeof routineSchema>;
export type SetLog = z.infer<typeof setLogSchema>;
export type WorkoutLog = z.infer<typeof workoutLogSchema>;

