
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
    const { prompt, attributes, avatarId, userId, style } = await req.json();
    
    console.log('Received avatar generation request:', { 
      hasPrompt: !!prompt, 
      hasAttributes: !!attributes, 
      avatarId,
      userId,
      style
    });
    
    if (!userId) {
      throw new Error('User ID is required');
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
    
    if (profile.credits < 1) {
      throw new Error('Not enough credits to generate an avatar');
    }
    
    // In a real implementation, this would call Stable Diffusion API
    // For now, we'll use a placeholder image
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let generationPrompt = prompt;
    
    // If using attributes instead of direct prompt, build a prompt
    if (attributes && !prompt) {
      generationPrompt = `Portrait of a person with ${attributes.gender || 'neutral'} features, ${attributes.ethnicity || ''} ethnicity, ${attributes.age || 'adult'} age, ${attributes.bodyType || ''} body type, ${attributes.hairStyle || ''} ${attributes.hairColor || ''} hair, ${attributes.eyeColor || ''} eyes, wearing ${attributes.fashionStyle || 'casual'} clothes`;
      
      if (style) {
        generationPrompt += `, ${style} style`;
      }
    }
    
    console.log('Generated prompt:', generationPrompt);
    
    // For demo, use a placeholder image URL
    // In production, this would come from the Stable Diffusion API
    const imageUrl = `https://picsum.photos/seed/${Math.random()}/512/512`;
    
    // Log usage and deduct credit
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        action: 'generate_avatar',
        details: { prompt: generationPrompt, style },
        credits_used: 1
      });
    
    // Update user credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);
    
    // If avatar ID is provided, update the avatar's primary image
    if (avatarId) {
      await supabase
        .from('avatars')
        .update({ 
          primary_image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', avatarId);
    }
    
    // Return the generated image
    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl,
        prompt: generationPrompt,
        creditsRemaining: profile.credits - 1
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-avatar function:', error);
    
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
