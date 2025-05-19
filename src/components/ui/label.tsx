import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-gray-700 dark:text-gray-300',
        error: 'text-red-600 dark:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1',
        labelVariants({ variant }),
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>
      )}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
