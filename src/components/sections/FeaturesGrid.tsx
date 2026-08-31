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
    <section id="features" className="relative -mt-32 md:-mt-48 py-24 md:py-32">
      <div className="container relative z-10 px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Amplify Your Learning Journey
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Our AI-powered platform creates a personalized learning experience tailored to your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:[grid-template-areas:'a_b_b'_'a_c_d'_'e_f_f'] md:auto-rows-[28rem] relative">
          <BentoBox gradient="purple" className="flex flex-col md:[grid-area:a] row-span-2 relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
              alt="AI Brain"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 before:absolute before:inset-0 before:rounded-2xl before:bg-primary/10 before:animate-pulse shadow-lg">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">AI-Driven Content</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Discover personalized content recommendations powered by advanced AI algorithms that adapt to your learning style.
              </p>
            </div>
          </BentoBox>
          
          <BentoBox gradient="blue" className="flex flex-col md:[grid-area:b] md:col-span-2 relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/7014766/pexels-photo-7014766.jpeg"
              alt="Content Transformation"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 shadow-lg">
                <Video className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">Multi-Modal Transformations</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Convert text to voice, video, and other formats instantly with our intelligent transformation tools.
              </p>
            </div>
          </BentoBox>
          
          <BentoBox gradient="teal" className="flex flex-col md:[grid-area:c] relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/7376/startup-photos.jpg"
              alt="Learning Dashboard"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 shadow-lg">
                <LineChart className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">Custom Learning Dashboards</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Track your progress and optimize your learning path with customizable dashboards.
              </p>
            </div>
          </BentoBox>
          
          <BentoBox gradient="green" className="flex flex-col md:[grid-area:d] relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
              alt="Language Translation"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 shadow-lg">
                <LanguagesIcon className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">Instant Translation</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Break language barriers with real-time translation across multiple languages.
              </p>
            </div>
          </BentoBox>
          
          <BentoBox gradient="blue" className="flex flex-col md:[grid-area:e] relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg"
              alt="Decentralized Storage"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 shadow-lg">
                <MessageSquareText className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">Decentralized Storage</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Secure your content with decentralized storage powered by Algorand and IPFS.
              </p>
            </div>
          </BentoBox>
          
          <BentoBox gradient="purple" className="flex flex-col md:[grid-area:f] md:col-span-2 relative overflow-hidden group backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/40 hover:bg-background/40 transition-all duration-500 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src="https://images.pexels.com/photos/2882566/pexels-photo-2882566.jpeg"
              alt="Premium Content"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 shadow-lg">
                <Lock className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground">Premium Content Gating</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Monetize your expertise with customizable content access controls and subscriptions.
              </p>
            </div>
          </BentoBox>
        </div>
      </div>
    </section>
  );
}