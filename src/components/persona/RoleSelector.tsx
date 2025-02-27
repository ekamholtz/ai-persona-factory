
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Image, MessageSquare, Sparkles } from "lucide-react";

const roles = [
  {
    id: 'influencer',
    name: 'Social Media Influencer',
    description: 'Create engaging content and build an online following',
    icon: Sparkles,
  },
  {
    id: 'companion',
    name: 'Virtual Companion',
    description: 'Engage in meaningful conversations and provide support',
    icon: MessageSquare,
  },
  {
    id: 'assistant',
    name: 'Marketing Assistant',
    description: 'Help with content creation and marketing strategies',
    icon: Brain,
  },
  {
    id: 'actor',
    name: 'Digital Actor',
    description: 'Perform in digital content and entertainment',
    icon: Image,
  },
];

const RoleSelector = () => {
  return (
    <RadioGroup defaultValue="influencer" className="space-y-4">
      {roles.map((role) => (
        <div key={role.id} className="flex items-center space-x-4 rounded-lg border p-4">
          <RadioGroupItem value={role.id} id={role.id} />
          <Label htmlFor={role.id} className="flex-1 cursor-pointer">
            <div className="flex items-center space-x-2">
              <role.icon className="h-5 w-5" />
              <span className="font-medium">{role.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RoleSelector;
