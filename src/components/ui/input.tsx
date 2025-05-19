import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-800 dark:bg-gray-900 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
          'transition-all duration-200 ease-in-out',
          'shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]',
          'dark:shadow-[inset_3px_3px_6px_#0f172a,inset_-3px_-3px_6px_#1e293b]',
          'focus:shadow-[inset_1px_1px_2px_#e2e8f0,inset_-1px_-1px_2px_#ffffff]',
          'dark:focus:shadow-[inset_1px_1px_2px_#0f172a,inset_-1px_-1px_2px_#1e293b]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
