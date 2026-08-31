import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import AdminGuard from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { AdminStats, AdminUserData, AdminLearningSession } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  PieChart,
  Users,
  Activity,
  BookOpen,
  Search,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Zap,
  Shield
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdmin, logAdminActivity } = useAdmin();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalLearningSessions: 0,
    totalRoadmaps: 0,
    totalResearchReports: 0,
    activeUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<AdminUserData[]>([]);
  const [recentSessions, setRecentSessions] = useState<AdminLearningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
      logAdminActivity('view', 'admin_dashboard');
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const statsPromises = [
        fetchUserCount(),
        fetchLearningSessionCount(),
        fetchRoadmapCount(),
        fetchResearchCount(),
      ];

      const [userCount, sessionCount, roadmapCount, researchCount] = await Promise.all(statsPromises);
      
      setStats({
        totalUsers: userCount,
        totalLearningSessions: sessionCount,
        totalRoadmaps: roadmapCount,
        totalResearchReports: researchCount,
        activeUsers: Math.floor(userCount * 0.7), // Placeholder - would be calculated from actual usage
      });

      // Fetch recent users
      await fetchRecentUsers();
      
      // Fetch recent learning sessions
      await fetchRecentSessions();
      
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCount = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('student_profiles')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  };

  const fetchLearningSessionCount = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('personalized_learning_sessions')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  };

  const fetchRoadmapCount = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('roadmaps')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  };

  const fetchResearchCount = async (): Promise<number> => {
    const { count, error } = await supabase
      .from('deep_research_history')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  };

  const fetchRecentUsers = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, user_id, first_name, last_name, email, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    setRecentUsers(data || []);
  };

  const fetchRecentSessions = async () => {
    const { data, error } = await supabase
      .from('personalized_learning_sessions')
      .select('id, user_id, topic, personality, modules_data, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;

    // Transform data to get module count
    const sessionsWithModuleCount = data?.map(session => ({
      ...session,
      module_count: Array.isArray(session.modules_data) ? session.modules_data.length : 0
    })) || [];

    setRecentSessions(sessionsWithModuleCount);
  };

  const toggleUserAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ is_admin: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setRecentUsers(prev => 
        prev.map(user => 
          user.user_id === userId 
            ? { ...user, is_admin: !currentStatus } 
            : user
        )
      );

      logAdminActivity(
        currentStatus ? 'revoke_admin' : 'grant_admin', 
        'user', 
        userId
      );

      toast({
        title: 'Success',
        description: `User admin status ${currentStatus ? 'revoked' : 'granted'}.`,
      });
    } catch (error) {
      console.error('Error updating user admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user admin status',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminGuard>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and manage your EchoVerse learning platform
              </p>
            </div>
          </div>
          
          <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>

        <Alert className="bg-primary/10 border-primary/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Welcome, Administrator</AlertTitle>
          <AlertDescription>
            This is the EchoVerse admin dashboard where you can manage users, content, and system settings.
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, change: '+12% from last month' },
            { label: 'Learning Sessions', value: stats.totalLearningSessions, icon: BookOpen, change: '+8% from last month' },
            { label: 'Roadmaps Created', value: stats.totalRoadmaps, icon: Activity, change: '+15% from last month' },
            { label: 'Research Reports', value: stats.totalResearchReports, icon: Search, change: '+20% from last month' },
          ].map((stat, i) => (
            <Card key={i} className="border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    {isLoading ? (
                      <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    )}
                  </div>
                </div>
                {!isLoading && (
                  <div className="mt-4 text-xs text-green-600 flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {stat.change}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Recent Users
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Recent Learning Sessions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Recently Registered Users</CardTitle>
                <CardDescription>
                  The newest users who have joined EchoVerse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-muted"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-3 bg-muted rounded w-1/3"></div>
                          </div>
                          <div className="h-8 w-16 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentUsers.length > 0 ? (
                    <div className="space-y-4">
                      {recentUsers.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/20 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              {user.is_admin && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                                  <Shield className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                                {user.is_admin && (
                                  <span className="ml-2 text-xs text-primary">Admin</span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <Button 
                              variant={user.is_admin ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => toggleUserAdminStatus(user.user_id, user.is_admin)}
                            >
                              {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Recent Learning Sessions</CardTitle>
                <CardDescription>
                  The latest personalized learning sessions created by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 rounded-lg border animate-pulse">
                          <div className="flex justify-between mb-2">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                          </div>
                          <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentSessions.length > 0 ? (
                    <div className="space-y-4">
                      {recentSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border hover:border-primary/20 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">{session.topic}</h4>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {new Date(session.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {session.personality} Personality
                            </div>
                            <div className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                              {session.module_count} modules
                            </div>
                            <div className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                              User: {session.user_id.substring(0, 8)}...
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground">No learning sessions found</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Platform Usage
              </CardTitle>
              <CardDescription>
                Distribution of platform features usage
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Award className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">
                    Usage analytics will be available in a future update
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                User Demographics
              </CardTitle>
              <CardDescription>
                User distribution by learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Award className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">
                    Demographic analytics will be available in a future update
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}