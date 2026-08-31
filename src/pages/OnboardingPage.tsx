/**
 * OnboardingPage — Learner DNA guided onboarding
 *
 * THEME: Uses semantic CSS tokens — works in BOTH light + dark mode
 * LOGO: Uses real MasterMindLogo SVG component
 * ARCHITECTURE: useOnboardingState hook — back navigation never destroys data
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MasterMindLogo from '@/components/ui/MasterMindLogo';
import { useAuth } from '@/components/auth/AuthContext';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import {
  CAPABILITY_REGISTRY,
  ALL_SKILLS,
  ROLE_FAMILIES,
  ROLE_FAMILY_LABELS,
  getSkillsForRole,
} from '@/lib/capabilities';
import {
  OnboardingStep,
  ProficiencyLevel,
  PROFICIENCY_LABEL,
  PROFICIENCY_DESCRIPTION,
} from '@/types/mastermind';

// ─── Motion variants ───────────────────────────────────
const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ─── Static data ───────────────────────────────────────
const SITUATION_GROUPS = [
  {
    label: 'Student',
    options: [
      { id: 'high_school', label: 'High School Student' },
      { id: 'undergraduate', label: 'Undergraduate Student' },
      { id: 'postgraduate', label: 'Postgraduate Student' },
      { id: 'masters', label: "Master's Student" },
      { id: 'phd', label: 'PhD Student' },
      { id: 'diploma', label: 'Diploma Student' },
      { id: 'bootcamp', label: 'Bootcamp Student' },
      { id: 'online_learner', label: 'Online Learner' },
      { id: 'self_taught', label: 'Self-Taught Learner' },
    ],
  },
  {
    label: 'Professional',
    options: [
      { id: 'working_professional', label: 'Working Professional' },
      { id: 'software_professional', label: 'Software Professional' },
      { id: 'engineer', label: 'Engineer' },
      { id: 'manager', label: 'Manager' },
      { id: 'consultant', label: 'Consultant' },
      { id: 'researcher', label: 'Researcher' },
      { id: 'professor', label: 'Professor / Teacher' },
      { id: 'freelancer', label: 'Freelancer' },
      { id: 'entrepreneur', label: 'Entrepreneur / Founder' },
    ],
  },
  {
    label: 'Career Transition',
    options: [
      { id: 'career_switcher', label: 'Career Switcher' },
      { id: 'returning_to_work', label: 'Returning to Work' },
      { id: 'upskilling', label: 'Upskilling in Current Role' },
      { id: 'reskilling', label: 'Reskilling for New Domain' },
      { id: 'first_job', label: 'Preparing for First Job' },
      { id: 'internship_prep', label: 'Preparing for Internship' },
      { id: 'promotion_prep', label: 'Preparing for Promotion' },
    ],
  },
];

// Expanded role list matching the spec
const EXTENDED_ROLE_FAMILIES: Record<string, Array<{ id: string; name: string }>> = {
  'AI / Machine Learning': [
    { id: 'ai-engineer', name: 'AI Engineer' },
    { id: 'ml-engineer', name: 'ML Engineer' },
    { id: 'data-scientist', name: 'Data Scientist' },
    { id: 'data-engineer', name: 'Data Engineer' },
    { id: 'mlops-engineer', name: 'MLOps Engineer' },
    { id: 'nlp-engineer', name: 'NLP Engineer' },
    { id: 'computer-vision-engineer', name: 'Computer Vision Engineer' },
    { id: 'ml-researcher', name: 'ML Researcher' },
    { id: 'data-analyst', name: 'Data Analyst' },
  ],
  'Software Engineering': [
    { id: 'fullstack-developer', name: 'Full-Stack Developer' },
    { id: 'frontend-engineer', name: 'Frontend Engineer' },
    { id: 'backend-engineer', name: 'Backend Engineer' },
    { id: 'mobile-developer', name: 'Mobile Developer' },
    { id: 'ios-developer', name: 'iOS Developer' },
    { id: 'android-developer', name: 'Android Developer' },
    { id: 'game-developer', name: 'Game Developer' },
    { id: 'embedded-engineer', name: 'Embedded Systems Engineer' },
    { id: 'systems-engineer', name: 'Systems Engineer' },
    { id: 'solutions-architect', name: 'Solutions Architect' },
  ],
  'Cloud / DevOps / SRE': [
    { id: 'cloud-engineer', name: 'Cloud Engineer' },
    { id: 'devops-engineer', name: 'DevOps Engineer' },
    { id: 'platform-engineer', name: 'Platform Engineer' },
    { id: 'sre', name: 'Site Reliability Engineer' },
  ],
  'Security': [
    { id: 'cybersecurity-engineer', name: 'Cybersecurity Engineer' },
    { id: 'security-analyst', name: 'Security Analyst' },
    { id: 'cloud-security-engineer', name: 'Cloud Security Engineer' },
    { id: 'appsec-engineer', name: 'Application Security Engineer' },
    { id: 'soc-analyst', name: 'SOC Analyst' },
    { id: 'pen-tester', name: 'Penetration Tester' },
  ],
  'Product / Business': [
    { id: 'product-manager', name: 'Product Manager' },
    { id: 'technical-pm', name: 'Technical Product Manager' },
    { id: 'project-manager', name: 'Project Manager' },
    { id: 'business-analyst', name: 'Business Analyst' },
    { id: 'data-product-manager', name: 'Data Product Manager' },
  ],
  'Design': [
    { id: 'ux-designer', name: 'UX Designer' },
    { id: 'ui-designer', name: 'UI Designer' },
    { id: 'product-designer', name: 'Product Designer' },
    { id: 'ux-researcher', name: 'UX Researcher' },
  ],
  'Finance / Consulting': [
    { id: 'financial-analyst', name: 'Financial Analyst' },
    { id: 'investment-analyst', name: 'Investment Analyst' },
    { id: 'risk-analyst', name: 'Risk Analyst' },
    { id: 'consultant', name: 'Consultant' },
    { id: 'strategy-consultant', name: 'Strategy Consultant' },
    { id: 'technology-consultant', name: 'Technology Consultant' },
  ],
  'Research / Education': [
    { id: 'researcher', name: 'Research Scientist' },
    { id: 'professor', name: 'Professor / Educator' },
    { id: 'instructional-designer', name: 'Instructional Designer' },
  ],
  'Entrepreneurship': [
    { id: 'founder', name: 'Founder / Startup Operator' },
    { id: 'technical-founder', name: 'Technical Founder' },
  ],
};

const INDUSTRIES = [
  'Technology', 'AI / Machine Learning', 'FinTech', 'Banking', 'Healthcare',
  'EdTech', 'Cybersecurity', 'Cloud', 'E-commerce', 'Automotive', 'Gaming',
  'Media', 'Consulting', 'Telecom', 'Manufacturing', 'Energy', 'Government',
  'Research', 'Retail', 'Travel', 'Logistics', 'Real Estate', 'Agriculture',
  'Sustainability', 'Biotech', 'Other',
];

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Adobe', 'NVIDIA',
  'OpenAI', 'IBM', 'HCLTech', 'TCS', 'Infosys', 'Wipro', 'Accenture',
  'Deloitte', 'Startups', 'Product Companies', 'Service Companies',
  'Research Labs', 'Government', 'No Specific Company',
];

const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  'never_used', 'beginner', 'developing', 'intermediate', 'advanced', 'professional',
];

// ─── Shared atoms ───────────────────────────────────────
function StepHeader({ stepNum, total, question, subtitle }: {
  stepNum: number; total: number; question: string; subtitle?: string
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
        Step {stepNum} of {total}
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{question}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function OptionBtn({ label, selected, onClick, id }: {
  label: string; selected: boolean; onClick: () => void; id?: string;
}) {
  return (
    <motion.button
      id={id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
      }`}
    >
      <span className="flex items-center gap-2">
        {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main page ───────────────────────────────────────────
export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? 'demo-user-123';

  const {
    step,
    dna,
    currentStepIndex,
    totalSteps,
    progress,
    updateDNA,
    goNext,
    goBack,
    isFirstStep,
    buildFinalDNA,
    goToStep,
  } = useOnboardingState(userId);

  const [direction, setDirection] = useState(1);
  const [customSituation, setCustomSituation] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [showCustomSituation, setShowCustomSituation] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [skillAssessIdx, setSkillAssessIdx] = useState(0);

  const handleNext = useCallback(() => { setDirection(1); goNext(); }, [goNext]);
  const handleBack = useCallback(() => {
    setDirection(-1);
    if (isFirstStep) navigate('/entry');
    else goBack();
  }, [isFirstStep, navigate, goBack]);

  // Role skills for current selection
  const roleId = dna.careerIntent?.primaryTargetRole ?? '';
  let roleSkills = (roleId && !roleId.startsWith('custom:'))
    ? getSkillsForRole(roleId)
    : [];

  // Fallback universal skills for unmapped or custom roles to ensure skill questions are always asked
  if (roleSkills.length === 0) {
    roleSkills = [
      { skillId: 'system-design', requiredLevel: 50, importance: 8, prerequisites: [] },
      { skillId: 'git', requiredLevel: 70, importance: 9, prerequisites: [] },
      { skillId: 'security-fundamentals', requiredLevel: 50, importance: 7, prerequisites: [] },
      { skillId: 'api-design', requiredLevel: 50, importance: 8, prerequisites: [] },
      { skillId: 'cloud', requiredLevel: 30, importance: 6, prerequisites: [] }
    ];
  }

  const currentSkillReq = roleSkills[skillAssessIdx];

  const toggleMulti = (field: string, value: string) => {
    const current: string[] = (dna.careerIntent as any)?.[field] ?? [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    updateDNA({ careerIntent: { ...dna.careerIntent!, [field]: updated } as any });
  };

  const handleSkillAssessment = (skillId: string, proficiency: ProficiencyLevel, confidence: number) => {
    updateDNA({
      skillAssessments: {
        ...dna.skillAssessments,
        [skillId]: { skillId, proficiencyLevel: proficiency, confidenceScore: confidence },
      },
    });
  };

  const handleSkillNext = () => {
    if (skillAssessIdx < roleSkills.length - 1) setSkillAssessIdx(i => i + 1);
    else { setDirection(1); goNext(); }
  };
  const handleSkillBack = () => {
    if (skillAssessIdx > 0) setSkillAssessIdx(i => i - 1);
    else handleBack();
  };

  const handleProceedToAnalysis = () => {
    const finalDNA = buildFinalDNA();
    updateDNA(finalDNA as any);
    navigate('/onboarding/analyzing');
  };

  // ─── Step renderer ─────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── 1. SITUATION ─────────────────────────────────
      case 'CURRENT_SITUATION':
        return (
          <div>
            <StepHeader stepNum={1} total={totalSteps} question="Where are you right now?" subtitle="Select what best describes your current situation." />
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              {SITUATION_GROUPS.map(group => (
                <div key={group.label}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.label}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {group.options.map(opt => (
                      <OptionBtn key={opt.id} id={`situation-${opt.id}`} label={opt.label}
                        selected={dna.currentSituation === opt.id}
                        onClick={() => updateDNA({ currentSituation: opt.id as any })} />
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Other</div>
                <OptionBtn label="Other — describe below" selected={showCustomSituation}
                  onClick={() => setShowCustomSituation(true)} id="situation-other" />
                {showCustomSituation && (
                  <input autoFocus value={customSituation}
                    onChange={e => { setCustomSituation(e.target.value); updateDNA({ currentSituation: 'other', currentSituationCustom: e.target.value }); }}
                    placeholder="Briefly describe your situation..."
                    className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                )}
              </div>
            </div>
          </div>
        );

      // ── 2. CAREER TARGET ─────────────────────────────
      case 'CAREER_TARGET':
        return (
          <div>
            <StepHeader stepNum={2} total={totalSteps} question="What do you want to become?" subtitle="Select your primary career target." />
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {Object.entries(EXTENDED_ROLE_FAMILIES).map(([family, roles]) => (
                <div key={family}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{family}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {roles.map(r => (
                      <OptionBtn key={r.id} id={`role-${r.id}`} label={r.name}
                        selected={dna.careerIntent?.primaryTargetRole === r.id}
                        onClick={() => updateDNA({ careerIntent: { ...dna.careerIntent!, primaryTargetRole: r.id } as any })} />
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Custom Role</div>
                <OptionBtn label="Other — type your target role" selected={showCustomRole}
                  onClick={() => setShowCustomRole(true)} id="role-other" />
                {showCustomRole && (
                  <input autoFocus value={customRole}
                    onChange={e => { setCustomRole(e.target.value); updateDNA({ careerIntent: { ...dna.careerIntent!, primaryTargetRole: `custom:${e.target.value}` } as any }); }}
                    placeholder="e.g. Robotics Engineer, Quant Analyst..."
                    className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                )}
              </div>
            </div>
          </div>
        );

      // ── 3. INDUSTRY ──────────────────────────────────
      case 'INDUSTRY':
        return (
          <div>
            <StepHeader stepNum={3} total={totalSteps} question="Where do you want to apply your skills?" subtitle="Select one or more industries. Influences project context." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {INDUSTRIES.map(ind => (
                <OptionBtn key={ind} id={`industry-${ind.toLowerCase().replace(/[ /]/g, '-')}`}
                  label={ind}
                  selected={(dna.careerIntent?.targetIndustries ?? []).includes(ind)}
                  onClick={() => toggleMulti('targetIndustries', ind)} />
              ))}
            </div>
          </div>
        );

      // ── 4. COMPANY ───────────────────────────────────
      case 'COMPANY':
        return (
          <div>
            <StepHeader stepNum={4} total={totalSteps} question="Is there a company you're targeting?" subtitle="Personalization signal only — not a verified hiring requirement." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[52vh] overflow-y-auto pr-1">
              {COMPANIES.map(co => (
                <OptionBtn key={co} id={`company-${co.toLowerCase().replace(/ /g, '-')}`}
                  label={co}
                  selected={(dna.careerIntent?.targetCompanies ?? []).includes(co)}
                  onClick={() => toggleMulti('targetCompanies', co)} />
              ))}
            </div>
            <div className="mt-3">
              <OptionBtn label="Add a custom company" selected={showCustomCompany}
                onClick={() => setShowCustomCompany(true)} id="company-other" />
              {showCustomCompany && (
                <div className="flex gap-2 mt-2">
                  <input autoFocus value={customCompany} onChange={e => setCustomCompany(e.target.value)}
                    placeholder="e.g. Razorpay, Swiggy..."
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                  <Button size="sm" variant="outline" onClick={() => {
                    if (customCompany.trim()) { toggleMulti('targetCompanies', customCompany.trim()); setCustomCompany(''); setShowCustomCompany(false); }
                  }}>Add</Button>
                </div>
              )}
            </div>
          </div>
        );

      // ── 5. LOCATION / WORK MODE ──────────────────────
      case 'LOCATION_WORKMODE':
        return (
          <div>
            <StepHeader stepNum={5} total={totalSteps} question="Where and how do you want to work?" subtitle="These are your preferences." />
            <div className="mb-5">
              <div className="text-sm font-semibold text-foreground mb-2">Work Mode</div>
              <div className="grid grid-cols-2 gap-2">
                {(['remote', 'hybrid', 'on-site', 'flexible'] as const).map(mode => (
                  <OptionBtn key={mode} id={`workmode-${mode}`}
                    label={mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                    selected={dna.careerIntent?.workMode === mode}
                    onClick={() => updateDNA({ careerIntent: { ...dna.careerIntent!, workMode: mode } as any })} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground mb-2">Location (optional)</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {['India', 'USA', 'Europe', 'Remote (Global)', 'Specific City', 'Flexible'].map(loc => (
                  <OptionBtn key={loc} id={`location-${loc.toLowerCase().replace(/ /g, '-')}`}
                    label={loc}
                    selected={(dna.careerIntent?.targetLocations ?? []).includes(loc)}
                    onClick={() => {
                      const cur = dna.careerIntent?.targetLocations ?? [];
                      updateDNA({ careerIntent: { ...dna.careerIntent!, targetLocations: cur.includes(loc) ? cur.filter(l => l !== loc) : [...cur, loc] } as any });
                    }} />
                ))}
              </div>
            </div>
          </div>
        );

      // ── 6. SENIORITY ─────────────────────────────────
      case 'SENIORITY':
        return (
          <div>
            <StepHeader stepNum={6} total={totalSteps} question="What level are you targeting?" subtitle="Affects depth and complexity of your learning path." />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'internship', label: 'Internship' },
                { id: 'entry', label: 'Entry Level' },
                { id: 'graduate', label: 'Graduate' },
                { id: 'junior', label: 'Junior' },
                { id: 'mid', label: 'Mid Level' },
                { id: 'senior', label: 'Senior' },
                { id: 'career_switch', label: 'Career Switch' },
              ].map(s => (
                <OptionBtn key={s.id} id={`seniority-${s.id}`} label={s.label}
                  selected={dna.careerIntent?.seniority === s.id}
                  onClick={() => updateDNA({ careerIntent: { ...dna.careerIntent!, seniority: s.id as any } as any })} />
              ))}
            </div>
          </div>
        );

      // ── 7. DYNAMIC SKILLS ────────────────────────────
      case 'DYNAMIC_SKILLS': {
        if (roleSkills.length === 0) {
          return (
            <div>
              <StepHeader stepNum={7} total={totalSteps} question="What skills do you have?" subtitle="No predefined skill list for your role. Add manually on the next screen." />
              <p className="text-sm text-muted-foreground mt-2">Click Next to continue to evidence and preferences.</p>
            </div>
          );
        }
        const skillMeta = ALL_SKILLS[currentSkillReq?.skillId] ?? { name: currentSkillReq?.skillId, category: 'Other' };
        const currentAssessment = dna.skillAssessments?.[currentSkillReq?.skillId];
        return (
          <div>
            <StepHeader stepNum={7} total={totalSteps}
              question={`How would you rate your ${skillMeta.name}?`}
              subtitle={`Skill ${skillAssessIdx + 1} of ${roleSkills.length} • ${skillMeta.category}`} />
            {/* Skill sub-progress */}
            <div className="mb-5 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((skillAssessIdx + 1) / roleSkills.length) * 100}%` }} />
            </div>
            {/* Proficiency */}
            <div className="mb-5">
              <div className="text-sm font-semibold text-foreground mb-2">Proficiency</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROFICIENCY_LEVELS.map(level => (
                  <motion.button key={level} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleSkillAssessment(currentSkillReq.skillId, level, currentAssessment?.confidenceScore ?? 50)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      currentAssessment?.proficiencyLevel === level
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                    }`}
                    id={`proficiency-${level}`}>
                    <div className="text-xs font-semibold mb-0.5">{PROFICIENCY_LABEL[level]}</div>
                    <div className="text-xs text-muted-foreground leading-snug">{PROFICIENCY_DESCRIPTION[level]}</div>
                  </motion.button>
                ))}
              </div>
            </div>
            {/* Confidence */}
            {currentAssessment?.proficiencyLevel && currentAssessment.proficiencyLevel !== 'never_used' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-foreground">Confidence in this skill</div>
                  <div className="text-sm font-bold text-primary">{currentAssessment?.confidenceScore ?? 50}%</div>
                </div>
                <input type="range" min={0} max={100}
                  value={currentAssessment?.confidenceScore ?? 50}
                  onChange={e => handleSkillAssessment(currentSkillReq.skillId, currentAssessment.proficiencyLevel, Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                  id="confidence-slider" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Not confident</span><span>Very confident</span>
                </div>
              </div>
            )}
            <div className="mt-4">
              <button onClick={handleSkillNext} className="text-xs text-muted-foreground hover:text-foreground transition-colors" id="skip-skill">
                Skip this skill →
              </button>
            </div>
          </div>
        );
      }

      // ── 8. EVIDENCE ──────────────────────────────────
      case 'EVIDENCE':
        return (
          <div>
            <StepHeader stepNum={8} total={totalSteps} question="Share what you've already built." subtitle="All optional. Skip if you prefer. We only read publicly accessible info." />
            <div className="space-y-3">
              {[
                { key: 'githubUrl', label: 'GitHub Profile URL', placeholder: 'https://github.com/yourusername' },
                { key: 'portfolioUrl', label: 'Portfolio / Website URL', placeholder: 'https://yourportfolio.com' },
                { key: 'resumeUrl', label: 'Resume / LinkedIn URL', placeholder: 'https://linkedin.com/in/you' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-foreground block mb-1">{label}</label>
                  <input type="url" id={`evidence-${key}`}
                    value={(dna as any)[key] ?? ''}
                    onChange={e => updateDNA({ [key]: e.target.value } as any)}
                    placeholder={placeholder}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-1">
                ⚠️ We use this as context only. No credentials required. Uploads are not verified.
              </p>
            </div>
          </div>
        );

      // ── 9. TECH PREFERENCES ──────────────────────────
      case 'TECHNOLOGY_PREFERENCES':
        return (
          <div>
            <StepHeader stepNum={9} total={totalSteps} question="What technologies do you prefer?" subtitle="Preferences influence your path, but don't override prerequisites." />
            {[
              { label: 'Languages', key: 'languages', options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'C', 'Kotlin', 'Swift', "I don't know yet"] },
              { label: 'Frameworks / Libraries', key: 'frameworks', options: ['React', 'Next.js', 'Vue', 'FastAPI', 'Django', 'Node.js', 'Spring Boot', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Hugging Face'] },
              { label: 'Cloud', key: 'cloud', options: ['AWS', 'Google Cloud', 'Azure', 'No preference'] },
              { label: 'Databases', key: 'databases', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'No preference'] },
            ].map(section => {
              const current: string[] = (dna.preferences?.technologyPreferences as any)?.[section.key] ?? [];
              return (
                <div key={section.label} className="mb-4">
                  <div className="text-sm font-semibold text-foreground mb-2">{section.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {section.options.map(opt => (
                      <motion.button key={opt} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          const updated = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
                          updateDNA({ preferences: { ...dna.preferences, technologyPreferences: { ...(dna.preferences?.technologyPreferences ?? {}), [section.key]: updated } } as any });
                        }}
                        id={`tech-${section.key}-${opt.toLowerCase().replace(/ /g, '-')}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                          current.includes(opt) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                        }`}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      // ── 10. LEARNING PREFERENCES ─────────────────────
      case 'LEARNING_PREFERENCES':
        return (
          <div>
            <StepHeader stepNum={10} total={totalSteps} question="How do you learn best?" subtitle="Select all that apply." />
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'visual', label: 'Visual (diagrams, charts)' },
                { id: 'reading', label: 'Reading (docs, books)' },
                { id: 'video', label: 'Video Courses' },
                { id: 'hands_on', label: 'Hands-On (doing)' },
                { id: 'project_based', label: 'Project-Based' },
                { id: 'theory_first', label: 'Theory First' },
                { id: 'practice_first', label: 'Practice First' },
                { id: 'mixed', label: 'Mixed / Flexible' },
              ].map(style => {
                const current = dna.preferences?.learningStyles ?? [];
                return (
                  <OptionBtn key={style.id} id={`learnstyle-${style.id}`} label={style.label}
                    selected={current.includes(style.id as any)}
                    onClick={() => {
                      const updated = current.includes(style.id as any) ? current.filter(s => s !== style.id) : [...current, style.id as any];
                      updateDNA({ preferences: { ...dna.preferences, learningStyles: updated } as any });
                    }} />
                );
              })}
            </div>
          </div>
        );

      // ── 11. PROJECT PREFERENCES ───────────────────────
      case 'PROJECT_PREFERENCES':
        return (
          <div>
            <StepHeader stepNum={11} total={totalSteps} question="What kind of work do you want to build?" subtitle="Select all that apply." />
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'portfolio', label: 'Portfolio Projects' },
                { id: 'real_world', label: 'Real-World Applications' },
                { id: 'hackathon', label: 'Hackathon Projects' },
                { id: 'open_source', label: 'Open-Source Contributions' },
                { id: 'research', label: 'Research Projects' },
                { id: 'startup', label: 'Startup Projects' },
                { id: 'interview', label: 'Interview Projects' },
                { id: 'academic', label: 'Academic Projects' },
              ].map(pref => {
                const current = dna.preferences?.projectPreferences ?? [];
                return (
                  <OptionBtn key={pref.id} id={`projpref-${pref.id}`} label={pref.label}
                    selected={current.includes(pref.id as any)}
                    onClick={() => {
                      const updated = current.includes(pref.id as any) ? current.filter(p => p !== pref.id) : [...current, pref.id as any];
                      updateDNA({ preferences: { ...dna.preferences, projectPreferences: updated } as any });
                    }} />
                );
              })}
            </div>
          </div>
        );

      // ── 12. AVAILABILITY ──────────────────────────────
      case 'AVAILABILITY':
        return (
          <div>
            <StepHeader stepNum={12} total={totalSteps} question="How much time can you realistically invest?" subtitle="Be honest — your path is calibrated to your actual capacity." />
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold text-foreground mb-2">Hours per day</div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[0.5, 1, 2, 3, 4].map(hrs => (
                    <OptionBtn key={hrs} id={`avail-${hrs}h`}
                      label={hrs < 1 ? '30 min' : `${hrs} hr${hrs > 1 ? 's' : ''}`}
                      selected={dna.availability?.amountPerDay === hrs}
                      onClick={() => updateDNA({ availability: { ...dna.availability, amountPerDay: hrs, weeklyLearningCapacityMinutes: Math.round(hrs * 60 * (dna.availability?.studyDaysPerWeek ?? 5)) } as any })} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground mb-2">Days per week</div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(days => (
                    <OptionBtn key={days} id={`study-days-${days}`} label={`${days}d`}
                      selected={dna.availability?.studyDaysPerWeek === days}
                      onClick={() => updateDNA({ availability: { ...dna.availability, studyDaysPerWeek: days, weeklyLearningCapacityMinutes: Math.round((dna.availability?.amountPerDay ?? 1) * 60 * days) } as any })} />
                  ))}
                </div>
              </div>
              {dna.availability?.weeklyLearningCapacityMinutes && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Weekly Learning Capacity</div>
                  <div className="text-2xl font-bold text-foreground">~{Math.round(dna.availability.weeklyLearningCapacityMinutes / 60)} hours/week</div>
                </div>
              )}
            </div>
          </div>
        );

      // ── 13. TIMELINE ──────────────────────────────────
      case 'TIMELINE':
        return (
          <div>
            <StepHeader stepNum={13} total={totalSteps} question="When do you want to reach your target?" subtitle="MasterMindAI will calibrate your path to this timeline." />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { months: 1, label: '1 Month' }, { months: 3, label: '3 Months' },
                { months: 6, label: '6 Months' }, { months: 9, label: '9 Months' },
                { months: 12, label: '12 Months' }, { months: 18, label: '18 Months' },
                { months: 24, label: '24 Months' },
              ].map(({ months, label }) => (
                <OptionBtn key={months} id={`timeline-${months}mo`} label={label}
                  selected={dna.careerIntent?.timeframeMonths === months}
                  onClick={() => updateDNA({ careerIntent: { ...dna.careerIntent!, timeframeMonths: months } as any })} />
              ))}
            </div>
            {dna.careerIntent?.timeframeMonths && dna.availability?.weeklyLearningCapacityMinutes && (
              <div className="mt-5 p-4 rounded-xl bg-muted border border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Total Learning Time</div>
                <div className="text-xl font-bold text-foreground">
                  ~{Math.round((dna.availability.weeklyLearningCapacityMinutes / 60) * (dna.careerIntent.timeframeMonths * 4.3))} hours
                </div>
                <div className="text-xs text-muted-foreground mt-1">Based on your availability over {dna.careerIntent.timeframeMonths} months.</div>
              </div>
            )}
          </div>
        );

      // ── 14. REVIEW ────────────────────────────────────
      case 'REVIEW':
        return (
          <div>
            <StepHeader stepNum={14} total={totalSteps} question="Your Learning DNA" subtitle="Review before MasterMindAI builds your personalized path." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-h-[55vh] overflow-y-auto pr-1">
              {[
                { label: 'Career Goal', value: dna.careerIntent?.primaryTargetRole?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                { label: 'Industry', value: (dna.careerIntent?.targetIndustries ?? []).join(', ') || '—' },
                { label: 'Target Companies', value: (dna.careerIntent?.targetCompanies ?? []).slice(0, 3).join(', ') || '—' },
                { label: 'Current Situation', value: (dna.currentSituation ?? '—').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                { label: 'Seniority', value: (dna.careerIntent?.seniority ?? '—').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                { label: 'Learning Style', value: (dna.preferences?.learningStyles ?? []).join(', ').replace(/_/g, ' ') || '—' },
                { label: 'Project Preference', value: (dna.preferences?.projectPreferences ?? []).slice(0, 2).join(', ').replace(/_/g, ' ') || '—' },
                { label: 'Weekly Availability', value: dna.availability?.weeklyLearningCapacityMinutes ? `~${Math.round(dna.availability.weeklyLearningCapacityMinutes / 60)} hrs/week` : '—' },
                { label: 'Timeline', value: dna.careerIntent?.timeframeMonths ? `${dna.careerIntent.timeframeMonths} months` : '—' },
                { label: 'Skills Assessed', value: `${Object.keys(dna.skillAssessments ?? {}).length} skills` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl border border-border bg-card">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm font-medium text-foreground">{value || '—'}</div>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 text-base shadow-lg shadow-primary/25"
              onClick={handleProceedToAnalysis}
              id="build-career-path-btn">
              <Sparkles className="mr-2 w-5 h-5" />
              Build My Career Path
            </Button>
            <div className="mt-3 flex justify-center">
              <button onClick={() => goToStep('CURRENT_SITUATION')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors" id="edit-dna-btn">
                Edit my answers
              </button>
            </div>
          </div>
        );

      default:
        return <div className="text-muted-foreground text-sm">Unknown step</div>;
    }
  };

  const isSkillStep = step === 'DYNAMIC_SKILLS';
  const isReviewStep = step === 'REVIEW';
  const canGoNext = (() => {
    if (step === 'CURRENT_SITUATION') return !!dna.currentSituation;
    if (step === 'CAREER_TARGET') return !!dna.careerIntent?.primaryTargetRole;
    if (step === 'INDUSTRY') return (dna.careerIntent?.targetIndustries?.length ?? 0) > 0;
    if (step === 'AVAILABILITY') return !!dna.availability?.weeklyLearningCapacityMinutes;
    if (step === 'TIMELINE') return !!dna.careerIntent?.timeframeMonths;
    return true;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Progress header */}
      <div className="relative z-10 max-w-2xl mx-auto w-full px-4 pt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MasterMindLogo className="h-8 w-8 text-primary" />
            <span className="text-sm font-bold text-foreground">MasterMindAI</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" initial={false}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 max-w-2xl mx-auto w-full flex-1 px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step + (isSkillStep ? `-${skillAssessIdx}` : '')}
            custom={direction} variants={pageVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <Card className="bg-card border border-border shadow-sm p-6 md:p-8">
              {renderStep()}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {!isReviewStep && (
        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 mt-4 mb-6 flex justify-between">
          <Button variant="ghost" onClick={isSkillStep ? handleSkillBack : handleBack} id="onboarding-back">
            <ChevronLeft className="mr-1 w-4 h-4" /> Back
          </Button>
          {!isSkillStep && (
            <Button onClick={handleNext} disabled={!canGoNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40" id="onboarding-next">
              {step === 'EVIDENCE' ? 'Skip / Next' : 'Next'}
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          )}
          {isSkillStep && (
            <Button onClick={handleSkillNext} className="bg-primary hover:bg-primary/90 text-primary-foreground" id="skill-next-btn">
              {skillAssessIdx < roleSkills.length - 1 ? 'Next Skill' : 'Done'}
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
