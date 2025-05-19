import { NeumorphicCard } from '../ui/NeumorphicCard';
import { MessageSquare, RefreshCw, Zap, CheckCircle } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Unified Messaging',
      description: 'Create a single source of truth for your brand voice and messaging.'
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: 'Brand Consistency',
      description: 'Ensure every piece of content aligns with your brand guidelines.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Automation',
      description: 'Leverage AI to generate and optimize content at scale.'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Platform Integration',
      description: 'Seamlessly connect with your existing tools and workflows.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to transform your brand communication
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-200 group-hover:duration-200"></div>
              <NeumorphicCard className="relative h-full p-6 bg-white dark:bg-gray-900 group-hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary rounded-xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                <div className="absolute bottom-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </NeumorphicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
