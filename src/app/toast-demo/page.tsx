'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-8">Toast Notifications</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="default"
            onClick={() => {
              toast({
                title: 'Default Toast',
                description: 'This is a default toast notification.',
              });
            }}
          >
            Default Toast
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              toast({
                title: 'Success!',
                description: 'Your action was completed successfully.',
                variant: 'success',
              });
            }}
          >
            Success Toast
          </Button>

          <Button
            variant="error"
            onClick={() => {
              toast({
                title: 'Error!',
                description: 'Something went wrong. Please try again.',
                variant: 'error',
              });
            }}
          >
            Error Toast
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: 'Warning',
                description: 'This action requires your attention.',
                variant: 'warning',
              });
            }}
          >
            Warning Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              toast({
                title: 'Information',
                description: 'Here is some information you might find useful.',
                variant: 'info',
              });
            }}
          >
            Info Toast
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              toast({
                title: 'With Action',
                description: 'This toast has an action button.',
                action: (
                  <Button variant="outline" size="sm">
                    Action
                  </Button>
                ),
              });
            }}
          >
            Toast with Action
          </Button>
        </div>
      </div>
    </div>
  );
}
