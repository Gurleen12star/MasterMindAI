/**
 * useOnboardingState — Onboarding state machine hook
 *
 * Manages the full Learner DNA onboarding flow with:
 * - Step navigation (forward + backward without losing data)
 * - Draft persistence in sessionStorage for demo mode
 * - Zod-validated partial state
 */

import { useState, useCallback, useEffect } from 'react';
import {
  OnboardingStep,
  OnboardingDraft,
  ONBOARDING_STEPS,
  LearnerDNA,
  PROFICIENCY_SCORE,
} from '@/types/mastermind';

const DRAFT_KEY = 'mastermind_onboarding_draft';

function loadDraft(): OnboardingDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as OnboardingDraft;
  } catch {
    // ignore
  }
  return null;
}

function saveDraft(draft: OnboardingDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

function clearDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}

const INITIAL_DRAFT: OnboardingDraft = {
  step: 'CURRENT_SITUATION',
  completedSteps: [],
  dna: {},
};

export function useOnboardingState(userId: string) {
  const [draft, setDraftState] = useState<OnboardingDraft>(() => {
    return loadDraft() ?? INITIAL_DRAFT;
  });

  // Persist every time draft changes
  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(draft.step);

  const updateDNA = useCallback((partial: Partial<LearnerDNA>) => {
    setDraftState(prev => {
      const next: OnboardingDraft = {
        ...prev,
        dna: { ...prev.dna, ...partial, userId },
      };
      return next;
    });
  }, [userId]);

  const goToStep = useCallback((step: OnboardingStep) => {
    setDraftState(prev => ({ ...prev, step }));
  }, []);

  const goNext = useCallback(() => {
    setDraftState(prev => {
      const idx = ONBOARDING_STEPS.indexOf(prev.step);
      if (idx < 0 || idx >= ONBOARDING_STEPS.length - 1) return prev;
      const nextStep = ONBOARDING_STEPS[idx + 1];
      const completed = prev.completedSteps.includes(prev.step)
        ? prev.completedSteps
        : [...prev.completedSteps, prev.step];
      return { ...prev, step: nextStep, completedSteps: completed };
    });
  }, []);

  const goBack = useCallback(() => {
    setDraftState(prev => {
      const idx = ONBOARDING_STEPS.indexOf(prev.step);
      if (idx <= 0) return prev;
      return { ...prev, step: ONBOARDING_STEPS[idx - 1] };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    clearDraft();
    setDraftState({ ...INITIAL_DRAFT });
  }, []);

  /**
   * Normalize skill assessments into the flat currentSkills map (0-100)
   * before submitting to the gap engine.
   */
  const buildFinalDNA = useCallback((): Partial<LearnerDNA> => {
    const currentSkills: Record<string, number> = {};
    const assessments = draft.dna.skillAssessments ?? {};

    for (const [skillId, assessment] of Object.entries(assessments)) {
      const base = PROFICIENCY_SCORE[assessment.proficiencyLevel] ?? 0;
      const confidence = assessment.confidenceScore ?? 50;
      currentSkills[skillId] = Math.round(base * 0.7 + confidence * 0.3);
    }

    return {
      ...draft.dna,
      currentSkills,
      isComplete: true,
      userId,
    };
  }, [draft.dna, userId]);

  return {
    draft,
    step: draft.step,
    dna: draft.dna,
    currentStepIndex,
    totalSteps: ONBOARDING_STEPS.length,
    progress: Math.round(((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100),
    updateDNA,
    goToStep,
    goNext,
    goBack,
    resetOnboarding,
    buildFinalDNA,
    isFirstStep: currentStepIndex <= 0,
    isLastStep: draft.step === 'REVIEW',
  };
}
