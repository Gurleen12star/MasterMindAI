import React from 'react';
import TavusConversation from '@/components/personalized-learning/TavusConversation';
import { BotMessageSquare, Video, FileText, MessageSquare, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TavusConversationPage = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <div className="ml-3 inline-block">
            <h1 className="text-2xl font-bold tracking-tight">Convo AI</h1>
          </div>
        </div>  
        <div className="mt-2 sm:mt-0">
          <p className="text-muted-foreground">
            Have a live video conversation with an AI that understands your content
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TavusConversation />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          <Card className="p-3 border-primary/10 bg-card/60 backdrop-blur-sm h-[fit-content]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">How It Works</h3>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Paste text you want to discuss</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>AI creates a conversation partner</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Talk via video to discuss content</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Reinforce learning through recall</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Conversation Tips</h3>
                </div>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                    <span>Provide clear, focused context</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                    <span>Ask open-ended questions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                    <span>Challenge with different views</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                    <span>Clarify difficult concepts</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 border-primary/10 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Sample Topics</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Research paper analysis",
                "Interview preparation",
                "Course notes review",
                "Technical concepts",
                "Historical events",
                "Scientific theories"
              ].map((topic, i) => (
                <div key={i} className="text-xs bg-background/50 rounded p-1.5 text-center border border-border/40">
                  {topic}
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-3 border-primary/10 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Benefits</h3>
            </div>
            <ul className="grid grid-cols-1 gap-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">✓</span>
                <span>Deepen understanding through dialogue</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">✓</span>
                <span>Practice articulating complex ideas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="bg-primary/10 text-primary rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">✓</span>
                <span>Identify gaps in your knowledge</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TavusConversationPage;