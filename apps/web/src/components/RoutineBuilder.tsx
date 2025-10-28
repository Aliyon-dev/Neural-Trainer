import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
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
import { useRoutines } from '../hooks/useRoutines';
import { useExercises } from '../hooks/useExercises';
import { useAuth } from '../contexts/AuthContext';
import { Routine, Exercise } from '@neural-trainer/shared';
import { toast } from 'sonner';

const muscleGroupColors = {
  chest: 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10',
  back: 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10',
  shoulders: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10',
  arms: 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/10',
  legs: 'bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/10',
  core: 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-yellow-500/10',
  cardio: 'bg-gradient-to-r from-pink-600/20 to-rose-600/20 text-pink-300 border border-pink-500/30 shadow-lg shadow-pink-500/10',
  other: 'bg-gradient-to-r from-gray-600/20 to-slate-600/20 text-gray-300 border border-gray-500/30 shadow-lg shadow-gray-500/10',
};

interface RoutineExercise {
  exerciseId: string;
  exercise: Exercise;
  plannedSets: number;
  plannedReps: number;
  order: number;
}

export function RoutineBuilder() {
  const { user } = useAuth();
  const { routines, loading: routinesLoading, addRoutine, removeRoutine } = useRoutines(user?.uid || '');
  const { exercises, loading: exercisesLoading } = useExercises(user?.uid || '');

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [plannedSets, setPlannedSets] = useState(3);
  const [plannedReps, setPlannedReps] = useState(10);

  const loading = routinesLoading || exercisesLoading;

  const handleAddExercise = () => {
    if (!selectedExercise) {
      toast.error('Please select an exercise');
      return;
    }

    const exercise = exercises.find(ex => ex.id === selectedExercise);
    if (!exercise) {
      toast.error('Exercise not found');
      return;
    }

    // Check if exercise is already in routine
    if (routineExercises.some(re => re.exerciseId === selectedExercise)) {
      toast.error('Exercise already added to routine');
      return;
    }

    const newRoutineExercise: RoutineExercise = {
      exerciseId: selectedExercise,
      exercise,
      plannedSets,
      plannedReps,
      order: routineExercises.length,
    };

    setRoutineExercises(prev => [...prev, newRoutineExercise]);
    setSelectedExercise('');
    setPlannedSets(3);
    setPlannedReps(10);
  };

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...routineExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newExercises.length) {
      [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
      // Update order values
      newExercises.forEach((ex, i) => {
        ex.order = i;
      });
      setRoutineExercises(newExercises);
    }
  };

  const handleCreateRoutine = async () => {
    if (!routineName.trim()) {
      toast.error('Routine name is required');
      return;
    }

    if (routineExercises.length === 0) {
      toast.error('Add at least one exercise to the routine');
      return;
    }

    const routineData = {
      name: routineName,
      exercises: routineExercises.map(re => ({
        exerciseId: re.exerciseId,
        plannedSets: re.plannedSets,
        plannedReps: re.plannedReps,
        order: re.order,
      })),
    };

    const result = await addRoutine(routineData);
    if (result.success) {
      toast.success('Routine created successfully!');
      setRoutineName('');
      setRoutineExercises([]);
      setShowCreateDialog(false);
    } else {
      toast.error('Failed to create routine');
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setRoutineName(routine.name);
    
    // Convert routine exercises to RoutineExercise format
    const routineExercisesData: RoutineExercise[] = routine.exercises.map(re => {
      const exercise = exercises.find(ex => ex.id === re.exerciseId);
      return {
        exerciseId: re.exerciseId,
        exercise: exercise!,
        plannedSets: re.plannedSets,
        plannedReps: re.plannedReps,
        order: re.order,
      };
    });
    
    setRoutineExercises(routineExercisesData);
    setShowEditDialog(true);
  };

  const handleUpdateRoutine = async () => {
    if (!editingRoutine) return;

    if (!routineName.trim()) {
      toast.error('Routine name is required');
      return;
    }

    if (routineExercises.length === 0) {
      toast.error('Add at least one exercise to the routine');
      return;
    }

    const routineData = {
      name: routineName,
      exercises: routineExercises.map(re => ({
        exerciseId: re.exerciseId,
        plannedSets: re.plannedSets,
        plannedReps: re.plannedReps,
        order: re.order,
      })),
    };

    const result = await addRoutine(routineData);
    if (result.success) {
      toast.success('Routine updated successfully!');
      setRoutineName('');
      setRoutineExercises([]);
      setEditingRoutine(null);
      setShowEditDialog(false);
    } else {
      toast.error('Failed to update routine');
    }
  };

  const handleDeleteRoutine = async (routineId: string, routineName: string) => {
    if (!confirm(`Are you sure you want to delete "${routineName}"?`)) return;

    const result = await removeRoutine(routineId);
    if (result.success) {
      toast.success('Routine deleted successfully!');
    } else {
      toast.error('Failed to delete routine');
    }
  };

  const resetForm = () => {
    setRoutineName('');
    setRoutineExercises([]);
    setSelectedExercise('');
    setPlannedSets(3);
    setPlannedReps(10);
    setEditingRoutine(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white font-manrope">Routine Builder</h2>
          <p className="text-gray-400 font-manrope">
            Create and manage your workout routines
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
        >
          Create New Routine
        </Button>
      </div>

      {/* Routines List */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white font-manrope">
            Your Routines ({routines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {routines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-manrope">No routines created yet</p>
              <p className="text-sm text-gray-500 font-manrope">Create your first routine to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {routines.map((routine) => (
                <Card key={routine.id} className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-xl hover:shadow-cyan-500/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white font-manrope">{routine.name}</CardTitle>
                        <CardDescription className="text-gray-400 font-manrope">
                          {routine.exercises.length} exercises
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditRoutine(routine)}
                          className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteRoutine(routine.id, routine.name)}
                          className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {routine.exercises.map((routineExercise, index) => {
                        const exercise = exercises.find(ex => ex.id === routineExercise.exerciseId);
                        if (!exercise) return null;
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-400 font-manrope">
                                {index + 1}.
                              </span>
                              <span className="text-white font-manrope">{exercise.name}</span>
                              <Badge className={`${muscleGroupColors[exercise.muscleGroup]} border`}>
                                {exercise.muscleGroup}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400 font-manrope">
                              {routineExercise.plannedSets} sets × {routineExercise.plannedReps} reps
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Routine Dialog */}
      <Dialog open={showCreateDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="bg-gray-950 border-cyan-500/30 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-manrope text-white">
              {showEditDialog ? 'Edit Routine' : 'Create New Routine'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-manrope">
              {showEditDialog ? 'Modify your routine' : 'Build a new workout routine'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Routine Name */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Routine Name</Label>
              <Input
                placeholder="Enter routine name"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="bg-gray-800 border-cyan-500/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Add Exercise */}
            <Card className="bg-gray-950 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white font-manrope">Add Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="space-y-2 md:col-span-5">
                    <Label className="text-gray-300 font-manrope">Exercise</Label>
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
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

                  <div className="space-y-2 md:col-span-3">
                    <Label className="text-gray-300 font-manrope">Sets</Label>
                    <Input
                      type="number"
                      min="1"
                      value={plannedSets}
                      onChange={(e) => setPlannedSets(parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-cyan-500/30 text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-300 font-manrope">Reps</Label>
                    <Input
                      type="number"
                      min="1"
                      value={plannedReps}
                      onChange={(e) => setPlannedReps(parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-cyan-500/30 text-white"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 md:pt-0 pt-2">
                    <Label className="text-gray-300 font-manrope opacity-0">Button</Label>
                    <Button
                      onClick={handleAddExercise}
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Routine Exercises */}
            {routineExercises.length > 0 && (
              <Card className="bg-gray-950 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white font-manrope">
                    Routine Exercises ({routineExercises.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyan-500/30">
                          <TableHead className="text-gray-300 font-manrope w-16">Order</TableHead>
                          <TableHead className="text-gray-300 font-manrope min-w-[200px]">Exercise</TableHead>
                          <TableHead className="text-gray-300 font-manrope w-28">Muscle</TableHead>
                          <TableHead className="text-gray-300 font-manrope w-24">Sets × Reps</TableHead>
                          <TableHead className="text-gray-300 font-manrope w-52">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routineExercises.map((routineExercise, index) => (
                          <TableRow key={index} className="border-cyan-500/30">
                            <TableCell className="text-white font-manrope w-16">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-white font-manrope min-w-[200px]">
                              <div className="min-w-0">
                                {routineExercise.exercise.name}
                              </div>
                            </TableCell>
                          <TableCell className="w-28">
                            <Badge className={`${muscleGroupColors[routineExercise.exercise.muscleGroup]} border text-xs`}>
                              {routineExercise.exercise.muscleGroup}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-manrope w-24">
                            {routineExercise.plannedSets} × {routineExercise.plannedReps}
                          </TableCell>
                          <TableCell className="w-52">
                            <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  onClick={() => handleMoveExercise(index, 'up')}
                                  disabled={index === 0}
                                  className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-manrope px-2 h-8 text-sm"
                                  size="sm"
                                >
                                  ↑
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleMoveExercise(index, 'down')}
                                  disabled={index === routineExercises.length - 1}
                                  className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-manrope px-2 h-8 text-sm"
                                  size="sm"
                                >
                                  ↓
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleRemoveExercise(index)}
                                  className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope px-2.5 h-8 text-xs"
                                  size="sm"
                                >
                                  ×
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowEditDialog(false);
                  resetForm();
                }}
                className="flex-1 bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
              >
                Cancel
              </Button>
              <Button
                onClick={showEditDialog ? handleUpdateRoutine : handleCreateRoutine}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
              >
                {showEditDialog ? 'Update Routine' : 'Create Routine'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
