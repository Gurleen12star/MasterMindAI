import { BentoBox } from '@/components/ui/BentoBox';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function EarlyAdopterSection() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <BentoBox gradient="purple" className="mx-auto max-w-6xl overflow-hidden p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            
            <h2 className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              Join Our Early Adopters Program
            </h2>
            
            <p className="mt-6 max-w-3xl text-muted-foreground text-lg md:text-xl">
              Be among the first to experience EchoVerse and receive exclusive benefits, including lifetime discounts, priority support, and early access to new features.
            </p>
            
            <div className="mt-12 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="w-full max-w-lg">
                <div className="flex rounded-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-l-md border border-r-0 border-input bg-background px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="lg" className="rounded-l-none px-8">Join Waitlist</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>50% off Pro plan for life</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Early access to new features</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Priority support</span>
              </div>
            </div>
          </div>
        </BentoBox>
      </div>
    </section>
  );
}