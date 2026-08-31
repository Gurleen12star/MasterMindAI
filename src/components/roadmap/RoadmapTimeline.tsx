import React from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

export interface Topic {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  topics: Topic[];
  progress: number;
  totalTopics: number;
}

interface RoadmapTimelineProps {
  phases: Phase[];
}

export default function RoadmapTimeline({ phases }: RoadmapTimelineProps) {
  if (!phases || phases.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Your 6-Month Roadmap
        </h2>
        
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md cursor-pointer">
            Timeline
          </div>
          <div className="px-3 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-md cursor-pointer">
            Skills View
          </div>
          <div className="px-3 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-md cursor-pointer">
            Table View
          </div>
        </div>
      </div>

      <div className="relative pt-8 pb-4 overflow-x-auto custom-scrollbar">
        {/* Horizontal Line connecting nodes */}
        <div className="absolute top-[4.5rem] left-0 right-0 h-0.5 bg-border z-0"></div>
        <div 
          className="absolute top-[4.5rem] left-0 h-0.5 bg-primary z-0 transition-all duration-1000" 
          style={{ width: `${(phases[0]?.progress || 0)}%` }} // Simplified for demo
        ></div>

        <div className="flex gap-6 min-w-max relative z-10 px-2">
          {phases.map((phase, index) => {
            const isCompleted = phase.progress === 100;
            const isCurrent = phase.progress > 0 && phase.progress < 100;
            
            return (
              <div key={phase.id} className="w-[280px] flex-shrink-0 flex flex-col">
                
                {/* Node Top Section */}
                <div className="text-center mb-4 flex flex-col items-center">
                  <div className="text-sm font-semibold text-primary mb-1">{phase.subtitle}</div>
                  <div className="text-xs text-muted-foreground font-medium mb-3">{phase.title}</div>
                  
                  {/* Circle Node */}
                  <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center bg-background
                    ${isCompleted ? 'border-primary' : (isCurrent ? 'border-primary' : 'border-border')}
                  `}>
                    {isCompleted && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                </div>

                {/* Card Section */}
                <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-4 flex-1 flex flex-col">
                  <div className="text-xs text-primary font-semibold mb-1">{phase.subtitle}</div>
                  <div className="text-sm font-bold text-foreground mb-4 line-clamp-1">{phase.title}</div>
                  
                  <div className="space-y-3 flex-1 mb-6">
                    {phase.topics.map(topic => (
                      <div key={topic.id} className="flex items-start gap-2 group cursor-pointer">
                        {topic.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                        )}
                        <span className={`text-xs ${topic.isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {topic.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{phase.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${phase.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground group cursor-pointer hover:text-foreground transition-colors">
                      {phase.totalTopics} Milestones <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
