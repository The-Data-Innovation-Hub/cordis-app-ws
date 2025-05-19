'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { NeumorphicButton } from '../ui/NeumorphicButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: isLogin ? 'Successfully logged in!' : 'Account created successfully!',
        variant: 'success' as const,
      });
      
      // Redirect to dashboard after successful login/signup
      if (isLogin) {
        router.push('/dashboard');
      } else {
        setIsLogin(true); // Switch to login after signup
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'error' as const,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAccount = () => {
    setEmail('test@example.com');
    setPassword('password123');
    
    toast({
      title: 'Test credentials filled',
      description: 'You can now click Sign In to continue with test account.',
      variant: 'default' as const,
    });
  };

  return (
    <section id="auth-section" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <NeumorphicCard className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isLogin ? 'Sign in to your account' : 'Join us today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
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
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
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
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full"
                />
              </div>

              {isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
              )}

              <NeumorphicButton
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </NeumorphicButton>

              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleTestAccount}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary hover:underline"
                  >
                    Use test account
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-primary hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </section>
  );
}
