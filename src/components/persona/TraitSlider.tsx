
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type TraitSliderProps = {
  name: string;
  traitKey: string;
  description: string;
  min: string;
  max: string;
  value: number;
  onChange: (key: string, value: number[]) => void;
};

const TraitSlider = ({ 
  name, 
  traitKey, 
  description, 
  min, 
  max, 
  value, 
  onChange 
}: TraitSliderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{name}</Label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-24">{min}</span>
        <Slider
          defaultValue={[value]}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(value) => onChange(traitKey, value)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-24 text-right">{max}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default TraitSlider;
