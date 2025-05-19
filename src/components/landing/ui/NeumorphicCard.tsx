import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface NeumorphicCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'inset';
  hoverEffect?: boolean;
}

export const NeumorphicCard = forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ className, variant = 'elevated', hoverEffect = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
    
    const variants = {
      elevated: 'bg-white dark:bg-gray-900 shadow-[10px_10px_20px_#e6e6e6,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#1a1a1a,-10px_-10px_20px_#1a1a1a]',
      inset: 'bg-gray-50 dark:bg-gray-800 shadow-[inset_5px_5px_10px_#e6e6e6,inset_-5px_-5px_10px_#ffffff] dark:shadow-[inset_5px_5px_10px_#1a1a1a,inset_-5px_-5px_10px_#333333]',
    };

    const hoverStyles = hoverEffect 
      ? 'hover:shadow-[15px_15px_30px_#e6e6e6,-15px_-15px_30px_#ffffff] dark:hover:shadow-[15px_15px_30px_#1a1a1a,-15px_-15px_30px_#1a1a1a] hover:-translate-y-1'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicCard.displayName = 'NeumorphicCard';
