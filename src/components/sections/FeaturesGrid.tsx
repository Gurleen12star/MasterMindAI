import { BentoBox } from '@/components/ui/BentoBox';
import GlassIcons from '@/components/ui/GlassIcons';
import { 
  Brain, 
  Search, 
  ShieldCheck, 
  DollarSign, 
  Video,
  MessagesSquare
} from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-4">
      <div className="container relative z-10 px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Your Career Intelligence Engine.
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-3xl mx-auto">
            MasterMindAI is more than a learning tool—it's a complete ecosystem for career alignment, skill gap analysis, and personalized learning paths.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 auto-rows-auto relative">
          {/* Intelligent Learning Paths */}
          <BentoBox gradient="purple" className="flex flex-col md:row-span-2 relative overflow-hidden group rounded-3xl min-h-[280px] md:min-h-[400px] border border-[hsl(var(--primary)/0.2)] shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--primary)/0.3)] via-[hsl(var(--primary)/0.2)] to-black/60 group-hover:from-[hsl(var(--primary)/0.4)] group-hover:via-[hsl(var(--primary)/0.3)] group-hover:to-black/70 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <Brain className="h-6 w-6" />, color: 'purple', label: 'DNA' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Learner DNA Engine</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  MasterMindAI captures your career intent, current capability baselines, learning preferences, and target industry to build a complete profile of who you are and where you want to be.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* The Animation Studio */}
          <BentoBox gradient="blue" className="flex flex-col md:col-span-2 relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-[hsl(var(--chart-2)/0.2)] shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--chart-2)/0.3)] via-[hsl(var(--chart-2)/0.2)] to-black/60 group-hover:from-[hsl(var(--chart-2)/0.4)] group-hover:via-[hsl(var(--chart-2)/0.3)] group-hover:to-black/70 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <Video className="h-6 w-6" />, color: 'blue', label: 'Analysis' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Skill Gap Analysis</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Dynamically calculates priority skill gaps between your current level and your target role baselines. We focus only on what you need to learn, eliminating unnecessary coursework and optimizing your time.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* Deep-Dive Research Agent */}
          <BentoBox gradient="teal" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-[hsl(var(--chart-3)/0.2)] shadow-lg shadow-black/20 p-4 md:p-8">
             {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--chart-3)/0.3)] via-[hsl(var(--chart-3)/0.2)] to-black/60 group-hover:from-[hsl(var(--chart-3)/0.4)] group-hover:via-[hsl(var(--chart-3)/0.3)] group-hover:to-black/70 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <Search className="h-6 w-6" />, color: 'teal', label: 'Intelligence' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">MasterMind Intelligence Trace</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Experience explainable AI generation. MasterMindAI shows you exactly why each path is tailored to you, tracing from your current skills to your career goal and the capability gaps in between.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* AI Video Conversations */}
          <BentoBox gradient="green" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-slate-800/30 shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800/50 via-slate-900/60 to-black/70 group-hover:from-slate-800/60 group-hover:via-slate-900/70 group-hover:to-black/80 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <MessagesSquare className="h-6 w-6" />, color: 'green', label: 'Paths' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Personalized Path Generator</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Automatically builds a custom curriculum tailored to your specific timeframe and goals, complete with an industry-specific capstone project that proves your readiness to top employers.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* Fortress-Level Security */}
          <BentoBox gradient="blue" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-[hsl(var(--secondary)/0.2)] shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--secondary)/0.3)] via-[hsl(var(--secondary)/0.2)] to-black/60 group-hover:from-[hsl(var(--secondary)/0.4)] group-hover:via-[hsl(var(--secondary)/0.3)] group-hover:to-black/70 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <ShieldCheck className="h-6 w-6" />, color: 'indigo', label: 'Visualize' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Interactive Visualizations</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Explore your learning roadmap through zoomable, interactive Mermaid diagrams. Every path is mapped natively to your goals, giving you a clear visual representation of your journey.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* Creator Hub & Monetization */}
          <BentoBox gradient="purple" className="flex flex-col md:col-span-2 relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-[hsl(var(--primary)/0.2)] shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--chart-2)/0.3)] via-[hsl(var(--primary)/0.2)] to-black/60 group-hover:from-[hsl(var(--chart-2)/0.4)] group-hover:via-[hsl(var(--primary)/0.3)] group-hover:to-black/70 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <DollarSign className="h-6 w-6" />, color: 'orange', label: 'Instant' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Zero-Friction Demo Mode</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Designed for immediate impact. Our application runs purely in the browser using session storage for instant demonstrations without any authentication blockers or friction.
                </p>
              </div>
            </div>
          </BentoBox>
        </div>
      </div>
    </section>
  );
}