import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
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
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { useRoutines } from '../hooks/useRoutines';
import { useExercises } from '../hooks/useExercises';
import { useAuth } from '../contexts/AuthContext';
import { SetLogger } from './SetLogger';
import { toast } from 'sonner';

export function ActiveWorkout() {
  const { user } = useAuth();
  const { routines, loading: routinesLoading } = useRoutines(user?.uid || '');
  const { exercises } = useExercises(user?.uid || '');
  
  const {
    isActive,
    routine,
    exercises: workoutExercises,
    currentExerciseIndex,
    startedAt,
    notes,
    workoutDuration,
    totalVolume,
    startWorkout,
    startEmptyWorkout,
    addExerciseToWorkout,
    logSet,
    removeLastSet,
    nextExercise,
    previousExercise,
    updateNotes,
    finishWorkout,
    cancelWorkout,
  } = useActiveWorkout(user?.uid || '');

  const [showStartDialog, setShowStartDialog] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<string>('');
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const currentExercise = workoutExercises[currentExerciseIndex];

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    if (selectedRoutine) {
      const routine = routines.find(r => r.id === selectedRoutine);
      if (routine) {
        startWorkout(routine, exercises);
        setShowStartDialog(false);
        toast.success('Workout started!');
      }
    } else {
      startEmptyWorkout();
      setShowStartDialog(false);
      toast.success('Empty workout started!');
    }
  };

  const handleFinishWorkout = async () => {
    const result = await finishWorkout();
    if (result.success) {
      toast.success('Workout completed and saved!');
      setShowFinishDialog(false);
    } else {
      toast.error('Failed to save workout');
    }
  };

  const handleAddExercise = (exerciseId: string, plannedSets: number, plannedReps: number) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      addExerciseToWorkout(exercise, plannedSets, plannedReps);
      toast.success('Exercise added to workout');
    }
  };

  if (!isActive) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-manrope">Active Workout</h2>
          <p className="text-gray-400 font-manrope">
            Start a new workout session
          </p>
        </div>

        {/* Start Workout Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start with Routine */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white font-manrope">Start with Routine</CardTitle>
              <CardDescription className="text-gray-400 font-manrope">
                Begin a workout using a saved routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              {routinesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <motion.div
                    className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : routines.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 font-manrope">No routines available</p>
                  <p className="text-sm text-gray-500 font-manrope">Create a routine first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {routines.slice(0, 3).map((routine) => (
                    <div key={routine.id} className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-xl hover:shadow-cyan-500/15 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-manrope">{routine.name}</h4>
                          <p className="text-sm text-gray-400 font-manrope">
                            {routine.exercises.length} exercises
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedRoutine(routine.id);
                            setShowStartDialog(true);
                          }}
                          className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Empty Workout */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white font-manrope">Start Empty Workout</CardTitle>
              <CardDescription className="text-gray-400 font-manrope">
                Begin a workout and add exercises as you go
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setSelectedRoutine('');
                  setShowStartDialog(true);
                }}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
              >
                Start Empty Workout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Start Workout Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="bg-gray-950 border-cyan-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-manrope text-white">
                Start Workout
              </DialogTitle>
              <DialogDescription className="text-gray-400 font-manrope">
                {selectedRoutine ? 'Start workout with selected routine' : 'Start an empty workout'}
              </DialogDescription>
            </DialogHeader>

            {selectedRoutine && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                  <h4 className="text-white font-manrope">
                    {routines.find(r => r.id === selectedRoutine)?.name}
                  </h4>
                  <p className="text-sm text-gray-400 font-manrope">
                    {routines.find(r => r.id === selectedRoutine)?.exercises.length} exercises
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowStartDialog(false)}
                className="flex-1 bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartWorkout}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
              >
                Start Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white font-manrope">
                {routine ? routine.name : 'Empty Workout'}
              </CardTitle>
              <CardDescription className="text-gray-400 font-manrope">
                Started at {startedAt ? new Date(startedAt).toLocaleTimeString() : 'Unknown'}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white font-manrope">
                {formatDuration(workoutDuration)}
              </div>
              <div className="text-sm text-gray-400 font-manrope">Duration</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xl font-bold text-white font-manrope">
                {workoutExercises.length}
              </div>
              <div className="text-sm text-gray-400 font-manrope">Exercises</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xl font-bold text-white font-manrope">
                {workoutExercises.reduce((total, ex) => total + ex.sets.length, 0)}
              </div>
              <div className="text-sm text-gray-400 font-manrope">Sets</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xl font-bold text-white font-manrope">
                {totalVolume.toFixed(0)}
              </div>
              <div className="text-sm text-gray-400 font-manrope">Volume</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      {currentExercise ? (
        <SetLogger
          exercise={currentExercise.exercise}
          completedSets={currentExercise.sets}
          onLogSet={(weight, reps) => logSet(currentExerciseIndex, weight, reps)}
          onRemoveLastSet={() => removeLastSet(currentExerciseIndex)}
          plannedSets={currentExercise.plannedSets}
          plannedReps={currentExercise.plannedReps}
        />
      ) : (
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-white font-manrope mb-2">
              No Exercises Added
            </h3>
            <p className="text-gray-400 font-manrope mb-4">
              Add exercises to your workout to start tracking sets
            </p>
            <AddExerciseDialog onAddExercise={handleAddExercise} />
          </CardContent>
        </Card>
      )}

      {/* Exercise Navigation */}
      {workoutExercises.length > 1 && (
        <Card className="bg-black border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white font-manrope">Exercise Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button
                onClick={previousExercise}
                disabled={currentExerciseIndex === 0}
                className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-manrope disabled:opacity-50"
              >
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-white font-manrope">
                  {currentExerciseIndex + 1} of {workoutExercises.length}
                </div>
                <div className="text-sm text-gray-400 font-manrope">
                  {currentExercise?.exercise.name}
                </div>
              </div>
              
              <Button
                onClick={nextExercise}
                disabled={currentExerciseIndex === workoutExercises.length - 1}
                className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-manrope disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Notes */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white font-manrope">Workout Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about your workout..."
            value={notes}
            onChange={(e) => updateNotes(e.target.value)}
            className="bg-gray-800 border-cyan-500/30 text-white placeholder-gray-400"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Workout Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => setShowFinishDialog(true)}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 font-manrope"
        >
          Finish Workout
        </Button>
        <Button
          onClick={cancelWorkout}
          variant="outline"
          className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
        >
          Cancel Workout
        </Button>
      </div>

      {/* Finish Workout Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="bg-gray-950 border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-manrope text-white">
              Finish Workout
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-manrope">
              Are you sure you want to finish this workout? It will be saved to your history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="text-lg font-bold text-white font-manrope">
                  {formatDuration(workoutDuration)}
                </div>
                <div className="text-sm text-gray-400 font-manrope">Duration</div>
              </div>
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="text-lg font-bold text-white font-manrope">
                  {workoutExercises.reduce((total, ex) => total + ex.sets.length, 0)}
                </div>
                <div className="text-sm text-gray-400 font-manrope">Total Sets</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowFinishDialog(false)}
              className="flex-1 bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinishWorkout}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 font-manrope"
            >
              Finish & Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Exercise Dialog Component
function AddExerciseDialog({ onAddExercise }: { onAddExercise: (exerciseId: string, sets: number, reps: number) => void }) {
  const { exercises } = useExercises('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [plannedSets, setPlannedSets] = useState(3);
  const [plannedReps, setPlannedReps] = useState(10);

  const handleAdd = () => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, plannedSets, plannedReps);
      setSelectedExercise('');
      setPlannedSets(3);
      setPlannedReps(10);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300 font-manrope">Exercise</Label>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="bg-black/50 border-cyan-500/30 text-white">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent className="bg-black border-cyan-500/30">
              {exercises.map(exercise => (
                <SelectItem 
                  key={exercise.id} 
                  value={exercise.id} 
                  className="text-white hover:bg-cyan-900/50"
                >
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 font-manrope">Sets</Label>
          <input
            type="number"
            min="1"
            value={plannedSets}
            onChange={(e) => setPlannedSets(parseInt(e.target.value) || 1)}
            className="w-full p-2 bg-black/50 border border-cyan-500/30 rounded text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 font-manrope">Reps</Label>
          <input
            type="number"
            min="1"
            value={plannedReps}
            onChange={(e) => setPlannedReps(parseInt(e.target.value) || 1)}
            className="w-full p-2 bg-black/50 border border-cyan-500/30 rounded text-white"
          />
        </div>
      </div>

      <Button
        onClick={handleAdd}
        disabled={!selectedExercise}
        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope disabled:opacity-50"
      >
        Add Exercise
      </Button>
    </div>
  );
}
