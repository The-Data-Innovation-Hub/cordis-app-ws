'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { USER_ROLES, type UserRole } from '@/lib/constants/roles';
import { useAuth } from '@/contexts/auth-context';

export function SignUpModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.USER
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'error' as const,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'error' as const,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password, formData.name, formData.role as UserRole);
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Account created successfully! Please check your email to verify your account.',
        variant: 'success' as const,
      });
      
      setOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: USER_ROLES.USER
      });
      
      // Optionally redirect to a welcome page or dashboard
      // router.push('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create account. Please try again.',
        variant: 'error' as const,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button 
          variant="default"
          className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                   bg-primary text-white border border-primary-600
                   hover:shadow-[5px_5px_10px_rgba(0,137,173,0.2),-5px_-5px_10px_rgba(0,137,173,0.1)] 
                   active:shadow-[inset_3px_3px_6px_rgba(0,137,173,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.1)]"
        >
          Sign Up
        </Button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              Create an Account
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.1)] border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              >
                {Object.entries(USER_ROLES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400" id="signup-dialog-description">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setOpen(false);
                  // You might want to open the sign-in modal here
                  // You can use a context or state management for this
                }}
              >
                Sign In
              </button>
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
