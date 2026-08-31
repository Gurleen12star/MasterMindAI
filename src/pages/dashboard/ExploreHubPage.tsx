import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Clock, BookOpen, Star, History, FileText, Network, Video, Brain, Loader2, BarChart, Filter } from 'lucide-react';
import AnimatedLoadingText from '@/components/ui/AnimatedLoadingText';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase';
import OverviewStats from '@/components/dashboard/OverviewStats';

// Types for activities
interface BaseActivity {
  id: string;
  user_id: string;
  type: 'learning_session' | 'deep_research' | 'roadmap';
  topic: string;
  created_at: string;
}

interface LearningSessionActivity extends BaseActivity {
  type: 'learning_session';
  personality: string;
  modules_count: number;
}

interface ResearchReportActivity extends BaseActivity {
  type: 'deep_research';
  max_depth: number;
  total_findings: number;
}

interface RoadmapActivity extends BaseActivity {
  type: 'roadmap';
  mermaid_code_preview: string;
}

type CombinedActivity = LearningSessionActivity | ResearchReportActivity | RoadmapActivity;

// Type for user statistics
interface UserStats {
  totalLearningSessions: number;
  totalResearchReports: number;
  totalRoadmaps: number;
  lastActive: string;
}

export default function ExploreHubPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivities, setRecentActivities] = useState<CombinedActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userStats, setUserStats] = useState<UserStats>({
    totalLearningSessions: 0,
    totalResearchReports: 0,
    totalRoadmaps: 0,
    lastActive: new Date().toISOString()
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserActivitiesAndStats();
    }
  }, [user?.id]);

  const fetchUserActivitiesAndStats = async () => {
    if (!user?.id) return;
    
    setIsLoadingActivities(true);
    
    try {
      // Fetch personalized learning sessions
      const { data: learningSessions, error: learningError } = await supabase
        .from('personalized_learning_sessions')
        .select('id, user_id, topic, personality, modules_data, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (learningError) throw learningError;
      
      // Fetch deep research history
      const { data: researchReports, error: researchError } = await supabase
        .from('deep_research_history')
        .select('id, user_id, topic, max_depth, total_findings, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (researchError) throw researchError;
      
      // Fetch roadmaps
      const { data: roadmaps, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('id, user_id, topic, mermaid_code, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (roadmapsError) throw roadmapsError;
      
      // Transform learning sessions
      const learningActivities: LearningSessionActivity[] = (learningSessions || []).map(session => ({
        id: session.id,
        user_id: session.user_id,
        type: 'learning_session',
        topic: session.topic,
        personality: session.personality,
        modules_count: Array.isArray(session.modules_data) ? session.modules_data.length : 0,
        created_at: session.created_at
      }));
      
      // Transform research reports
      const researchActivities: ResearchReportActivity[] = (researchReports || []).map(report => ({
        id: report.id,
        user_id: report.user_id,
        type: 'deep_research',
        topic: report.topic,
        max_depth: report.max_depth,
        total_findings: report.total_findings || 0,
        created_at: report.created_at
      }));
      
      // Transform roadmaps
      const roadmapActivities: RoadmapActivity[] = (roadmaps || []).map(roadmap => ({
        id: roadmap.id,
        user_id: roadmap.user_id,
        type: 'roadmap',
        topic: roadmap.topic,
        mermaid_code_preview: roadmap.mermaid_code ? roadmap.mermaid_code.substring(0, 50) + '...' : '',
        created_at: roadmap.created_at
      }));
      
      // Combine all activities and sort by creation date
      const allActivities = [
        ...learningActivities,
        ...researchActivities,
        ...roadmapActivities
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setRecentActivities(allActivities);
      
      // Update user stats
      setUserStats({
        totalLearningSessions: learningSessions?.length || 0,
        totalResearchReports: researchReports?.length || 0,
        totalRoadmaps: roadmaps?.length || 0,
        lastActive: allActivities.length > 0 ? allActivities[0].created_at : new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const renderActivityItem = (activity: CombinedActivity) => {
    // Get the appropriate icon based on activity type
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'learning_session':
          return <Brain className="h-5 w-5 text-primary" />;
        case 'deep_research':
          return <FileText className="h-5 w-5 text-primary" />;
        case 'roadmap':
          return <Network className="h-5 w-5 text-primary" />;
        default:
          return <Star className="h-5 w-5 text-primary" />;
      }
    };
    
    // Get badge text and color based on activity type
    const getActivityBadge = () => {
      switch (activity.type) {
        case 'learning_session':
          return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Learning Session</Badge>;
        case 'deep_research':
          return <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Research Report</Badge>;
        case 'roadmap':
          return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Learning Roadmap</Badge>;
        default:
          return <Badge variant="secondary">Activity</Badge>;
      }
    };
    
    return (
      <motion.div
        key={activity.id}
        whileHover={{ x: 5 }}
        className="p-4 rounded-xl bg-accent/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center mt-1 flex-shrink-0">
            {getActivityIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{activity.topic}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {getActivityBadge()}
            </div>
            
            {/* Type-specific details */}
            {activity.type === 'learning_session' && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Personality: {activity.personality}</span>
                {activity.modules_count > 0 && (
                  <span className="ml-3 text-muted-foreground">{activity.modules_count} modules</span>
                )}
              </div>
            )}
            
            {activity.type === 'deep_research' && (
              <div className="mt-2 text-sm flex items-center gap-3">
                <span className="text-muted-foreground">Depth: {activity.max_depth}</span>
                <span className="text-muted-foreground">Findings: {activity.total_findings}</span>
              </div>
            )}
            
            {activity.type === 'roadmap' && (
              <div className="mt-2 text-sm flex items-center gap-2">
                <span className="text-muted-foreground">Learning roadmap visualization</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Filter activities based on active tab
  const filteredActivities = activeTab === 'all' 
    ? recentActivities 
    : recentActivities.filter(activity => activity.type === activeTab);

  return (
    <div 
      className="p-4 md:p-6 space-y-8"
      onClick={(e) => {
        console.log('Page clicked - Target:', e.target, 'Current Target:', e.currentTarget);
      }}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Explore Hub</h1>
        <p className="text-muted-foreground">
          Discover personalized learning content tailored to your interests
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl" />
        <Card className="p-6 backdrop-blur-xl bg-background/20 border-primary/10 rounded-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for topics, courses, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
            <Button className="ml-2 gap-2">
              <Sparkles className="h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>
      </div>

      {/* Overview Stats */}
      <OverviewStats />
      
      {/* Recent Activities */}
      <Card className="p-6 rounded-2xl">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUserActivitiesAndStats} 
              disabled={isLoadingActivities}
              className="gap-2"
            >
              {isLoadingActivities ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <History className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="learning_session" className="gap-2">
                <Brain className="h-4 w-4" />
                Learning Sessions
              </TabsTrigger>
              <TabsTrigger value="deep_research" className="gap-2">
                <FileText className="h-4 w-4" />
                Research Reports
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="gap-2">
                <Network className="h-4 w-4" />
                Roadmaps
              </TabsTrigger>
            </TabsList>
            
            <CardContent className="px-0 pt-6">
              <ScrollArea className="h-[450px] w-full pr-4">
                {isLoadingActivities ? (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading your activities...</p>
                  </div>
                ) : filteredActivities.length > 0 ? (
                  <div className="space-y-4">
                    {filteredActivities.map(activity => renderActivityItem(activity))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <History className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No recent activities found</h3>
                    <p className="text-muted-foreground max-w-md">
                      {activeTab === 'all' 
                        ? "You haven't created any learning content yet. Start by exploring our features!" 
                        : `You haven't created any ${activeTab.replace('_', ' ')}s yet.`}
                    </p>
                    <div className="flex gap-4 mt-6">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setActiveTab('all')}
                      >
                        <History className="h-4 w-4" />
                        View All Activities
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={fetchUserActivitiesAndStats}
                        disabled={isLoadingActivities}
                      >
                        {isLoadingActivities ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BarChart className="h-4 w-4" />
                        )}
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Learning Resources Card */}
      <Card className="p-6 rounded-2xl">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Resources
          </CardTitle>
          <CardDescription>Quick access to our learning tools</CardDescription>
        </CardHeader>
        <CardContent className="px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: 'Personalized Learning', 
              icon: Brain, 
              description: 'AI-powered personalized learning sessions', 
              path: '/dashboard/personalized-learning',
              color: 'from-blue-500/20 to-purple-500/20'
            },
            { 
              title: 'Deep Research', 
              icon: FileText, 
              description: 'In-depth research on any topic', 
              path: '/dashboard/research',
              color: 'from-purple-500/20 to-pink-500/20'
            },
            { 
              title: 'Roadmap Generator', 
              icon: Network, 
              description: 'Create visual learning paths', 
              path: '/dashboard/roadmap-generator',
              color: 'from-green-500/20 to-emerald-500/20'
            },
            { 
              title: 'Animation Studio', 
              icon: Video, 
              description: 'Generate educational animations', 
              path: '/dashboard/animation-studio',
              color: 'from-orange-500/20 to-amber-500/20'
            },
          ].map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card 
                key={index}
                className="relative group overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Card clicked:', resource.title, resource.path);
                  window.location.href = resource.path;
                }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${resource.color} opacity-10`} />
                <div className="relative p-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}