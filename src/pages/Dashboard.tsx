
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar as AvatarImage, AvatarFallback, AvatarImage as AvatarImageComponent } from '@/components/ui/avatar';
import { Loader2, Plus, RefreshCw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, Generation, Profile } from '@/types/avatar';

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch avatars
      const { data: avatarData, error: avatarError } = await supabase
        .from('avatars')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (avatarError) throw avatarError;
      setAvatars(avatarData as Avatar[]);

      // Fetch recent generations
      const { data: genData, error: genError } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (genError) throw genError;
      setRecentGenerations(genData as Generation[]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                New Avatar
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* User stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile?.credits || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for avatar and content generation
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Your Avatars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avatars.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total avatars created
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{profile?.role || 'User'}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile?.subscription_tier ? `${profile.subscription_tier} plan` : 'Free tier'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="avatars" className="space-y-6">
              <TabsList>
                <TabsTrigger value="avatars">Your Avatars</TabsTrigger>
                <TabsTrigger value="recent">Recent Generations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="avatars" className="space-y-4">
                {avatars.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No avatars yet</h3>
                      <p className="text-muted-foreground text-center max-w-sm mb-4">
                        Create your first avatar to start generating unique images and videos with AI.
                      </p>
                      <Button asChild>
                        <Link to="/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Avatar
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {avatars.map((avatar) => (
                      <Card key={avatar.id} className="overflow-hidden">
                        <div className="aspect-square relative bg-muted">
                          {avatar.primary_image_url ? (
                            <img 
                              src={avatar.primary_image_url} 
                              alt={avatar.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle>{avatar.name}</CardTitle>
                          <CardDescription>
                            {avatar.description?.substring(0, 100) || 'No description'}
                            {avatar.description && avatar.description.length > 100 ? '...' : ''}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" asChild>
                            <Link to={`/edit/${avatar.id}`}>
                              Edit Avatar
                            </Link>
                          </Button>
                          <Button asChild>
                            <Link to={`/gallery?avatar=${avatar.id}`}>
                              View Gallery
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent">
                {recentGenerations.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No generations yet</h3>
                      <p className="text-muted-foreground text-center max-w-sm mb-4">
                        Select an avatar and start generating unique images and videos with AI.
                      </p>
                      <Button asChild disabled={avatars.length === 0}>
                        <Link to={avatars.length > 0 ? `/edit/${avatars[0].id}` : "#"}>
                          Generate Content
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentGenerations.map((generation) => (
                      <Card key={generation.id}>
                        <div className="aspect-square relative bg-muted">
                          {generation.type === 'image' ? (
                            <img 
                              src={generation.url} 
                              alt={generation.prompt?.substring(0, 20)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-black">
                              <div className="text-white text-sm">Video content</div>
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {generation.prompt?.substring(0, 30)}
                            {generation.prompt && generation.prompt.length > 30 ? '...' : ''}
                          </CardTitle>
                          <CardDescription>
                            {new Date(generation.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to={`/gallery?avatar=${generation.avatar_id}`}>
                              View in Gallery
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
