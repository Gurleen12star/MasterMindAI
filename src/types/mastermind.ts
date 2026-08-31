import { z } from 'zod';

// ============================================================
// PROFICIENCY & CONFIDENCE — kept separate by design
// ============================================================
export const ProficiencyLevelEnum = z.enum([
  'never_used',
  'beginner',
  'developing',
  'intermediate',
  'advanced',
  'professional',
  'expert',
]);
export type ProficiencyLevel = z.infer<typeof ProficiencyLevelEnum>;

export const PROFICIENCY_SCORE: Record<ProficiencyLevel, number> = {
  never_used: 0,
  beginner: 15,
  developing: 30,
  intermediate: 50,
  advanced: 70,
  professional: 85,
  expert: 100,
};

export const PROFICIENCY_LABEL: Record<ProficiencyLevel, string> = {
  never_used: 'Never Used',
  beginner: 'Beginner',
  developing: 'Developing',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  professional: 'Professional',
  expert: 'Expert',
};

export const PROFICIENCY_DESCRIPTION: Record<ProficiencyLevel, string> = {
  never_used: "I haven't used this skill before.",
  beginner: 'I understand the basics but need guidance.',
  developing: 'I can complete simple tasks with support.',
  intermediate: 'I can build independently with occasional help.',
  advanced: 'I can solve complex problems independently.',
  professional: 'I use this skill in real projects or work.',
  expert: 'I can design, teach, review and lead work in this area.',
};

// ============================================================
// EVIDENCE
// ============================================================
export const EvidenceTypeEnum = z.enum([
  'none',
  'resume',
  'github',
  'portfolio',
  'project',
  'course',
  'certification',
  'work_experience',
  'open_source',
]);
export type EvidenceType = z.infer<typeof EvidenceTypeEnum>;

export const SkillEvidenceSchema = z.object({
  type: EvidenceTypeEnum,
  label: z.string().optional(),
  url: z.string().optional(),
});
export type SkillEvidence = z.infer<typeof SkillEvidenceSchema>;

// ============================================================
// SKILL ASSESSMENT — a single skill being evaluated
// ============================================================
export const SkillAssessmentSchema = z.object({
  skillId: z.string(),
  proficiencyLevel: ProficiencyLevelEnum,
  confidenceScore: z.number().min(0).max(100),
  evidence: SkillEvidenceSchema.optional(),
});
export type SkillAssessment = z.infer<typeof SkillAssessmentSchema>;

// ============================================================
// CAREER INTENT — what the learner wants to achieve
// ============================================================
export const CareerIntentSchema = z.object({
  primaryTargetRole: z.string(),
  additionalTargetRoles: z.array(z.string()).default([]),
  targetIndustries: z.array(z.string()).min(1),
  targetCompanies: z.array(z.string()).default([]),
  targetLocations: z.array(z.string()).default([]),
  workMode: z.enum(['remote', 'hybrid', 'on-site', 'flexible']).optional(),
  seniority: z.enum([
    'internship', 'entry', 'graduate', 'junior', 'mid', 'senior', 'career_switch'
  ]).optional(),
  timeframeMonths: z.number().min(1).max(60),
});
export type CareerIntent = z.infer<typeof CareerIntentSchema>;

// ============================================================
// LEARNING PREFERENCES
// ============================================================
export const LearningPreferencesSchema = z.object({
  learningStyles: z.array(z.enum([
    'visual', 'reading', 'video', 'hands_on', 'project_based',
    'theory_first', 'practice_first', 'mixed'
  ])).default(['mixed']),
  projectPreferences: z.array(z.enum([
    'portfolio', 'real_world', 'hackathon', 'open_source',
    'research', 'freelance', 'startup', 'interview', 'academic'
  ])).default(['portfolio']),
  projectScale: z.enum(['small', 'medium', 'large', 'capstone']).default('medium'),
  technologyPreferences: z.object({
    languages: z.array(z.string()).default([]),
    frameworks: z.array(z.string()).default([]),
    cloud: z.array(z.string()).default([]),
    databases: z.array(z.string()).default([]),
  }).default({}),
});
export type LearningPreferences = z.infer<typeof LearningPreferencesSchema>;

// ============================================================
// AVAILABILITY
// ============================================================
export const AvailabilitySchema = z.object({
  amountPerDay: z.number().min(0).optional(),
  amountPerWeek: z.number().min(0).optional(),
  studyDaysPerWeek: z.number().min(1).max(7).default(5),
  weeklyLearningCapacityMinutes: z.number().min(30),
});
export type Availability = z.infer<typeof AvailabilitySchema>;

