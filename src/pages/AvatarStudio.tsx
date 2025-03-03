
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Image as ImageIcon, Bot, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/types/avatar';

const AvatarStudio = () => {
  const { avatarId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!avatarId;
  
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingAvatar, setGeneratingAvatar] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  
  const [avatar, setAvatar] = useState<Avatar>({
    id: '',
    user_id: '',
    name: '',
    description: '',
    primary_image_url: '',
    style: 'realistic',
    gender: '',
    ethnicity: '',
    age: 'adult',
    body_type: '',
    hair_style: '',
    hair_color: '',
    eye_color: '',
    created_at: '',
    updated_at: ''
  });
  
  // For prompt-based generation
  const [prompt, setPrompt] = useState<string>('');
  
  useEffect(() => {
    if (avatarId) {
      loadAvatar();
    }
  }, [avatarId]);
  
  const loadAvatar = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setAvatar(data as Avatar);
        if (data.primary_image_url) {
          setGeneratedImageUrl(data.primary_image_url);
        }
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
      toast({
        title: 'Error loading avatar',
        description: 'Failed to load avatar details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveAvatar = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to save an avatar');
      }
      
      // Make sure required fields are filled
      if (!avatar.name) {
        throw new Error('Avatar name is required');
      }
      
      if (!avatar.style) {
        throw new Error('Avatar style is required');
      }
      
      const avatarData = {
        ...avatar,
        user_id: user.id,
        primary_image_url: generatedImageUrl || avatar.primary_image_url,
      };
      
      let result;
      
      if (isEditing) {
        // Update existing avatar
        result = await supabase
          .from('avatars')
          .update(avatarData)
          .eq('id', avatarId)
          .select()
          .single();
      } else {
        // Create new avatar
        result = await supabase
          .from('avatars')
          .insert([avatarData])
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Success!',
        description: isEditing ? 'Avatar updated successfully.' : 'Avatar created successfully.',
      });
      
      if (!isEditing && result.data) {
        // Navigate to edit page if this was a new avatar
        navigate(`/edit/${result.data.id}`);
      }
    } catch (error: any) {
      console.error('Error saving avatar:', error);
      toast({
        title: 'Error saving avatar',
        description: error.message || 'Failed to save avatar.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateAvatar = async () => {
    setGeneratingAvatar(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to generate an avatar');
      }
      
      // For attribute-based generation
      const attributes = {
        gender: avatar.gender,
        ethnicity: avatar.ethnicity,
        age: avatar.age,
        bodyType: avatar.body_type,
        hairStyle: avatar.hair_style,
        hairColor: avatar.hair_color,
        eyeColor: avatar.eye_color,
        fashionStyle: avatar.style
      };
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: {
          userId: user.id,
          avatarId: avatarId || null,
          prompt: activeTab === 'prompt' ? prompt : null,
          attributes: activeTab === 'attributes' ? attributes : null,
          style: avatar.style
        }
      });
      
      if (error) throw error;
      
      if (data && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setAvatar({
          ...avatar,
          primary_image_url: data.imageUrl
        });
        
        toast({
          title: 'Avatar generated',
          description: `Remaining credits: ${data.creditsRemaining}`,
        });
      }
    } catch (error: any) {
      console.error('Error generating avatar:', error);
      toast({
        title: 'Error generating avatar',
        description: error.message || 'Failed to generate avatar image.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingAvatar(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAvatar(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setAvatar(prev => ({ ...prev, [name]: value }));
  };

  if (loading && !avatar.id) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'Edit Avatar' : 'Create New Avatar'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Avatar Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Avatar Preview</CardTitle>
                <CardDescription>
                  This is how your avatar will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                  {generatedImageUrl ? (
                    <img
                      src={generatedImageUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm text-center">
                        Generate an avatar or upload an image
                      </p>
                    </div>
                  )}
                  
                  {generatingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-white" />
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={generateAvatar} 
                  className="w-full mb-2"
                  disabled={generatingAvatar}
                >
                  {generatingAvatar ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Avatar
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Each generation costs 1 credit
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Editing Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Avatar Details</CardTitle>
                <CardDescription>
                  Configure your avatar's appearance and traits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="name">Avatar Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={avatar.name}
                      onChange={handleChange}
                      placeholder="Enter a name for your avatar"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={avatar.description || ''}
                      onChange={handleChange}
                      placeholder="Describe your avatar..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="style">Avatar Style</Label>
                    <Select
                      value={avatar.style}
                      onValueChange={(value) => handleSelectChange('style', value)}
                    >
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="cartoon">Cartoon</SelectItem>
                        <SelectItem value="3d">3D Rendered</SelectItem>
                        <SelectItem value="pixel">Pixel Art</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="comic">Comic Book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                    <TabsTrigger value="prompt">Custom Prompt</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={avatar.gender || ''}
                          onValueChange={(value) => handleSelectChange('gender', value)}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Select
                          value={avatar.age || 'adult'}
                          onValueChange={(value) => handleSelectChange('age', value)}
                        >
                          <SelectTrigger id="age">
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="teen">Teen</SelectItem>
                            <SelectItem value="young-adult">Young Adult</SelectItem>
                            <SelectItem value="adult">Adult</SelectItem>
                            <SelectItem value="middle-aged">Middle Aged</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="ethnicity">Ethnicity</Label>
                        <Select
                          value={avatar.ethnicity || ''}
                          onValueChange={(value) => handleSelectChange('ethnicity', value)}
                        >
                          <SelectTrigger id="ethnicity">
                            <SelectValue placeholder="Select ethnicity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="caucasian">Caucasian</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="hispanic">Hispanic</SelectItem>
                            <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                            <SelectItem value="south-asian">South Asian</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="body-type">Body Type</Label>
                        <Select
                          value={avatar.body_type || ''}
                          onValueChange={(value) => handleSelectChange('body_type', value)}
                        >
                          <SelectTrigger id="body-type">
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="slim">Slim</SelectItem>
                            <SelectItem value="athletic">Athletic</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="curvy">Curvy</SelectItem>
                            <SelectItem value="muscular">Muscular</SelectItem>
                            <SelectItem value="plus-size">Plus Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="attributes" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hair-style">Hair Style</Label>
                        <Select
                          value={avatar.hair_style || ''}
                          onValueChange={(value) => handleSelectChange('hair_style', value)}
                        >
                          <SelectTrigger id="hair-style">
                            <SelectValue placeholder="Select hair style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="straight">Straight</SelectItem>
                            <SelectItem value="wavy">Wavy</SelectItem>
                            <SelectItem value="curly">Curly</SelectItem>
                            <SelectItem value="afro">Afro</SelectItem>
                            <SelectItem value="braided">Braided</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                            <SelectItem value="bald">Bald</SelectItem>
                            <SelectItem value="ponytail">Ponytail</SelectItem>
                            <SelectItem value="bun">Bun</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="hair-color">Hair Color</Label>
                        <Select
                          value={avatar.hair_color || ''}
                          onValueChange={(value) => handleSelectChange('hair_color', value)}
                        >
                          <SelectTrigger id="hair-color">
                            <SelectValue placeholder="Select hair color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="blonde">Blonde</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="white">White/Gray</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="pink">Pink</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="rainbow">Rainbow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="eye-color">Eye Color</Label>
                        <Select
                          value={avatar.eye_color || ''}
                          onValueChange={(value) => handleSelectChange('eye_color', value)}
                        >
                          <SelectTrigger id="eye-color">
                            <SelectValue placeholder="Select eye color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="hazel">Hazel</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                            <SelectItem value="amber">Amber</SelectItem>
                            <SelectItem value="heterochromia">Heterochromia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="role">Role/Occupation</Label>
                        <Input
                          id="role"
                          name="role"
                          value={avatar.role || ''}
                          onChange={handleChange}
                          placeholder="e.g. Doctor, Adventurer, etc."
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="prompt" className="space-y-4">
                    <div>
                      <Label htmlFor="custom-prompt">Custom Generation Prompt</Label>
                      <Textarea
                        id="custom-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your perfect avatar in detail..."
                        rows={6}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Be specific about appearance, clothing, background, style, and any other details you want to include.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveAvatar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Avatar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AvatarStudio;
