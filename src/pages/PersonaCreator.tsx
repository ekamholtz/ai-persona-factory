
import React from 'react';
import { Card } from "@/components/ui/card";
import AvatarEditor from "@/components/persona/AvatarEditor";
import PersonalityBuilder from "@/components/persona/PersonalityBuilder";
import RoleSelector from "@/components/persona/RoleSelector";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

type PersonaInsert = {
  name: string;
  role: string;
  user_id: string;
  status: 'draft' | 'published';
  description?: string | null;
};

const PersonaCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a persona",
          variant: "destructive",
        });
        return;
      }

      const newPersona: PersonaInsert = {
        name: 'New Persona',
        role: 'influencer',
        user_id: user.id,
        status: 'draft'
      };

      // Create the basic persona first
      const { data: persona, error: personaError } = await supabase
        .from('personas')
        .insert(newPersona)
        .select()
        .single();

      if (personaError) throw personaError;

      toast({
        title: "Success!",
        description: "Your persona has been created.",
      });

      // Navigate to the edit page (to be implemented)
      // navigate(`/persona/${persona.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Your AI Persona</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Left column: Avatar Editor and Role Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Visual Appearance</h2>
            <AvatarEditor />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Role Selection</h2>
            <RoleSelector />
          </Card>
        </div>

        <div className="space-y-8">
          {/* Right column: Personality Builder */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Personality Traits</h2>
            <PersonalityBuilder />
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Creating...' : 'Create Persona'}
        </Button>
      </div>
    </div>
  );
};

export default PersonaCreator;
