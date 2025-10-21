import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithEmail, signUpWithEmail, signOutUser } from '../lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      
      toast.success('Logged out successfully');
    } catch (error) {
      // Error already handled above
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

