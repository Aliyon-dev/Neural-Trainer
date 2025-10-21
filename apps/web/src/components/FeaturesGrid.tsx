import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
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

const features = [
  {
    icon: "🏋️",
    title: "POWER TRACKING",
    description: "LOG INTENSITY, WEIGHTS, AND PERFORMANCE METRICS WITH PRECISION.",
    color: "red"
  },
  {
    icon: "⚡",
    title: "ENERGY ANALYTICS",
    description: "MONITOR YOUR POWER OUTPUT AND TRAINING INTENSITY LEVELS.",
    color: "red"
  },
  {
    icon: "📊",
    title: "PERFORMANCE DASHBOARD",
    description: "REAL-TIME INSIGHTS INTO YOUR STRENGTH AND ENDURANCE PROGRESS.",
    color: "red"
  }
];

export function FeaturesGrid() {
  return (
    <motion.section 
      className="grid md:grid-cols-3 gap-8 mb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300 border border-red-500/30 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <motion.div 
                className={`w-14 h-14 bg-red-900/50 rounded-2xl flex items-center justify-center mb-4 border border-red-500/30 backdrop-blur-sm`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl">{feature.icon}</span>
              </motion.div>
              <CardTitle className="text-xl text-red-400 font-manrope font-bold">{feature.title}</CardTitle>
              <CardDescription className="text-base text-gray-300 font-manrope">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  );
}
