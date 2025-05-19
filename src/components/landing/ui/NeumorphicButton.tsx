import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type NeumorphicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

export const NeumorphicButton = forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseStyles = 'relative rounded-xl p-4 font-medium transition-all duration-200 active:scale-95';
    
    const variants = {
      primary: 'bg-primary text-white shadow-[5px_5px_10px_#006d8a,-5px_-5px_10px_#00a5d1] hover:shadow-[inset_5px_5px_10px_#006d8a,inset_-5px_-5px_10px_#00a5d1]',
      secondary: 'bg-secondary text-white shadow-[5px_5px_10px_#333333,-5px_-5px_10px_#4d4d4d] hover:shadow-[inset_5px_5px_10px_#333333,inset_-5px_-5px_10px_#4d4d4d]',
      outline: 'bg-white dark:bg-gray-900 text-primary border-2 border-primary shadow-[5px_5px_10px_#e6e6e6,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#1a1a1a] hover:shadow-[inset_5px_5px_10px_#e6e6e6,inset_-5px_-5px_10px_#ffffff] dark:hover:shadow-[inset_5px_5px_10px_#1a1a1a,inset_-5px_-5px_10px_#1a1a1a]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeumorphicButton.displayName = 'NeumorphicButton';
