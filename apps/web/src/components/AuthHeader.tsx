import { motion } from 'framer-motion';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

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

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <motion.div 
      className="text-center mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30 backdrop-blur-sm border border-cyan-500/30"
        whileHover={{ 
          rotate: 360,
          scale: 1.1 
        }}
        transition={{ duration: 0.5 }}
        variants={itemVariants}
      >
        <span className="text-white font-black text-3xl">NB</span>
      </motion.div>
      <motion.h1 
        className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent uppercase tracking-tight"
        variants={itemVariants}
      >
        {title}
      </motion.h1>
      <motion.p 
        className="text-gray-300 mt-3 font-medium text-lg font-manrope"
        variants={itemVariants}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
