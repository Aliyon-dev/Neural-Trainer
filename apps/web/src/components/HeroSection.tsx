import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

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
      duration: 0.5
    }
  }
};

export function HeroSection() {
  return (
    <motion.section 
      className="text-center mb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
    <motion.p
      className="text-xl text-white tracking-tight font-manrope relative"
      variants={itemVariants}
      animate={{
        textShadow: [
          "-1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000, 1px 1px 0 #ff0000, 0 0 5px #ff0000",
          "-2px -2px 0 #ff3333, 2px -2px 0 #ff3333, -2px 2px 0 #ff3333, 2px 2px 0 #ff3333, 0 0 10px #ff3333",
          "-1px -1px 0 #ff6666, 1px -1px 0 #ff6666, -1px 1px 0 #ff6666, 1px 1px 0 #ff6666, 0 0 8px #ff6666",
          "-1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000, 1px 1px 0 #ff0000, 0 0 5px #ff0000"
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      Push your limits
    </motion.p>

      <motion.h1 className="text-[6rem] text-red-600 font-pacifico text-white tracking-tight">
        Neural Trainer
      </motion.h1>
    
      <motion.p 
        className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed font-manrope font-medium"
        variants={itemVariants}
      >
        Track your power. Analyze your intensity. Dominate your workouts.
      </motion.p>
      <motion.div 
        className="flex gap-4 justify-center"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="relative overflow-hidden group bg-gradient-to-r from-red-600 to-red-800 border-0 font-bold backdrop-blur-sm px-8 py-4 text-lg">
            <Link to="/signup">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                initial={false}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">START TRAINING</span>
            </Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className="border-red-500 text-red-300 hover:bg-red-900/50 font-bold backdrop-blur-sm px-8 py-4 text-lg">
            SEE RESULTS
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
