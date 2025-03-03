
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Download, Plus, Filter, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, Generation } from '@/types/avatar';

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const avatarIdFromUrl = searchParams.get('avatar');

  const [loading, setLoading] = useState<boolean>(true);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarIdFromUrl || '');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchAvatars();
    fetchGenerations();
  }, [avatarIdFromUrl]);

  const fetchAvatars = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvatars(data as Avatar[]);
      
      // If no avatar is selected in URL and we have avatars, select the first one
      if (!avatarIdFromUrl && data.length > 0 && !selectedAvatar) {
        setSelectedAvatar(data[0].id);
        setSearchParams({ avatar: data[0].id });
      }
    } catch (error) {
      console.error('Error fetching avatars:', error);
      toast({
        title: 'Error',
        description: 'Failed to load avatars',
        variant: 'destructive',
      });
    }
  };

  const fetchGenerations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by avatar if selected
      if (avatarIdFromUrl) {
        query = query.eq('avatar_id', avatarIdFromUrl);
      } else if (selectedAvatar) {
        query = query.eq('avatar_id', selectedAvatar);
      }

      // Filter by type if not "all"
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGenerations(data as Generation[]);
    } catch (error) {
      console.error('Error fetching generations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load generated content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (value: string) => {
    setSelectedAvatar(value);
    setSearchParams({ avatar: value });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Trigger filter
    fetchGenerations();
  };

  const openGenerationDialog = (generation: Generation) => {
    setSelectedGeneration(generation);
    setDialogOpen(true);
  };

  const downloadGeneration = (url: string, filename = 'avatar-generation.jpg') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Content Gallery</h1>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-initial min-w-[200px]">
              <Select value={selectedAvatar} onValueChange={handleAvatarChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Avatar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Avatars</SelectItem>
                  {avatars.map((avatar) => (
                    <SelectItem key={avatar.id} value={avatar.id}>
                      {avatar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 md:flex-initial min-w-[150px]">
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button asChild className="flex-1 md:flex-initial">
              <Link to={selectedAvatar ? `/edit/${selectedAvatar}` : "/create"}>
                <Plus className="mr-2 h-4 w-4" />
                Generate New
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
            {generations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No content yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    {avatars.length === 0 
                      ? "Create your first avatar to start generating content."
                      : "Start generating unique images and videos with your avatars."}
                  </p>
                  <Button asChild>
                    <Link to={avatars.length > 0 ? `/edit/${avatars[0].id}` : "/create"}>
                      <Plus className="mr-2 h-4 w-4" />
                      {avatars.length > 0 ? "Generate Content" : "Create Avatar"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {generations.map((generation) => (
                  <Card 
                    key={generation.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openGenerationDialog(generation)}
                  >
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
                    <CardContent className="p-4">
                      <div className="line-clamp-2 text-sm">
                        {generation.prompt || "No prompt data"}
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                        <span className="capitalize">{generation.type}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Generation Details</DialogTitle>
            <DialogDescription>
              Created on {selectedGeneration ? new Date(selectedGeneration.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGeneration && (
            <div className="space-y-4">
              <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                {selectedGeneration.type === 'image' ? (
                  <img 
                    src={selectedGeneration.url} 
                    alt={selectedGeneration.prompt?.substring(0, 20)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-black">
                    <div className="text-white">Video content</div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Prompt</h4>
                <p className="text-sm">{selectedGeneration.prompt}</p>
              </div>
              
              {selectedGeneration.scene_description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Scene Description</h4>
                  <p className="text-sm">{selectedGeneration.scene_description}</p>
                </div>
              )}
              
              {selectedGeneration.style && (
                <div className="space-y-2">
                  <h4 className="font-medium">Style</h4>
                  <p className="text-sm capitalize">{selectedGeneration.style}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => downloadGeneration(selectedGeneration.url)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button asChild>
                  <Link to={`/edit/${selectedGeneration.avatar_id}`}>
                    Generate More
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Gallery;
