import { NeumorphicButton } from '../ui/NeumorphicButton';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Image - Moved to top */}
          <motion.div 
            className="mb-12 md:mb-16 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="relative w-full aspect-video">
              <Image
                src="/Cordis Hero Image.png"
                alt="Cordis AI Platform"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </motion.div>

          {/* Content below image */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Cordis – AI That Powers the{' '}
              <span className="text-primary">Heart of Your Brand</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Transform your brand communication with AI-powered consistency across every touchpoint. 
              Keep your brand's voice, tone, and identity perfectly aligned, always.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeumorphicButton 
                variant="primary" 
                className="group flex items-center gap-2 px-8 py-4 text-lg"
                onClick={() => {
                  const authSection = document.getElementById('auth-section');
                  authSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NeumorphicButton>
              
              <NeumorphicButton 
                variant="outline" 
                className="group flex items-center gap-2 px-8 py-4 text-lg"
                onClick={() => {
                  const waitlistSection = document.getElementById('waitlist-section');
                  waitlistSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join Waitlist
              </NeumorphicButton>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-20 left-20 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
    </section>
  );
}
