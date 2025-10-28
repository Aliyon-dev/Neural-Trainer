import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileForm } from '../components/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { UserProfile } from '@neural-trainer/shared';
import { getUserProfile, updateUserProfile } from '../lib/firestore';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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

export default function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setUserProfile(result.data || null);
        } else {
          // Create initial profile if none exists
          const initialProfile = {
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUserProfile(initialProfile as UserProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async (data: any) => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      const result = await updateUserProfile(user.uid, data);
      console.log('result', result);
      if (result.success) {
        setUserProfile(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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

  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-6 border-b border-cyan-500/20"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-gray-300 hover:text-cyan-200 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20">
              ← Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-manrope text-white">Profile Settings</h1>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto p-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-cyan-300 text-center font-manrope">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={userProfile || undefined}
                onSubmit={handleSaveProfile}
                isLoading={isSaving}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Profile Info */}
        {userProfile && (
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 backdrop-blur-sm border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-cyan-300 font-manrope">
                  Current Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{userProfile.displayName}</span>
                </div>
                {userProfile.age && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age:</span>
                    <span className="text-white">{userProfile.age}</span>
                  </div>
                )}
                {userProfile.experienceLevel && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white capitalize">{userProfile.experienceLevel}</span>
                  </div>
                )}
                {userProfile.fitnessGoals && userProfile.fitnessGoals.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Goals:</span>
                    <span className="text-white">{userProfile.fitnessGoals.join(', ')}</span>
                  </div>
                )}
                {userProfile.bio && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bio:</span>
                    <span className="text-white text-right max-w-xs">{userProfile.bio}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
