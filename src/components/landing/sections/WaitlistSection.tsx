'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NeumorphicCard } from '../ui/NeumorphicCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setEmail('');
      setName('');
      setRole('');
      
      toast({
        title: 'Success!',
        description: 'Thank you for joining our waitlist. We\'ll be in touch soon!',
        variant: 'success' as const,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        variant: 'error' as const,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist-section" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Waitlist
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Be among the first to experience the future of brand management
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <NeumorphicCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Your Role / Company (Optional)</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="E.g., Marketing Director at Tech Inc."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Help us understand how we can best serve you.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full py-3 bg-primary hover:bg-primary/90 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </NeumorphicCard>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Already have access?
            </h3>
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary/10"
              onClick={() => {
                const authSection = document.getElementById('auth-section');
                authSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
