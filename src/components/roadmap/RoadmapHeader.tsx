import React from 'react';
import { Target, Clock, Calendar, BarChart2 } from 'lucide-react';

interface RoadmapHeaderProps {
  goal: string;
  industry: string;
  targetCompany: string;
  level: string;
  timeframeMonths: number;
  weeklyHours: number;
  currentLevel: string;
  progressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
}

export default function RoadmapHeader({
  goal, industry, targetCompany, level, timeframeMonths, weeklyHours,
  currentLevel, progressPercent, completedMilestones, totalMilestones
}: RoadmapHeaderProps) {
  return (
    <div className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Left: Goal & Badges */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider">Your Goal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 truncate">{goal}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm font-semibold rounded-full truncate max-w-full">{industry}</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs md:text-sm font-semibold rounded-full truncate max-w-full">{targetCompany}</span>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs md:text-sm font-semibold rounded-full truncate max-w-full">{level}</span>
          </div>
          
          {/* Sub metrics */}
          <div className="flex flex-wrap gap-4 md:gap-8 text-sm">
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4 flex-shrink-0" /> Timeline
              </div>
              <div className="font-semibold text-foreground">{timeframeMonths} Months</div>
            </div>
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Clock className="w-4 h-4 flex-shrink-0" /> Weekly
              </div>
              <div className="font-semibold text-foreground">{weeklyHours} hrs</div>
            </div>
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <BarChart2 className="w-4 h-4 flex-shrink-0" /> Level
              </div>
              <div className="font-semibold text-foreground capitalize truncate">{currentLevel.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>

        {/* Middle: Progress Ring */}
        <div className="flex flex-col items-center justify-center min-w-[150px]">
          <div className="relative w-32 h-32 mb-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
              <circle 
                className="text-primary stroke-current transition-all duration-1000 ease-out" 
                strokeWidth="8" 
                strokeLinecap="round" 
                cx="50" cy="50" r="40" 
                fill="transparent"
                strokeDasharray={`${progressPercent * 2.51327} 251.327`}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-foreground">{progressPercent}%</span>
            </div>
          </div>
          <div className="text-sm font-semibold text-muted-foreground">Overall Progress</div>
        </div>

        {/* Right: Milestone Progress */}
        <div className="flex-1 max-w-[300px] border-l border-border pl-6 hidden lg:block">
          <div className="text-sm font-semibold text-foreground mb-1">Milestone Progress</div>
          <div className="text-xs text-muted-foreground mb-4">{completedMilestones} of {totalMilestones} milestones completed</div>
          <div className="h-20 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path 
                d="M 0,40 Q 10,35 20,40 T 40,30 T 60,25 T 80,10 T 100,5" 
                fill="none" 
                className="stroke-primary opacity-30" 
                strokeWidth="2" 
              />
              <path 
                d="M 0,40 Q 10,35 20,40" 
                fill="none" 
                className="stroke-primary" 
                strokeWidth="2" 
              />
              <circle cx="0" cy="40" r="2" className="fill-primary" />
              <circle cx="20" cy="40" r="2" className="fill-primary" />
              <circle cx="40" cy="30" r="2" className="fill-muted stroke-primary stroke-2" />
              <circle cx="60" cy="25" r="2" className="fill-muted stroke-primary stroke-2" />
              <circle cx="80" cy="10" r="2" className="fill-muted stroke-primary stroke-2" />
              <circle cx="100" cy="5" r="2" className="fill-muted stroke-primary stroke-2" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
