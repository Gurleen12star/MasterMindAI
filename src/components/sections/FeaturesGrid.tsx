import { BentoBox } from '@/components/ui/BentoBox';
import GlassIcons from '@/components/ui/GlassIcons';
import { 
  Brain, 
  LanguagesIcon, 
  Search, 
  ShieldCheck, 
  DollarSign, 
  Video
} from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-4">
      <div className="container relative z-10 px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            The Future of Intelligence, at Your Fingertips.
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-3xl mx-auto">
            EchoVerse is more than a learning tool—it's a complete ecosystem for knowledge acquisition, content creation, and monetization.
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
                  <GlassIcons items={[{ icon: <Brain className="h-6 w-6" />, color: 'purple', label: 'AI Learning' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Intelligent Learning Paths</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Go beyond simple tutorials. Our AI generates dynamic learning paths with interactive modules, AI tutors, and progress tracking tailored to your unique goals and style.
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
                  <GlassIcons items={[{ icon: <Video className="h-6 w-6" />, color: 'blue', label: 'Animation' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">The Animation Studio</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Bring your ideas to life. Instantly transform text or articles into engaging video presentations and audible lessons, perfect for any audience or learning preference.
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
                  <GlassIcons items={[{ icon: <Search className="h-6 w-6" />, color: 'teal', label: 'Research' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Deep-Dive Research Agent</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Ask any question and receive comprehensive, AI-curated research reports. Our agent sifts through millions of sources to deliver structured insights, saving you hours of work.
                </p>
              </div>
            </div>
          </BentoBox>
          
          {/* Global Content Creator */}
          <BentoBox gradient="green" className="flex flex-col relative overflow-hidden group rounded-3xl min-h-[200px] md:min-h-[280px] border border-slate-800/30 shadow-lg shadow-black/20 p-4 md:p-8">
            {/* Dark Gradient Background Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800/50 via-slate-900/60 to-black/70 group-hover:from-slate-800/60 group-hover:via-slate-900/70 group-hover:to-black/80 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-center mb-4" style={{ height: '80px' }}>
                <div className="scale-75">
                  <GlassIcons items={[{ icon: <LanguagesIcon className="h-6 w-6" />, color: 'green', label: 'Global' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Global Content Creator</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Break down barriers. Create and consume content in any language with seamless, real-time translation, expanding your reach and knowledge base.
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
                  <GlassIcons items={[{ icon: <ShieldCheck className="h-6 w-6" />, color: 'indigo', label: 'Security' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Fortress-Level Security</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Your data is yours alone. We leverage decentralized storage and state-of-the-art encryption to ensure your content and personal information are always protected.
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
                  <GlassIcons items={[{ icon: <DollarSign className="h-6 w-6" />, color: 'orange', label: 'Monetize' }]} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">Creator Hub & Monetization</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Build your knowledge empire. Gate your premium content, manage subscriptions, and connect with your audience using our integrated monetization tools.
                </p>
              </div>
            </div>
          </BentoBox>
        </div>
      </div>
    </section>
  );
}