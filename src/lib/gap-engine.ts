/**
 * MasterMindAI Deterministic Skill Gap Engine
 *
 * Deterministically calculates skill gaps from a learner's profile vs the
 * capability registry. This module has ZERO AI dependency — it computes
 * pure math from structured configuration.
 *
 * Gap Priority Formula:
 *   priorityScore = normalizedGap × capabilityImportance × skillImportance × urgencyMultiplier
 *
 * Where:
 *   normalizedGap         = gapSize / 100              (0-1)
 *   capabilityImportance  = capability.importance / 10  (0.1 - 1.0)
 *   skillImportance       = skill.importance / 10       (0.1 - 1.0)
 *   urgencyMultiplier     = f(timeline, weeklyCapacity)  (0.5 - 1.5)
 */

import { LearnerDNA, SkillGap, PROFICIENCY_SCORE } from '@/types/mastermind';
import {
  CAPABILITY_REGISTRY,
  ALL_SKILLS,
  type RoleDefinition,
} from './capabilities';

// ──────────────────────────────────────────
// NORMALIZE: Proficiency level -> 0-100 score
// ──────────────────────────────────────────
function getSkillScore(dna: LearnerDNA, skillId: string): number {
  // First check explicit currentSkills map
  const flat = dna.currentSkills?.[skillId];
  if (flat !== undefined) return Math.max(0, Math.min(100, flat));

  // Derive from skillAssessments if available
  const assessment = dna.skillAssessments?.[skillId];
  if (assessment) {
    const base = PROFICIENCY_SCORE[assessment.proficiencyLevel] ?? 0;
    // Blend with confidence: (base * 0.7) + (confidence * 0.3)
    const confidence = assessment.confidenceScore ?? 50;
    return Math.round(base * 0.7 + confidence * 0.3);
  }

  return 0; // Never used / no info
}

// ──────────────────────────────────────────
// URGENCY: How much timeline pressure affects prioritization
// ──────────────────────────────────────────
function urgencyMultiplier(timeframeMonths: number, weeklyMinutes: number): number {
  const totalHours = (weeklyMinutes / 60) * (timeframeMonths * 4);
  if (totalHours < 50) return 1.5;   // Very tight — high urgency
  if (totalHours < 100) return 1.2;
  if (totalHours < 200) return 1.0;
  return 0.8;                         // Plenty of time — lower urgency weight
}

// ──────────────────────────────────────────
// GAP EXPLANATION: Deterministic, data-driven
// ──────────────────────────────────────────
function buildExplanation(
  skillId: string,
  skillName: string,
  capabilityName: string,
  roleName: string,
  currentLevel: number,
  requiredLevel: number,
  criticality: SkillGap['criticality'],
  prerequisites: string[],
): string {
  const gapPct = requiredLevel - currentLevel;
  const prereqNames = prerequisites
    .map(id => ALL_SKILLS[id]?.name ?? id)
    .filter(Boolean);

  if (criticality === 'critical') {
    let explanation = `${skillName} is a critical gap for your ${roleName} target. Your current level is ${currentLevel}/100, but the role requires at least ${requiredLevel}/100 — a gap of ${gapPct} points. This skill is foundational to the "${capabilityName}" capability and must be addressed early in your path.`;
    if (prereqNames.length > 0) {
      explanation += ` It also unlocks downstream skills: ${prereqNames.join(', ')}.`;
    }
    return explanation;
  }

  if (criticality === 'high') {
    return `${skillName} is a high-priority gap. Your current score of ${currentLevel}/100 needs to reach ${requiredLevel}/100 for the "${capabilityName}" capability. Closing this gap will meaningfully improve your job-readiness as a ${roleName}.`;
  }

  if (criticality === 'medium') {
    return `You're developing in ${skillName} (${currentLevel}/100, target ${requiredLevel}/100). This skill contributes to "${capabilityName}" — strengthening it will make you a more competitive ${roleName} candidate.`;
  }

  return `Your ${skillName} is close to the target (${currentLevel} vs ${requiredLevel}). A targeted project or focused practice will close this gap quickly.`;
}

