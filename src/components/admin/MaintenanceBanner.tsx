import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MaintenanceBanner() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'system_settings')
          .single();
        
        if (!error && data) {
          setIsMaintenanceMode(data.value.maintenanceMode || false);
        } else if (error && error.code === 'PGRST116') {
          // No system_settings row exists yet, default to maintenance mode disabled
          setIsMaintenanceMode(false);
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkMaintenanceStatus();
    
    // Set up a subscription for real-time updates
    const systemSettingsSubscription = supabase
      .channel('system-settings-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'admin_settings',
          filter: 'key=eq.system_settings'
        }, 
        (payload) => {
          if (payload.new && payload.new.value) {
            setIsMaintenanceMode(payload.new.value.maintenanceMode || false);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(systemSettingsSubscription);
    };
  }, []);
  
  if (isLoading || !isMaintenanceMode) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="sticky top-0 z-50 rounded-none">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>System Maintenance</AlertTitle>
      <AlertDescription>
        EchoVerse is currently in maintenance mode. Some features may be unavailable. We apologize for any inconvenience.
      </AlertDescription>
    </Alert>
  );
}