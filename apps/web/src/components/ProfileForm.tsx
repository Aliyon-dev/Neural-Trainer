import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'framer-motion';
import { UserProfile } from '@neural-trainer/shared';

const profileFormSchema = z.object({
  displayName: z.string().min(1, 'Name is required'),
  age: z.number().int().min(13).max(120).optional(),
  fitnessGoals: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  bio: z.string().max(500).optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData?: Partial<UserProfile>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

const fitnessGoalOptions = [
  'Weight Loss',
  'Muscle Gain',
  'Endurance',
  'Strength',
  'Flexibility',
  'General Fitness',
  'Sports Performance',
  'Rehabilitation',
];

export function ProfileForm({ initialData, onSubmit, isLoading = false }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: initialData?.displayName || '',
      age: initialData?.age,
      fitnessGoals: initialData?.fitnessGoals || [],
      experienceLevel: initialData?.experienceLevel,
      bio: initialData?.bio || '',
    },
  });

  const selectedGoals = watch('fitnessGoals') || [];

  const toggleFitnessGoal = (goal: string) => {
    const currentGoals = selectedGoals;
    if (currentGoals.includes(goal)) {
      setValue('fitnessGoals', currentGoals.filter(g => g !== goal));
    } else {
      setValue('fitnessGoals', [...currentGoals, goal]);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium text-gray-300">
          Display Name *
        </Label>
        <Input
          id="displayName"
          {...register('displayName')}
          className="bg-black/50 border-cyan-500/30 text-white placeholder-gray-400"
          placeholder="Enter your display name"
        />
        {errors.displayName && (
          <p className="text-sm text-cyan-400">{errors.displayName.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age" className="text-sm font-medium text-gray-300">
          Age (Optional)
        </Label>
        <Input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="bg-black/50 border-cyan-500/30 text-white placeholder-gray-400"
          placeholder="Enter your age"
        />
        {errors.age && (
          <p className="text-sm text-cyan-400">{errors.age.message}</p>
        )}
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-300">
          Experience Level
        </Label>
        <Select
          value={watch('experienceLevel') || ''}
          onValueChange={(value) => setValue('experienceLevel', value as 'beginner' | 'intermediate' | 'advanced')}
        >
          <SelectTrigger className="bg-black/50 border-cyan-500/30 text-white">
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent className="bg-black border-cyan-500/30">
            <SelectItem value="beginner" className="text-white hover:bg-cyan-900/50">
              Beginner
            </SelectItem>
            <SelectItem value="intermediate" className="text-white hover:bg-cyan-900/50">
              Intermediate
            </SelectItem>
            <SelectItem value="advanced" className="text-white hover:bg-cyan-900/50">
              Advanced
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fitness Goals */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-300">
          Fitness Goals
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {fitnessGoalOptions.map((goal) => (
            <motion.button
              key={goal}
              type="button"
              onClick={() => toggleFitnessGoal(goal)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                selectedGoals.includes(goal)
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                  : 'bg-black/50 border-cyan-500/30 text-gray-300 hover:border-cyan-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {goal}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
          Bio (Optional)
        </Label>
        <textarea
          id="bio"
          {...register('bio')}
          rows={4}
          className="w-full p-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
          placeholder="Tell us about yourself and your fitness journey..."
        />
        {errors.bio && (
          <p className="text-sm text-cyan-400">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </motion.div>
    </motion.form>
  );
}
