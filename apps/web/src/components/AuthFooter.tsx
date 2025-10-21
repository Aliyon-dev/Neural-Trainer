import { motion } from 'framer-motion';

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

export function AuthFooter() {
  return (
    <motion.div 
      className="text-center mt-8"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p 
        className="text-sm text-gray-500 font-bold uppercase tracking-wider font-manrope"
        whileHover={{ scale: 1.05 }}
      >
        TRAIN HARD • STAY FOCUSED • DOMINATE
      </motion.p>
    </motion.div>
  );
}
