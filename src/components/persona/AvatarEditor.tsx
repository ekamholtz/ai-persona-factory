
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, RefreshCw, Image as ImageIcon, MessageSquareText, Sliders } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

// Define types for avatar attributes
type AvatarAttributes = {
  race: string;
  skinColor: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: string;
  fashionStyle: string;
};

const AvatarEditor = () => {
  // State for image preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState('prompt');
  
  // State for avatar attributes
  const [avatarAttributes, setAvatarAttributes] = useState<AvatarAttributes>({
    race: 'caucasian',
    skinColor: 'fair',
    hairColor: 'brown',
    hairStyle: 'short',
    eyeColor: 'blue',
    bodyType: 'average',
    fashionStyle: 'casual',
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle avatar attribute change
  const handleAttributeChange = (attribute: keyof AvatarAttributes, value: string) => {
    setAvatarAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  // Generate avatar from prompt
  const generateFromPrompt = async () => {
    if (!generationPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Placeholder for actual API call
      // This would be replaced with your windsurf AI API integration
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // For now, we'll use a placeholder image
      setPreviewUrl(`https://picsum.photos/seed/${Math.random()}/300/300`);
      
      // In a real implementation, you would:
      // 1. Call the windsurf API with the prompt
      // 2. Get back the generated image
      // 3. Save it to Supabase storage
      // 4. Set the preview URL to the stored image URL
      
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate avatar from attributes
  const generateFromAttributes = async () => {
    setIsGenerating(true);
    try {
      // Convert attributes to a prompt for the AI
      const attributePrompt = `Generate a portrait with these characteristics: ${avatarAttributes.race} race, ${avatarAttributes.skinColor} skin, ${avatarAttributes.hairColor} ${avatarAttributes.hairStyle} hair, ${avatarAttributes.eyeColor} eyes, ${avatarAttributes.bodyType} body type, ${avatarAttributes.fashionStyle} fashion style.`;
      
      // Placeholder for actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // For now, we'll use a placeholder image
      setPreviewUrl(`https://picsum.photos/seed/${Math.random()}/300/300`);
      
      // In a real implementation, you would call the windsurf API with the attribute prompt
      
    } catch (error) {
      console.error('Error generating image from attributes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Modify uploaded image
  const modifyUploadedImage = async () => {
    if (!previewUrl) return;
    
    setIsGenerating(true);
    try {
      // Placeholder for actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // For now, we'll use a slightly different placeholder image
      setPreviewUrl(`https://picsum.photos/seed/${Math.random()}/300/300`);
      
      // In a real implementation, you would:
      // 1. Send the uploaded image to the windsurf API
      // 2. Include modification instructions based on selected attributes
      // 3. Get back the modified image
      // 4. Save it to Supabase and update the preview
      
    } catch (error) {
      console.error('Error modifying image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-4 relative">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <Tabs 
          defaultValue="prompt" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="prompt">
                    <MessageSquareText className="h-4 w-4 mr-2" />
                    Prompt
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate avatar from a text description</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="attributes">
                    <Sliders className="h-4 w-4 mr-2" />
                    Attributes
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create avatar by selecting physical attributes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload your own image as avatar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          <TabsContent value="prompt" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-input">Describe your avatar</Label>
              <div className="flex gap-2">
                <Input
                  id="prompt-input"
                  placeholder="E.g., Professional woman with short brown hair and glasses"
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                />
                <Button 
                  onClick={generateFromPrompt} 
                  disabled={isGenerating || !generationPrompt.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Be specific about appearance, style, and mood for best results.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Race selection */}
              <div>
                <Label htmlFor="race-select">Race</Label>
                <Select 
                  value={avatarAttributes.race}
                  onValueChange={(value) => handleAttributeChange('race', value)}
                >
                  <SelectTrigger id="race-select">
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caucasian">Caucasian</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="hispanic">Hispanic</SelectItem>
                    <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skin color */}
              <div>
                <Label htmlFor="skin-select">Skin Color</Label>
                <Select 
                  value={avatarAttributes.skinColor}
                  onValueChange={(value) => handleAttributeChange('skinColor', value)}
                >
                  <SelectTrigger id="skin-select">
                    <SelectValue placeholder="Select skin color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="olive">Olive</SelectItem>
                    <SelectItem value="tan">Tan</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hair color */}
              <div>
                <Label htmlFor="hair-color-select">Hair Color</Label>
                <Select 
                  value={avatarAttributes.hairColor}
                  onValueChange={(value) => handleAttributeChange('hairColor', value)}
                >
                  <SelectTrigger id="hair-color-select">
                    <SelectValue placeholder="Select hair color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blonde">Blonde</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hair style */}
              <div>
                <Label htmlFor="hair-style-select">Hair Style</Label>
                <Select 
                  value={avatarAttributes.hairStyle}
                  onValueChange={(value) => handleAttributeChange('hairStyle', value)}
                >
                  <SelectTrigger id="hair-style-select">
                    <SelectValue placeholder="Select hair style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="curly">Curly</SelectItem>
                    <SelectItem value="wavy">Wavy</SelectItem>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="bald">Bald</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Eye color */}
              <div>
                <Label htmlFor="eye-color-select">Eye Color</Label>
                <Select 
                  value={avatarAttributes.eyeColor}
                  onValueChange={(value) => handleAttributeChange('eyeColor', value)}
                >
                  <SelectTrigger id="eye-color-select">
                    <SelectValue placeholder="Select eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="hazel">Hazel</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Body type */}
              <div>
                <Label htmlFor="body-type-select">Body Type</Label>
                <Select 
                  value={avatarAttributes.bodyType}
                  onValueChange={(value) => handleAttributeChange('bodyType', value)}
                >
                  <SelectTrigger id="body-type-select">
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="curvy">Curvy</SelectItem>
                    <SelectItem value="muscular">Muscular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fashion style */}
              <div className="md:col-span-2">
                <Label htmlFor="fashion-style">Fashion Style</Label>
                <RadioGroup 
                  value={avatarAttributes.fashionStyle}
                  onValueChange={(value) => handleAttributeChange('fashionStyle', value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sporty" id="sporty" />
                    <Label htmlFor="sporty">Sporty</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal">Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="artistic" id="artistic" />
                    <Label htmlFor="artistic">Artistic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="streetwear" id="streetwear" />
                    <Label htmlFor="streetwear">Streetwear</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vintage" id="vintage" />
                    <Label htmlFor="vintage">Vintage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimalist" id="minimalist" />
                    <Label htmlFor="minimalist">Minimalist</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button 
              onClick={generateFromAttributes} 
              className="w-full mt-4"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Avatar from Attributes'}
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload your image (JPG, PNG)
                </p>
                <Label 
                  htmlFor="avatar-upload-file" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer"
                >
                  Choose File
                </Label>
                <input
                  id="avatar-upload-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {previewUrl && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h4 className="font-medium">Enhance uploaded image</h4>
                  <div className="space-y-2">
                    <Input 
                      placeholder="E.g., Change hair color to blonde" 
                      className="w-full"
                    />
                    <Button 
                      onClick={modifyUploadedImage}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Processing...' : 'Apply Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground text-center mt-4">
        The avatar will represent your AI persona in chats and profile views.
      </p>
    </div>
  );
};

export default AvatarEditor;
