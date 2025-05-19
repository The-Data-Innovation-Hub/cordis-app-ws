import { NeumorphicCard } from '../ui/NeumorphicCard';

export function VisionSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <NeumorphicCard className="max-w-4xl mx-auto p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <blockquote className="space-y-6">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-primary">"</span>If Sales is the lifeblood, then Branding is the Heart.<span className="text-primary">"</span>
            </div>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              At Cordis, we believe that powerful brands are built on consistent, authentic communication. 
              Our mission is to empower businesses to maintain their unique voice across every touchpoint, 
              ensuring that every interaction strengthens their brand identity and resonates with their audience.
            </p>
          </blockquote>
        </NeumorphicCard>
      </div>
    </section>
  );
}
