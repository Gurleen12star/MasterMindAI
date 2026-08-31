import React from 'react';
import TavusConversation from '@/components/personalized-learning/TavusConversation';
import { BotMessageSquare, Video, FileText } from 'lucide-react';

const TavusConversationPage = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <BotMessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Convo AI</h1>
          <p className="text-muted-foreground">
            Have a live video conversation with an AI that understands your content
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TavusConversation />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">How It Works</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span>Paste any text you want to discuss (like an article, research paper, or your notes)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span>Our system creates an AI conversation partner that understands your content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span>Talk with the AI via video to deepen your understanding through discussion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <span>Conversations help reinforce your learning through active recall</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tips for Better Conversations</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                <span>Provide detailed context with clear, focused information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                <span>Ask open-ended questions to explore the topic deeper</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                <span>Challenge the AI with different perspectives to test understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                <span>Use the conversation to clarify concepts you're struggling with</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                <span>Try explaining concepts back to the AI to reinforce your learning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusConversationPage;