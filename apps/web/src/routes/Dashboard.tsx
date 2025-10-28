import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { WorkoutModal } from '../components/WorkoutModal';
import { MoodModal } from '../components/MoodModal';
import { WorkoutList } from '../components/WorkoutList';
import { MoodHistory } from '../components/MoodHistory';
import { InsightsPanel } from '../components/InsightsPanel';
import { ExerciseLibrary } from '../components/ExerciseLibrary';
import { RoutineBuilder } from '../components/RoutineBuilder';
import { ActiveWorkout } from '../components/ActiveWorkout';
import { WorkoutHistory } from '../components/WorkoutHistory';
import { useWorkouts } from '../hooks/useWorkouts';
import { useMoods } from '../hooks/useMoods';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

export default function Dashboard() {
  const { user, userProfile, logout } = useAuth();
  const { stats: workoutStats, loading: workoutLoading } = useWorkouts(user?.uid || '');
  const { stats: moodStats, loading: moodLoading } = useMoods(user?.uid || '');
  
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [moodModalOpen, setMoodModalOpen] = useState(false);

  // Show loading state while data is being fetched
  if (workoutLoading || moodLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="flex justify-between items-center p-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl font-pacifico">N</span>
            </div>
            <h1 className="text-2xl font-bold font-pacifico text-white">Neural Trainer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-300 font-manrope">Welcome back,</p>
              <p className="text-lg font-semibold text-white font-manrope">
                {userProfile?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
            </div>
            <Link to="/profile">
              <Button 
                variant="outline"
                className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
              >
                Profile
              </Button>
            </Link>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-600/20 font-manrope"
            >
              Logout
            </Button>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.div 
          className="flex-1 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div 
              className="text-center mb-8"
              variants={itemVariants}
            >
              <h2 className="text-4xl md:text-6xl font-bold font-pacifico text-white mb-4">
                Welcome Back!
              </h2>
              <p className="text-xl text-gray-300 font-manrope mb-2">
                Ready to continue your fitness journey?
              </p>
              <p className="text-lg text-gray-400 font-manrope">
                {user?.email}
              </p>
            </motion.div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                    <TabsTrigger 
                      value="overview" 
                      className="text-gray-300 font-manrope"
                    >
                      📊 Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="exercises" 
                      className="text-gray-300 font-manrope"
                    >
                      💪 Exercises
                    </TabsTrigger>
                    <TabsTrigger 
                      value="routines" 
                      className="text-gray-300 font-manrope"
                    >
                      📋 Routines
                    </TabsTrigger>
                    <TabsTrigger 
                      value="active" 
                      className="text-gray-300 font-manrope"
                    >
                      ⚡ Active
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history" 
                      className="text-gray-300 font-manrope"
                    >
                      📈 History
                    </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <motion.div variants={itemVariants}>
                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Workouts Card */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="text-white font-manrope flex items-center">
                                <span className="text-2xl mr-3">💪</span>
                                Workouts
                              </CardTitle>
                              <CardDescription className="text-gray-400 font-manrope">
                                Track your training sessions
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
                                  <span className="text-sm text-gray-300 font-manrope">This Week</span>
                                  <Badge className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30">
                                    {workoutStats?.weekly || 0} sessions
                                  </Badge>
                                </div>
                                <Button 
                                  onClick={() => setWorkoutModalOpen(true)}
                                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-manrope shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
                                >
                                  Log Workout
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Mood Tracking Card */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="text-white font-manrope flex items-center">
                                <span className="text-2xl mr-3">😊</span>
                                Mood Tracking
                              </CardTitle>
                              <CardDescription className="text-gray-400 font-manrope">
                                Monitor your mental wellness
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
                                  <span className="text-sm text-gray-300 font-manrope">This Week</span>
                                  <Badge className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30">
                                    {moodStats?.weekly || 0} entries
                                  </Badge>
                                </div>
                                <Button 
                                  onClick={() => setMoodModalOpen(true)}
                                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-manrope shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
                                >
                                  Log Mood
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Insights Card */}
                        <motion.div variants={itemVariants}>
                          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
                            <CardHeader>
                              <CardTitle className="text-white font-manrope flex items-center">
                                <span className="text-2xl mr-3">📊</span>
                                Insights
                              </CardTitle>
                              <CardDescription className="text-gray-400 font-manrope">
                                View your progress analytics
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
                                  <span className="text-sm text-gray-300 font-manrope">Progress</span>
                                  <Badge className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30">
                                    {(workoutStats?.weekly || 0) + (moodStats?.weekly || 0)} entries
                                  </Badge>
                                </div>
                                <Button 
                                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-manrope shadow-lg shadow-gray-500/25 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-300"
                                  disabled
                                >
                                  View Analytics
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Workouts */}
                    <motion.div variants={itemVariants}>
                      <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm h-fit">
                        <CardHeader>
                          <CardTitle className="text-white font-manrope flex items-center">
                            <span className="text-2xl mr-3">💪</span>
                            Recent Workouts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <WorkoutList />
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Right Column - Moods */}
                    <motion.div variants={itemVariants}>
                      <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm h-fit">
                        <CardHeader>
                          <CardTitle className="text-white font-manrope flex items-center">
                            <span className="text-2xl mr-3">😊</span>
                            Mood History
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <MoodHistory />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Insights Panel */}
                  <motion.div 
                    className="mt-8"
                    variants={itemVariants}
                  >
                    <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white font-manrope flex items-center">
                          <span className="text-2xl mr-3">📊</span>
                          Your Progress & Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <InsightsPanel />
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Motivation Quote */}
                  <motion.div 
                    className="text-center mt-12"
                    variants={itemVariants}
                  >
                    <blockquote className="text-xl text-gray-300 font-manrope italic">
                      "The only bad workout is the one that didn't happen."
                    </blockquote>
                    <p className="text-sm text-gray-500 font-manrope mt-2">
                      - Anonymous
                    </p>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Exercises Tab */}
              <TabsContent value="exercises" className="mt-6">
                <ExerciseLibrary />
              </TabsContent>

              {/* Routines Tab */}
              <TabsContent value="routines" className="mt-6">
                <RoutineBuilder />
              </TabsContent>

              {/* Active Workout Tab */}
              <TabsContent value="active" className="mt-6">
                <ActiveWorkout />
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-6">
                <WorkoutHistory />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        {/* Modals */}
        <WorkoutModal 
          open={workoutModalOpen} 
          onOpenChange={setWorkoutModalOpen} 
        />
        <MoodModal 
          open={moodModalOpen} 
          onOpenChange={setMoodModalOpen} 
        />
      </div>
    </div>
  );
}

