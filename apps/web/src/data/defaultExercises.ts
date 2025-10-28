import { Exercise } from '@neural-trainer/shared';

export const defaultExercises: Exercise[] = [
  // Chest exercises
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscleGroup: 'chest',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Press',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    isCustom: false,
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    muscleGroup: 'chest',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'chest-fly',
    name: 'Chest Fly',
    muscleGroup: 'chest',
    equipment: 'dumbbell',
    isCustom: false,
  },

  // Back exercises
  {
    id: 'deadlift',
    name: 'Deadlift',
    muscleGroup: 'back',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'bent-over-row',
    name: 'Bent-over Row',
    muscleGroup: 'back',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    equipment: 'machine',
    isCustom: false,
  },
  {
    id: 'seated-row',
    name: 'Seated Row',
    muscleGroup: 'back',
    equipment: 'cable',
    isCustom: false,
  },

  // Shoulder exercises
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    isCustom: false,
  },
  {
    id: 'front-raises',
    name: 'Front Raises',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    isCustom: false,
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    muscleGroup: 'shoulders',
    equipment: 'dumbbell',
    isCustom: false,
  },

  // Arm exercises
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    muscleGroup: 'arms',
    equipment: 'dumbbell',
    isCustom: false,
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    muscleGroup: 'arms',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'hammer-curls',
    name: 'Hammer Curls',
    muscleGroup: 'arms',
    equipment: 'dumbbell',
    isCustom: false,
  },
  {
    id: 'tricep-extensions',
    name: 'Tricep Extensions',
    muscleGroup: 'arms',
    equipment: 'dumbbell',
    isCustom: false,
  },

  // Leg exercises
  {
    id: 'squats',
    name: 'Squats',
    muscleGroup: 'legs',
    equipment: 'barbell',
    isCustom: false,
  },
  {
    id: 'lunges',
    name: 'Lunges',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'legs',
    equipment: 'machine',
    isCustom: false,
  },
  {
    id: 'leg-curls',
    name: 'Leg Curls',
    muscleGroup: 'legs',
    equipment: 'machine',
    isCustom: false,
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    isCustom: false,
  },

  // Core exercises
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'crunches',
    name: 'Crunches',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    isCustom: false,
  },

  // Cardio exercises
  {
    id: 'running',
    name: 'Running',
    muscleGroup: 'cardio',
    equipment: 'other',
    isCustom: false,
  },
  {
    id: 'cycling',
    name: 'Cycling',
    muscleGroup: 'cardio',
    equipment: 'other',
    isCustom: false,
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    isCustom: false,
  },
  {
    id: 'burpees',
    name: 'Burpees',
    muscleGroup: 'cardio',
    equipment: 'bodyweight',
    isCustom: false,
  },
];
