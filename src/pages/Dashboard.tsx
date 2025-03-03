
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Plus, Trash, Image as ImageIcon, Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Avatar {
  id: string;
  name: string;
  description: string;
  primary_image_url: string;
  style: string;
  created_at: string;
}

interface Generation {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  created_at: string;
  avatar_id: string;
}

const Dashboard = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Get user ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get avatars
        const { data: avatarsData, error: avatarsError } = await supabase
          .from('avatars')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (avatarsError) throw avatarsError;
        
        setAvatars(avatarsData || []);
        
        // Get recent generations
        const { data: generationsData, error: generationsError } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8);
        
        if (generationsError) throw generationsError;
        
        setRecentGenerations(generationsData || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching dashboard data",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const handleDeleteAvatar = async (avatarId: string) => {
    try {
      const { error } = await supabase
        .from('avatars')
        .delete()
        .eq('id', avatarId);
      
      if (error) throw error;
      
      setAvatars(avatars.filter(avatar => avatar.id !== avatarId));
      
      toast({
        title: "Avatar deleted",
        description: "Your avatar has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting avatar",
        description: error.message,
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/create')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Avatar
          </Button>
        </div>
        
        <Tabs defaultValue="avatars" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="avatars">My Avatars</TabsTrigger>
            <TabsTrigger value="recent">Recent Generations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatars" className="space-y-4">
            {avatars.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Avatars Created Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first AI avatar to start generating images and videos
                </p>
                <Button onClick={() => navigate('/create')}>
                  <Plus className="mr-2 h-4 w-4" /> Create Avatar
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <Card key={avatar.id} className="overflow-hidden">
                    <div className="relative h-48 bg-muted">
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
                      <Badge className="absolute top-2 right-2">
                        {avatar.style}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{avatar.name}</CardTitle>
                      <CardDescription>
                        {avatar.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this avatar and all its data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAvatar(avatar.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/create/${avatar.id}`)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" onClick={() => navigate(`/create?avatarId=${avatar.id}`)}>
                          <ImageIcon className="h-4 w-4 mr-1" /> Generate
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            {recentGenerations.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No Generations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create an avatar and generate your first AI image
                </p>
                <Button onClick={() => navigate('/create')}>Get Started</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentGenerations.map((gen) => (
                  <Card key={gen.id} className="overflow-hidden">
                    <div className="relative h-48 bg-muted group">
                      {gen.type === 'image' ? (
                        <img
                          src={gen.url}
                          alt={gen.prompt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={gen.url}
                            className="w-full h-full object-cover"
                            controls={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">
                        {gen.type}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardDescription className="line-clamp-2">
                        {gen.prompt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/gallery?id=${gen.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
