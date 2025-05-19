'use client';

import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

type FormSubmitHandler<T> = (data: T) => Promise<void> | void;

export function useFormSubmit<T>(
  onSubmit: FormSubmitHandler<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      setIsLoading(true);
      setError(null);

      try {
        await onSubmit(data);
        
        if (options.onSuccess) {
          options.onSuccess(data);
        }

        if (options.successMessage) {
          toast({
            title: 'Success',
            description: options.successMessage,
            variant: 'success',
          });
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        toast({
          title: 'Error',
          description: options.errorMessage || error.message,
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit, options]
  );

  return {
    handleSubmit,
    isLoading,
    error,
  };
}
