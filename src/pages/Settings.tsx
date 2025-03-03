
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CreditCard, Upload, User, Key } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: 'user' | 'premium' | 'admin';
  credits: number;
  subscription_tier: string | null;
  subscription_expires_at: string | null;
  created_at: string;
}

const Settings = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
        setFullName(data.full_name || '');
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [navigate, toast]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  
  const updateProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    
    try {
      let avatarUrl = profile.avatar_url;
      
      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${profile.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatar-images')
          .upload(filePath, avatarFile);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('avatar-images')
          .getPublicUrl(filePath);
        
        avatarUrl = data.publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        full_name: fullName,
        avatar_url: avatarUrl,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      // Reset form
      document.getElementById('password-form')?.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile?.full_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="avatar-upload"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Change Avatar
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.id || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex items-center gap-2">
                    <Badge>{profile?.role || 'user'}</Badge>
                    {profile?.subscription_tier && (
                      <Badge variant="outline">{profile.subscription_tier}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account created on {new Date(profile?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form id="password-form" className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const currentPassword = formData.get('currentPassword') as string;
                  const newPassword = formData.get('newPassword') as string;
                  const confirmPassword = formData.get('confirmPassword') as string;
                  
                  if (newPassword !== confirmPassword) {
                    toast({
                      variant: "destructive",
                      title: "Passwords don't match",
                      description: "New password and confirmation must match.",
                    });
                    return;
                  }
                  
                  handleChangePassword(currentPassword, newPassword);
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and payment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-muted-foreground">
                      {profile?.subscription_tier ? profile.subscription_tier : 'Free Plan'}
                    </p>
                  </div>
                  
                  {profile?.subscription_tier ? (
                    <Badge>
                      {profile.subscription_expires_at
                        ? `Expires: ${new Date(profile.subscription_expires_at).toLocaleDateString()}`
                        : 'Active'}
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Credit Balance</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {profile?.credits || 0} credits
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Credits are used for generating images and videos
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">5 Credits</CardTitle>
                      <CardDescription>$4.99</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Buy</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">20 Credits</CardTitle>
                      <CardDescription>$14.99</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Buy</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">50 Credits</CardTitle>
                      <CardDescription>$29.99</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Buy</Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Payment Methods</h3>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
