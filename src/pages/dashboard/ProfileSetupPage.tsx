import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Target,
  Brain,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Briefcase,
  Clock,
  Code
} from 'lucide-react';

import { ALL_SKILLS } from '@/lib/capabilities';
import { PersistenceProvider } from '@/lib/persistence/PersistenceProvider';

const STEPS = [
  { id: 'intent', title: 'Career Intent', icon: Briefcase },
  { id: 'skills', title: 'Current Skills', icon: Code },
  { id: 'preferences', title: 'Learning Preferences', icon: Brain },
];

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Default pre-filled demo learner
  const [formData, setFormData] = useState({
    targetRole: 'ai-engineer',
    industryFocus: 'FinTech',
    timeframeMonths: 6,
    
    currentSkills: {
      'python': 60,
      'javascript': 80,
      'machine-learning': 20,
    } as Record<string, number>,
    
    weeklyHours: 10,
    learningStyle: 'visual',
    preferredFormat: 'project-based',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSkill = (skillId: string, level: number) => {
    setFormData(prev => ({
      ...prev,
      currentSkills: {
        ...prev.currentSkills,
        [skillId]: level
      }
    }));
  };

  const removeSkill = (skillId: string) => {
    const updatedSkills = { ...formData.currentSkills };
    delete updatedSkills[skillId];
    setFormData(prev => ({ ...prev, currentSkills: updatedSkills }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const profileData = {
        careerIntent: {
          targetRole: formData.targetRole,
          industryFocus: formData.industryFocus,
          timeframeMonths: formData.timeframeMonths
        },
        currentSkills: formData.currentSkills,
        preferences: {
          weeklyHours: formData.weeklyHours,
          learningStyle: formData.learningStyle,
          preferredFormat: formData.preferredFormat
        }
      };

      await PersistenceProvider.getInstance().saveProfile(user.id, user.email || '', profileData as any);
      
      // Auto-generate roadmap based on the new profile
      try {
        const { generateRoadmap } = await import('@/lib/gemini');
        const { convertLearningPathToMermaid } = await import('@/lib/mermaid-adapter');
        const { calculateSkillGaps } = await import('@/lib/gap-engine');
        const { generateIntelligenceTrace } = await import('@/lib/explanations');

        const gaps = calculateSkillGaps(profileData as any);
        const traceData = generateIntelligenceTrace(gaps, profileData.careerIntent as any, []);
        
        const topic = profileData.careerIntent.targetRole || 'Target Role';
        const roadmapData = await generateRoadmap(topic, profileData, gaps);
        const mermaidCode = convertLearningPathToMermaid(roadmapData);

        const newRoadmap = {
          topic,
          mermaid_code: mermaidCode,
          structured_data: roadmapData,
          intelligence_trace: traceData,
          learner_snapshot: profileData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          id: crypto.randomUUID()
        };

        await PersistenceProvider.getInstance().saveRoadmap(user.id, newRoadmap);
      } catch (aiError) {
        console.error('Failed to auto-generate roadmap:', aiError);
      }

      toast({
        title: 'Learning DNA Built!',
        description: 'Your MasterMindAI profile and roadmap have been configured successfully.',
      });
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderCareerIntent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Briefcase className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Define Your Career Intent</h2>
        <p className="text-muted-foreground">What is your ultimate goal?</p>
      </div>
      
      <div>
        <Label>Target Role</Label>
        <Select value={formData.targetRole} onValueChange={(val) => updateFormData('targetRole', val)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ai-engineer">AI Engineer</SelectItem>
            <SelectItem value="full-stack-developer">Full Stack Developer</SelectItem>
            <SelectItem value="data-scientist">Data Scientist</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Industry Focus</Label>
          <Input
            value={formData.industryFocus}
            onChange={(e) => updateFormData('industryFocus', e.target.value)}
            placeholder="e.g., FinTech, HealthTech, Gaming"
          />
        </div>
        <div>
          <Label>Timeframe (Months)</Label>
          <Input
            type="number"
            min="1" max="60"
            value={formData.timeframeMonths}
            onChange={(e) => updateFormData('timeframeMonths', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentSkills = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Code className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Your Current Skills</h2>
        <p className="text-muted-foreground">Rate your proficiency from 1 to 100.</p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(formData.currentSkills).map(([skillId, level]) => (
          <div key={skillId} className="flex items-center gap-4">
            <div className="flex-1 font-medium">{ALL_SKILLS[skillId]?.name || skillId}</div>
            <Input
              type="number"
              min="0" max="100"
              className="w-24 text-center"
              value={level}
              onChange={(e) => updateSkill(skillId, parseInt(e.target.value) || 0)}
            />
            <Button variant="ghost" size="sm" onClick={() => removeSkill(skillId)} className="text-destructive">
              Remove
            </Button>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t">
        <Label>Add a Skill</Label>
        <Select onValueChange={(val) => updateSkill(val, 10)}>
          <SelectTrigger><SelectValue placeholder="Select a skill to add..." /></SelectTrigger>
          <SelectContent>
            {Object.entries(ALL_SKILLS).map(([id, meta]) => (
              !formData.currentSkills[id] && (
                <SelectItem key={id} value={id}>{meta.name}</SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Learning Preferences</h2>
        <p className="text-muted-foreground">How do you prefer to learn?</p>
      </div>
      
      <div>
        <Label>Weekly Hours Available</Label>
        <Input
          type="number"
          min="1" max="168"
          value={formData.weeklyHours}
          onChange={(e) => updateFormData('weeklyHours', parseInt(e.target.value) || 1)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Primary Learning Style</Label>
          <Select value={formData.learningStyle} onValueChange={(val) => updateFormData('learningStyle', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">Visual</SelectItem>
              <SelectItem value="auditory">Auditory</SelectItem>
              <SelectItem value="reading">Reading & Writing</SelectItem>
              <SelectItem value="kinesthetic">Kinesthetic (Hands-on)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred Format</Label>
          <Select value={formData.preferredFormat} onValueChange={(val) => updateFormData('preferredFormat', val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video Lectures</SelectItem>
              <SelectItem value="text">Text / Articles</SelectItem>
              <SelectItem value="interactive">Interactive Coding</SelectItem>
              <SelectItem value="project-based">Project-based Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderCareerIntent();
      case 1: return renderCurrentSkills();
      case 2: return renderPreferences();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
            Build Your Learning DNA
          </h1>
          <p className="text-muted-foreground text-center">
            Let MasterMindAI personalize your intelligence trace.
          </p>
        </div>

        <div className="mb-8 relative px-4">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center px-8 z-0">
            <Progress value={progress} className="h-1" />
          </div>
          
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isActive ? 'border-primary bg-background text-primary' :
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' :
                    'border-muted bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="p-6 md:p-10 shadow-lg border-primary/10">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing DNA...
                  </>
                ) : (
                  <>
                    Launch MasterMindAI
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}