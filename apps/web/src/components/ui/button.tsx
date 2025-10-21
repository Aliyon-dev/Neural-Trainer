import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'outline' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default:
    'bg-black text-white dark:bg-white dark:text-black hover:opacity-90 border border-transparent',
  outline: 'rounded-4xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-900',
  ghost: 'rounded-4xl hover:bg-gray-100 dark:hover:bg-zinc-900',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'ring-offset-background',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
});

