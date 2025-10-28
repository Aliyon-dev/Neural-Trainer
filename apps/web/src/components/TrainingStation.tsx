import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export function TrainingStation() {
  const [selectedMood, setSelectedMood] = useState('💪');
  const [energyLevel, setEnergyLevel] = useState(4);
  const [selectedWorkout, setSelectedWorkout] = useState('Weight Lifting');

  const workouts = ['Weight Lifting', 'Running', 'Cycling', 'MMA', 'CrossFit'];
  const moods = [
    { emoji: '💪', label: 'Powerful' },
    { emoji: '🔥', label: 'Intense' },
    { emoji: '⚡', label: 'Energetic' },
    { emoji: '🎯', label: 'Focused' }
  ];

  return (
    <motion.section
      className="bg-black/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-cyan-500/30 mb-16"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-cyan-500 to-blue-300 bg-clip-text text-transparent uppercase"
        variants={itemVariants}
      >
        TRAINING STATION
      </motion.h3>
      {/* New wrapper div to constrain width and center the content.
  - 'max-w-2xl' limits the maximum width.
  - 'mx-auto' centers the block horizontally.
  - 'w-full' ensures it's responsive on small screens.
  - 'px-4' adds horizontal padding for mobile.
*/}
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="flex flex-col gap-12">
          {/* Workout Log */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2 font-manrope">
              <motion.span animate={pulseAnimation}>🏋️</motion.span>
              LOG YOUR SESSION
            </h4>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold mb-3 block text-gray-200 uppercase tracking-wide">
                  TRAINING TYPE
                </label>
                <div className="flex gap-2 flex-wrap">
                  {workouts.map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Badge
                        variant={selectedWorkout === type ? 'default' : 'outline'}
                        className={`cursor-pointer px-3 py-2 font-bold border-cyan-500 backdrop-blur-sm ${selectedWorkout === type
                            ? 'bg-cyan-600 text-white'
                            : 'text-cyan-600 hover:bg-cyan-900/50'
                          }`}
                        onClick={() => setSelectedWorkout(type)}
                      >
                        {type}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-3 block text-gray-200 uppercase tracking-wide">
                  Duration (Minutes)
                </label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    placeholder="45"
                    className="rounded-lg border-cyan-500/30 bg-black/40 text-white focus:border-cyan-500 backdrop-blur-sm"
                  />
                </motion.div>
              </div>

              <div>
                <label className="text-sm font-bold mb-3 block text-gray-200 uppercase tracking-wide">
                  Intensity Level
                </label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    placeholder="8/10"
                    className="rounded-lg border-cyan-500/30 bg-black/40 text-white focus:border-cyan-500 backdrop-blur-sm"
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden"
              >
                <Button className="w-full rounded-lg py-3 text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 backdrop-blur-sm">
                  LOG TRAINING
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Energy & Mindset */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2 font-manrope">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.span>
              Energy & Mindset
            </h4>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold mb-3 block text-gray-200 uppercase tracking-wide">
                  Training Mindset
                </label>
                <div className="flex gap-4 text-4xl justify-center">
                  {moods.map((mood) => (
                    <motion.div
                      key={mood.emoji}
                      className="relative"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className={`cursor-pointer p-3 rounded-2xl transition-all border-2 backdrop-blur-sm ${selectedMood === mood.emoji
                            ? 'bg-cyan-900/50 border-cyan-500 scale-110 shadow-lg shadow-cyan-500/30'
                            : 'border-cyan-500/30 hover:border-cyan-500'
                          }`}
                        onClick={() => setSelectedMood(mood.emoji)}
                        animate={
                          selectedMood === mood.emoji
                            ? {
                              y: [0, -5, 0],
                              transition: { duration: 2, repeat: Infinity },
                            }
                            : {}
                        }
                      >
                        {mood.emoji}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-3 block text-gray-200 uppercase tracking-wide">
                  Power Level
                </label>
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-sm text-gray-300">LOW</span>
                  <div className="flex gap-1 bg-black/40 rounded-full p-1 border border-cyan-500/20 backdrop-blur-sm">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.div
                        key={level}
                        className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-sm font-bold transition-all ${energyLevel >= level
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEnergyLevel(level)}
                        animate={energyLevel === level ? pulseAnimation : {}}
                      >
                        {level}
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">HIGH</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full rounded-lg py-3 text-lg font-bold border-cyan-500 text-cyan-300 hover:bg-cyan-900/50 border-2 backdrop-blur-sm"
                >
                  Save Mindset
                </Button>
              </motion.div>

              {/* Current Status */}
              <motion.div
                className="text-center p-4 bg-cyan-900/30 rounded-xl border border-cyan-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-200 font-bold">
                  Mindset:{' '}
                  <span className="text-cyan-300">
                    {moods.find((m) => m.emoji === selectedMood)?.label}
                  </span>
                  {' • '}
                  Power: <span className="text-cyan-300">{energyLevel}/5</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
