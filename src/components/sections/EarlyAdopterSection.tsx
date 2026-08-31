import { BentoBox } from '@/components/ui/BentoBox';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

export default function EarlyAdopterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Join Our Early Adopters Program
          </h2>
          
          <p className="mt-6 max-w-3xl text-muted-foreground text-lg md:text-xl leading-relaxed">
            Be among the first to experience EchoVerse and receive exclusive benefits, including lifetime discounts, priority support, and early access to new features.
          </p>
            
          <div className="mt-12 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="w-full max-w-lg">
              <div className="flex rounded-xl shadow-lg">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-l-xl border-2 border-r-0 border-primary/20 bg-background/60 backdrop-blur-sm px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/60"
                />
                <Button 
                  size="lg" 
                  className="rounded-l-none rounded-r-xl px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = '/signup'}
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
            
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-base text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>50% off Pro plan for life</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>Early access to new features</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>Priority support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}