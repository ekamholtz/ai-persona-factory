
import React from 'react';
import TraitSlider from './TraitSlider';
import type { PersonalityTrait } from '@/utils/personalityDefaults';

type TraitSectionProps = {
  title: string;
  traits: PersonalityTrait[];
  values: Record<string, number>;
  onChange: (trait: string, value: number[]) => void;
};

const TraitSection = ({ title, traits, values, onChange }: TraitSectionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-6">
        {traits.map((trait) => (
          <TraitSlider
            key={trait.key}
            name={trait.name}
            traitKey={trait.key}
            description={trait.description}
            min={trait.min}
            max={trait.max}
            value={values[trait.key]}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default TraitSection;
