import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { ProfileFormData } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  GraduationCap,
  Brain,
  Target,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  UserCircle,
  BookOpen,
  Clock,
  Star
} from 'lucide-react';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'academic', title: 'Academic Background', icon: GraduationCap },
  { id: 'learning', title: 'Learning Preferences', icon: Brain },
  { id: 'goals', title: 'Goals & Interests', icon: Target },
  { id: 'preferences', title: 'Preferences', icon: Settings },
];

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const { profile, saveProfile, isSaving } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    date_of_birth: '',
    profile_image: user?.imageUrl || '',
    
    education_level: 'undergraduate',
    institution: '',
    field_of_study: '',
    graduation_year: new Date().getFullYear(),
    current_gpa: undefined,
    
    learning_style: 'mixed',
    preferred_difficulty: 'intermediate',
    study_hours_per_week: undefined,
    preferred_study_time: 'flexible',
    
    career_goals: [],
    learning_objectives: [],
    interests: [],
    skills_to_develop: [],
    
    programming_experience: 'beginner',
    languages_known: [],
    previous_courses: [],
    certifications: [],
    
    notification_preferences: {
      email_notifications: true,
      push_notifications: true,
      weekly_progress: true,
      course_recommendations: true,
    },
    
    profile_completed: false,
    onboarding_completed: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({ ...prev, ...profile }));
    }
  }, [profile]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateArrayField = (field: keyof ProfileFormData, value: string) => {
    const currentArray = formData[field] as string[] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFormData(field, newArray);
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
    const finalData = {
      ...formData,
      profile_completed: true,
      onboarding_completed: true,
    };

    const success = await saveProfile(finalData);
    if (success) {
      toast({
        title: 'Welcome to EchoVerse!',
        description: 'Your profile has been set up successfully. Let\'s start learning!',
      });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <UserCircle className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">Let's start with your basic information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => updateFormData('first_name', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => updateFormData('last_name', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => updateFormData('date_of_birth', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <GraduationCap className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Academic Background</h2>
        <p className="text-muted-foreground">Help us understand your educational journey</p>
      </div>
      
      <div>
        <Label htmlFor="education_level">Education Level *</Label>
        <Select value={formData.education_level} onValueChange={(value) => updateFormData('education_level', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high_school">High School</SelectItem>
            <SelectItem value="undergraduate">Undergraduate</SelectItem>
            <SelectItem value="graduate">Graduate</SelectItem>
            <SelectItem value="postgraduate">Postgraduate</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="institution">Institution/University</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => updateFormData('institution', e.target.value)}
            placeholder="e.g., Stanford University"
          />
        </div>
        <div>
          <Label htmlFor="field_of_study">Field of Study</Label>
          <Input
            id="field_of_study"
            value={formData.field_of_study}
            onChange={(e) => updateFormData('field_of_study', e.target.value)}
            placeholder="e.g., Computer Science"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="graduation_year">Graduation Year</Label>
          <Input
            id="graduation_year"
            type="number"
            value={formData.graduation_year}
            onChange={(e) => updateFormData('graduation_year', parseInt(e.target.value))}
            placeholder="2024"
          />
        </div>
        <div>
          <Label htmlFor="current_gpa">Current GPA (Optional)</Label>
          <Input
            id="current_gpa"
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.current_gpa || ''}
            onChange={(e) => updateFormData('current_gpa', parseFloat(e.target.value))}
            placeholder="3.75"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="programming_experience">Programming Experience *</Label>
        <Select value={formData.programming_experience} onValueChange={(value) => updateFormData('programming_experience', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Experience</SelectItem>
            <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
            <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
            <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
            <SelectItem value="expert">Expert (5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderLearningPreferences = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Learning Preferences</h2>
        <p className="text-muted-foreground">How do you learn best?</p>
      </div>
      
      <div>
        <Label htmlFor="learning_style">Learning Style *</Label>
        <Select value={formData.learning_style} onValueChange={(value) => updateFormData('learning_style', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">Visual (diagrams, charts, images)</SelectItem>
            <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
            <SelectItem value="kinesthetic">Kinesthetic (hands-on, practice)</SelectItem>
            <SelectItem value="reading_writing">Reading/Writing (text-based)</SelectItem>
            <SelectItem value="mixed">Mixed (combination of styles)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="preferred_difficulty">Preferred Difficulty Level *</Label>
        <Select value={formData.preferred_difficulty} onValueChange={(value) => updateFormData('preferred_difficulty', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner - Start from basics</SelectItem>
            <SelectItem value="intermediate">Intermediate - Some background knowledge</SelectItem>
            <SelectItem value="advanced">Advanced - Challenge me</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="study_hours_per_week">Study Hours per Week</Label>
          <Input
            id="study_hours_per_week"
            type="number"
            min="1"
            max="168"
            value={formData.study_hours_per_week || ''}
            onChange={(e) => updateFormData('study_hours_per_week', parseInt(e.target.value))}
            placeholder="10"
          />
        </div>
        <div>
          <Label htmlFor="preferred_study_time">Preferred Study Time</Label>
          <Select value={formData.preferred_study_time} onValueChange={(value) => updateFormData('preferred_study_time', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
              <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderGoalsAndInterests = () => {
    const careerGoalOptions = [
      'Software Developer', 'Data Scientist', 'Product Manager', 'UX/UI Designer',
      'DevOps Engineer', 'Machine Learning Engineer', 'Cybersecurity Specialist',
      'Full-Stack Developer', 'Mobile App Developer', 'Cloud Architect'
    ];
    
    const skillOptions = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning',
      'Data Analysis', 'UI/UX Design', 'Cloud Computing', 'DevOps',
      'Mobile Development', 'Blockchain', 'Cybersecurity'
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <Target className="h-16 w-16 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold">Goals & Interests</h2>
          <p className="text-muted-foreground">What do you want to achieve?</p>
        </div>
        
        <div>
          <Label>Career Goals (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {careerGoalOptions.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`career-${goal}`}
                  checked={formData.career_goals?.includes(goal)}
                  onCheckedChange={() => updateArrayField('career_goals', goal)}
                />
                <Label htmlFor={`career-${goal}`} className="text-sm">{goal}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Skills to Develop (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {skillOptions.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={formData.skills_to_develop?.includes(skill)}
                  onCheckedChange={() => updateArrayField('skills_to_develop', skill)}
                />
                <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="learning_objectives">Learning Objectives</Label>
          <Textarea
            id="learning_objectives"
            value={formData.learning_objectives?.join('\n') || ''}
            onChange={(e) => updateFormData('learning_objectives', e.target.value.split('\n').filter(Boolean))}
            placeholder="What specific goals do you want to achieve? (One per line)"
            className="min-h-[100px]"
          />
        </div>
      </div>
    );
  };

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-16 w-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        <p className="text-muted-foreground">How would you like to stay updated?</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="email_notifications"
            checked={formData.notification_preferences.email_notifications}
            onCheckedChange={(checked) => 
              updateFormData('notification_preferences', {
                ...formData.notification_preferences,
                email_notifications: checked
              })
            }
          />
          <Label htmlFor="email_notifications">Email notifications for important updates</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="push_notifications"
            checked={formData.notification_preferences.push_notifications}
            onCheckedChange={(checked) => 
              updateFormData('notification_preferences', {
                ...formData.notification_preferences,
                push_notifications: checked
              })
            }
          />
          <Label htmlFor="push_notifications">Push notifications for reminders</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="weekly_progress"
            checked={formData.notification_preferences.weekly_progress}
            onCheckedChange={(checked) => 
              updateFormData('notification_preferences', {
                ...formData.notification_preferences,
                weekly_progress: checked
              })
            }
          />
          <Label htmlFor="weekly_progress">Weekly progress reports</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="course_recommendations"
            checked={formData.notification_preferences.course_recommendations}
            onCheckedChange={(checked) => 
              updateFormData('notification_preferences', {
                ...formData.notification_preferences,
                course_recommendations: checked
              })
            }
          />
          <Label htmlFor="course_recommendations">Personalized course recommendations</Label>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderAcademicInfo();
      case 2: return renderLearningPreferences();
      case 3: return renderGoalsAndInterests();
      case 4: return renderPreferences();
      default: return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.first_name && formData.last_name && formData.email;
      case 1:
        return formData.education_level && formData.programming_experience;
      case 2:
        return formData.learning_style && formData.preferred_difficulty;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Star className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to EchoVerse
            </h1>
          </motion.div>
          <p className="text-lg text-muted-foreground">
            Let's set up your profile to personalize your learning experience
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Profile Setup Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                      isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                      'border-muted-foreground bg-background'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
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
                disabled={!isStepValid() || isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
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