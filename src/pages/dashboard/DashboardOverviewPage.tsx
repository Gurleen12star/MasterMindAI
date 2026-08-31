/**
 * DashboardOverviewPage — The primary landing page for MasterMindAI dashboard
 * Displays the currently active roadmap and learner intent.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Clock, ArrowRight, Brain, AlertCircle, BookOpen, Layers, Star, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthContext';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import MasterMindLogo from '@/components/ui/MasterMindLogo';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roadmaps, isLoading } = useRoadmaps();
  
  // The most recent roadmap
  const activeRoadmap = roadmaps && roadmaps.length > 0 ? roadmaps[0] : null;
  const dna = activeRoadmap?.learner_snapshot;
  const gaps = activeRoadmap?.intelligence_trace?.gaps || [];
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (isLoading || !mounted) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <MasterMindLogo className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground text-sm font-medium">Loading your career path...</p>
        </div>
      </div>
    );
  }

  // If no roadmap exists, prompt them to onboard
  if (!activeRoadmap || !dna) {
    return (
      <div className="flex h-[70vh] items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 border-border shadow-sm text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">No Career Path Found</h2>
          <p className="text-muted-foreground mb-8">
            You haven't generated a personalized career path yet. Let MasterMindAI build your unique learning DNA.
          </p>
          <Button 
            className="w-full bg-primary text-primary-foreground font-semibold"
            onClick={() => navigate('/onboarding/intro')}
          >
            Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // Safe extractions
  const role = dna?.careerIntent?.primaryTargetRole?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Target Role';
  const industry = (dna?.careerIntent?.targetIndustries && dna.careerIntent.targetIndustries.length > 0) 
    ? dna.careerIntent.targetIndustries.join(', ') 
    : 'Tech Industry';
  const company = (dna?.careerIntent?.targetCompanies && dna.careerIntent.targetCompanies.length > 0)
    ? dna.careerIntent.targetCompanies[0]
    : 'Tech Companies';
  
  const weeklyHours = dna?.availability?.weeklyLearningCapacityMinutes 
    ? Math.round(dna.availability.weeklyLearningCapacityMinutes / 60)
    : 0;
  const months = dna?.careerIntent?.timeframeMonths || 6;
  
  const topGap = gaps.length > 0 ? gaps[0] : null;
  const currentPhase = activeRoadmap?.structured_data?.phases?.[0];
  const nextStep = currentPhase?.modules?.[0];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.user_metadata?.first_name || 'Learner'}</h1>
          <p className="text-muted-foreground mt-1">Here's the current state of your journey.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Career Path Card */}
        <Card className="lg:col-span-2 overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6 bg-muted/30">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Your Current Career Path
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{role}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
              <span className="flex items-center"><Target className="w-4 h-4 mr-1"/> {industry}</span>
              <span className="hidden sm:inline text-border">•</span>
              <span className="flex items-center"><Star className="w-4 h-4 mr-1"/> Targeting {company}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Phase</div>
                <div className="font-semibold text-foreground">{currentPhase?.title || 'Phase 1: Foundation'}</div>
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{currentPhase?.description || 'Building your core skills.'}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Top Skill Gap</div>
                {topGap ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground text-sm">{topGap.skillName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {topGap.currentLevel}% → {topGap.requiredLevel}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-green-600">No critical gaps identified</div>
                )}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                <Play className="w-4 h-4" /> Next Recommended Step
              </div>
              <div className="font-semibold text-foreground text-lg mb-1">
                {nextStep?.title || 'Start Learning'}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {nextStep?.description || 'Begin your first module in the personalized path.'}
              </div>
              <div className="flex gap-2">
                {nextStep?.topics?.slice(0, 3).map((t: string) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => navigate('/dashboard/roadmap-generator')}
            >
              <Layers className="w-4 h-4 mr-2" /> View Full Roadmap
            </Button>
          </div>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Path Configuration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Weekly Capacity</div>
                  <div className="font-semibold text-sm text-foreground">~{weeklyHours} hours / week</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Path Duration</div>
                  <div className="font-semibold text-sm text-foreground">{months} Months</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Learning Style</div>
                  <div className="font-semibold text-sm text-foreground truncate max-w-[150px]">
                    {dna.preferences?.learningStyles?.join(', ').replace(/_/g, ' ') || 'Mixed'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">MasterMindAI V2</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Your path is fully personalized based on your Learner DNA.
            </p>
            <Button variant="outline" className="w-full text-xs h-8" onClick={() => navigate('/onboarding')}>
              Recalibrate Path
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
