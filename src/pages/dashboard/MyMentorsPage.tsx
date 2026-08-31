import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { MentorRelationship } from '@/types/mentor';
import {
  UserRound,
  Users,
  Calendar,
  MessageSquare,
  Clock,
  ArrowRight,
  Loader2,
  CheckCheck,
  X,
  CalendarClock,
  Video,
  CalendarPlus,
  CheckCircle2,
  User
} from 'lucide-react';

export default function MyMentorsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('mentees');
  const [mentorRelationships, setMentorRelationships] = useState<MentorRelationship[]>([]);
  const [menteeRelationships, setMenteeRelationships] = useState<MentorRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  // In a real app, these would come from the database via Supabase
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Mock data for demonstration
      const mockMentorRelationships: MentorRelationship[] = Array(3).fill(null).map((_, i) => ({
        id: `mentor-rel-${i}`,
        mentor_id: 'mock-mentor-id',
        student_id: user?.id || 'unknown',
        status: i === 2 ? 'pending' : 'active',
        subjects: [['Computer Science', 'Machine Learning'], ['Mathematics', 'Statistics'], ['Physics']][i],
        notes: 'Last session focused on neural network architecture and backpropagation algorithms.',
        meeting_schedule: [
          {
            date: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
            start_time: '15:00',
            end_time: '16:00',
            topic: 'Advanced Data Structures',
            completed: false
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const mockMenteeRelationships: MentorRelationship[] = Array(5).fill(null).map((_, i) => ({
        id: `mentee-rel-${i}`,
        mentor_id: user?.id || 'unknown',
        student_id: `mock-student-${i}`,
        status: i === 3 ? 'pending' : 'active',
        subjects: [['Web Development', 'React'], ['Data Science'], ['Python Programming'], ['Mobile Development'], ['UI/UX Design']][i],
        notes: i % 2 === 0 ? 'Working on building portfolio projects.' : 'Focusing on algorithm optimization techniques.',
        meeting_schedule: [
          {
            date: new Date(Date.now() + 86400000 * (i + 2)).toISOString().split('T')[0],
            start_time: '10:00',
            end_time: '11:30',
            topic: ['JavaScript Basics', 'Python Data Analysis', 'Algorithm Design', 'React Hooks', 'Design Systems'][i],
            completed: false
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      setMentorRelationships(mockMentorRelationships);
      setMenteeRelationships(mockMenteeRelationships);
      
      // Extract upcoming sessions from both relationships
      const allUpcoming = [
        ...mockMentorRelationships.flatMap(r => r.meeting_schedule.map(s => ({
          ...s, 
          relationship: r,
          isMentor: false,
          otherName: 'Jane Smith' // Mock mentor name
        }))),
        ...mockMenteeRelationships.flatMap(r => r.meeting_schedule.map(s => ({
          ...s, 
          relationship: r,
          isMentor: true,
          otherName: ['Alex Johnson', 'Maria Garcia', 'David Kim', 'Sophia Williams', 'James Brown'][parseInt(r.student_id.split('-')[2])]
        })))
      ].sort((a, b) => new Date(a.date + 'T' + a.start_time).getTime() - new Date(b.date + 'T' + b.start_time).getTime());
      
      setUpcomingSessions(allUpcoming.slice(0, 3));
      setIsLoading(false);
    }, 1000);
  }, [user?.id]);
  
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCheck className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary">
            Inactive
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const MentorshipCard = ({ relationship, isMentor }: { relationship: MentorRelationship, isMentor: boolean }) => {
    return (
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 p-4 md:p-6 flex flex-col items-center text-center bg-muted/30 border-r">
            <Avatar className="h-20 w-20 mb-4 border-2 border-primary/20">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${relationship.id}`} />
              <AvatarFallback>
                {isMentor ? relationship.student_id.substring(0, 2).toUpperCase() : 'MS'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">
              {isMentor ? 
                ['Alex Johnson', 'Maria Garcia', 'David Kim', 'Sophia Williams', 'James Brown'][parseInt(relationship.student_id.split('-')[2])] : 
                'Jane Smith'}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {isMentor ? 'Your Mentee' : 'Your Mentor'}
            </p>
            
            <div className="mt-2">
              {renderStatusBadge(relationship.status)}
            </div>
            
            <Button
              className="mt-4 w-full"
              size="sm"
              disabled={relationship.status === 'pending'}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
          
          <div className="p-4 md:p-6 flex-1">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {relationship.subjects.map(subject => (
                  <Badge key={subject} variant="secondary" className="font-normal">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            
            {relationship.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Session Notes</h4>
                <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-md">
                  {relationship.notes}
                </p>
              </div>
            )}
            
            {relationship.meeting_schedule.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Upcoming Session</h4>
                <Card className="bg-primary/5 border border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {formatDate(relationship.meeting_schedule[0].date)}
                        </span>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {relationship.meeting_schedule[0].start_time} - {relationship.meeting_schedule[0].end_time}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {relationship.meeting_schedule[0].topic || 'General mentoring session'}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2 flex-1">
                        <Calendar className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button size="sm" className="gap-2 flex-1">
                        <Video className="h-4 w-4" />
                        Join Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 before:absolute before:inset-0 before:rounded-lg before:bg-primary/5 before:animate-pulse">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Mentors</h1>
          <p className="text-muted-foreground">
            Manage your mentoring relationships and sessions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Your scheduled mentoring sessions for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading sessions...</span>
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingSessions.map((session, index) => (
                  <Card key={index} className="bg-accent/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={session.isMentor ? "default" : "secondary"} className="gap-1">
                          {session.isMentor ? (
                            <>
                              <UserRound className="h-3 w-3" />
                              You're Mentoring
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-3 w-3" />
                              You're Learning
                            </>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {session.relationship.subjects[0]}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${session.relationship.id}`} />
                          <AvatarFallback>{session.otherName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{session.otherName}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.isMentor ? 'Mentee' : 'Mentor'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{session.start_time} - {session.end_time}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium mb-3">
                        {session.topic || 'General mentoring session'}
                      </p>
                      
                      <Button size="sm" className="w-full gap-2">
                        <Video className="h-4 w-4" />
                        Join Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Sessions</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  You don't have any mentoring sessions scheduled for the next 7 days.
                </p>
                <Button>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule a Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Mentorship Relationships */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="mentees" className="gap-2">
                  <Users className="h-4 w-4" />
                  My Mentees
                </TabsTrigger>
                <TabsTrigger value="mentors" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  My Mentors
                </TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/find-mentors">Find Mentors</a>
              </Button>
            </div>
            
            <TabsContent value="mentees" className="mt-0 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : menteeRelationships.length > 0 ? (
                menteeRelationships.map(relationship => (
                  <MentorshipCard key={relationship.id} relationship={relationship} isMentor={true} />
                ))
              ) : (
                <Card className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Mentees Found</h3>
                  <p className="text-muted-foreground mb-6">
                    You're not currently mentoring any students.
                  </p>
                  <Button asChild>
                    <a href="#">Become a Mentor</a>
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="mentors" className="mt-0 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : mentorRelationships.length > 0 ? (
                mentorRelationships.map(relationship => (
                  <MentorshipCard key={relationship.id} relationship={relationship} isMentor={false} />
                ))
              ) : (
                <Card className="p-12 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Mentors Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any mentors yet. Find a mentor to accelerate your learning.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/find-mentors">Find a Mentor</a>
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}