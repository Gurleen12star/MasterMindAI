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
    <section id="demo" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background/50" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="relative mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            See EchoVerse in Action
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Experience how our AI transforms content across different formats.
          </p>
        </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <BentoBox gradient="purple" className="h-full backdrop-blur-xl bg-background/20 border border-primary/10 hover:border-primary/20 transition-colors duration-300 shadow-[inset_0_0_1px_rgba(var(--primary),0.1)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Input Content</h3>
                </div>
                <textarea
                  className="h-48 w-full resize-none rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm p-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  placeholder="Enter text content to transform..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-4">
                  <Button className="w-full bg-primary/90 hover:bg-primary transition-all duration-200 shadow-lg hover:shadow-primary/25">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Transform Content
                  </Button>
                </div>
              </BentoBox>
            </div>
            
            <div className="lg:col-span-7">
              <BentoBox gradient="blue" className="h-full backdrop-blur-xl bg-background/20 border border-primary/10 hover:border-primary/20 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">AI Transformations</h3>
                </div>
                
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="mb-6 w-full justify-start bg-accent/50 p-1">
                    <TabsTrigger value="summary" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Summary</span>
                    </TabsTrigger>
                    <TabsTrigger value="audio" className="flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      <span>Audio</span>
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-0">
                    <div className="rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm p-6">
                      <p className="mb-2 font-medium">AI-Generated Summary</p>
                      <p className="text-sm text-muted-foreground">
                        EchoVerse personalizes learning through AI-powered content recommendations and multi-modal transformations, analyzing user preferences and enabling seamless conversion between text, audio, and video formats.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="audio" className="mt-0">
                    <div className="flex items-center justify-center rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm p-8">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full bg-primary/10">
                          <Headphones className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Audio transformation would appear here
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="video" className="mt-0">
                    <div className="flex items-center justify-center rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm p-8">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full bg-primary/10">
                          <Video className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
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