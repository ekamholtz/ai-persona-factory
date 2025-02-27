
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export type PersonalityTrait = {
  name: string;
  key: string;
  description: string;
  min: string;
  max: string;
};

const personalityTraits = [
  // Basic Traits (Big Five)
  { 
    name: 'Extroversion',
    key: 'extroversion',
    description: 'Social energy and enthusiasm',
    min: 'Introverted',
    max: 'Extroverted'
  },
  {
    name: 'Openness',
    key: 'openness',
    description: 'Curiosity and creativity',
    min: 'Conservative',
    max: 'Exploratory'
  },
  {
    name: 'Conscientiousness',
    key: 'conscientiousness',
    description: 'Organization and responsibility',
    min: 'Flexible',
    max: 'Organized'
  },
  {
    name: 'Agreeableness',
    key: 'agreeableness',
    description: 'Cooperation and compassion',
    min: 'Challenging',
    max: 'Agreeable'
  },
  // Advanced Traits
  {
    name: 'Communication Style',
    key: 'communicationStyle',
    description: 'How the persona communicates',
    min: 'Formal',
    max: 'Casual'
  },
  {
    name: 'Directness',
    key: 'directness',
    description: 'Approach to communication',
    min: 'Indirect',
    max: 'Direct'
  },
  {
    name: 'Emotional Tone',
    key: 'emotionalTone',
    description: 'Overall emotional expression',
    min: 'Reserved',
    max: 'Expressive'
  },
  {
    name: 'Humor & Wit',
    key: 'humor',
    description: 'Style of humor',
    min: 'Serious',
    max: 'Playful'
  },
  {
    name: 'Empathy',
    key: 'empathy',
    description: 'Understanding of others',
    min: 'Objective',
    max: 'Empathetic'
  },
  {
    name: 'Assertiveness',
    key: 'assertiveness',
    description: 'Confidence in expression',
    min: 'Modest',
    max: 'Confident'
  },
  {
    name: 'Creativity',
    key: 'creativity',
    description: 'Approach to ideas',
    min: 'Conventional',
    max: 'Innovative'
  },
  {
    name: 'Energy Level',
    key: 'energyLevel',
    description: 'Overall energy in interactions',
    min: 'Calm',
    max: 'Energetic'
  },
  {
    name: 'Knowledge Focus',
    key: 'knowledgeFocus',
    description: 'Depth vs breadth of expertise',
    min: 'Generalist',
    max: 'Specialist'
  },
  {
    name: 'Social Sensitivity',
    key: 'socialSensitivity',
    description: 'Social awareness',
    min: 'Direct',
    max: 'Tactful'
  },
  {
    name: 'Linguistic Flair',
    key: 'linguisticStyle',
    description: 'Communication complexity',
    min: 'Concise',
    max: 'Elaborate'
  },
];

type PersonalityBuilderProps = {
  onChange: (traits: Record<string, number>) => void;
};

const PersonalityBuilder = ({ onChange }: PersonalityBuilderProps) => {
  const [traits, setTraits] = React.useState<Record<string, number>>(() => {
    const initialTraits: Record<string, number> = {};
    personalityTraits.forEach(trait => {
      initialTraits[trait.key] = 50; // Default value
    });
    return initialTraits;
  });

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
          {personalityTraits.slice(0, 4).map((trait) => (
            <div key={trait.key} className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{trait.name}</Label>
                <span className="text-sm text-muted-foreground">{traits[trait.key]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24">{trait.min}</span>
                <Slider
                  defaultValue={[50]}
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
          {personalityTraits.slice(4).map((trait) => (
            <div key={trait.key} className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{trait.name}</Label>
                <span className="text-sm text-muted-foreground">{traits[trait.key]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24">{trait.min}</span>
                <Slider
                  defaultValue={[50]}
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
          Adjust the sliders to fine-tune the personality.
        </p>
      </div>
    </div>
  );
};

export default PersonalityBuilder;
