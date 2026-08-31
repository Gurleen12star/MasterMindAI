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
    <section id="features" className="relative -mt-32 md:-mt-48 py-24 md:py-32 overflow-hidden">
      {/* Simplified overlay effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-40" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/4 to-transparent opacity-30" />
      
      <div className="container relative z-10 px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Amplify Your Learning Journey
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Our AI-powered platform creates a personalized learning experience tailored to your needs.
          </p>
        </div>
        
        {/* Grid with vibrant color cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto relative">
          {/* AI-Driven Content - Orange Pantone theme */}
          <BentoBox gradient="purple" className="flex flex-col md:row-span-2 relative overflow-hidden group rounded-3xl min-h-[400px] border border-[hsl(var(--primary)/0.3)] bg-gradient-to-br from-[hsl(var(--primary)/0.9)] via-[hsl(var(--primary)/0.7)] to-[#F4D47C]/50 hover:from-[hsl(var(--primary)/1)] hover:via-[hsl(var(--primary)/0.8)] hover:to-[#F4D47C]/60 transition-all duration-300 shadow-lg shadow-[hsl(var(--primary)/0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">AI-Driven Content</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Discover personalized content recommendations powered by advanced AI algorithms that adapt to your learning style.
              </p>
            </div>
          </BentoBox>
          
          {/* Multi-Modal Transformations - Midnight Green theme */}
          <BentoBox gradient="blue" className="flex flex-col md:col-span-2 relative overflow-hidden group rounded-3xl min-h-[280px] border border-[#075058]/30 bg-gradient-to-br from-[#075058]/90 via-[#075058]/70 to-[#233038]/50 hover:from-[#075058] hover:via-[#075058]/80 hover:to-[#233038]/60 transition-all duration-300 shadow-lg shadow-[#075058]/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Multi-Modal Transformations</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Convert text to voice, video, and other formats instantly with our intelligent transformation tools.
              </p>
            </div>
          </BentoBox>
          
          {/* Custom Learning Dashboards - Sand Yellow theme */}
          <BentoBox gradient="teal" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[280px] border border-[#F4D47C]/30 bg-gradient-to-br from-[#F4D47C]/90 via-[#F4D47C]/70 to-[#FDF6E3]/50 hover:from-[#F4D47C] hover:via-[#F4D47C]/80 hover:to-[#FDF6E3]/60 transition-all duration-300 shadow-lg shadow-[#F4D47C]/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-black/10 backdrop-blur-sm shadow-lg">
                <LineChart className="h-8 w-8 text-[#233038]" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-[#233038]">Custom Learning Dashboards</h3>
              <p className="text-[#233038]/80 text-lg leading-relaxed">
                Track your progress and optimize your learning path with customizable dashboards.
              </p>
            </div>
          </BentoBox>
          
          {/* Instant Translation - Gunmetal theme */}
          <BentoBox gradient="green" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[280px] border border-[#233038]/30 bg-gradient-to-br from-[#233038]/90 via-[#233038]/70 to-[#075058]/50 hover:from-[#233038] hover:via-[#233038]/80 hover:to-[#075058]/60 transition-all duration-300 shadow-lg shadow-[#233038]/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <LanguagesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Instant Translation</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Break language barriers with real-time translation across multiple languages.
              </p>
            </div>
          </BentoBox>
          
          {/* Decentralized Storage - Light Silver theme */}
          <BentoBox gradient="blue" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[280px] border border-[#D3DBDD]/30 bg-gradient-to-br from-[#D3DBDD]/90 via-[#D3DBDD]/70 to-[#FDF6E3]/50 hover:from-[#D3DBDD] hover:via-[#D3DBDD]/80 hover:to-[#FDF6E3]/60 transition-all duration-300 shadow-lg shadow-[#D3DBDD]/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-black/10 backdrop-blur-sm shadow-lg">
                <MessageSquareText className="h-8 w-8 text-[#233038]" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-[#233038]">Decentralized Storage</h3>
              <p className="text-[#233038]/80 text-lg leading-relaxed">
                Secure your content with decentralized storage powered by Algorand and IPFS.
              </p>
            </div>
          </BentoBox>
          
          {/* Premium Content Gating - Mixed vibrant theme */}
          <BentoBox gradient="purple" className="flex flex-col md:col-span-2 relative overflow-hidden group rounded-3xl min-h-[280px] border border-[hsl(var(--primary)/0.3)] bg-gradient-to-br from-[#075058]/90 via-[hsl(var(--primary)/0.7)] to-[#F4D47C]/50 hover:from-[#075058] hover:via-[hsl(var(--primary)/0.8)] hover:to-[#F4D47C]/60 transition-all duration-300 shadow-lg shadow-[hsl(var(--primary)/0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-end">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Premium Content Gating</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Monetize your expertise with customizable content access controls and subscriptions.
              </p>
            </div>
          </BentoBox>
        </div>
      </div>
    </section>
  );
}