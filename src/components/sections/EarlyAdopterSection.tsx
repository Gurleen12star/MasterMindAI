import { BentoBox } from '@/components/ui/BentoBox';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';

export default function EarlyAdopterSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Blurred oval overlay effects */}
      <div className="absolute top-20 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/8 via-purple-500/6 to-transparent blur-3xl opacity-60" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/6 via-primary/4 to-transparent blur-3xl opacity-50" />
      
      <div className="container px-4 max-w-[1200px] mx-auto">
        <BentoBox gradient="purple" className="mx-auto max-w-6xl overflow-hidden p-12 lg:p-16 backdrop-blur-xl bg-background/30 border-2 border-primary/30 bento-modern shadow-inner-modern transition-all duration-500 rounded-3xl">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl opacity-60" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
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
        </BentoBox>
      </div>
    </section>
  );
}