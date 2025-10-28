import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { AuthFooter } from '../components/AuthFooter';

type SignupFields = { email: string; password: string; confirmPassword: string };

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

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFields>();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch('password', '');
  
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-cyan-500' };
    if (password.length < 8) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 10) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignupFields) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AuthHeader 
          title="Join the Movement"
          subtitle="Start your transformation today"
        />

        <AuthForm
          title="Create Your Account"
          description="Build your legacy • Track your power"
          footer={
            <p className="text-sm text-gray-400 font-medium font-manrope">
              Already have an account?{' '}
              <motion.span whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/login" 
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                >
                  Sign In
                </Link>
              </motion.span>
            </p>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <label className="text-sm font-bold text-gray-300 font-manrope">Email</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...register('email')} 
                  className="w-full"
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <label className="text-sm font-bold text-gray-300 font-manrope">Password</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  {...register('password')} 
                  className="w-full"
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <label className="text-sm font-bold text-gray-300 font-manrope">Confirm Password</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input 
                  type="password" 
                  placeholder="Confirm your password" 
                  {...register('confirmPassword')} 
                  className="w-full"
                />
              </motion.div>
            </motion.div>

            {/* Strength Indicator */}
            <motion.div
              className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm shadow-lg shadow-cyan-500/5"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">PASSWORD STRENGTH</span>
                <span className="text-xs font-black text-cyan-400">MEDIUM</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 text-lg font-bold font-manrope disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Start Training'}
              </Button>
            </motion.div>
          </form>
        </AuthForm>

        <AuthFooter />
      </motion.div>
    </AuthLayout>
  );
}