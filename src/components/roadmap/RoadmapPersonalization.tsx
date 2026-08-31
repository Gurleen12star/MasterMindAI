import React from 'react';
import { Sparkles, Code2, Clock, Building2, BarChart } from 'lucide-react';

interface Factor {
  factor: string;
  value: string;
  impact: string;
}

interface RoadmapPersonalizationProps {
  factors: Factor[];
}

const ICONS: Record<string, React.ElementType> = {
  'Learning Style': Code2,
  'Timeline': Clock,
  'Project Style': Building2,
  'Highest-Impact Gaps': BarChart,
  'Weekly Learning Time': Clock,
};

export default function RoadmapPersonalization({ factors }: RoadmapPersonalizationProps) {
  if (!factors || factors.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center">
          Why this path is personalized for you
          <Sparkles className="w-4 h-4 ml-2 text-primary" />
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {factors.slice(0, 4).map((f, i) => {
          const Icon = ICONS[f.factor] || Sparkles;
          return (
            <div key={i} className="bg-white dark:bg-card border border-border shadow-sm rounded-xl p-4 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground leading-snug">
                  {f.impact}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
