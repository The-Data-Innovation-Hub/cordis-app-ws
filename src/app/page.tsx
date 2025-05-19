'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HeroSection } from '@/components/landing/sections/HeroSection';
import { ProblemStatementSection } from '@/components/landing/sections/ProblemStatementSection';
import { SolutionSection } from '@/components/landing/sections/SolutionSection';
import { HowItWorksSection } from '@/components/landing/sections/HowItWorksSection';
import { VisionSection } from '@/components/landing/sections/VisionSection';
import { Footer } from '@/components/landing/sections/Footer';

export default function Home() {
  const { toast } = useToast();

  // Check for URL parameters that might indicate a redirect from auth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const message = params.get('message');

    if (status && message) {
      toast({
        title: status === 'success' ? 'Success' : 'Error',
        description: message,
        variant: status === 'success' ? 'success' : 'error',
      });

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Statement Section */}
      <ProblemStatementSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Vision & Mission Section */}
      <VisionSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
