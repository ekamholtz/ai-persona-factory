
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const personalityTraits = [
  { name: 'Extroversion', description: 'Social energy and enthusiasm' },
  { name: 'Openness', description: 'Curiosity and creativity' },
  { name: 'Conscientiousness', description: 'Organization and responsibility' },
  { name: 'Agreeableness', description: 'Cooperation and compassion' },
];

const PersonalityBuilder = () => {
  return (
    <div className="space-y-8">
      {personalityTraits.map((trait) => (
        <div key={trait.name} className="space-y-4">
          <div>
            <Label>{trait.name}</Label>
            <p className="text-sm text-muted-foreground">{trait.description}</p>
          </div>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
          />
        </div>
      ))}

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          These traits will influence how your AI persona interacts and creates content.
          Adjust the sliders to fine-tune the personality.
        </p>
      </div>
    </div>
  );
};

export default PersonalityBuilder;
