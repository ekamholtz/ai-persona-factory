
import React, { useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { traitDefinitions, defaultTraits } from '@/utils/personalityDefaults';
import type { Database } from '@/integrations/supabase/types';

type PersonaRole = Database['public']['Enums']['persona_role'];

type PersonalityBuilderProps = {
  onChange: (traits: Record<string, number>) => void;
  selectedRole: PersonaRole;
};

const PersonalityBuilder = ({ onChange, selectedRole }: PersonalityBuilderProps) => {
  // Initialize traits with default values
  const [traits, setTraits] = React.useState<Record<string, number>>(() => {
    return Object.fromEntries(
      traitDefinitions.map(trait => [trait.key, 50])
    );
  });

  // Update traits when role changes
  useEffect(() => {
    const newTraits = defaultTraits[selectedRole];
    setTraits(newTraits);
    onChange(newTraits);
  }, [selectedRole, onChange]);

  const handleTraitChange = (trait: string, value: number[]) => {
    const newTraits = { ...traits, [trait]: value[0] };
    setTraits(newTraits);
    onChange(newTraits);
  };

  return (
    <div className="space-y-8">
      {/* Basic Traits Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Core Personality Traits</h3>
        <div className="space-y-6">
          {traitDefinitions.slice(0, 5).map((trait) => (
            <div key={trait.key} className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{trait.name}</Label>
                <span className="text-sm text-muted-foreground">{traits[trait.key]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24">{trait.min}</span>
                <Slider
                  defaultValue={[traits[trait.key]]}
                  max={100}
                  step={1}
                  value={[traits[trait.key]]}
                  onValueChange={(value) => handleTraitChange(trait.key, value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-24 text-right">{trait.max}</span>
              </div>
              <p className="text-sm text-muted-foreground">{trait.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Traits Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Advanced Personality Settings</h3>
        <div className="space-y-6">
          {traitDefinitions.slice(5).map((trait) => (
            <div key={trait.key} className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{trait.name}</Label>
                <span className="text-sm text-muted-foreground">{traits[trait.key]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24">{trait.min}</span>
                <Slider
                  defaultValue={[traits[trait.key]]}
                  max={100}
                  step={1}
                  value={[traits[trait.key]]}
                  onValueChange={(value) => handleTraitChange(trait.key, value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-24 text-right">{trait.max}</span>
              </div>
              <p className="text-sm text-muted-foreground">{trait.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          These traits will influence how your AI persona interacts and creates content.
          Adjust the sliders to fine-tune the personality from the role defaults.
        </p>
      </div>
    </div>
  );
};

export default PersonalityBuilder;
