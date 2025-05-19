import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded border border-gray-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'data-[state=checked]:text-white',
      'transition-all duration-200 ease-in-out',
      'shadow-[3px_3px_6px_#e2e8f0,-3px_-3px_6px_#ffffff]',
      'dark:shadow-[3px_3px_6px_#0f172a,-3px_-3px_6px_#1e293b]',
      'data-[state=checked]:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]',
      'dark:data-[state=checked]:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]',
      'dark:border-gray-700',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

export type { CheckboxProps } from '@radix-ui/react-checkbox';
