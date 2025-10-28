import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useWorkouts } from '../hooks/useWorkouts';
import { useMoods } from '../hooks/useMoods';
import { useAuth } from '../contexts/AuthContext';

const statCards = [
  {
    id: 'workouts',
    title: 'Workouts This Week',
    icon: '💪',
    getValue: (workouts: any, moods: any) => workouts?.stats?.weekly || 0,
    getSubtext: (workouts: any) => `${workouts?.stats?.weeklyCalories || 0} calories burned`,
    color: 'text-cyan-400',
  },
  {
    id: 'streak',
    title: 'Current Streak',
    icon: '🔥',
    getValue: (workouts: any) => workouts?.streak || 0,
    getSubtext: (workouts: any) => (workouts?.streak || 0) > 0 ? 'Keep it up!' : 'Start your streak!',
    color: 'text-orange-400',
  },
  {
    id: 'mood',
    title: 'Average Mood',
    icon: '😊',
    getValue: (workouts: any, moods: any) => (moods?.stats?.weeklyAverageIntensity || 0).toFixed(1),
    getSubtext: (moods: any) => `${moods?.stats?.weekly || 0} entries this week`,
    color: 'text-green-400',
  },
  {
    id: 'duration',
    title: 'Total Duration',
    icon: '⏱️',
    getValue: (workouts: any) => {
      const weeklyDuration = workouts?.stats?.weeklyDuration || 0;
      const hours = Math.floor(weeklyDuration / 60);
      const minutes = weeklyDuration % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    },
    getSubtext: (workouts: any) => 'This week',
    color: 'text-blue-400',
  },
];

const motivationalMessages = [
  "You're doing great! Keep up the momentum! 🚀",
  "Every workout counts. You're building a stronger you! 💪",
  "Consistency is key. You're on the right track! ⭐",
  "Your dedication is inspiring. Keep going! 🔥",
  "Small steps lead to big changes. You've got this! 🌟",
  "Your future self will thank you for today's effort! 🙌",
  "Progress, not perfection. You're making it happen! 🎯",
  "Every rep, every step, every choice matters! 💯",
];

export function InsightsPanel() {
  const { user } = useAuth();
  const { stats: workoutStats, streak, mostFrequentType } = useWorkouts(user?.uid || '');
  const { stats: moodStats, mostFrequentMood } = useMoods(user?.uid || '');

  const getMotivationalMessage = () => {
    const totalWorkouts = workoutStats?.weekly || 0;
    const moodScore = moodStats?.weeklyAverageIntensity || 0;
    
    if (totalWorkouts >= 5 && moodScore >= 4) {
      return motivationalMessages[0];
    } else if (totalWorkouts >= 3) {
      return motivationalMessages[1];
    } else if (totalWorkouts > 0) {
      return motivationalMessages[2];
    } else {
      return motivationalMessages[7];
    }
  };

  const getProgressPercentage = () => {
    // Calculate progress based on workouts and mood
    const workoutProgress = Math.min(((workoutStats?.weekly || 0) / 7) * 100, 100);
    const moodProgress = Math.min(((moodStats?.weeklyAverageIntensity || 0) / 5) * 100, 100);
    return Math.round((workoutProgress + moodProgress) / 2);
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10"
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white font-manrope mb-2">
            Your Progress
          </h3>
          <div className="text-3xl font-bold text-cyan-400 font-manrope">
            {progressPercentage}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 font-manrope italic">
            "{getMotivationalMessage()}"
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/5 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white font-manrope flex items-center">
                  <span className="text-lg mr-2">{card.icon}</span>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-2xl font-bold ${card.color} font-manrope`}>
                  {card.getValue(workoutStats, moodStats)}
                </div>
                <div className="text-xs text-gray-400 font-manrope mt-1">
                  {card.getSubtext(workoutStats)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-cyan-500/5"
      >
        <h4 className="text-lg font-bold text-white font-manrope mb-3">
          Quick Insights
        </h4>
        
        <div className="space-y-3">
          {mostFrequentType && mostFrequentType !== 'none' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-manrope">Favorite Exercise:</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30">
                {mostFrequentType.charAt(0).toUpperCase() + mostFrequentType.slice(1)}
              </Badge>
            </div>
          )}
          
          {(moodStats?.weekly || 0) > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-manrope">Most Common Mood:</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30">
                {mostFrequentMood}
              </Badge>
            </div>
          )}
          
          {(workoutStats?.weekly || 0) > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-manrope">This Week's Goal:</span>
              <Badge 
                variant="secondary" 
                className={(workoutStats?.weekly || 0) >= 3 ? "bg-green-600/20 text-green-300" : "bg-yellow-600/20 text-yellow-300"}
              >
                {(workoutStats?.weekly || 0) >= 3 ? "Achieved! 🎉" : "Keep going! 💪"}
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
