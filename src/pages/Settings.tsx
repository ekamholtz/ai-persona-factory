
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, LogOut, User, CreditCard, Bell, Shield, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/avatar';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    avatar_url: '',
    role: 'user',
    credits: 0,
    created_at: '',
    updated_at: ''
  });
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [sessionNotifications, setSessionNotifications] = useState<boolean>(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="w-16 h-16">
                      {profile.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{profile.full_name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="full_name">Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profile.full_name || ''}
                        onChange={handleInputChange}
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={fetchProfile}>Reset</Button>
                  <Button
                    onClick={updateProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>
                    Overview of your account usage and limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Available Credits</div>
                      <div className="text-2xl font-bold">{profile.credits}</div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Account Type</div>
                      <div className="text-2xl font-bold capitalize">{profile.role}</div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Subscription</div>
                      <div className="text-2xl font-bold">
                        {profile.subscription_tier || 'Free'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates and alerts via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications while you're using the app
                      </p>
                    </div>
                    <Switch 
                      checked={sessionNotifications}
                      onCheckedChange={setSessionNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.subscription_tier ? `${profile.subscription_tier} Plan` : 'Free Tier'}
                      </p>
                    </div>
                    {profile.subscription_tier && (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        Active
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Credits</span>
                      <span className="font-medium">{profile.role === 'premium' ? '100' : '5'}</span>
                    </div>
                    
                    {profile.subscription_expires_at && (
                      <div className="flex justify-between text-sm">
                        <span>Next Billing Date</span>
                        <span className="font-medium">
                          {new Date(profile.subscription_expires_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Available Plans</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={`border-2 ${profile.role === 'user' ? 'border-primary' : 'border-transparent'}`}>
                      <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>Basic features for personal use</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">$0</div>
                        <ul className="space-y-2 text-sm">
                          <li>5 credits per month</li>
                          <li>Basic avatar generation</li>
                          <li>Standard image resolution</li>
                          <li>3 saved avatars maximum</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" disabled={profile.role === 'user'}>
                          {profile.role === 'user' ? 'Current Plan' : 'Select Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className={`border-2 ${profile.role === 'premium' ? 'border-primary' : 'border-transparent'}`}>
                      <CardHeader>
                        <CardTitle>Premium</CardTitle>
                        <CardDescription>Enhanced features for more creativity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></div>
                        <ul className="space-y-2 text-sm">
                          <li>100 credits per month</li>
                          <li>Advanced avatar generation</li>
                          <li>HD image resolution</li>
                          <li>Video generation</li>
                          <li>Unlimited saved avatars</li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" disabled={profile.role === 'premium'}>
                          {profile.role === 'premium' ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                {profile.subscription_tier && (
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="text-destructive">
                      Cancel Subscription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
