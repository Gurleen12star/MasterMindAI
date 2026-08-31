/**
 * AnalyzingPage — MasterMindAI Intelligence Analysis
 *
 * Runs sequentially:
 * 1. Loads the Learner DNA draft from sessionStorage
 * 2. Runs the deterministic gap engine
 * 3. Calls the AI Edge Function with the full payload (ONE call)
 * 4. Persists the roadmap
 * 5. Transitions to gap results view
 *
 * THEME: Semantic tokens — works in BOTH light + dark mode
 * LOGO: Uses real MasterMindLogo
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MasterMindLogo from '@/components/ui/MasterMindLogo';
import { useAuth } from '@/components/auth/AuthContext';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import { calculateSkillGaps, generatePersonalizationFactors, checkFeasibility } from '@/lib/gap-engine';
import { generateRoadmap } from '@/lib/gemini';
import { convertLearningPathToMermaid } from '@/lib/mermaid-adapter';
import {
  AnalysisStep,
  ANALYSIS_MESSAGES,
  LearnerDNA,
  SkillGap,
} from '@/types/mastermind';

const DRAFT_KEY = 'mastermind_onboarding_draft';
const ANALYSIS_RESULT_KEY = 'mastermind_analysis_result';

const STEP_ORDER: AnalysisStep[] = [
  'understanding_goal',
  'mapping_capabilities',
  'comparing_skills',
  'identifying_gaps',
  'optimizing_time',
  'personalizing_projects',
  'building_path',
  'complete',
];

// Criticality color map
function critColor(criticality: SkillGap['criticality']) {
  if (criticality === 'critical') return 'text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/10';
  if (criticality === 'high') return 'text-orange-600 dark:text-orange-400 border-orange-500/30 bg-orange-500/10';
  if (criticality === 'medium') return 'text-amber-600 dark:text-yellow-400 border-amber-500/30 bg-amber-500/10';
  return 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/10';
}

function critLabel(criticality: SkillGap['criticality']) {
  return criticality.charAt(0).toUpperCase() + criticality.slice(1);
}

export default function AnalyzingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveRoadmap } = useRoadmaps();

  const [currentAnalysisStep, setCurrentAnalysisStep] = useState<AnalysisStep>('understanding_goal');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [personalizationFactors, setPersonalizationFactors] = useState<any[]>([]);
  const [feasibility, setFeasibility] = useState<any | null>(null);
  const [selectedGapIdx, setSelectedGapIdx] = useState<number | null>(null);
  const [dna, setDna] = useState<LearnerDNA | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    runAnalysis();
  }, []);

  async function advanceStep(step: AnalysisStep, delay = 800): Promise<void> {
    return new Promise(resolve => {
      setCurrentAnalysisStep(step);
      setTimeout(resolve, delay);
    });
  }

  async function runAnalysis() {
    // 1. Load DNA
    await advanceStep('understanding_goal', 600);
    let rawDraft: any = null;
    try {
      const stored = sessionStorage.getItem(DRAFT_KEY);
      rawDraft = stored ? JSON.parse(stored) : null;
    } catch {
      // ignore
    }

    const loadedDNA: LearnerDNA | null = rawDraft?.dna ?? null;
    setDna(loadedDNA);

    if (!loadedDNA || !loadedDNA.careerIntent?.primaryTargetRole) {
      setAiError('No Learner DNA found. Please complete the onboarding first.');
      setAnalysisComplete(true);
      return;
    }

    // 2. Deterministic gap calculation
    await advanceStep('mapping_capabilities', 700);
    await advanceStep('comparing_skills', 700);
    const calculatedGaps = calculateSkillGaps(loadedDNA);
    setGaps(calculatedGaps);

    await advanceStep('identifying_gaps', 600);
    const factors = generatePersonalizationFactors(loadedDNA, calculatedGaps);
    setPersonalizationFactors(factors);

    const feasibilityResult = checkFeasibility(loadedDNA, calculatedGaps);
    setFeasibility(feasibilityResult);

    await advanceStep('optimizing_time', 700);
    await advanceStep('personalizing_projects', 700);

    // 3. Single optimized AI call
    await advanceStep('building_path', 600);

    let roadmapData = null;
    let mermaidCode = '';

    try {
      const topic = loadedDNA.careerIntent.primaryTargetRole.replace(/-/g, ' ');
      roadmapData = await generateRoadmap(topic, loadedDNA, calculatedGaps);
      mermaidCode = convertLearningPathToMermaid(roadmapData);
    } catch (err: any) {
      console.error('[AnalyzingPage] AI generation error:', err);
      setAiError(`AI path generation encountered an error: ${err.message || 'Unknown error'}. Your skill gap analysis is still available below.`);
    }

    // 4. Persist result (gaps always persist; roadmap only if AI succeeded)
    const analysisResult = {
      dna: loadedDNA,
      gaps: calculatedGaps,
      personalizationFactors: factors,
      feasibility: feasibilityResult,
      roadmap: roadmapData,
      mermaidCode,
      generatedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(ANALYSIS_RESULT_KEY, JSON.stringify(analysisResult));
    } catch {
      // ignore
    }

    // 5. Save to persistence layer (Supabase or Demo sessionStorage)
    if (roadmapData && user?.id) {
      try {
        await saveRoadmap({
          topic: loadedDNA.careerIntent.primaryTargetRole,
          mermaid_code: mermaidCode,
          structured_data: roadmapData,
          intelligence_trace: { gaps: calculatedGaps, factors },
          learner_snapshot: loadedDNA,
          user_id: user.id,
        });
      } catch (saveErr) {
        console.error('[AnalyzingPage] Save roadmap error:', saveErr);
      }
    }

    await advanceStep('complete', 400);
    setAnalysisComplete(true);
  }

  // ──────────────────────────────────────────
  // ANIMATION PHASE
  // ──────────────────────────────────────────
  if (!analysisComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative bg-background">
        <div className="fixed inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="fixed inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo pulse */}
          <motion.div
            className="relative mb-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150" />
            <MasterMindLogo className="h-24 w-24 text-primary relative z-10" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ scale: [1, 1.4, 1.8], opacity: [0.5, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            MasterMindAI is understanding you
          </h2>

          {/* Step messages */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentAnalysisStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-muted-foreground text-sm"
              >
                {ANALYSIS_MESSAGES[currentAnalysisStep]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Step dots */}
          <div className="flex gap-2 mt-8">
            {STEP_ORDER.slice(0, -1).map((s, i) => {
              const currentIdx = STEP_ORDER.indexOf(currentAnalysisStep);
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <motion.div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isDone ? 'bg-primary w-4' : isActive ? 'bg-primary/70 w-4' : 'bg-primary/20 w-2'
                  }`}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // RESULTS PHASE
  // ──────────────────────────────────────────
  const topGaps = gaps.slice(0, 8);
  const roleName = dna?.careerIntent?.primaryTargetRole
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase()) ?? 'Your Target Role';

  return (
    <div className="min-h-screen relative px-4 py-10 bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex items-center justify-center">
            <MasterMindLogo className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Your Career Gap Analysis
            </h1>
            <p className="text-sm text-muted-foreground">For {roleName}</p>
          </div>
        </div>

        {/* AI Error state */}
        {aiError && (
          <div className="mb-6 p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-1">
                AI path generation is temporarily unavailable
              </div>
              <div className="text-xs text-orange-800 dark:text-orange-300 opacity-80">{aiError}</div>
            </div>
          </div>
        )}

        {/* Feasibility notice */}
        {feasibility && !feasibility.isRealistic && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <div className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
              ⚠️ Your timeline is ambitious
            </div>
            <div className="text-xs text-amber-800 dark:text-amber-300 opacity-80">{feasibility.message}</div>
          </div>
        )}

        {/* Skill Gaps */}
        {topGaps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Your Highest-Impact Gaps</h2>
            <div className="space-y-2">
              {topGaps.map((gap, idx) => (
                <div key={gap.skillId}>
                  <motion.button
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${critColor(gap.criticality)}`}
                    onClick={() => setSelectedGapIdx(selectedGapIdx === idx ? null : idx)}
                    whileHover={{ scale: 1.01 }}
                    id={`gap-${gap.skillId}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                          {critLabel(gap.criticality)}
                        </span>
                        <span className="text-sm font-semibold">{gap.skillName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium opacity-80">
                        <span className="hidden sm:inline">{gap.capabilityName}</span>
                        <span>{gap.currentLevel} → {gap.requiredLevel}</span>
                      </div>
                    </div>

                    {/* Gap bar */}
                    <div className="mt-3 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-current opacity-70"
                        style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                      />
                    </div>
                  </motion.button>

                  {/* Expandable explanation */}
                  <AnimatePresence>
                    {selectedGapIdx === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-muted/50 border border-border rounded-b-xl -mt-2 text-sm text-muted-foreground leading-relaxed">
                          <div className="text-xs font-semibold text-foreground mb-1">
                            WHY THIS GAP MATTERS
                          </div>
                          {gap.explanation}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {gaps.length === 0 && (
          <div className="mb-8 p-6 rounded-xl border border-green-500/30 bg-green-500/10 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
              Your skills already meet many requirements for {roleName}!
            </div>
            <div className="text-xs text-green-800 dark:text-green-300 opacity-80 mt-1">
              Focus on interview preparation, portfolio projects, and advanced specialization.
            </div>
          </div>
        )}

        {/* Personalization Proof */}
        {personalizationFactors.length > 0 && (
          <Card className="bg-card border border-border shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Why Your Path Is Different</h2>
            </div>
            <div className="space-y-3">
              {personalizationFactors.map(f => (
                <div key={f.factor} className="p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-0.5">
                        {f.factor}
                      </div>
                      <div className="text-sm font-semibold text-foreground mb-1">{f.value}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{f.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25"
            onClick={() => navigate('/dashboard')}
            id="go-to-dashboard-btn"
          >
            <span>View My Personalized Roadmap</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-muted"
            onClick={() => navigate('/onboarding')}
            id="edit-profile-btn"
          >
            Edit Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
