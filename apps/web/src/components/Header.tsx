import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header 
      className="flex items-center justify-between mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div 
          className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30 backdrop-blur-sm"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white font-bold text-lg">NL</span>
        </motion.div>
        <h1 className="text-3xl font-bold font-pacifico text-white">
          Neural Trainer
        </h1>
      </motion.div>
      <nav className="flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-red-900/50 backdrop-blur-sm">
            <Link to="/login">LOGIN</Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 border-0 backdrop-blur-sm">
            <Link to="/signup">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full"
                whileHover={{ translateX: '200%' }}
                transition={{ duration: 0.8 }}
              />
              GET STARTED
            </Link>
          </Button>
        </motion.div>
      </nav>
    </motion.header>
  );
}
