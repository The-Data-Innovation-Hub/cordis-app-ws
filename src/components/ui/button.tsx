import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all',
    'duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white text-gray-900',
          'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]',
          'dark:bg-gray-800 dark:text-white',
          'dark:shadow-[5px_5px_10px_#0f172a,-5px_-5px_10px_#1e293b]',
          'hover:shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff]',
          'dark:hover:shadow-[3px_3px_6px_#0f172a,-3px_-3px_6px_#1e293b]',
          'active:shadow-[inset_2px_2px_5px_#d1d5db,inset_-2px_-2px_5px_#ffffff]',
          'dark:active:shadow-[inset_2px_2px_5px_#0f172a,inset_-2px_-2px_5px_#1e293b]',
        ],
        primary: [
          'bg-primary text-white',
          'shadow-[5px_5px_10px_rgba(0,137,173,0.3),-5px_-5px_10px_rgba(0,137,173,0.2)]',
          'hover:shadow-[3px_3px_6px_rgba(0,137,173,0.4),-3px_-3px_6px_rgba(0,137,173,0.2)]',
          'active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)]',
          'focus-visible:ring-primary/50',
        ],
        secondary: [
          'bg-gray-100 text-gray-900',
          'dark:bg-gray-800 dark:text-gray-100',
          'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]',
          'dark:shadow-[5px_5px_10px_#0f172a,-5px_-5px_10px_#1e293b]',
          'hover:shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff]',
          'dark:hover:shadow-[3px_3px_6px_#0f172a,-3px_-3px_6px_#1e293b]',
          'active:shadow-[inset_2px_2px_5px_#d1d5db,inset_-2px_-2px_5px_#ffffff]',
          'dark:active:shadow-[inset_2px_2px_5px_#0f172a,inset_-2px_-2px_5px_#1e293b]',
        ],
        outline: [
          'border border-gray-200 bg-transparent',
          'dark:border-gray-700',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          'active:bg-gray-100 dark:active:bg-gray-800/70',
        ],
        ghost: [
          'bg-transparent hover:bg-gray-100',
          'dark:hover:bg-gray-800/50',
          'active:bg-gray-200 dark:active:bg-gray-700/50',
        ],
        error: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'dark:bg-red-700 dark:hover:bg-red-800',
          'focus-visible:ring-red-500/50',
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline',
          'active:text-primary/80',
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          'pointer-events-none opacity-70': isLoading,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
