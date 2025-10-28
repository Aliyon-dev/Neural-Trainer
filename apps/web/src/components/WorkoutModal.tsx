import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useWorkouts } from '../hooks/useWorkouts';
import { useAuth } from '../contexts/AuthContext';

interface WorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WorkoutFormData {
  type: 'run' | 'cycle' | 'lift' | 'swim' | 'other';
  duration: number;
  calories: number;
}

const workoutTypes = [
  { value: 'run', label: 'Running', icon: '🏃‍♂️' },
  { value: 'cycle', label: 'Cycling', icon: '🚴‍♂️' },
  { value: 'lift', label: 'Weightlifting', icon: '🏋️‍♂️' },
  { value: 'swim', label: 'Swimming', icon: '🏊‍♂️' },
  { value: 'other', label: 'Other', icon: '💪' },
];

export function WorkoutModal({ open, onOpenChange }: WorkoutModalProps) {
  const { user } = useAuth();
  const { addWorkout } = useWorkouts(user?.uid || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<WorkoutFormData>({
    defaultValues: {
      type: 'run',
      duration: 30,
      calories: 0,
    }
  });

  const selectedType = watch('type');

  const onSubmit = async (data: WorkoutFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addWorkout({
        type: data.type,
        duration: data.duration,
        calories: data.calories,
      });
      
      toast.success('Workout logged successfully!');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to log workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-950 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-manrope text-white">
            Log New Workout
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-manrope">
            Track your training session and monitor your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Workout Type */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Exercise Type
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as WorkoutFormData['type'])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                {workoutTypes.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    className="text-white hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 focus:bg-gradient-to-r focus:from-cyan-900/20 focus:to-blue-900/20"
                  >
                    <span className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Duration (minutes)
            </Label>
            <Input
              type="number"
              min="1"
              max="300"
              placeholder="30"
              {...register('duration', { 
                required: 'Duration is required',
                min: { value: 1, message: 'Duration must be at least 1 minute' },
                max: { value: 300, message: 'Duration cannot exceed 300 minutes' }
              })}
              className="w-full"
            />
            {errors.duration && (
              <p className="text-sm text-cyan-400 font-manrope">{errors.duration.message}</p>
            )}
          </div>

          {/* Calories */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Calories Burned (optional)
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              {...register('calories', { 
                min: { value: 0, message: 'Calories cannot be negative' }
              })}
              className="w-full"
            />
            {errors.calories && (
              <p className="text-sm text-cyan-400 font-manrope">{errors.calories.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-manrope disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Log Workout'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
