import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { TrainingStation } from '../components/TrainingStation';
import { MotivationSection } from '../components/MotivationSection';
import { Footer } from '../components/Footer';

export default function App() {
  return (
    <motion.div 
      className="min-h-screen relative"
      initial="hidden"
      animate="visible"
    >
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-3.jpg"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Animated floating elements */}
      <div className="fixed inset-0 z-1 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-600/10 rounded-full mix-blend-screen filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-screen filter blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        <HeroSection />
        <FeaturesGrid />
        <TrainingStation />
        <MotivationSection />
        <Footer />
      </div>
    </motion.div>
  );
}