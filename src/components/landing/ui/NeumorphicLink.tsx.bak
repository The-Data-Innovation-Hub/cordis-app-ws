import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

const linkVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-[#0089AD] hover:bg-[#006d8f] text-white shadow-[4px_4px_8px_#006d8f,-4px_-4px_8px_#00a5cb] hover:shadow-[2px_2px_4px_#006d8f,-2px_-2px_4px_#00a5cb] active:shadow-[inset_4px_4px_8px_#006d8f,inset_-4px_-4px_8px_#00a5cb]',
        outline: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e] hover:shadow-[2px_2px_4px_#d1d1d1,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1a1a1a,-2px_-2px_4px_#2e2e2e] active:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] dark:active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2e2e2e]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface NeumorphicLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof linkVariants> {}

export function NeumorphicLink({
  className,
  variant,
  size,
  ...props
}: NeumorphicLinkProps) {
  return (
    <Link
      className={cn(linkVariants({ variant, size, className }))}
      {...props}
    />
  );
}
