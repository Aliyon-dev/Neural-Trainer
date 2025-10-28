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
import { useExercises } from '../hooks/useExercises';
import { useAuth } from '../contexts/AuthContext';
import { Exercise } from '@neural-trainer/shared';
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

const equipmentIcons = {
  barbell: '🏋️',
  dumbbell: '🏋️‍♂️',
  machine: '🏋️‍♀️',
  bodyweight: '🤸',
  cable: '🔗',
  other: '💪',
};

export function ExerciseLibrary() {
  const { user } = useAuth();
  const { 
    exercises, 
    loading, 
    addExercise, 
    removeExercise, 
    muscleGroups, 
    equipmentTypes 
  } = useExercises(user?.uid || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroup: 'chest' as const,
    equipment: 'barbell' as const,
  });

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment;
    
    return matchesSearch && matchesMuscleGroup && matchesEquipment;
  });

  const handleAddExercise = async () => {
    if (!newExercise.name.trim()) {
      toast.error('Exercise name is required');
      return;
    }

    const result = await addExercise({ ...newExercise, isCustom: true });
    if (result.success) {
      toast.success('Exercise added successfully!');
      setNewExercise({ name: '', muscleGroup: 'chest', equipment: 'barbell' });
      setShowAddDialog(false);
    } else {
      toast.error('Failed to add exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId: string, exerciseName: string) => {
    if (!confirm(`Are you sure you want to delete "${exerciseName}"?`)) return;

    const result = await removeExercise(exerciseId);
    if (result.success) {
      toast.success('Exercise deleted successfully!');
    } else {
      toast.error('Failed to delete exercise');
    }
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
          <h2 className="text-2xl font-bold text-white font-manrope">Exercise Library</h2>
          <p className="text-gray-400 font-manrope">
            Browse and manage your exercise collection
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
        >
          Add Custom Exercise
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-white font-manrope">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Search</Label>
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-cyan-500/30 text-white placeholder-gray-400 backdrop-blur-sm shadow-lg shadow-cyan-500/5 focus:shadow-xl focus:shadow-cyan-500/20 focus:border-cyan-400/50 transition-all duration-300"
              />
            </div>

            {/* Muscle Group Filter */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Muscle Group</Label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                  <SelectItem value="all" className="text-white hover:bg-cyan-900/50">
                    All Muscle Groups
                  </SelectItem>
                  {muscleGroups.map(group => (
                    <SelectItem 
                      key={group} 
                      value={group} 
                      className="text-white hover:bg-cyan-900/50"
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipment Filter */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Equipment</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                  <SelectItem value="all" className="text-white hover:bg-cyan-900/50">
                    All Equipment
                  </SelectItem>
                  {equipmentTypes.map(equipment => (
                    <SelectItem 
                      key={equipment} 
                      value={equipment} 
                      className="text-white hover:bg-cyan-900/50"
                    >
                      {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Table */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-white font-manrope">
            Exercises ({filteredExercises.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-500/30">
                <TableHead className="text-gray-300 font-manrope">Name</TableHead>
                <TableHead className="text-gray-300 font-manrope">Muscle Group</TableHead>
                <TableHead className="text-gray-300 font-manrope">Equipment</TableHead>
                <TableHead className="text-gray-300 font-manrope">Type</TableHead>
                <TableHead className="text-gray-300 font-manrope">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise) => (
                <TableRow key={exercise.id} className="border-cyan-500/30">
                  <TableCell className="text-white font-manrope">
                    {exercise.name}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${muscleGroupColors[exercise.muscleGroup]} border`}
                    >
                      {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-manrope">
                    <span className="flex items-center space-x-2">
                      <span>{equipmentIcons[exercise.equipment]}</span>
                      <span>{exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={exercise.isCustom ? "default" : "secondary"}
                      className={exercise.isCustom ? "bg-cyan-600/20 text-cyan-300" : "bg-gray-600/20 text-gray-300"}
                    >
                      {exercise.isCustom ? 'Custom' : 'Default'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {exercise.isCustom && (
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteExercise(exercise.id, exercise.name)}
                        className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Exercise Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-gray-950 border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-manrope text-white">
              Add Custom Exercise
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-manrope">
              Create your own exercise to add to your library
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Exercise Name</Label>
              <Input
                placeholder="Enter exercise name"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-cyan-500/30 text-white placeholder-gray-400 backdrop-blur-sm shadow-lg shadow-cyan-500/5 focus:shadow-xl focus:shadow-cyan-500/20 focus:border-cyan-400/50 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Muscle Group</Label>
              <Select 
                value={newExercise.muscleGroup} 
                onValueChange={(value) => setNewExercise(prev => ({ ...prev, muscleGroup: value as any }))}
              >
                <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                  {muscleGroups.map(group => (
                    <SelectItem 
                      key={group} 
                      value={group} 
                      className="text-white hover:bg-cyan-900/50"
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 font-manrope">Equipment</Label>
              <Select 
                value={newExercise.equipment} 
                onValueChange={(value) => setNewExercise(prev => ({ ...prev, equipment: value as any }))}
              >
                <SelectTrigger className="bg-gray-800 border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                  {equipmentTypes.map(equipment => (
                    <SelectItem 
                      key={equipment} 
                      value={equipment} 
                      className="text-white hover:bg-cyan-900/50"
                    >
                      {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddExercise}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
              >
                Add Exercise
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
