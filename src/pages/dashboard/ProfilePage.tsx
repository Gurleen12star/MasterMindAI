import { useState } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { ProfileFormData } from '@/types/profile';
import {
  User,
  GraduationCap,
  Brain,
  Target,
  Settings,
  Edit,
  Save,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, saveProfile, isSaving } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileFormData | null>(null);

  const handleEdit = () => {
    if (profile) {
      setEditData({ ...profile });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (editData) {
      const success = await saveProfile(editData);
      if (success) {
        setIsEditing(false);
        setEditData(null);
      }
    }
  };

  const updateEditData = (field: string, value: any) => {
    if (editData) {
      setEditData(prev => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const updateArrayField = (field: keyof ProfileFormData, value: string) => {
    if (editData) {
      const currentArray = editData[field] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      updateEditData(field, newArray);
    }
  };

  if (!profile) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            It looks like you haven't set up your profile yet.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/profile-setup'}>
            Set Up Profile
          </Button>
        </Card>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </h3>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={editData?.first_name || ''}
                onChange={(e) => updateEditData('first_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={editData?.last_name || ''}
                onChange={(e) => updateEditData('last_name', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editData?.email || ''}
              onChange={(e) => updateEditData('email', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editData?.phone || ''}
                onChange={(e) => updateEditData('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={editData?.date_of_birth || ''}
                onChange={(e) => updateEditData('date_of_birth', e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
              <p className="text-muted-foreground">{profile.field_of_study} Student</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.date_of_birth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const renderAcademicInfo = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <GraduationCap className="h-5 w-5" />
        Academic Background
      </h3>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="education_level">Education Level</Label>
            <Select value={editData?.education_level} onValueChange={(value) => updateEditData('education_level', value)}>
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
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={editData?.institution || ''}
                onChange={(e) => updateEditData('institution', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input
                id="field_of_study"
                value={editData?.field_of_study || ''}
                onChange={(e) => updateEditData('field_of_study', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                value={editData?.graduation_year || ''}
                onChange={(e) => updateEditData('graduation_year', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="current_gpa">Current GPA</Label>
              <Input
                id="current_gpa"
                type="number"
                step="0.01"
                value={editData?.current_gpa || ''}
                onChange={(e) => updateEditData('current_gpa', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Education Level</Label>
              <p className="font-medium capitalize">{profile.education_level.replace('_', ' ')}</p>
            </div>
            {profile.institution && (
              <div>
                <Label className="text-sm text-muted-foreground">Institution</Label>
                <p className="font-medium">{profile.institution}</p>
              </div>
            )}
            {profile.field_of_study && (
              <div>
                <Label className="text-sm text-muted-foreground">Field of Study</Label>
                <p className="font-medium">{profile.field_of_study}</p>
              </div>
            )}
            {profile.graduation_year && (
              <div>
                <Label className="text-sm text-muted-foreground">Graduation Year</Label>
                <p className="font-medium">{profile.graduation_year}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <Award className="h-3 w-3" />
              {profile.programming_experience.charAt(0).toUpperCase() + profile.programming_experience.slice(1)} Level
            </Badge>
            {profile.current_gpa && (
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                GPA: {profile.current_gpa}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  const renderLearningPreferences = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5" />
        Learning Preferences
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm text-muted-foreground">Learning Style</Label>
          <p className="font-medium capitalize">{profile.learning_style.replace('_', ' ')}</p>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Preferred Difficulty</Label>
          <p className="font-medium capitalize">{profile.preferred_difficulty}</p>
        </div>
        
        {profile.study_hours_per_week && (
          <div>
            <Label className="text-sm text-muted-foreground">Study Hours per Week</Label>
            <p className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {profile.study_hours_per_week} hours
            </p>
          </div>
        )}
        
        <div>
          <Label className="text-sm text-muted-foreground">Preferred Study Time</Label>
          <p className="font-medium capitalize">{profile.preferred_study_time}</p>
        </div>
      </div>
    </Card>
  );

  const renderGoalsAndInterests = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
        <Target className="h-5 w-5" />
        Goals & Interests
      </h3>

      <div className="space-y-6">
        {profile.career_goals && profile.career_goals.length > 0 && (
          <div>
            <Label className="text-sm text-muted-foreground">Career Goals</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.career_goals.map((goal) => (
                <Badge key={goal} variant="secondary">{goal}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.skills_to_develop && profile.skills_to_develop.length > 0 && (
          <div>
            <Label className="text-sm text-muted-foreground">Skills to Develop</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills_to_develop.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.learning_objectives && profile.learning_objectives.length > 0 && (
          <div>
            <Label className="text-sm text-muted-foreground">Learning Objectives</Label>
            <ul className="mt-2 space-y-1">
              {profile.learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2">
            <Brain className="h-4 w-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {renderPersonalInfo()}
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          {renderAcademicInfo()}
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          {renderLearningPreferences()}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {renderGoalsAndInterests()}
        </TabsContent>
      </Tabs>
    </div>
  );
}