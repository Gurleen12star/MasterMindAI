import { Clock, BookOpen, Trophy, Target } from 'lucide-react';

const stats = [
  {
    label: 'Learning Time',
    value: '12h 30m',
    icon: Clock,
    trend: '+2.5h this week',
    trendUp: true,
  },
  {
    label: 'Courses',
    value: '8',
    icon: BookOpen,
    trend: '2 in progress',
    trendUp: true,
  },
  {
    label: 'Achievements',
    value: '15',
    icon: Trophy,
    trend: 'Silver tier',
    trendUp: true,
  },
  {
    label: 'Goals',
    value: '4/5',
    icon: Target,
    trend: 'On track',
    trendUp: true,
  },
];

export default function OverviewStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-6 bg-card rounded-xl border border-border hover:border-border/80 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-semibold">{stat.value}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={stat.trendUp ? 'text-green-500' : 'text-red-500'}
            >
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}