/**
 * Explainability utilities for MasterMindAI
 *
 * All explanations are generated deterministically from structured data.
 * No generic motivational text — every sentence references actual learner fields.
 */

import { SkillGap, CareerIntent, IntelligenceTrace, PersonalizationFactor } from '@/types/mastermind';

export function generateGapExplanation(gap: SkillGap, intent: CareerIntent): string {
  const roleName = intent.primaryTargetRole
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  if (gap.criticality === 'critical') {
    return `${gap.skillName} is a critical gap for your ${roleName} path. Your current score (${gap.currentLevel}/100) is significantly below the required ${gap.requiredLevel}/100. This skill is core to the "${gap.capabilityName}" capability and should be prioritized immediately.`;
  }

  if (gap.criticality === 'high') {
    return `Your ${gap.skillName} needs meaningful improvement (${gap.currentLevel} → ${gap.requiredLevel}). As part of "${gap.capabilityName}", this skill directly affects your readiness as a ${roleName}.`;
  }

  if (gap.criticality === 'medium') {
    return `You're developing in ${gap.skillName}. Closing this gap (${gap.currentLevel} → ${gap.requiredLevel}) will noticeably strengthen your "${gap.capabilityName}" capability for a ${roleName} role.`;
  }

  return `You're close to the target for ${gap.skillName} (${gap.currentLevel} vs ${gap.requiredLevel}). A focused project will complete this quickly.`;
}

export function generateIntelligenceTrace(
  gaps: SkillGap[],
  intent: CareerIntent,
  personalizationFactors: PersonalizationFactor[] = [],
): IntelligenceTrace {
  const roleName = intent.primaryTargetRole
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const primaryGap = gaps[0];

  let reasoning = `Your goal is to become a ${roleName} in ${intent.timeframeMonths} months. `;

  if (gaps.length === 0) {
    reasoning += `Your current skills already meet or exceed baseline requirements. We recommend focusing on advanced projects, interview preparation, and portfolio building.`;
  } else {
    reasoning += `We identified ${gaps.length} skill gaps. The highest-priority gap is ${primaryGap.skillName} (current: ${primaryGap.currentLevel}/100, required: ${primaryGap.requiredLevel}/100).`;
  }

  return {
    timestamp: new Date().toISOString(),
    careerIntent: intent,
    identifiedGaps: gaps,
    reasoning,
    recommendedAction:
      gaps.length > 0
        ? `Prioritize ${primaryGap.skillName} first — it unlocks downstream capabilities in your path.`
        : 'Focus on advanced specialization and interview preparation.',
    personalizationFactors,
  };
}