// ──────────────────────────────────────────
// CORE: Calculate skill gaps for a role
// ──────────────────────────────────────────
function calculateGapsForRole(
  dna: LearnerDNA,
  role: RoleDefinition,
): SkillGap[] {
  const gaps: SkillGap[] = [];
  const timeframeMonths = dna.careerIntent.timeframeMonths;
  const weeklyMinutes = dna.availability.weeklyLearningCapacityMinutes;
  const urgency = urgencyMultiplier(timeframeMonths, weeklyMinutes);

  for (const capability of role.capabilities) {
    for (const skillReq of capability.skills) {
      const currentLevel = getSkillScore(dna, skillReq.skillId);
      const requiredLevel = skillReq.requiredLevel;
      const gapSize = requiredLevel - currentLevel;

      // No gap — learner meets or exceeds requirement
      if (gapSize <= 0) continue;

      // Criticality based on raw gap size
      let criticality: SkillGap['criticality'] = 'low';
      if (gapSize >= 50) criticality = 'critical';
      else if (gapSize >= 30) criticality = 'high';
      else if (gapSize >= 15) criticality = 'medium';

      // Priority score formula
      const normalizedGap = gapSize / 100;
      const capImportance = capability.importance / 10;
      const skillImportance = skillReq.importance / 10;
      const priorityScore = Math.round(
        normalizedGap * capImportance * skillImportance * urgency * 100
      );

      const skillMeta = ALL_SKILLS[skillReq.skillId] ?? {
        name: skillReq.skillId,
        category: 'Other',
      };

      const explanation = buildExplanation(
        skillReq.skillId,
        skillMeta.name,
        capability.name,
        role.roleName,
        currentLevel,
        requiredLevel,
        criticality,
        skillReq.prerequisites,
      );

      gaps.push({
        skillId: skillReq.skillId,
        skillName: skillMeta.name,
        skillCategory: skillMeta.category,
        currentLevel,
        requiredLevel,
        gapSize,
        priorityScore,
        criticality,
        explanation,
        capabilityName: capability.name,
      });
    }
  }

  // Sort: highest priorityScore first (most impactful gap)
  return gaps.sort((a, b) => b.priorityScore - a.priorityScore);
}

// ──────────────────────────────────────────
// PUBLIC API
// ──────────────────────────────────────────
export function calculateSkillGaps(dna: LearnerDNA): SkillGap[] {
  if (!dna) return [];
  
  const roleId = dna.careerIntent?.primaryTargetRole || 'ai-engineer';
  const role = CAPABILITY_REGISTRY[roleId];

  if (!role) {
    console.warn(
      `[GapEngine] Role "${roleId}" not found in registry. Falling back to ai-engineer.`
    );
    const fallback = CAPABILITY_REGISTRY['ai-engineer'];
    return calculateGapsForRole(dna, fallback);
  }

  return calculateGapsForRole(dna, role);
}

