import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useMoods } from '../hooks/useMoods';
import { useAuth } from '../contexts/AuthContext';

interface MoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MoodFormData {
  emoji: string;
  intensity: number;
  notes?: string;
}

const moodEmojis = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
];

export function MoodModal({ open, onOpenChange }: MoodModalProps) {
  const { user } = useAuth();
  const { addMood } = useMoods(user?.uid || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [intensity, setIntensity] = useState([3]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MoodFormData>({
    defaultValues: {
      emoji: '😊',
      intensity: 3,
      notes: '',
    }
  });

  const onSubmit = async (data: MoodFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addMood({
        emoji: selectedEmoji,
        intensity: intensity[0],
        notes: data.notes,
      });
      
      toast.success('Mood logged successfully!');
      reset();
      setSelectedEmoji('😊');
      setIntensity([3]);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to log mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedEmoji('😊');
    setIntensity([3]);
    onOpenChange(false);
  };

  const getIntensityLabel = (value: number) => {
    switch (value) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Medium';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-950 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-manrope text-white">
            How are you feeling?
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-manrope">
            Track your mood and mental wellness
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Emoji Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Select your mood
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {moodEmojis.map((mood) => (
                <motion.button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedEmoji(mood.emoji)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedEmoji === mood.emoji
                      ? 'border-cyan-500 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 shadow-lg shadow-cyan-500/25'
                      : 'border-gray-600 bg-gradient-to-r from-gray-800/40 to-gray-700/40 hover:border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl">{mood.emoji}</div>
                  <div className="text-xs text-gray-400 font-manrope mt-1">
                    {mood.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Intensity: {getIntensityLabel(intensity[0])}
            </Label>
            <div className="px-2">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 font-manrope mt-2">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-300 font-manrope">
              Notes (optional)
            </Label>
            <Input
              placeholder="How are you feeling? Any thoughts to share?"
              {...register('notes')}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 font-manrope"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-manrope disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Log Mood'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
