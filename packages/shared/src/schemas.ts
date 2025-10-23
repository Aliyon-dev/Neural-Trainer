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

export type User = z.infer<typeof userSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type Motivation = z.infer<typeof motivationSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

