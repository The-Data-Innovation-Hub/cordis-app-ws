'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { useToast } from './useToast';

const toastVariants = cva(
  'relative w-full flex items-center p-4 rounded-lg shadow-lg overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border',
        success: 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200',
        error: 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200',
        warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
        info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ToastProps = {
  toast: {
    id: string;
    type: 'default' | 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
  };
  onDismiss: (id: string) => void;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toastVariants>;

const Toast = ({ toast, onDismiss, className, variant, ...props }: ToastProps) => {
  const { title, description, id } = toast;

  return (
    <div
      className={cn(
        toastVariants({ variant: variant || toast.type }),
        'animate-in slide-in-from-right-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="ml-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

type ToastViewportProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  children?: React.ReactNode;
};

const ToastViewport = ({
  className,
  position = 'top-right',
  children,
  ...props
}: ToastViewportProps) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={cn(
        'fixed z-[100] flex max-h-screen w-full max-w-[400px] flex-col gap-2',
        positionClasses[position],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type ToasterProps = {
  position?: ToastViewportProps['position'];
};

const Toaster = ({ position = 'top-right' }: ToasterProps) => {
  const { toasts, dismissToast } = useToast();

  return (
    <ToastViewport position={position}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          variant={toast.type}
        />
      ))}
    </ToastViewport>
  );
};

export { Toast, ToastViewport, Toaster };
