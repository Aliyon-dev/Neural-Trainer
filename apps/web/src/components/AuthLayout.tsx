import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        {/* Dark red overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Animated floating elements */}
      <div className="fixed inset-0 z-1 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full mix-blend-screen filter blur-xl"
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
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-red-800/5 rounded-full mix-blend-screen filter blur-xl"
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {children}
      </div>

      {/* Performance Stats Floating Elements */}
      <motion.div
        className="fixed bottom-8 left-8 text-xs text-gray-500 font-bold uppercase tracking-widest backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-red-500/20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        POWERED BY MY BENEFIT
      </motion.div>

      <motion.div
        className="fixed top-8 right-8 text-xs text-gray-500 font-bold uppercase tracking-widest backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-red-500/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        PERFORMANCE READY
      </motion.div>
    </div>
  );
}
