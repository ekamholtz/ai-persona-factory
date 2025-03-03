
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extract request data
    const { 
      avatarId, 
      userId, 
      type = 'image',
      prompt,
      sceneDescription,
      style,
      additionalParams = {}
    } = await req.json();
    
    console.log('Received content generation request:', { 
      avatarId, 
      userId,
      type,
      prompt,
      style
    });
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!avatarId) {
      throw new Error('Avatar ID is required');
    }
    
    // Get the avatar details
    const { data: avatar, error: avatarError } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', avatarId)
      .single();
    
    if (avatarError) {
      throw new Error(`Failed to get avatar: ${avatarError.message}`);
    }
    
    // Check if user has enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw new Error(`Failed to get user profile: ${profileError.message}`);
    }
    
    // Define credit cost based on content type
    const creditCost = type === 'video' ? 3 : 1;
    
    if (profile.credits < creditCost) {
      throw new Error(`Not enough credits to generate ${type}. Required: ${creditCost}, Available: ${profile.credits}`);
    }
    
    // In a real implementation, this would call AI generation APIs
    // For now, we'll use placeholder content
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, type === 'video' ? 4000 : 2000));
    
    // Build a complete prompt using avatar details and user input
    const completePrompt = `${prompt || ''} ${sceneDescription ? `in a ${sceneDescription}` : ''} with a ${avatar.gender || ''} ${avatar.ethnicity || ''} person with ${avatar.hair_style || ''} ${avatar.hair_color || ''} hair, ${avatar.eye_color || ''} eyes, wearing ${avatar.fashion_style || 'casual'} clothes`;
    
    console.log('Complete prompt:', completePrompt);
    
    // For demo, use a placeholder URL
    // In production, this would come from the AI generation API
    const contentUrl = type === 'image' 
      ? `https://picsum.photos/seed/${Math.random()}/1024/1024`
      : 'https://example.com/placeholder-video.mp4'; // Replace with actual video placeholder
    
    // Log usage and deduct credits
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: `generate_${type}`,
        details: { 
          prompt: completePrompt, 
          style,
          avatarId,
          additionalParams 
        },
        credits_used: creditCost
      });
    
    // Update user credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditCost })
      .eq('id', userId);
    
    // Store the generation in the database
    const { data: generation, error: generationError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        avatar_id: avatarId,
        type,
        url: contentUrl,
        prompt: completePrompt,
        scene_description: sceneDescription,
        style,
        additional_params: additionalParams
      })
      .select()
      .single();
    
    if (generationError) {
      throw new Error(`Failed to save generation: ${generationError.message}`);
    }
    
    // Return the generated content
    return new Response(
      JSON.stringify({ 
        success: true,
        contentUrl,
        type,
        prompt: completePrompt,
        generationId: generation.id,
        creditsRemaining: profile.credits - creditCost
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});
