import React, { useState } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { MentorApplication } from '@/types/mentor';
import {
  Award,
  Briefcase,
  Book,
  CheckCircle2,
  Clock,
  DollarSign,
  CheckCircle,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function BecomeMentorPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<Partial<MentorApplication>>({
    subjects: [],
    experience: '',
    hourly_rate: 25,
    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    }
  });

  const subjectOptions = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Psychology', 'Economics', 'Business', 'Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'UI/UX Design'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
  ];

  const toggleSubject = (subject: string) => {
    const currentSubjects = application.subjects || [];
    if (currentSubjects.includes(subject)) {
      setApplication({
        ...application,
        subjects: currentSubjects.filter(s => s !== subject)
      });
    } else {
      setApplication({
        ...application,
        subjects: [...currentSubjects, subject]
      });
    }
  };
  
  const toggleTimeSlot = (day: string, timeSlot: string) => {
    const [start, end] = timeSlot.split('-');
    const currentAvailability = { ...(application.availability || {}) };
    const daySlots = currentAvailability[day] || [];
    
    const existingSlot = daySlots.findIndex(
      slot => slot.start === start && slot.end === end
    );
    
    if (existingSlot >= 0) {
      // Remove slot
      daySlots.splice(existingSlot, 1);
    } else {
      // Add slot
      daySlots.push({ start, end });
    }
    
    currentAvailability[day] = daySlots;
    
    setApplication({
      ...application,
      availability: currentAvailability
    });
  };
  
  const isTimeSlotSelected = (day: string, timeSlot: string) => {
    const [start, end] = timeSlot.split('-');
    const daySlots = application.availability?.[day] || [];
    
    return daySlots.some(slot => slot.start === start && slot.end === end);
  };
  
  const handleSubmit = async () => {
    if (!application.subjects?.length) {
      toast({
        title: "Missing Information",
        description: "Please select at least one subject you can mentor.",
        variant: "destructive"
      });
      return;
    }
    
    if (!application.experience) {
      toast({
        title: "Missing Information",
        description: "Please describe your experience and qualifications.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if any availability is selected
    const hasAvailability = Object.values(application.availability || {}).some(
      slots => slots.length > 0
    );
    
    if (!hasAvailability) {
      toast({
        title: "Missing Information",
        description: "Please select at least one time slot when you're available.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would save to the Supabase database
      // const { data, error } = await supabase
      //   .from('mentor_applications')
      //   .insert([{
      //     user_id: user?.id,
      //     ...application
      //   }]);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted",
        description: "Your mentor application has been submitted successfully. We'll review it shortly.",
      });
      
      // Optional: redirect to dashboard or confirmation page
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Become a Mentor</h1>
          <p className="text-muted-foreground">
            Help other students learn and grow by sharing your knowledge and experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Mentoring Subjects
              </CardTitle>
              <CardDescription>
                Select the subjects that you feel confident teaching others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjectOptions.map(subject => (
                  <div key={subject} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`subject-${subject}`}
                      checked={(application.subjects || []).includes(subject)}
                      onCheckedChange={() => toggleSubject(subject)}
                    />
                    <Label 
                      htmlFor={`subject-${subject}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
              {(application.subjects || []).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {(application.subjects || []).map(subject => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                        <button 
                          className="ml-1 hover:text-destructive"
                          onClick={() => toggleSubject(subject)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience & Expertise
              </CardTitle>
              <CardDescription>
                Describe your qualifications and experience in these subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience & Qualifications</Label>
                <Textarea 
                  id="experience"
                  placeholder="Describe your experience, qualifications, and teaching approach..."
                  value={application.experience || ''}
                  onChange={(e) => setApplication({...application, experience: e.target.value})}
                  className="min-h-[150px]"
                />
                <p className="text-sm text-muted-foreground">
                  Include relevant education, work experience, certifications, and any previous teaching or mentoring experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="hourly-rate"
                      type="number"
                      min="0"
                      step="5"
                      className="pl-8"
                      value={application.hourly_rate || ''}
                      onChange={(e) => setApplication({...application, hourly_rate: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expertise-level">Expertise Level</Label>
                  <Select 
                    value={application.expertise_level || 'intermediate'}
                    onValueChange={(value) => setApplication({...application, expertise_level: value})}
                  >
                    <SelectTrigger id="expertise-level">
                      <SelectValue placeholder="Select your expertise level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Availability
              </CardTitle>
              <CardDescription>
                Select the time slots when you're available to mentor students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day}>
                    <h4 className="text-sm font-medium mb-2">{day}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                      {timeSlots.map(timeSlot => (
                        <Button
                          key={timeSlot}
                          type="button"
                          variant={isTimeSlotSelected(day, timeSlot) ? "default" : "outline"}
                          size="sm"
                          className="h-auto py-1"
                          onClick={() => toggleTimeSlot(day, timeSlot)}
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Review your application before submitting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our mentorship guidelines and commit to helping students learn and grow. 
                  Our team will review your application and get back to you within 2-3 business days.
                </p>
                
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" />
                  <Label 
                    htmlFor="terms"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <a href="#" className="text-primary underline">Mentor Terms & Conditions</a> and <a href="#" className="text-primary underline">Code of Conduct</a>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="ml-auto gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Information Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Mentoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Earn Extra Income</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your own hourly rate and earn money while helping others learn.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Professional Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Teaching others strengthens your own knowledge and skills.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Build Your Reputation</h3>
                  <p className="text-sm text-muted-foreground">
                    Establish yourself as an expert and build your professional profile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Submit Application</h3>
                    <p className="text-xs text-muted-foreground">
                      Complete all required fields and submit your application.
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Application Review</h3>
                    <p className="text-xs text-muted-foreground">
                      Our team reviews your application and qualifications.
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Short Interview</h3>
                    <p className="text-xs text-muted-foreground">
                      Selected applicants will have a brief video interview.
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Approval & Onboarding</h3>
                    <p className="text-xs text-muted-foreground">
                      Successful applicants are approved and onboarded as mentors.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about becoming a mentor or the application process, please reach out to our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}