import { BentoBox } from '@/components/ui/BentoBox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EarlyAdopterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 backdrop-blur-xl">
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}