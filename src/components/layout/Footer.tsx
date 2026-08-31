import { Github, Linkedin, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-card/50 py-12">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
                EchoVerse
              </span>
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              AI-powered personalized learning hub that transforms how you learn and grow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Platform</h3>
              <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <div className="flex flex-col gap-2">
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
        
        <Separator className="my-8" />
        
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 EchoVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}