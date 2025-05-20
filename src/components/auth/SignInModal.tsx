'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { Checkbox } from '@/components/ui/checkbox';


export function SignInModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await signIn(email, password);

      if (!response) {
        // Sign in failed
        setIsLoading(false);
        return;
      }
      
      // Sign in successful
      toast({
        title: 'Success',
        description: 'Successfully signed in! Redirecting...',
        variant: 'default',
      });
      
      // Reset loading state and close modal immediately
      setIsLoading(false);
      setOpen(false);
      
      // Add a small delay and use direct location change to ensure session propagation
      setTimeout(() => {
        // Use absolute URL to ensure proper navigation
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}${redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`}`;
      }, 500);
    } catch (error) {
      // Error is already handled by auth context with toast
      console.error('Sign in error:', error);
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
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
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
                <Link
                  href="/auth/reset-password"
                  onClick={() => setOpen(false)}
                  className="text-sm text-[#0089AD] hover:text-[#0089AD]/80"
                >
                  Forgot password?
                </Link>
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
            
            <div className="flex items-center mt-4">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="text-[#0089AD] focus:ring-[#0089AD]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200
                bg-[#0089AD] hover:bg-[#0089AD]/90 text-white
                hover:shadow-[4px_4px_8px_#006f8b,-4px_-4px_8px_#00a3cf]
                active:shadow-[inset_3px_3px_6px_#006f8b,inset_-3px_-3px_6px_#00a3cf]
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
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
