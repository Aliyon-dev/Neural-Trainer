import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();

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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl font-pacifico">N</span>
            </div>
            <h1 className="text-2xl font-bold font-pacifico text-white">Neural Trainer</h1>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-black/40 border-red-500/30 text-white hover:bg-red-600/20 font-manrope"
          >
            Logout
          </Button>
        </motion.header>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex items-center justify-center p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-4xl">
            {/* Welcome Section */}
            <motion.div 
              className="text-center mb-12"
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

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Workouts Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 font-manrope">This Week</span>
                        <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                          0 sessions
                        </Badge>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-manrope"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mood Tracking Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 font-manrope">This Week</span>
                        <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                          0 entries
                        </Badge>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-manrope"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Insights Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 font-manrope">Progress</span>
                        <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                          No data yet
                        </Badge>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-manrope"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

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
          </div>
        </motion.div>
      </div>
    </div>
  );
}

