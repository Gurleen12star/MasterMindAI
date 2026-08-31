import { useState } from 'react';
import { BentoBox } from '@/components/ui/BentoBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Headphones, Video, Wand2, Sparkles } from 'lucide-react';

export default function DemoSection() {
  const [useState] = useState(false);
  const [content, setContent] = useState('');

  return (
    <section className="py-24 px-4">
      {/* SVG filter definition for the grainy noise effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="grainy" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend mode="multiply" in="SourceGraphic" />
        </filter>
      </svg>
      
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            See EchoVerse in Action
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Experience how our AI transforms content across different formats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Input Content Card */}
          <div className="lg:col-span-5">
            {/* BentoBox is now a positioning container */}
            <BentoBox gradient="purple" className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 bento-modern shadow-inner-modern rounded-3xl h-full">
              {/* Grainy background layer holds the color, blur, and noise filter */}
              <div className="absolute inset-0 backdrop-blur-xl bg-background/30 [filter:url(#grainy)]" />

              {/* Content is wrapped to sit on top of the background layer */}
              <div className="relative z-10 h-full flex flex-col p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-primary/10 before:animate-pulse shadow-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Input Content</h3>
                </div>
                <textarea
                  className="flex-grow w-full resize-none rounded-xl border-2 border-primary/20 bg-background/60 backdrop-blur-sm p-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/60"
                  placeholder="Enter text content to transform..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 rounded-xl h-12">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Transform Content
                  </Button>
                </div>
              </div>
            </BentoBox>
          </div>
          
          {/* AI Transformations Card */}
          <div className="lg:col-span-7">
            {/* BentoBox is now a positioning container */}
            <BentoBox gradient="blue" className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 bento-modern shadow-inner-modern rounded-3xl h-full">
              {/* Grainy background layer holds the color, blur, and noise filter */}
              <div className="absolute inset-0 backdrop-blur-xl bg-background/30 [filter:url(#grainy)]" />

              {/* Content is wrapped to sit on top of the background layer */}
              <div className="relative z-10 h-full p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-primary/10 before:animate-pulse shadow-lg">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">AI Transformations</h3>
                </div>
                
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="mb-6 w-full justify-start bg-muted/40 backdrop-blur-sm p-1.5 rounded-xl border border-border/30">
                    <TabsTrigger value="summary" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all duration-200">
                      <FileText className="h-4 w-4" />
                      <span>Summary</span>
                    </TabsTrigger>
                    <TabsTrigger value="audio" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all duration-200">
                      <Headphones className="h-4 w-4" />
                      <span>Audio</span>
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all duration-200">
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-0">
                    <div className="rounded-xl border-2 border-primary/20 bg-card/60 backdrop-blur-sm p-6 shadow-lg">
                      <p className="mb-3 font-semibold text-foreground">AI-Generated Summary</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        EchoVerse personalizes learning through AI-powered content recommendations and multi-modal transformations, analyzing user preferences and enabling seamless conversion between text, audio, and video formats for an optimized educational experience.
                      </p>
                    </div>
                  </TabsContent>
                  
                  {/* Other TabsContent remain the same */}
                  <TabsContent value="audio" className="mt-0">
                    <div className="flex items-center justify-center rounded-xl border-2 border-primary/20 bg-card/60 backdrop-blur-sm p-8 shadow-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
                          <Headphones className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Audio transformation would appear here
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="video" className="mt-0">
                    <div className="flex items-center justify-center rounded-xl border-2 border-primary/20 bg-card/60 backdrop-blur-sm p-8 shadow-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
                          <Video className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Video transformation would appear here
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </BentoBox>
          </div>
        </div>
      </div>
    </section>
  );
}