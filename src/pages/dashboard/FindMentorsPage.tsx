import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { MentorProfile, MentorSearchParams } from '@/types/mentor';
import {
  Search,
  BookOpen,
  Sparkles,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Filter,
  UserRound,
  Briefcase,
  GraduationCap,
  User,
  Check,
  Loader2
} from 'lucide-react';

export default function FindMentorsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingMentorId, setRequestingMentorId] = useState<string | null>(null);
  
  // Search parameters
  const [searchParams, setSearchParams] = useState<MentorSearchParams>({
    subject: undefined,
    expertise_level: undefined,
    max_hourly_rate: 100,
    availability_day: undefined,
    sort_by: 'rating',
    sort_order: 'desc'
  });
  
  // Filter options
  const subjectOptions = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Psychology', 'Economics', 'Business'];
  const expertiseLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Mock data for now - in a real app, this would come from the database
  useEffect(() => {
    // In a real implementation, we would fetch from the database
    const mockMentors: MentorProfile[] = Array(10).fill(null).map((_, i) => ({
      id: `mentor-${i}`,
      user_id: `user-${i}`,
      first_name: ['Sarah', 'John', 'Maria', 'David', 'Emily', 'Michael', 'Jessica', 'Robert', 'Jennifer', 'William'][i],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][i],
      email: `mentor${i}@example.com`,
      profile_image: `https://i.pravatar.cc/150?u=${i}`,
      bio: `Experienced mentor with a passion for teaching and helping students excel. Specializing in various subjects and learning techniques.`,
      subjects: subjectOptions.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
      expertise_level: expertiseLevels[Math.floor(Math.random() * expertiseLevels.length)] as any,
      hourly_rate: Math.floor(Math.random() * 50) + 20,
      availability: {
        'Monday': [{ start: '09:00', end: '12:00' }],
        'Wednesday': [{ start: '14:00', end: '18:00' }],
        'Friday': [{ start: '10:00', end: '15:00' }],
      },
      total_sessions: Math.floor(Math.random() * 50),
      rating: (3 + Math.random() * 2).toFixed(1) as unknown as number,
      is_active: Math.random() > 0.2
    }));
    
    setMentors(mockMentors);
    setFilteredMentors(mockMentors);
    setIsLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...mentors];
    
    if (searchParams.subject) {
      filtered = filtered.filter(mentor => 
        mentor.subjects.includes(searchParams.subject!)
      );
    }
    
    if (searchParams.expertise_level) {
      filtered = filtered.filter(mentor => 
        mentor.expertise_level === searchParams.expertise_level
      );
    }
    
    if (searchParams.max_hourly_rate !== undefined) {
      filtered = filtered.filter(mentor => 
        mentor.hourly_rate <= searchParams.max_hourly_rate!
      );
    }
    
    if (searchParams.availability_day) {
      filtered = filtered.filter(mentor => 
        mentor.availability[searchParams.availability_day!]
      );
    }
    
    // Sort results
    if (searchParams.sort_by) {
      filtered.sort((a, b) => {
        const aValue = a[searchParams.sort_by!];
        const bValue = b[searchParams.sort_by!];
        
        return searchParams.sort_order === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
    }
    
    setFilteredMentors(filtered);
  }, [mentors, searchParams]);

  const handleRequestMentor = (mentorId: string) => {
    setRequestingMentorId(mentorId);
    
    // In a real app, this would send a request to the backend
    setTimeout(() => {
      setRequestingMentorId(null);
      toast({
        title: "Mentor Request Sent",
        description: "Your request has been sent to the mentor. They'll review it shortly.",
      });
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find Mentors</h1>
          <p className="text-muted-foreground">
            Connect with expert mentors to accelerate your learning journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <Card className="lg:col-span-1 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Mentors
            </CardTitle>
            <CardDescription>
              Narrow down mentors based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select
                value={searchParams.subject}
                onValueChange={(value) => setSearchParams({...searchParams, subject: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>All Subjects</SelectItem>
                  {subjectOptions.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Expertise Level</label>
              <Select
                value={searchParams.expertise_level}
                onValueChange={(value) => setSearchParams({...searchParams, expertise_level: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expertise level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>Any Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Max Hourly Rate</label>
                <span className="text-sm font-medium">${searchParams.max_hourly_rate}</span>
              </div>
              <Slider
                defaultValue={[100]}
                min={10}
                max={200}
                step={5}
                value={[searchParams.max_hourly_rate || 100]}
                onValueChange={(value) => setSearchParams({...searchParams, max_hourly_rate: value[0]})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability Day</label>
              <Select
                value={searchParams.availability_day}
                onValueChange={(value) => setSearchParams({...searchParams, availability_day: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined}>Any Day</SelectItem>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <div className="flex gap-2">
                <Select
                  value={searchParams.sort_by}
                  onValueChange={(value: any) => setSearchParams({...searchParams, sort_by: value})}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="hourly_rate">Hourly Rate</SelectItem>
                    <SelectItem value="total_sessions">Experience</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchParams({
                    ...searchParams, 
                    sort_order: searchParams.sort_order === 'asc' ? 'desc' : 'asc'
                  })}
                >
                  {searchParams.sort_order === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSearchParams({
                subject: undefined,
                expertise_level: undefined,
                max_hourly_rate: 100,
                availability_day: undefined,
                sort_by: 'rating',
                sort_order: 'desc'
              })}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isLoading ? 'Loading mentors...' : `${filteredMentors.length} Mentors Found`}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name..." 
                className="pl-9"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMentors.length === 0 ? (
            <Card className="p-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No mentors match your filters</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria to find available mentors.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchParams({
                  subject: undefined,
                  expertise_level: undefined,
                  max_hourly_rate: 100,
                  availability_day: undefined,
                  sort_by: 'rating',
                  sort_order: 'desc'
                })}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
              <div className="space-y-4">
                {filteredMentors.map((mentor) => (
                  <Card key={mentor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3 lg:w-1/4 p-4 md:p-6 flex flex-col items-center text-center bg-muted/30 border-r">
                        <div className="relative mb-3">
                          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20">
                            <img 
                              src={mentor.profile_image || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'} 
                              alt={`${mentor.first_name} ${mentor.last_name}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-semibold text-sm">
                            {mentor.rating}
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg">{mentor.first_name} {mentor.last_name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-muted-foreground">{mentor.rating}/5.0</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">{mentor.total_sessions}</span> sessions completed
                        </p>
                        
                        <div className="mt-4 text-sm text-muted-foreground font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${mentor.hourly_rate}/hour
                        </div>
                        
                        <Button
                          className="mt-4 w-full gap-2"
                          size="sm"
                          onClick={() => handleRequestMentor(mentor.id)}
                          disabled={requestingMentorId === mentor.id}
                        >
                          {requestingMentorId === mentor.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Requesting...
                            </>
                          ) : (
                            <>
                              <UserRound className="h-4 w-4" />
                              Request Mentor
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="p-4 md:p-6 flex-1">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentor.subjects.map(subject => (
                              <Badge 
                                key={subject} 
                                variant="secondary" 
                                className="font-normal"
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Expertise Level</h4>
                          <Badge 
                            variant="outline" 
                            className="font-normal capitalize"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            {mentor.expertise_level}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Availability</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(mentor.availability).map(([day, times]) => (
                              <div key={day} className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{day}:</span>
                                {times.map((time, i) => (
                                  <span key={i} className="text-muted-foreground">
                                    {time.start}-{time.end}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {mentor.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}