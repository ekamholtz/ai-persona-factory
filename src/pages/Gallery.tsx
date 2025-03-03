
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Trash, 
  Play, 
  Image as ImageIcon,
  Film
} from 'lucide-react';
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

interface Generation {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt: string;
  scene_description?: string;
  created_at: string;
  avatar_id: string;
  style?: string;
  additional_params?: any;
}

const Gallery = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenerations = async () => {
      setLoading(true);
      
      try {
        // Get user ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get all generations
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setGenerations(data || []);
        
        if (data && data.length > 0) {
          setSelectedGeneration(data[0]);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching generations",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenerations();
  }, [toast]);
  
  const handleDeleteGeneration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGenerations(generations.filter(gen => gen.id !== id));
      
      if (selectedGeneration?.id === id) {
        setSelectedGeneration(generations.length > 1 ? generations[0] : null);
      }
      
      toast({
        title: "Generation deleted",
        description: "The content has been deleted from your gallery.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting generation",
        description: error.message,
      });
    }
  };
  
  const downloadGeneration = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'ai-generation';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const shareGeneration = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my AI-generated content',
        text: 'Created with AI Avatar Creator',
        url: url,
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "Sharing failed",
          description: error.message,
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste the link anywhere you want to share it.",
        });
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Gallery</h1>
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4 mr-1" />
                Images
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Film className="h-4 w-4 mr-1" />
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : generations.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Your Gallery is Empty</h3>
            <p className="text-muted-foreground mb-4">
              Create an avatar and generate content to see it here
            </p>
            <Button onClick={() => window.location.href = '/create'}>Create Now</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 h-[600px] overflow-y-auto border rounded-lg p-4 space-y-4">
              {generations.map((gen) => (
                <div 
                  key={gen.id}
                  className={`flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                    selectedGeneration?.id === gen.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedGeneration(gen)}
                >
                  <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
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
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm line-clamp-2 mb-1">{gen.prompt}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-5 px-1">
                        {gen.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(gen.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              {selectedGeneration ? (
                <Card>
                  <div className="p-4">
                    <div className="bg-muted rounded-lg overflow-hidden mb-4">
                      {selectedGeneration.type === 'image' ? (
                        <img
                          src={selectedGeneration.url}
                          alt={selectedGeneration.prompt}
                          className="w-full max-h-[500px] object-contain"
                        />
                      ) : (
                        <video
                          src={selectedGeneration.url}
                          className="w-full max-h-[500px]"
                          controls
                        />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <Badge>
                        {selectedGeneration.type}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => downloadGeneration(
                            selectedGeneration.url, 
                            `ai-${selectedGeneration.type}-${Date.now()}`
                          )}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => shareGeneration(selectedGeneration.url)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this content from your gallery.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteGeneration(selectedGeneration.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Prompt</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedGeneration.prompt}
                        </p>
                      </div>
                      
                      {selectedGeneration.scene_description && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Scene Description</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedGeneration.scene_description}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedGeneration.style && (
                          <Badge variant="outline">{selectedGeneration.style}</Badge>
                        )}
                        
                        {selectedGeneration.additional_params && Object.entries(selectedGeneration.additional_params).map(([key, value]) => (
                          <Badge key={key} variant="outline">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Created</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedGeneration.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="mb-4 rounded-full bg-muted p-6">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Select a Generated Image</h3>
                  <p className="text-muted-foreground">
                    Click on an item from the gallery to view details
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Gallery;
