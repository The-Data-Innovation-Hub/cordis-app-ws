'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function SignInModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Successfully signed in!',
        variant: 'success' as const,
      });
      
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in. Please try again.',
        variant: 'error' as const,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button 
          variant="outline"
          className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                   bg-white dark:bg-gray-900 text-primary border border-gray-200 dark:border-gray-700
                   hover:shadow-[5px_5px_10px_#e2e8f0,-5px_-5px_10px_#ffffff] 
                   dark:hover:shadow-[5px_5px_10px_#0f172a,-5px_-5px_10px_#1e293b]
                   active:shadow-[inset_3px_3px_6px_#e2e8f0,inset_-3px_-3px_6px_#ffffff]
                   dark:active:shadow-[inset_3px_3px_6px_#0f172a,inset_-3px_-3px_6px_#1e293b]"
        >
          Sign In
        </Button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password">Password</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    toast({
                      title: 'Password Reset',
                      description: 'Check your email for a password reset link.',
                      variant: 'info' as const,
                    });
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  toast({
                    title: 'Sign Up',
                    description: 'Contact us to create an account.',
                    variant: 'info' as const,
                  });
                }}
              >
                Contact us
              </button>
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
