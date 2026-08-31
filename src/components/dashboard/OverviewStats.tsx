import { Clock, BookOpen, Trophy, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    label: 'Learning Time',
    value: '12h 30m',
    icon: Clock,
    trend: '+2.5h this week',
    trendUp: true
  },
  {
    label: 'Courses',
    value: '8',
    icon: BookOpen,
    trend: '2 in progress',
    trendUp: true
  },
  {
    label: 'Achievements',
    value: '15',
    icon: Trophy,
    trend: 'Silver tier',
    trendUp: true
  },
  {
    label: 'Goals',
    value: '4/5',
    icon: Target,
    trend: 'On track',
    trendUp: true
  },
];

export default function OverviewStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/40 hover:border-primary/20 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 before:absolute before:inset-0 before:rounded-xl before:bg-primary/5 before:animate-pulse">
              <stat.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {stat.value}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={75} className="h-1 bg-primary/10" />
            <div className="mt-2 flex items-center gap-2 text-sm">
              {stat.trendUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={stat.trendUp ? 'text-green-500' : 'text-red-500'}
            >
                {stat.trend}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}