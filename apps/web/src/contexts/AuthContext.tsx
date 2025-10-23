import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithEmail, signUpWithEmail, signOutUser } from '../lib/firebase';
import { createUserProfile, getUserProfile, migrateLocalStorageData } from '../lib/firestore';
import { UserProfile } from '@neural-trainer/shared';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Error message mapping
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load user profile
        try {
          const result = await getUserProfile(user.uid);
          if (result.success) {
            setUserProfile(result.data);
          } else {
            // Create initial profile if none exists
            const initialProfile = {
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await createUserProfile(user.uid, initialProfile);
            setUserProfile(initialProfile as UserProfile);
          }
          
          // Migrate localStorage data to Firestore
          await migrateLocalStorageData(user.uid);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, error } = await signInWithEmail(email, password);
      
      if (error) {
        const errorMessage = getErrorMessage(error.code);
        toast.error(errorMessage);
        throw error;
      }
      
      toast.success('Welcome back!');
    } catch (error) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, error } = await signUpWithEmail(email, password);
      
      if (error) {
        const errorMessage = getErrorMessage(error.code);
        toast.error(errorMessage);
        throw error;
      }
      
      toast.success('Account created successfully!');
    } catch (error) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOutUser();
      
      if (error) {
        const errorMessage = getErrorMessage(error.code);
        toast.error(errorMessage);
        throw error;
      }
      
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.uid) return;
    
    try {
      const result = await updateUserProfile(user.uid, updates);
      if (result.success) {
        setUserProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

