import { BentoBox } from '@/components/ui/BentoBox';
import { 
  Brain, 
  LanguagesIcon, 
  LineChart, 
  Lock, 
  MessageSquareText, 
  Video
} from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-16 md:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)/0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, hsl(var(--primary)/0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(circle at center, black, transparent 90%)'
          }}
        ></div>
      </div>
      <div className="container relative z-10 px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Amplify Your Learning Journey
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Our AI-powered platform creates a personalized learning experience tailored to your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 [grid-template-areas:'a_b_b'_'a_c_d'_'e_f_f'] md:auto-rows-[28rem]">
          <BentoBox gradient="purple" className="flex flex-col md:[grid-area:a] row-span-2 relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
              alt="AI Brain"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">AI-Driven Content</h3>
            <p className="text-muted-foreground text-lg">
              Discover personalized content recommendations powered by advanced AI algorithms.
            </p>
          </BentoBox>
          
          <BentoBox gradient="blue" className="flex flex-col md:[grid-area:b] md:col-span-2 relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/7014766/pexels-photo-7014766.jpeg"
              alt="Content Transformation"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">Multi-Modal Transformations</h3>
            <p className="text-muted-foreground text-lg">
              Convert text to voice, video, and other formats instantly with our transformation tools.
            </p>
          </BentoBox>
          
          <BentoBox gradient="teal" className="flex flex-col md:[grid-area:c] relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/7376/startup-photos.jpg"
              alt="Learning Dashboard"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">Custom Learning Dashboards</h3>
            <p className="text-muted-foreground text-lg">
              Track your progress and optimize your learning path with customizable dashboards.
            </p>
          </BentoBox>
          
          <BentoBox gradient="green" className="flex flex-col md:[grid-area:d] relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
              alt="Language Translation"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <LanguagesIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">Instant Translation</h3>
            <p className="text-muted-foreground text-lg">
              Break language barriers with real-time translation across multiple languages.
            </p>
          </BentoBox>
          
          <BentoBox gradient="blue" className="flex flex-col md:[grid-area:e] relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg"
              alt="Decentralized Storage"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">Decentralized Storage</h3>
            <p className="text-muted-foreground text-lg">
              Secure your content with decentralized storage powered by Algorand and IPFS.
            </p>
          </BentoBox>
          
          <BentoBox gradient="purple" className="flex flex-col md:[grid-area:f] md:col-span-2 relative overflow-hidden group backdrop-blur-md bg-background/30 border-primary/20">
            <img
              src="https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg"
              alt="Premium Content"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight">Premium Content Gating</h3>
            <p className="text-muted-foreground text-lg">
              Monetize your expertise with customizable content access controls and subscriptions.
            </p>
          </BentoBox>
        </div>
      </div>
    </section>
  );
}