import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import AdminGuard from '@/components/admin/AdminGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { AdminUserData } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Shield,
  Search,
  MoreHorizontal,
  UserCog,
  Trash2,
  Clock,
  CalendarClock,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function UserManagementPage() {
  const { isAdmin, logAdminActivity } = useAdmin();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 20;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      logAdminActivity('view', 'user_management');
    }
  }, [isAdmin]);

  useEffect(() => {
    if (users.length > 0 && searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async (page = 0) => {
    try {
      if (page === 0) {
        setIsLoading(true);
        setUsers([]);
      } else {
        setIsLoadingMore(true);
      }

      // First get total count
      if (page === 0) {
        const { count, error: countError } = await supabase
          .from('student_profiles')
          .select('id', { count: 'exact', head: true });
        
        if (!countError) {
          setTotalUsers(count || 0);
        }
      }

      // Then fetch page of users
      const { data, error } = await supabase
        .from('student_profiles')
        .select('id, user_id, first_name, last_name, email, is_admin, created_at')
        .range(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (page === 0) {
        setUsers(data || []);
      } else {
        setUsers(prev => [...prev, ...(data || [])]);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const toggleUserAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update({ is_admin: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId 
            ? { ...user, is_admin: !currentStatus } 
            : user
        )
      );

      if (selectedUser && selectedUser.user_id === userId) {
        setSelectedUser({ ...selectedUser, is_admin: !currentStatus });
      }

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

  const viewUserDetails = (user: AdminUserData) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleLoadMore = () => {
    fetchUsers(currentPage + 1);
  };

  return (
    <AdminGuard>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchUsers()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Alert className="bg-primary/10 border-primary/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>User Management</AlertTitle>
          <AlertDescription>
            Here you can manage all users and assign admin privileges. Use the admin toggle to grant or revoke administrator access.
          </AlertDescription>
        </Alert>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-admins" className="text-sm">Admins Only</Label>
              <Switch 
                id="show-admins" 
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilteredUsers(users.filter(user => user.is_admin));
                  } else {
                    setFilteredUsers(users);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Listing */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>
                  {totalUsers} total users
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full pr-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-3 bg-muted rounded w-1/3"></div>
                        </div>
                        <div className="h-8 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 rounded-lg border hover:border-primary/20 hover:bg-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            {user.is_admin && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                <Shield className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                              {user.is_admin && (
                                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                  Admin
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground hidden md:flex items-center">
                            <CalendarClock className="h-3.5 w-3.5 mr-1" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={user.is_admin}
                              onCheckedChange={() => toggleUserAdminStatus(user.user_id, user.is_admin)}
                              className="data-[state=checked]:bg-primary"
                            />
                            <Label className="text-sm">Admin</Label>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewUserDetails(user)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {users.length < totalUsers && (
                    <div className="flex justify-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <p className="font-medium mb-2">No users found</p>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery ? "Try a different search term" : "There are no users in the system yet"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about this user
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-8 w-8 text-primary" />
                    </div>
                    {selectedUser.is_admin && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Shield className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">User ID</h4>
                    <p className="text-sm font-mono bg-muted p-1 rounded">
                      {selectedUser.user_id.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Admin Access</h4>
                    <Switch 
                      checked={selectedUser.is_admin}
                      onCheckedChange={() => toggleUserAdminStatus(selectedUser.user_id, selectedUser.is_admin)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedUser.is_admin
                      ? "This user has administrator privileges. They can access all platform features and manage other users."
                      : "This user has standard privileges. You can grant admin access if needed."}
                  </p>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowUserDialog(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="destructive"
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: 'Not Implemented',
                          description: 'User deletion is not yet implemented',
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}