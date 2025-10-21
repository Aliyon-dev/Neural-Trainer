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

export function Footer() {
  return (
    <motion.footer 
      className="text-center mt-20 text-gray-300"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p 
        whileHover={{ scale: 1.05 }}
        className="text-lg font-bold font-manrope"
      >
        &copy; 2025 NEURAL TRAINER. TRAIN HARD. DOMINATE.
      </motion.p>
    </motion.footer>
  );
}
