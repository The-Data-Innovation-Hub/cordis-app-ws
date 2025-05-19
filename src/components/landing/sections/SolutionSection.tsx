import { NeumorphicCard } from '../ui/NeumorphicCard';
import { Bot, Sparkles, Zap } from 'lucide-react';

export function SolutionSection() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'AI-Powered Brand Analysis',
      description: 'Our AI analyzes your brand voice and provides real-time suggestions to maintain consistency across all communications.'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: 'Automated Message Generation',
      description: 'Generate on-brand content in seconds, perfectly aligned with your brand guidelines and voice.'
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: 'Seamless Integration',
      description: 'Works with your existing tools and platforms, ensuring brand consistency across all channels.'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The Cordis Solution
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered brand consistency that works as hard as you do
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <NeumorphicCard 
              key={index} 
              hoverEffect 
              className="p-8 text-center h-full flex flex-col items-center"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </NeumorphicCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <NeumorphicCard className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to transform your brand communication?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join the waitlist to be among the first to experience the future of brand consistency.
            </p>
            <button 
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist-section');
                waitlistSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join Waitlist
            </button>
          </NeumorphicCard>
        </div>
      </div>
    </section>
  );
}
