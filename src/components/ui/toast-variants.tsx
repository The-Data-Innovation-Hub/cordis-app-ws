'use client';

import * as React from 'react';
import { Loader2, WifiOff, Wifi, Sparkles, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { ToastProps } from '@/components/ui/toast';

type ToastInstance = { id: string } & ToastProps;

interface ToastActionProps {
  onAction: () => void;
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader2 className="h-4 w-4" />
  </motion.div>
);

export function ToastAction({ onAction, children }: ToastActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAction}
      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
    >
      {children}
    </motion.button>
  );
}

export function useLoadingToast() {
  const { toast } = useToast();
  
  return async (message: string, promise: Promise<any>) => {
    const toastInstance = toast({
      title: (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          Loading...
        </span>
      ) as unknown as string,
      description: message,
      variant: 'loading',
      duration: Infinity,
    }) as ToastInstance;

    try {
      await promise;
      toast({
        title: 'Success',
        description: 'Operation completed successfully',
        variant: 'success',
        duration: 3000,
      } as unknown as ToastProps);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        variant: 'destructive',
        duration: 5000,
      } as unknown as ToastProps);
    }

    return toastInstance.id;
  };
}

export function useFeatureToast() {
  const { toast } = useToast();
  
  return (feature: { title: string; description: string; action?: () => void }) => {
    toast({
      title: (
        <motion.span
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
          New Feature: {feature.title}
        </motion.span>
      ) as unknown as string,
      description: feature.description,
      variant: 'feature',
      action: feature.action && (
        <ToastAction onAction={feature.action}>Try it now</ToastAction>
      ),
    } as ToastProps);
  };
}

export function useNetworkToast() {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    function onOnline() {
      setIsOnline(true);
      toast({
        title: (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Wifi className="h-4 w-4" />
            Back Online
          </motion.span>
        ) as unknown as string,
        description: 'Your connection has been restored',
        variant: 'online',
      } as ToastProps);
    }

    function onOffline() {
      setIsOnline(false);
      toast({
        title: (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <WifiOff className="h-4 w-4" />
            Offline
          </motion.span>
        ) as unknown as string,
        description: 'Check your internet connection',
        variant: 'offline',
      } as ToastProps);
    }

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [toast]);

  return isOnline;
}

export function useUndoToast() {
  const { toast } = useToast();
  
  return (message: string, undoAction: () => void) => {
    toast({
      description: message,
      action: (
        <ToastAction onAction={undoAction}>
          <motion.span 
            className="flex items-center gap-2"
            initial={{ x: 10 }}
            animate={{ x: 0 }}
          >
            <motion.div
              animate={{ x: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Undo2 className="h-4 w-4" />
            </motion.div>
            Undo
          </motion.span>
        </ToastAction>
      ),
    } as ToastProps);
  };
}
