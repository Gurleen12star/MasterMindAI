import { useState } from 'react';
import { BentoBox } from '@/components/ui/BentoBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Headphones, Video, Wand2, Sparkles } from 'lucide-react';

export default function DemoSection() {
  const [content, setContent] = useState<string>(
    "Imagine having an AI companion that understands your unique learning style. EchoVerse adapts to your preferences, transforming complex content into formats that resonate with you. From detailed technical documentation to engaging video tutorials, watch as your content evolves into the perfect learning experience."
  );

  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 relative bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              See It In Action
            </span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Experience how our AI transforms content across different formats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="lg:col-span-5">
            <BentoBox gradient="purple" className="h-full backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 bento-modern shadow-inner-modern rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 before:absolute before:inset-0 before:rounded-xl before:bg-primary/10 before:animate-pulse shadow-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Input Content</h3>
              </div>
              <textarea
                className="h-48 w-full resize-none rounded-xl border-2 border-primary/20 bg-background/60 backdrop-blur-sm p-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/60"
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
            </BentoBox>
          </div>
          
          <div className="lg:col-span-7">
            <BentoBox gradient="blue" className="h-full backdrop-blur-xl bg-background/30 border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 bento-modern shadow-inner-modern rounded-3xl">
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
            </BentoBox>
          </div>
        </div>
      </div>
    </section>
  );
}