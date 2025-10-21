import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

interface AuthFormProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export function AuthForm({ title, description, children, footer }: AuthFormProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-black/50 backdrop-blur-md border border-red-500/30 shadow-2xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-black text-red-400 text-center uppercase tracking-wide font-manrope">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400 text-center font-medium font-manrope">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer && (
            <motion.div 
              className="mt-8 text-center border-t border-red-500/20 pt-6"
              variants={itemVariants}
            >
              {footer}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
