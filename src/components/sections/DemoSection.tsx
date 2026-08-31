import { useState } from 'react';
import { BentoBox } from '@/components/ui/BentoBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Headphones, Video } from 'lucide-react';

export default function DemoSection() {
  const [content, setContent] = useState<string>(
    "EchoVerse transforms learning by personalizing content and offering multi-modal transformations. Our AI analyzes your preferences and learning style to deliver tailored recommendations, while allowing you to convert content between text, audio, and video formats seamlessly."
  );

  return (
    <section id="demo" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="mx-auto max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            See EchoVerse in Action
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Experience how our AI transforms content across different formats.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <BentoBox gradient="purple" className="h-full">
                <h3 className="mb-4 text-xl font-medium">Input Content</h3>
                <textarea
                  className="h-48 w-full resize-none rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter text content to transform..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-4">
                  <Button>
                    Transform Content
                  </Button>
                </div>
              </BentoBox>
            </div>
            
            <div className="lg:col-span-7">
              <BentoBox gradient="blue" className="h-full">
                <h3 className="mb-4 text-xl font-medium">AI Transformations</h3>
                
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="mb-4 w-full justify-start">
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
                    <div className="rounded-lg border border-border/40 bg-card/50 p-4">
                      <p className="mb-2 font-medium">AI-Generated Summary</p>
                      <p className="text-sm text-muted-foreground">
                        EchoVerse personalizes learning through AI-powered content recommendations and multi-modal transformations, analyzing user preferences and enabling seamless conversion between text, audio, and video formats.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="audio" className="mt-0">
                    <div className="flex items-center justify-center rounded-lg border border-border/40 bg-card/50 p-8">
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
                    <div className="flex items-center justify-center rounded-lg border border-border/40 bg-card/50 p-8">
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
      </div>
    </section>
  );
}