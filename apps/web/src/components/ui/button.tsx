import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'outline' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default:
    'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300',
  outline: 'border border-cyan-500/30 bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-cyan-300 hover:from-cyan-900/20 hover:to-blue-900/20 hover:text-cyan-200 hover:border-cyan-400/50 backdrop-blur-sm shadow-lg shadow-cyan-500/5 hover:shadow-xl hover:shadow-cyan-500/15 transition-all duration-300',
  ghost: 'text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 hover:text-cyan-200 transition-all duration-300',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'ring-offset-background',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
});

