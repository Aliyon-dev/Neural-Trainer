import { MotivationCursor } from './MotivationCursor';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export function MotivationSection() {
  return (
    <motion.section 
      className="text-center mb-12"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-3xl font-black mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent uppercase"
        animate={{
          backgroundPosition: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          backgroundSize: '200% 100%',
        }}
      >
        ACTIVATE MOTIVATION
      </motion.h3>
      <motion.p 
        className="text-gray-200 mb-8 text-lg font-medium font-manrope"
        variants={itemVariants}
      >
        HOVER FOR POWER BOOST
      </motion.p>
      <motion.div 
        className="flex justify-center"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <MotivationCursor />
      </motion.div>
    </motion.section>
  );
}
