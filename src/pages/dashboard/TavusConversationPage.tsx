import React from 'react';
import TavusConversation from '@/components/personalized-learning/TavusConversation';
import { BotMessageSquare, Video, FileText, CheckCircle, Users, Sparkles, Shield } from 'lucide-react';

const TavusConversationPage = () => {
  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <BotMessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Convo AI</h1>
          <p className="text-muted-foreground max-w-3xl">
            Have a live video conversation with an AI persona that deeply understands your content and can discuss it naturally
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TavusConversation />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border-2 border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">How It Works</h3>
            </div>
            <ul className="space-y-5 ml-2">
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                  <span className="font-bold">1</span>
                </div>
                <div className="pt-1">
                  <p className="font-medium mb-1">Provide Content</p>
                  <p className="text-muted-foreground">Paste any text you want to discuss (articles, research papers, notes, etc.)</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                  <span className="font-bold">2</span>
                </div>
                <div className="pt-1">
                  <p className="font-medium mb-1">AI Preparation</p>
                  <p className="text-muted-foreground">Our system creates an AI conversation partner specialized in your content</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                  <span className="font-bold">3</span>
                </div>
                <div className="pt-1">
                  <p className="font-medium mb-1">Video Conversation</p>
                  <p className="text-muted-foreground">Talk with the AI via live video to deepen your understanding through natural discussion</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                  <span className="font-bold">4</span>
                </div>
                <div className="pt-1">
                  <p className="font-medium mb-1">Learning Reinforcement</p>
                  <p className="text-muted-foreground">Active discussion helps reinforce concepts through interactive recall</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border-2 border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Tips for Better Conversations</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-5 ml-2">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Clear Context</p>
                    <p className="text-xs text-muted-foreground">Provide detailed, focused information for better results</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Open-Ended Questions</p>
                    <p className="text-xs text-muted-foreground">Use questions that encourage exploration of the topic</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Challenge Perspectives</p>
                    <p className="text-xs text-muted-foreground">Test understanding with different viewpoints</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Concept Clarification</p>
                    <p className="text-xs text-muted-foreground">Ask about specific concepts you're struggling with</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <BotMessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Explain Back</p>
                    <p className="text-xs text-muted-foreground">Reinforce learning by explaining concepts to the AI</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Visual Cues</p>
                    <p className="text-xs text-muted-foreground">Use facial expressions and gestures for natural interaction</p>
                  </div>
                </div>
              </div>
            </div>
              </li>
            
          </div>
        </div>
        
        <div className="rounded-xl border-2 border-primary/10 p-6 bg-primary/5 backdrop-blur-sm shadow-inner mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-primary/15 rounded-full">
              <BotMessageSquare className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Enhance Your Learning Experience</h3>
              <p className="text-muted-foreground">Video conversations with specialized AI personas can significantly improve comprehension and retention of complex topics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusConversationPage;