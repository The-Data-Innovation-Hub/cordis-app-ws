import { NeumorphicCard } from '../ui/NeumorphicCard';
import { AlertCircle, ArrowRight } from 'lucide-react';

export function ProblemStatementSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            The Branding Disconnect
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <NeumorphicCard hoverEffect className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Inconsistent Brand Voice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your brand's voice changes across different channels, confusing your audience and diluting your identity.
                  </p>
                </div>
              </div>
            </NeumorphicCard>

            <NeumorphicCard hoverEffect className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Manual Processes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Teams spend countless hours ensuring brand consistency instead of focusing on strategy and creativity.
                  </p>
                </div>
              </div>
            </NeumorphicCard>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">87%</div>
                    <p className="text-gray-600 dark:text-gray-300">of brands struggle with maintaining consistent messaging</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Without proper tools, your brand's message gets lost in translation across different teams and platforms.
                </p>
                <button className="inline-flex items-center text-primary font-medium group">
                  Learn how we solve this
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
