import { Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background py-20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0" />
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="relative z-10 flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
                EchoVerse
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI-powered personalized learning hub that transforms how you learn and grow.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Join Discord</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#"
                className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Documentation</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:gap-24">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wide">Platform</h3>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wide">Company</h3>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-wide">Legal</h3>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-12 opacity-30" />
        
        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 EchoVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}