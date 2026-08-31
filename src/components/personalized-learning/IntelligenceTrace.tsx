import { MasterMindProfile, SkillGap } from '@/types/mastermind';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { ALL_SKILLS } from '@/lib/capabilities';

interface IntelligenceTraceProps {
  profile: MasterMindProfile;
  gaps: SkillGap[];
}

export default function IntelligenceTrace({ profile, gaps }: IntelligenceTraceProps) {
  const safeGaps = Array.isArray(gaps) ? gaps : [];
  const criticalGaps = safeGaps.filter(g => g.criticality === 'critical' || g.criticality === 'high');

  // Safely derive display values from the new LearnerDNA shape
  const roleName = (profile?.careerIntent?.primaryTargetRole ?? '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const industryDisplay =
    profile?.careerIntent?.targetIndustries?.join(', ') || 'Your Target Industry';

  const learningStyles =
    profile?.preferences?.learningStyles?.join(', ').replace(/_/g, ' ') || 'Mixed';

  const weeklyHours = profile?.availability?.weeklyLearningCapacityMinutes
    ? Math.round(profile.availability.weeklyLearningCapacityMinutes / 60)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">MasterMind Intelligence Trace</h3>
          <p className="text-sm text-muted-foreground">How we personalized this path for your DNA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-accent/30 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Your Career Goal</span>
          </div>
          <div className="text-2xl font-bold capitalize truncate">{roleName}</div>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Industry: {industryDisplay}
          </p>
        </Card>

        <Card className="p-4 bg-accent/30 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Learning Profile</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">{learningStyles} Learner</Badge>
            {weeklyHours && (
              <Badge variant="outline">{weeklyHours} hrs/week</Badge>
            )}
            {profile?.careerIntent?.timeframeMonths && (
              <Badge variant="outline">{profile.careerIntent.timeframeMonths} months</Badge>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Critical Skill Gaps Addressed
        </h4>
        {criticalGaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your skills are remarkably close to your target baseline! We've focused this path on advanced projects.
          </p>
        ) : (
          <div className="space-y-3">
            {criticalGaps.map(gap => (
              <div key={gap.skillId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{gap.skillName}</span>
                  <span className="text-muted-foreground">Gap: -{gap.gapSize}</span>
                </div>
                <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary/40 rounded-full"
                    style={{ width: `${gap.requiredLevel}%` }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: `${gap.currentLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
        <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary">
          <TrendingUp className="h-4 w-4" />
          Why Your Path Is Different
        </h4>
        <p className="text-sm leading-relaxed">
          Unlike generic roadmaps, this path front-loads{' '}
          {criticalGaps.length > 0 ? criticalGaps[0].skillName : 'advanced projects'} because it is
          the most critical blocker for your transition into {industryDisplay}. We have compressed
          content related to your existing strengths so you don't waste time on what you already know.
          The capstone project is designed to demonstrate competency to employers in the{' '}
          {industryDisplay} sector.
        </p>
      </div>
    </div>
  );
}
