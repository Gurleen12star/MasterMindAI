import React from 'react';
import { ArrowRight, Play, Calendar } from 'lucide-react';
import { SkillGap } from '@/types/mastermind';
import { Button } from '@/components/ui/button';

interface Project {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface RoadmapBottomPanelsProps {
  skillGaps: SkillGap[];
  projects: Project[];
  nextStepTitle: string;
  nextStepSubtitle: string;
  dailyGoalMinutes: number;
  dailyCompletedMinutes: number;
}

const DIFF_COLORS = {
  Easy: 'text-green-500 bg-green-500/10',
  Medium: 'text-orange-500 bg-orange-500/10',
  Hard: 'text-red-500 bg-red-500/10',
};

export default function RoadmapBottomPanels({
  skillGaps, projects, nextStepTitle, nextStepSubtitle, dailyGoalMinutes, dailyCompletedMinutes
}: RoadmapBottomPanelsProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Top Skills to Focus */}
      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-sm font-bold text-foreground">Top Skills to Focus</h3>
        </div>
        
        <div className="space-y-3 flex-1">
          {skillGaps.slice(0, 4).map(gap => (
            <div key={gap.skillId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground truncate mr-2">{gap.skillName}</span>
                <span className="text-muted-foreground font-medium">{gap.requiredLevel}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${gap.requiredLevel}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline flex items-center">
          View All Skill Gaps <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>

      {/* Recommended Projects */}
      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-sm font-bold text-foreground">Recommended Projects</h3>
        </div>
        
        <div className="space-y-3 flex-1">
          {projects.map((proj, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 truncate pr-2">
                <span className="text-xs font-bold text-primary/60 bg-primary/10 w-5 h-5 flex items-center justify-center rounded">{i+1}</span>
                <span className="text-foreground truncate">{proj.title}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${DIFF_COLORS[proj.difficulty]}`}>
                {proj.difficulty}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs font-semibold text-primary cursor-pointer hover:underline flex items-center">
          View All Projects <ArrowRight className="w-3 h-3 ml-1" />
        </div>
      </div>

      {/* Next Up */}
      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
            </svg>
            <h3 className="text-sm font-bold text-foreground">Next Up</h3>
          </div>
          
          <div className="flex gap-4 items-start mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary/20 transition-colors">
              <Play className="w-5 h-5 text-primary ml-1" fill="currentColor" />
            </div>
            <div>
              <div className="font-bold text-foreground text-sm line-clamp-2 leading-tight mb-1">{nextStepTitle}</div>
              <div className="text-xs text-muted-foreground">{nextStepSubtitle}</div>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 shadow-md">
          Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Daily Goal */}
      <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Daily Goal</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-foreground mb-1">Study for at least</div>
            <div className="text-xl font-bold text-foreground">{dailyGoalMinutes} minutes</div>
          </div>
          
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
              <circle 
                className="text-primary stroke-current transition-all duration-1000 ease-out" 
                strokeWidth="8" 
                strokeLinecap="round" 
                cx="50" cy="50" r="40" 
                fill="transparent"
                strokeDasharray={`${(dailyCompletedMinutes / dailyGoalMinutes) * 251.327} 251.327`}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-foreground leading-none">{dailyCompletedMinutes}/{dailyGoalMinutes}</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-1">mins</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
