import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
import { useWorkoutLogs } from '../hooks/useWorkoutLogs';
import { useExercises } from '../hooks/useExercises';
import { useAuth } from '../contexts/AuthContext';
import { WorkoutLog, SetLog } from '@neural-trainer/shared';
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

export function WorkoutHistory() {
  const { user } = useAuth();
  const { workoutLogs, loading, removeWorkoutLog, stats } = useWorkoutLogs(user?.uid || '');
  const { exercises } = useExercises(user?.uid || '');
  
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter workouts by search query
  const filteredWorkouts = workoutLogs.filter(workout => 
    workout.routineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteWorkout = async (workoutId: string, workoutName: string) => {
    if (!confirm(`Are you sure you want to delete "${workoutName}"?`)) return;

    const result = await removeWorkoutLog(workoutId);
    if (result.success) {
      toast.success('Workout deleted successfully!');
    } else {
      toast.error('Failed to delete workout');
    }
  };

  const handleViewDetails = (workout: WorkoutLog) => {
    setSelectedWorkout(workout);
    setShowDetailsDialog(true);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Unknown Exercise';
  };

  const getExerciseMuscleGroup = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.muscleGroup || 'other';
  };

  // Group sets by exercise
  const groupSetsByExercise = (sets: SetLog[]) => {
    const grouped: { [key: string]: SetLog[] } = {};
    sets.forEach(set => {
      if (!grouped[set.exerciseId]) {
        grouped[set.exerciseId] = [];
      }
      grouped[set.exerciseId].push(set);
    });
    return grouped;
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
          <h2 className="text-2xl font-bold text-white font-manrope">Workout History</h2>
          <p className="text-gray-400 font-manrope">
            View and manage your completed workouts
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-manrope">{stats.totalWorkouts}</div>
          <div className="text-sm text-gray-400 font-manrope">Total Workouts</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white font-manrope">{stats.thisWeek}</div>
            <div className="text-sm text-gray-400 font-manrope">This Week</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white font-manrope">{stats.thisMonth}</div>
            <div className="text-sm text-gray-400 font-manrope">This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white font-manrope">{formatDuration(stats.avgDuration)}</div>
            <div className="text-sm text-gray-400 font-manrope">Avg Duration</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white font-manrope">{stats.totalVolume.toFixed(0)}</div>
            <div className="text-sm text-gray-400 font-manrope">Total Volume</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-black border-cyan-500/30">
        <CardContent className="p-4">
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-cyan-500/30 text-white placeholder-gray-400 backdrop-blur-sm shadow-lg shadow-cyan-500/5 focus:shadow-xl focus:shadow-cyan-500/20 focus:border-cyan-400/50 transition-all duration-300"
          />
        </CardContent>
      </Card>

      {/* Workouts List */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white font-manrope">
            Workouts ({filteredWorkouts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-manrope">No workouts found</p>
              <p className="text-sm text-gray-500 font-manrope">
                {searchQuery ? 'Try adjusting your search' : 'Complete your first workout to see it here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkouts.map((workout) => {
                const groupedSets = groupSetsByExercise(workout.sets);
                const totalVolume = workout.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
                
                return (
                  <Card key={workout.id} className="bg-gray-950 border-cyan-500/20">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white font-manrope">
                            {workout.routineName || 'Empty Workout'}
                          </CardTitle>
                          <CardDescription className="text-gray-400 font-manrope">
                            {formatDate(workout.completedAt)} • {formatDuration(workout.duration)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(workout)}
                            className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-manrope"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteWorkout(workout.id, workout.routineName || 'Workout')}
                            className="bg-cyan-600/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 font-manrope"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                          <div className="text-lg font-bold text-white font-manrope">
                            {Object.keys(groupedSets).length}
                          </div>
                          <div className="text-sm text-gray-400 font-manrope">Exercises</div>
                        </div>
                        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                          <div className="text-lg font-bold text-white font-manrope">
                            {workout.sets.length}
                          </div>
                          <div className="text-sm text-gray-400 font-manrope">Sets</div>
                        </div>
                        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                          <div className="text-lg font-bold text-white font-manrope">
                            {totalVolume.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-400 font-manrope">Volume</div>
                        </div>
                      </div>
                      
                      {/* Exercise Summary */}
                      <div className="space-y-2">
                        {Object.entries(groupedSets).slice(0, 3).map(([exerciseId, sets]) => {
                          const exerciseName = getExerciseName(exerciseId);
                          const muscleGroup = getExerciseMuscleGroup(exerciseId);
                          const exerciseVolume = sets.reduce((total, set) => total + (set.weight * set.reps), 0);
                          
                          return (
                            <div key={exerciseId} className="flex justify-between items-center p-2 bg-black/30 rounded">
                              <div className="flex items-center space-x-3">
                                <span className="text-white font-manrope">{exerciseName}</span>
                                <Badge className={`${muscleGroupColors[muscleGroup]} border`}>
                                  {muscleGroup}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-400 font-manrope">
                                {sets.length} sets • {exerciseVolume.toFixed(0)} volume
                              </div>
                            </div>
                          );
                        })}
                        {Object.keys(groupedSets).length > 3 && (
                          <div className="text-center text-gray-400 font-manrope">
                            +{Object.keys(groupedSets).length - 3} more exercises
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-gray-950 border-cyan-500/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-manrope text-white">
              {selectedWorkout?.routineName || 'Workout Details'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-manrope">
              {selectedWorkout && formatDate(selectedWorkout.completedAt)} • {selectedWorkout && formatDuration(selectedWorkout.duration)}
            </DialogDescription>
          </DialogHeader>

          {selectedWorkout && (
            <div className="space-y-6">
              {/* Workout Stats */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                  <div className="text-lg font-bold text-white font-manrope">
                    {Object.keys(groupSetsByExercise(selectedWorkout.sets)).length}
                  </div>
                  <div className="text-sm text-gray-400 font-manrope">Exercises</div>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                  <div className="text-lg font-bold text-white font-manrope">
                    {selectedWorkout.sets.length}
                  </div>
                  <div className="text-sm text-gray-400 font-manrope">Sets</div>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                  <div className="text-lg font-bold text-white font-manrope">
                    {selectedWorkout.sets.reduce((total, set) => total + (set.weight * set.reps), 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-400 font-manrope">Volume</div>
                </div>
                <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl p-4 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                  <div className="text-lg font-bold text-white font-manrope">
                    {formatDuration(selectedWorkout.duration)}
                  </div>
                  <div className="text-sm text-gray-400 font-manrope">Duration</div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white font-manrope">Exercise Details</h3>
                {Object.entries(groupSetsByExercise(selectedWorkout.sets)).map(([exerciseId, sets]) => {
                  const exerciseName = getExerciseName(exerciseId);
                  const muscleGroup = getExerciseMuscleGroup(exerciseId);
                  const exerciseVolume = sets.reduce((total, set) => total + (set.weight * set.reps), 0);
                  
                  return (
                    <Card key={exerciseId} className="bg-gray-950 border-cyan-500/20">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-white font-manrope">{exerciseName}</CardTitle>
                            <CardDescription className="text-gray-400 font-manrope">
                              {sets.length} sets • {exerciseVolume.toFixed(0)} volume
                            </CardDescription>
                          </div>
                          <Badge className={`${muscleGroupColors[muscleGroup]} border`}>
                            {muscleGroup}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-cyan-500/30">
                              <TableHead className="text-gray-300 font-manrope">Set</TableHead>
                              <TableHead className="text-gray-300 font-manrope">Weight</TableHead>
                              <TableHead className="text-gray-300 font-manrope">Reps</TableHead>
                              <TableHead className="text-gray-300 font-manrope">Volume</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                          {sets.map((set, index) => (
                            <TableRow key={set.id} className="border-cyan-500/30">
                                <TableCell className="text-white font-manrope">{index + 1}</TableCell>
                                <TableCell className="text-white font-manrope">{set.weight}</TableCell>
                                <TableCell className="text-white font-manrope">{set.reps}</TableCell>
                                <TableCell className="text-white font-manrope">
                                  {set.weight * set.reps}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Notes */}
              {selectedWorkout.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-manrope">Notes</h3>
                  <div className="p-4 bg-black rounded-lg">
                    <p className="text-gray-300 font-manrope">{selectedWorkout.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setShowDetailsDialog(false)}
              className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 font-manrope"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