// ============================================================
// CURRENT SITUATION
// ============================================================
export const CurrentSituationEnum = z.enum([
  'high_school', 'undergraduate', 'postgraduate', 'masters', 'phd',
  'diploma', 'bootcamp', 'online_learner', 'self_taught',
  'working_professional', 'software_professional', 'engineer',
  'manager', 'consultant', 'researcher', 'professor', 'teacher',
  'freelancer', 'entrepreneur', 'founder',
  'career_switcher', 'returning_to_work', 'upskilling', 'reskilling',
  'first_job', 'internship_prep', 'promotion_prep', 'other'
]);
export type CurrentSituation = z.infer<typeof CurrentSituationEnum>;

// ============================================================
// LEARNER DNA — the full profile built during onboarding
// ============================================================
export const LearnerDNASchema = z.object({
  id: z.string().optional(),
  userId: z.string(),

  // Background
  currentSituation: CurrentSituationEnum,
  currentSituationCustom: z.string().optional(),

  // Career intent
  careerIntent: CareerIntentSchema,

  // Skills: map of skillId -> assessment
  skillAssessments: z.record(z.string(), SkillAssessmentSchema).default({}),

  // Also maintain a flat score map for the gap engine (0-100 normalized)
  currentSkills: z.record(z.string(), z.number().min(0).max(100)).default({}),

  // Preferences
  preferences: LearningPreferencesSchema.default({}),

  // Availability
  availability: AvailabilitySchema,

  // Optional evidence links
  resumeUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),

  // Metadata
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isComplete: z.boolean().default(false),
});
export type LearnerDNA = z.infer<typeof LearnerDNASchema>;

// Backward-compat alias used in existing code
export type MasterMindProfile = LearnerDNA;

// ============================================================
// SKILL GAP — output of the deterministic gap engine
// ============================================================
export interface SkillGap {
  skillId: string;
  skillName: string;
  skillCategory: string;
  currentLevel: number;       // 0-100 normalized
  requiredLevel: number;      // 0-100 from capability registry
  gapSize: number;            // requiredLevel - currentLevel
  priorityScore: number;      // deterministic composite score
  criticality: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;        // "Why this gap matters"
  capabilityName: string;     // The parent capability
}

// ============================================================
// INTELLIGENCE TRACE — output of gap analysis
// ============================================================
export interface IntelligenceTrace {
  timestamp: string;
  careerIntent: CareerIntent;
  identifiedGaps: SkillGap[];
  reasoning: string;
  recommendedAction: string;
  personalizationFactors: PersonalizationFactor[];
}

export interface PersonalizationFactor {
  factor: string;
  value: string;
  impact: string;
}

// ============================================================
// MASTERMIND RECOMMENDATION
// ============================================================
export interface MasterMindRecommendation {
  pathId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  targetedGaps: string[];
  justification: string;
  projectBrief?: string;
}

// ============================================================
// ONBOARDING STATE MACHINE
// ============================================================
export type OnboardingStep =
  | 'WELCOME'
  | 'CURRENT_SITUATION'
  | 'CAREER_TARGET'
  | 'INDUSTRY'
  | 'COMPANY'
  | 'LOCATION_WORKMODE'
  | 'SENIORITY'
  | 'DYNAMIC_SKILLS'
  | 'EVIDENCE'
  | 'TECHNOLOGY_PREFERENCES'
  | 'LEARNING_PREFERENCES'
  | 'PROJECT_PREFERENCES'
  | 'AVAILABILITY'
  | 'TIMELINE'
  | 'REVIEW'
  | 'ANALYZING'
  | 'GAP_RESULTS'
  | 'ROADMAP'
  | 'DASHBOARD';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'CURRENT_SITUATION',
  'CAREER_TARGET',
  'INDUSTRY',
  'COMPANY',
  'LOCATION_WORKMODE',
  'SENIORITY',
  'DYNAMIC_SKILLS',
  'EVIDENCE',
  'TECHNOLOGY_PREFERENCES',
  'LEARNING_PREFERENCES',
  'PROJECT_PREFERENCES',
  'AVAILABILITY',
  'TIMELINE',
  'REVIEW',
];

export interface OnboardingDraft {
  step: OnboardingStep;
  completedSteps: OnboardingStep[];
  dna: Partial<LearnerDNA>;
}

// ============================================================
// ANALYSIS STATES
// ============================================================
export type AnalysisStep =
  | 'understanding_goal'
  | 'mapping_capabilities'
  | 'comparing_skills'
  | 'identifying_gaps'
  | 'optimizing_time'
  | 'personalizing_projects'
  | 'building_path'
  | 'complete';

export const ANALYSIS_MESSAGES: Record<AnalysisStep, string> = {
  understanding_goal: 'Understanding your career goal...',
  mapping_capabilities: 'Mapping your current capabilities...',
  comparing_skills: 'Comparing your skills with the target role...',
  identifying_gaps: 'Identifying your highest-impact gaps...',
  optimizing_time: 'Optimizing for your available time...',
  personalizing_projects: 'Personalizing projects for your industry...',
  building_path: 'Building your learning path...',
  complete: 'Your personalized path is ready.',
};
