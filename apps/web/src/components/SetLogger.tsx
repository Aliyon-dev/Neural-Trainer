import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SetLog, Exercise } from '@neural-trainer/shared';

interface SetLoggerProps {
  exercise: Exercise;
  completedSets: SetLog[];
  onLogSet: (weight: number, reps: number) => void;
  onRemoveLastSet: () => void;
  plannedSets: number;
  plannedReps: number;
}

export function SetLogger({ 
  exercise, 
  completedSets, 
  onLogSet, 
  onRemoveLastSet, 
  plannedSets, 
  plannedReps 
}: SetLoggerProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleLogSet = () => {
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    if (isNaN(weightNum) || isNaN(repsNum) || weightNum < 0 || repsNum <= 0) {
      return;
    }

    onLogSet(weightNum, repsNum);
    setWeight('');
    setReps('');
  };

  const handleQuickReps = (quickReps: number) => {
    setReps(quickReps.toString());
  };

  const handleQuickWeight = (quickWeight: number) => {
    setWeight(quickWeight.toString());
  };

  const muscleGroupColors = {
    chest: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30',
    back: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
    shoulders: 'bg-green-600/20 text-green-300 border-green-500/30',
    arms: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
    legs: 'bg-orange-600/20 text-orange-300 border-orange-500/30',
    core: 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
    cardio: 'bg-pink-600/20 text-pink-300 border-pink-500/30',
    other: 'bg-gray-600/20 text-gray-300 border-gray-500/30',
  };

  const totalVolume = completedSets.reduce((total, set) => total + (set.weight * set.reps), 0);
  const avgWeight = completedSets.length > 0 
    ? completedSets.reduce((total, set) => total + set.weight, 0) / completedSets.length 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white font-manrope">{exercise.name}</CardTitle>
            <CardDescription className="text-gray-400 font-manrope">
              {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)} • {exercise.muscleGroup}
            </CardDescription>
          </div>
          <Badge className={`${muscleGroupColors[exercise.muscleGroup]} border`}>
            {exercise.muscleGroup}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <div className="text-2xl font-bold text-white font-manrope">
              {completedSets.length}/{plannedSets}
            </div>
            <div className="text-sm text-gray-400 font-manrope">Sets</div>
          </div>
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <div className="text-2xl font-bold text-white font-manrope">
              {totalVolume.toFixed(0)}
            </div>
            <div className="text-sm text-gray-400 font-manrope">Volume</div>
          </div>
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <div className="text-2xl font-bold text-white font-manrope">
              {avgWeight.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400 font-manrope">Avg Weight</div>
          </div>
        </div>

        {/* Set Input */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Weight (lbs/kg)</Label>
              <Input
                type="number"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-cyan-500/30 text-white placeholder-gray-400 backdrop-blur-sm shadow-lg shadow-cyan-500/5 focus:shadow-xl focus:shadow-cyan-500/20 focus:border-cyan-400/50 transition-all duration-300"
              />
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleQuickWeight(parseFloat(weight || '0') - 5)}
                  className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
                >
                  -5
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickWeight(parseFloat(weight || '0') + 5)}
                  className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
                >
                  +5
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Reps</Label>
              <Input
                type="number"
                placeholder="0"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-cyan-500/30 text-white placeholder-gray-400 backdrop-blur-sm shadow-lg shadow-cyan-500/5 focus:shadow-xl focus:shadow-cyan-500/20 focus:border-cyan-400/50 transition-all duration-300"
              />
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleQuickReps(plannedReps)}
                  className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
                >
                  {plannedReps}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickReps(plannedReps + 2)}
                  className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
                >
                  {plannedReps + 2}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleLogSet}
              disabled={!weight || !reps || parseFloat(weight) < 0 || parseInt(reps) <= 0}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope disabled:opacity-50"
            >
              Log Set
            </Button>
            {completedSets.length > 0 && (
              <Button
                variant="outline"
                onClick={onRemoveLastSet}
                className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
              >
                Undo Last
              </Button>
            )}
          </div>
        </div>

        {/* Completed Sets */}
        {completedSets.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-300 font-manrope">Completed Sets</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {completedSets.map((set, index) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400 font-manrope">
                      Set {index + 1}
                    </span>
                    <span className="text-white font-manrope">
                      {set.weight} × {set.reps}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-manrope">
                    {set.weight * set.reps} volume
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
