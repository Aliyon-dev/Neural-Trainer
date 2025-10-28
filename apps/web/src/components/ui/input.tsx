import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, ...props },
  ref,
) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-cyan-500/30 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-gray-400 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:border-cyan-400/50 focus-visible:shadow-xl focus-visible:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
