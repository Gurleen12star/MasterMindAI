import { Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BentoBox } from '@/components/ui/BentoBox';
import EchoVerseLogo from '@/components/ui/EchoVerseLogo';

export default function Footer() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Background overlay for better text visibility */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
      
      {/* Blurred oval overlay effects */}
      <div className="absolute top-20 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/8 via-purple-500/6 to-transparent blur-3xl opacity-60" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/6 via-primary/4 to-transparent blur-3xl opacity-50" />
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
      <div className="container px-4 max-w-[1200px] mx-auto relative z-10">
        <BentoBox gradient="purple" className="mx-auto max-w-6xl overflow-hidden p-12 lg:p-16 backdrop-blur-xl bg-background/30 border-2 border-primary/30 shadow-inner-modern shadow-[0_20px_50px_rgb(0,0,0,0.15)] hover:shadow-[0_30px_60px_rgb(0,0,0,0.2)] transition-all duration-500 rounded-3xl">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl opacity-60" />
          
          <div className="relative z-10 flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="flex flex-col items-start gap-6">
              <div className="flex items-center gap-3">
                <EchoVerseLogo 
                  className="h-20 w-20 -my-4 text-primary" 
                />
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
                  EchoVerse
                </span>
              </div>
              <p className="max-w-xs text-base text-muted-foreground leading-relaxed">
                AI-powered personalized learning hub that transforms how you learn and grow.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://discord.gg/echoverse"
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Join Discord</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="/docs"
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Documentation</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:gap-16 lg:gap-24">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold tracking-wide text-foreground">Platform</h3>
                <div className="flex flex-col gap-3">
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                  <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold tracking-wide text-foreground">Company</h3>
                <div className="flex flex-col gap-3">
                  <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </a>
                  <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                  <a href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold tracking-wide text-foreground">Legal</h3>
                <div className="flex flex-col gap-3">
                  <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </a>
                  <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </a>
                  <a href="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-12 opacity-30 bg-primary/20" />
          
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 EchoVerse. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://twitter.com/echoverse_ai"
                className="text-muted-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com/company/echoverse-ai"
                className="text-muted-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com/ManojINaik"
                className="text-muted-foreground/80 transition-all duration-300 hover:text-foreground hover:scale-110"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </BentoBox>
      </div>
    </section>
  );
}