import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2',
          'text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
          'transition-shadow duration-200',
          'shadow-[3px_3px_6px_#e2e8f0,-3px_-3px_6px_#ffffff]',
          'dark:shadow-[3px_3px_6px_#0f172a,-3px_-3px_6px_#1e293b]',
          'hover:shadow-[2px_2px_4px_#e2e8f0,-2px_-2px_4px_#ffffff]',
          'dark:hover:shadow-[2px_2px_4px_#0f172a,-2px_-2px_4px_#1e293b]',
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
Textarea.displayName = 'Textarea';

export { Textarea };