// ──────────────────────────────────────────
// PERSONALIZATION FACTORS
// Generate human-readable "Why Your Path Is Different" factors
// ──────────────────────────────────────────
export function generatePersonalizationFactors(
  dna: LearnerDNA,
  gaps: SkillGap[],
) {
  const factors: Array<{ factor: string; value: string; impact: string }> = [];

  // Target role
  factors.push({
    factor: 'Target Role',
    value: dna.careerIntent.primaryTargetRole.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    impact: 'Determines which capabilities and skills are required.',
  });

  // Industry
  if ((dna.careerIntent?.targetIndustries ?? []).length > 0) {
    factors.push({
      factor: 'Target Industry',
      value: dna.careerIntent.targetIndustries!.join(', '),
      impact: 'Influences project context and industry-specific examples in your path.',
    });
  }

  // Companies
  if ((dna.careerIntent?.targetCompanies ?? []).length > 0) {
    factors.push({
      factor: 'Target Companies',
      value: dna.careerIntent.targetCompanies!.join(', '),
      impact: 'Used as a personalization signal to tailor preparation style and project themes.',
    });
  }

  // Time availability
  const hours = Math.round((dna.availability?.weeklyLearningCapacityMinutes ?? 600) / 60);
  factors.push({
    factor: 'Weekly Learning Time',
    value: `~${hours} hours/week`,
    impact:
      hours < 7
        ? 'Limited time means fewer concurrent tracks and higher focus on top-priority gaps.'
        : hours > 20
        ? 'High availability allows faster progression and parallel learning tracks.'
        : 'Moderate availability — path is balanced between depth and breadth.',
  });

  // Timeline
  factors.push({
    factor: 'Timeline',
    value: `${dna.careerIntent?.timeframeMonths ?? 6} months`,
    impact: 'Affects the pace, depth, and number of topics covered.',
  });

  // Skill compression for advanced skills
  const advancedSkills = Object.entries(dna.currentSkills ?? {})
    .filter(([, score]) => score >= 70)
    .map(([skillId]) => ALL_SKILLS[skillId]?.name ?? skillId);

  if (advancedSkills.length > 0) {
    factors.push({
      factor: 'Existing Strengths',
      value: advancedSkills.slice(0, 3).join(', '),
      impact: `Beginner content for these skills was compressed or skipped to avoid wasting your time.`,
    });
  }

  // Top gaps
  const topGaps = gaps.slice(0, 3).map(g => g.skillName);
  if (topGaps.length > 0) {
    factors.push({
      factor: 'Highest-Impact Gaps',
      value: topGaps.join(', '),
      impact: 'These gaps were prioritized at the beginning of your path based on their importance to your target role.',
    });
  }

  // Learning preferences
  if ((dna.preferences?.learningStyles ?? []).length > 0) {
    factors.push({
      factor: 'Learning Style',
      value: dna.preferences!.learningStyles!.join(', ').replace(/_/g, ' '),
      impact: 'Influenced the ratio of project-based vs conceptual content in your path.',
    });
  }

  // Project preferences
  if ((dna.preferences?.projectPreferences ?? []).length > 0) {
    factors.push({
      factor: 'Project Style',
      value: dna.preferences!.projectPreferences!.join(', ').replace(/_/g, ' '),
      impact: 'Projects in your path were selected to match your preferred project type.',
    });
  }

  return factors;
}

// ──────────────────────────────────────────
// FEASIBILITY CHECK
// ──────────────────────────────────────────
export interface FeasibilityResult {
  isRealistic: boolean;
  estimatedMinutes: number;
  availableMinutes: number;
  message: string;
}

export function checkFeasibility(dna: LearnerDNA, gaps: SkillGap[]): FeasibilityResult {
  const months = dna.careerIntent?.timeframeMonths ?? 6;
  const weeklyMinutes = dna.availability?.weeklyLearningCapacityMinutes ?? 600;
  const weeksAvailable = months * 4.3;
  const availableMinutes = weeklyMinutes * weeksAvailable;

  // Rough effort estimate: each gap point costs ~30 minutes of focused study
  const estimatedMinutes = gaps.reduce((sum, g) => sum + g.gapSize * 30, 0);

  const ratio = availableMinutes / estimatedMinutes;
  const isRealistic = ratio >= 0.7; // Within 30% buffer is considered feasible

  let message = '';
  if (ratio >= 1.2) {
    message = 'Your timeline and availability are well-suited for this learning path. You may have capacity for extra projects.';
  } else if (isRealistic) {
    message = 'Your timeline is achievable with consistent effort. Stay focused on high-priority gaps first.';
  } else {
    const extra = Math.ceil((estimatedMinutes - availableMinutes) / (weeklyMinutes * 4.3));
    message = `Your timeline is ambitious. You may need ${extra} additional month(s), or you can prioritize the most critical gaps and defer lower-priority skills.`;
  }

  return { isRealistic, estimatedMinutes, availableMinutes, message };
}
