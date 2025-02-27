
import React, { useEffect } from 'react';
import TraitSection from './TraitSection';
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

  const coreTraits = traitDefinitions.slice(0, 5);
  const advancedTraits = traitDefinitions.slice(5);

  return (
    <div className="space-y-8">
      <TraitSection
        title="Core Personality Traits"
        traits={coreTraits}
        values={traits}
        onChange={handleTraitChange}
      />

      <TraitSection
        title="Advanced Personality Settings"
        traits={advancedTraits}
        values={traits}
        onChange={handleTraitChange}
      />

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
