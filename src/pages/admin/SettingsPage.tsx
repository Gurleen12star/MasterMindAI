import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import AdminGuard from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { AdminSetting, AdminLog } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Save,
  Loader2,
  BarChart,
  Database,
  ServerCrash,
  History,
  InfoIcon,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { isAdmin, logAdminActivity } = useAdmin();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  
  // Sample settings - in production this would come from the database
  const [featureFlags, setFeatureFlags] = useState({
    enableDeepResearch: true,
    enableAnimationStudio: true,
    enableRoadmapGenerator: true,
    enablePersonalizedLearning: true,
  });
  
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    maxSessionsPerUser: 20,
    maxResearchDepth: 5,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
      fetchActivityLogs();
      logAdminActivity('view', 'system_settings');
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If there are settings in the database, use them to initialize our state
      if (data && data.length > 0) {
        setSettings(data);
        
        // Initialize our state objects based on database values
        const featureFlagSetting = data.find(s => s.key === 'feature_flags');
        if (featureFlagSetting) {
          setFeatureFlags(featureFlagSetting.value);
        }
        
        const systemSetting = data.find(s => s.key === 'system_settings');
        if (systemSetting) {
          setSystemSettings(systemSetting.value);
        }
      } else {
        // If no settings exist, create initial ones
        await initializeSettings();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSettings = async () => {
    try {
      // Create initial settings in database
      const initialSettings = [
        {
          key: 'feature_flags',
          value: featureFlags,
          description: 'Controls which features are enabled on the platform'
        },
        {
          key: 'system_settings',
          value: systemSettings,
          description: 'General system configuration settings'
        }
      ];
      
      const { data, error } = await supabase
        .from('admin_settings')
        .insert(initialSettings)
        .select();

      if (error) throw error;
      setSettings(data || []);
      
    } catch (error) {
      console.error('Error initializing settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize settings',
        variant: 'destructive',
      });
    }
  };

  const fetchActivityLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activity logs',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Update feature flags
      const featureFlagsIndex = settings.findIndex(s => s.key === 'feature_flags');
      if (featureFlagsIndex >= 0) {
        const { error: ffError } = await supabase
          .from('admin_settings')
          .update({ value: featureFlags })
          .eq('id', settings[featureFlagsIndex].id);
        
        if (ffError) throw ffError;
      }
      
      // Update system settings
      const systemSettingsIndex = settings.findIndex(s => s.key === 'system_settings');
      if (systemSettingsIndex >= 0) {
        const { error: ssError } = await supabase
          .from('admin_settings')
          .update({ value: systemSettings })
          .eq('id', settings[systemSettingsIndex].id);
        
        if (ssError) throw ssError;
      }

      // Log the activity
      await logAdminActivity('update', 'system_settings', undefined, {
        feature_flags: featureFlags,
        system_settings: systemSettings
      });

      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully',
      });
      
      // Refresh settings
      fetchSettings();
      fetchActivityLogs();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminGuard>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
              <p className="text-muted-foreground">
                Manage platform configuration and feature flags
              </p>
            </div>
          </div>
          
          <Button 
            onClick={saveSettings} 
            disabled={isSaving || isLoading}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        <Alert className="bg-primary/10 border-primary/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Settings</AlertTitle>
          <AlertDescription>
            These settings control how EchoVerse functions. Changes will apply to all users immediately.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="features" className="space-y-4">
          <TabsList>
            <TabsTrigger value="features" className="gap-2">
              <BarChart className="h-4 w-4" />
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Database className="h-4 w-4" />
              System Configuration
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              Admin Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Management</CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-muted rounded"></div>
                          <div className="h-3 w-60 bg-muted rounded"></div>
                        </div>
                        <div className="h-5 w-10 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Deep Research</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable autonomous research agent feature
                        </p>
                      </div>
                      <Switch 
                        checked={featureFlags.enableDeepResearch}
                        onCheckedChange={(checked) => {
                          setFeatureFlags(prev => ({...prev, enableDeepResearch: checked}));
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Animation Studio</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable educational animation generation
                        </p>
                      </div>
                      <Switch 
                        checked={featureFlags.enableAnimationStudio}
                        onCheckedChange={(checked) => {
                          setFeatureFlags(prev => ({...prev, enableAnimationStudio: checked}));
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Roadmap Generator</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable learning roadmap visualization
                        </p>
                      </div>
                      <Switch 
                        checked={featureFlags.enableRoadmapGenerator}
                        onCheckedChange={(checked) => {
                          setFeatureFlags(prev => ({...prev, enableRoadmapGenerator: checked}));
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Personalized Learning</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable AI teacher personalized learning experiences
                        </p>
                      </div>
                      <Switch 
                        checked={featureFlags.enablePersonalizedLearning}
                        onCheckedChange={(checked) => {
                          setFeatureFlags(prev => ({...prev, enablePersonalizedLearning: checked}));
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 w-40 bg-muted rounded mb-2"></div>
                        <div className="h-10 w-full bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Put the platform in maintenance mode (users will see a maintenance message)
                        </p>
                      </div>
                      <Switch 
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) => {
                          setSystemSettings(prev => ({...prev, maintenanceMode: checked}));
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label className="text-base font-medium">User Registration</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow new users to register for accounts
                        </p>
                      </div>
                      <Switch 
                        checked={systemSettings.userRegistration}
                        onCheckedChange={(checked) => {
                          setSystemSettings(prev => ({...prev, userRegistration: checked}));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-sessions" className="text-base font-medium">
                        Max Learning Sessions Per User
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Maximum number of personalized learning sessions a user can create
                      </p>
                      <Input 
                        id="max-sessions"
                        type="number"
                        min={1}
                        max={100}
                        value={systemSettings.maxSessionsPerUser}
                        onChange={(e) => {
                          setSystemSettings(prev => ({
                            ...prev, 
                            maxSessionsPerUser: parseInt(e.target.value) || 20
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-research-depth" className="text-base font-medium">
                        Max Research Depth
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Maximum depth for the deep research feature
                      </p>
                      <Select 
                        value={systemSettings.maxResearchDepth.toString()}
                        onValueChange={(value) => {
                          setSystemSettings(prev => ({
                            ...prev, 
                            maxResearchDepth: parseInt(value)
                          }));
                        }}
                      >
                        <SelectTrigger id="max-research-depth">
                          <SelectValue placeholder="Select depth" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Shallow</SelectItem>
                          <SelectItem value="3">3 - Standard</SelectItem>
                          <SelectItem value="5">5 - Deep</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerCrash className="h-5 w-5" />
                  System Diagnostics
                </CardTitle>
                <CardDescription>
                  Information about the platform's current state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <p className="font-medium">Operational</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">API Health</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      <div className="p-3 bg-accent rounded-lg flex flex-col">
                        <span className="text-xs text-muted-foreground">Supabase</span>
                        <span className="font-medium flex items-center gap-1 text-green-600">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          Online
                        </span>
                      </div>
                      <div className="p-3 bg-accent rounded-lg flex flex-col">
                        <span className="text-xs text-muted-foreground">Gemini AI</span>
                        <span className="font-medium flex items-center gap-1 text-green-600">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          Online
                        </span>
                      </div>
                      <div className="p-3 bg-accent rounded-lg flex flex-col">
                        <span className="text-xs text-muted-foreground">ElevenLabs</span>
                        <span className="font-medium flex items-center gap-1 text-yellow-600">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          Limited
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Admin Activity Logs</CardTitle>
                    <CardDescription>
                      Records of administrative actions
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchActivityLogs}
                    className="gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  {isLoadingLogs ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 rounded-lg border animate-pulse">
                          <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-3 bg-muted rounded w-1/4"></div>
                          </div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : activityLogs.length > 0 ? (
                    <div className="space-y-3">
                      {activityLogs.map((log, index) => (
                        <motion.div 
                          key={log.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="p-3 text-sm rounded-lg bg-accent/50 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium capitalize">
                              {log.action.replace(/_/g, ' ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-2 text-muted-foreground">
                            <span>Admin:</span>
                            <span className="font-mono">{log.admin_id.substring(0, 8)}...</span>
                            <span>•</span>
                            <span>Entity: {log.entity_type}</span>
                            {log.entity_id && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{log.entity_id.substring(0, 6)}...</span>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <History className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                      <p className="font-medium mb-1">No activity logs found</p>
                      <p className="text-muted-foreground text-sm">
                        Admin actions will be recorded here
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}