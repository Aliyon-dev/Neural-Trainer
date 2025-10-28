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
      className="text-xl text-cyan-200 tracking-tight font-manrope relative drop-shadow-lg"
      variants={itemVariants}
      animate={{
        textShadow: [
          "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4",
          "0 0 15px #3b82f6, 0 0 25px #3b82f6, 0 0 35px #3b82f6",
          "0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6",
          "0 0 10px #06b6d4, 0 0 20px #06b6d4, 0 0 30px #06b6d4"
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      Push your limits
    </motion.p>

      <motion.h1 className="text-[6rem] text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text font-pacifico tracking-tight drop-shadow-2xl">
        Neural Trainer
      </motion.h1>
    
      <motion.p 
        className="text-xl text-cyan-200 mb-8 max-w-2xl mx-auto leading-relaxed font-manrope font-medium drop-shadow-lg"
        variants={itemVariants}
      >
        Track your power. Analyze your intensity. Dominate your workouts.
      </motion.p>
      <motion.div 
        className="flex gap-4 justify-center"
        variants={itemVariants}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-blue-600 border-0 font-bold backdrop-blur-sm px-8 py-4 text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40">
            <Link to="/signup">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                initial={false}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">START TRAINING</span>
            </Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 hover:text-cyan-200 font-bold backdrop-blur-sm px-8 py-4 text-lg">
            SEE RESULTS
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
