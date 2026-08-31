import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  UserPlus,
  GraduationCap,
  Calendar,
  Search,
  BarChart,
  MessageSquare,
  Users,
  Star,
  Clock,
  Info,
  ThumbsUp,
  ThumbsDown,
  Award,
  FileText,
  Loader2,
  ChevronRight
} from 'lucide-react';

// Types
interface Mentor {
  mentor_id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  subjects: string[];
  experience: string;
  hourly_rate: number;
  availability: Record<string, any>;
  match_score: number;
}

interface MentorRelationship {
  id: string;
  mentor_id: string;
  student_id: string;
  status: 'active' | 'pending' | 'inactive' | 'declined';
  subjects: string[];
  notes: string | null;
  meeting_schedule: Array<{
    day: string;
    time: string;
    duration: number;
  }>;
  created_at: string;
  updated_at: string;
  mentor_name?: string;
  mentor_image?: string;
}

interface MentorApplication {
  id: string;
  user_id: string;
  application_status: 'pending' | 'approved' | 'rejected';
  subjects: string[];
  experience: string;
  hourly_rate: number;
  availability: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function MentorMatchingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // States
  const [activeTab, setActiveTab] = useState('find');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchSubject, setSearchSubject] = useState('');
  const [relationships, setRelationships] = useState<MentorRelationship[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  const [application, setApplication] = useState<MentorApplication | null>(null);
  const [newApplication, setNewApplication] = useState({
    subjects: [] as string[],
    experience: '',
    hourly_rate: 25,
    availability: {
      weekdays: true,
      weekends: false,
      morning: false,
      afternoon: true,
      evening: true
    }
  });
  
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  
  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      Promise.all([
        fetchMentors(),
        fetchRelationships(),
        fetchApplication()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user?.id]);
  
  // Fetch available mentors with match scores
  const fetchMentors = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase.rpc('get_matching_mentors', {
        student_id: user.id,
        subject_filter: searchSubject || null,
        max_results: 50
      });
      
      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentors. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Fetch user's mentor relationships
  const fetchRelationships = async () => {
    if (!user?.id) return;
    
    try {
      // Get relationships where user is a student
      const { data, error } = await supabase
        .from('student_mentors')
        .select(`
          *,
          mentor:mentor_id(
            user_id,
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('student_id', user.id);
      
      if (error) throw error;
      
      // Transform the data to include mentor name and image
      const formattedRelationships = (data || []).map(rel => ({
        ...rel,
        mentor_name: `${rel.mentor.first_name} ${rel.mentor.last_name}`,
        mentor_image: rel.mentor.profile_image
      }));
      
      setRelationships(formattedRelationships);
    } catch (error) {
      console.error('Error fetching relationships:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor relationships. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Fetch user's mentor application if exists
  const fetchApplication = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };
  
  // Request a mentor
  const requestMentor = async (mentor: Mentor) => {
    if (!user?.id) return;
    
    setLoadingAction(`request-${mentor.mentor_id}`);
    
    try {
      // Create a new student-mentor relationship
      const { error } = await supabase
        .from('student_mentors')
        .insert({
          mentor_id: mentor.mentor_id,
          student_id: user.id,
          status: 'pending',
          subjects: mentor.subjects,
          notes: `Requested via mentor matching.`
        });
      
      if (error) throw error;
      
      toast({
        title: 'Request Sent',
        description: `Your mentor request has been sent to ${mentor.first_name}. You'll be notified when they respond.`,
      });
      
      // Refresh data
      await fetchRelationships();
    } catch (error) {
      console.error('Error requesting mentor:', error);
      toast({
        title: 'Request Failed',
        description: 'Failed to send mentor request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(null);
    }
  };
  
  // Submit mentor application
  const submitApplication = async () => {
    if (!user?.id) return;
    
    setLoadingAction('submit-application');
    
    try {
      const { error } = await supabase
        .from('mentor_applications')
        .insert({
          user_id: user.id,
          subjects: newApplication.subjects,
          experience: newApplication.experience,
          hourly_rate: newApplication.hourly_rate,
          availability: newApplication.availability
        });
      
      if (error) throw error;
      
      toast({
        title: 'Application Submitted',
        description: 'Your mentor application has been submitted successfully. You will be notified when it is reviewed.',
      });
      
      // Refresh application data
      await fetchApplication();
      setShowApplicationDialog(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit mentor application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingAction(null);
    }
  };
  
  // Format availability object into readable text
  const formatAvailability = (availability: Record<string, any>) => {
    const days = [];
    if (availability.weekdays) days.push('Weekdays');
    if (availability.weekends) days.push('Weekends');
    
    const times = [];
    if (availability.morning) times.push('Morning');
    if (availability.afternoon) times.push('Afternoon');
    if (availability.evening) times.push('Evening');
    
    return `${days.join(', ')} (${times.join(', ')})`;
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      case 'declined': return 'destructive';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };
  
  // Handle adding/removing subjects from application
  const toggleSubject = (subject: string) => {
    setNewApplication(prev => {
      const subjects = [...prev.subjects];
      
      if (subjects.includes(subject)) {
        return {...prev, subjects: subjects.filter(s => s !== subject)};
      } else {
        return {...prev, subjects: [...subjects, subject]};
      }
    });
  };
  
  // Handle checkbox changes for availability
  const handleAvailabilityChange = (key: string, checked: boolean) => {
    setNewApplication(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [key]: checked
      }
    }));
  };
  
  // Get match score label
  const getMatchScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent Match';
    if (score >= 3.5) return 'Good Match';
    if (score >= 2.5) return 'Decent Match';
    return 'Basic Match';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mentor Matching</h1>
          <p className="text-muted-foreground">
            Find mentors or become a mentor to help others learn
          </p>
        </div>
        
        {!application && (
          <Button 
            variant="outline" 
            className="ml-auto gap-2"
            onClick={() => setShowApplicationDialog(true)}
          >
            <UserPlus className="h-4 w-4" />
            Become a Mentor
          </Button>
        )}
        
        {application && (
          <Badge 
            variant={getStatusBadgeVariant(application.application_status)}
            className="ml-auto"
          >
            {application.application_status === 'approved' ? 'Mentor' : `Application ${application.application_status}`}
          </Badge>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="find" className="gap-2">
            <Search className="h-4 w-4" />
            Find a Mentor
          </TabsTrigger>
          <TabsTrigger value="my-mentors" className="gap-2">
            <Users className="h-4 w-4" />
            My Mentors
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>
        
        {/* Find a Mentor Tab */}
        <TabsContent value="find" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Find Your Perfect Mentor</CardTitle>
              <CardDescription>
                Search for mentors based on your learning needs and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="subject-search" className="mb-2 block">
                    Subject or Topic
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subject-search"
                      placeholder="e.g., JavaScript, Machine Learning, Web Development..."
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => fetchMentors()}
                    disabled={loadingAction === 'search'}
                  >
                    {loadingAction === 'search' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search Mentors
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : mentors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {mentors.map((mentor) => (
                      <motion.div
                        key={mentor.mentor_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border border-primary/10 hover:border-primary/30 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Avatar className="h-16 w-16 border-2 border-primary/10">
                                <AvatarImage src={mentor.profile_image || undefined} />
                                <AvatarFallback className="text-lg">
                                  {mentor.first_name[0]}{mentor.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                  {mentor.first_name} {mentor.last_name}
                                </h3>
                                
                                <div className="flex items-center gap-2 mt-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm font-medium">
                                    {getMatchScoreLabel(mentor.match_score)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    ({mentor.match_score.toFixed(1)}/5)
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => {
                                    setSelectedMentor(mentor);
                                    setShowMentorDialog(true);
                                  }}
                                >
                                  <Info className="h-4 w-4" />
                                  Details
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Subjects</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {mentor.subjects.slice(0, 2).map((subject, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                  {mentor.subjects.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{mentor.subjects.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Rate</Label>
                                <p className="text-sm font-medium">${mentor.hourly_rate}/hour</p>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Button
                                className="w-full gap-2"
                                disabled={loadingAction === `request-${mentor.mentor_id}`}
                                onClick={() => requestMentor(mentor)}
                              >
                                {loadingAction === `request-${mentor.mentor_id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4" />
                                )}
                                Request Mentorship
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No mentors found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {searchSubject 
                        ? `No mentors found matching "${searchSubject}". Try a different search term.` 
                        : "No mentors available right now. Try again later or adjust your search."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* My Mentors Tab */}
        <TabsContent value="my-mentors" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>My Mentor Relationships</CardTitle>
              <CardDescription>
                View and manage your current mentor relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : relationships.length > 0 ? (
                <div className="space-y-4">
                  {relationships.map((relationship) => (
                    <Card key={relationship.id} className="border-primary/10">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarImage src={relationship.mentor_image || undefined} />
                            <AvatarFallback className="text-lg">
                              {relationship.mentor_name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{relationship.mentor_name}</h3>
                              <Badge variant={getStatusBadgeVariant(relationship.status)}>
                                {relationship.status.charAt(0).toUpperCase() + relationship.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Subjects</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(relationship.subjects || []).map((subject, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Since</Label>
                                <p className="text-sm">
                                  {new Date(relationship.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {relationship.status === 'active' && (
                          <div className="mt-4 flex justify-between items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                            >
                              <Calendar className="h-4 w-4" />
                              Schedule Meeting
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Message
                            </Button>
                          </div>
                        )}
                        
                        {relationship.status === 'pending' && (
                          <div className="mt-4 text-sm text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Waiting for mentor to accept your request...
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No mentor relationships</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    You haven't connected with any mentors yet. Find a mentor to help guide your learning journey.
                  </p>
                  <Button onClick={() => setActiveTab('find')}>
                    Find a Mentor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Mentorship Progress</CardTitle>
              <CardDescription>
                Track your learning journey with mentors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relationships.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="bg-accent/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="rounded-full bg-primary/10 p-3 mb-4">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-2xl font-bold">{relationships.length}</span>
                          <span className="text-sm text-muted-foreground">Total Mentors</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="rounded-full bg-primary/10 p-3 mb-4">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-2xl font-bold">0</span>
                          <span className="text-sm text-muted-foreground">Sessions Completed</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="rounded-full bg-primary/10 p-3 mb-4">
                            <Star className="h-6 w-6 text-primary" />
                          </div>
                          <span className="text-2xl font-bold">--</span>
                          <span className="text-sm text-muted-foreground">Avg. Session Rating</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="text-center py-6">
                    <h3 className="text-lg font-semibold mb-2">Mentorship Activity</h3>
                    <p className="text-muted-foreground">
                      Your mentorship activity history will appear here after you complete sessions with your mentors.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No mentorship data yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Connect with mentors to start tracking your learning progress.
                  </p>
                  <Button onClick={() => setActiveTab('find')}>
                    Find a Mentor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Mentor Details Dialog */}
      <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mentor Details</DialogTitle>
            <DialogDescription>
              Learn more about this mentor before sending a request
            </DialogDescription>
          </DialogHeader>
          
          {selectedMentor && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 border-2 border-primary/10">
                  <AvatarImage src={selectedMentor.profile_image || undefined} />
                  <AvatarFallback className="text-2xl">
                    {selectedMentor.first_name[0]}{selectedMentor.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{selectedMentor.first_name} {selectedMentor.last_name}</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      {selectedMentor.experience === 'beginner' ? 'New Mentor' :
                       selectedMentor.experience === 'intermediate' ? 'Experienced Mentor' :
                       'Senior Mentor'}
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">
                        {selectedMentor.match_score.toFixed(1)}/5
                      </span>
                      <span className="text-sm text-muted-foreground">match score</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">${selectedMentor.hourly_rate}/hr</Badge>
                    <Badge variant="outline">{formatAvailability(selectedMentor.availability)}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Expertise</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedMentor.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">Experience</h4>
                  <p className="mt-1 text-sm">
                    {selectedMentor.experience || 'No experience details available.'}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowMentorDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    requestMentor(selectedMentor);
                    setShowMentorDialog(false);
                  }}
                  disabled={loadingAction === `request-${selectedMentor.mentor_id}`}
                >
                  {loadingAction === `request-${selectedMentor.mentor_id}` ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Request Mentorship
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Become a Mentor Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Become a Mentor</DialogTitle>
            <DialogDescription>
              Share your expertise and help others on their learning journey
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              <div>
                <Label htmlFor="mentor-subjects" className="font-medium">Subjects You Can Teach</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select areas where you have expertise and can effectively mentor others
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['JavaScript', 'Python', 'Web Development', 'React', 'Node.js', 'Machine Learning', 
                    'Data Science', 'UX/UI Design', 'Mobile Development', 'DevOps', 'Cloud Computing', 
                    'Blockchain', 'Game Development'].map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`subject-${subject}`} 
                        checked={newApplication.subjects.includes(subject)}
                        onCheckedChange={(checked) => {
                          if (checked) toggleSubject(subject);
                          else toggleSubject(subject);
                        }}
                      />
                      <label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="mentor-experience" className="font-medium">Relevant Experience</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Describe your background, qualifications, and experience in these subjects
                </p>
                <Textarea 
                  id="mentor-experience" 
                  placeholder="e.g., 5 years professional experience as a JavaScript developer, taught coding bootcamps, etc."
                  value={newApplication.experience}
                  onChange={(e) => setNewApplication({...newApplication, experience: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="hourly-rate" className="font-medium">Hourly Rate (USD)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Set your mentorship fee per hour (you can offer free mentorship by entering 0)
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-lg">$</span>
                  <Input
                    id="hourly-rate"
                    type="number"
                    min="0"
                    max="500"
                    value={newApplication.hourly_rate}
                    onChange={(e) => setNewApplication({...newApplication, hourly_rate: parseInt(e.target.value) || 0})}
                    className="max-w-[200px]"
                  />
                </div>
              </div>
              
              <div>
                <Label className="font-medium">Availability</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  When are you typically available for mentorship sessions?
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Days</Label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="weekdays" 
                          checked={newApplication.availability.weekdays}
                          onCheckedChange={(checked) => handleAvailabilityChange('weekdays', !!checked)}
                        />
                        <label htmlFor="weekdays" className="text-sm">Weekdays</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="weekends" 
                          checked={newApplication.availability.weekends}
                          onCheckedChange={(checked) => handleAvailabilityChange('weekends', !!checked)}
                        />
                        <label htmlFor="weekends" className="text-sm">Weekends</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Times</Label>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="morning" 
                          checked={newApplication.availability.morning}
                          onCheckedChange={(checked) => handleAvailabilityChange('morning', !!checked)}
                        />
                        <label htmlFor="morning" className="text-sm">Morning</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="afternoon" 
                          checked={newApplication.availability.afternoon}
                          onCheckedChange={(checked) => handleAvailabilityChange('afternoon', !!checked)}
                        />
                        <label htmlFor="afternoon" className="text-sm">Afternoon</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="evening" 
                          checked={newApplication.availability.evening}
                          onCheckedChange={(checked) => handleAvailabilityChange('evening', !!checked)}
                        />
                        <label htmlFor="evening" className="text-sm">Evening</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApplicationDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitApplication}
              disabled={
                loadingAction === 'submit-application' ||
                newApplication.subjects.length === 0 ||
                !newApplication.experience
              }
            >
              {loadingAction === 'submit-application' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}