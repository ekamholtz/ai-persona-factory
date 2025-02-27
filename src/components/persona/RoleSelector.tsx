
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, MessageSquare, Sparkles, Image, Heart, BookOpen, 
  PiggyBank, Shirt, UtensilsCrossed, Plane, Laptop, Gamepad, 
  Target, Music, Radio, Languages
} from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type PersonaRole = Database['public']['Enums']['persona_role'];

type RoleSelectorProps = {
  onSelect: (role: PersonaRole) => void;
};

const roles: Array<{
  id: PersonaRole;
  name: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    id: 'personal_trainer',
    name: 'Personal Trainer / Wellness Coach',
    description: 'Guide users in fitness and wellness journey',
    icon: Heart,
  },
  {
    id: 'virtual_tutor',
    name: 'Virtual Tutor / Educator',
    description: 'Help with learning and educational content',
    icon: BookOpen,
  },
  {
    id: 'financial_advisor',
    name: 'Financial Advisor / Budget Coach',
    description: 'Provide financial guidance and budgeting tips',
    icon: PiggyBank,
  },
  {
    id: 'fashion_stylist',
    name: 'Fashion Stylist / Personal Shopper',
    description: 'Offer fashion advice and styling tips',
    icon: Shirt,
  },
  {
    id: 'food_blogger',
    name: 'Food Blogger / Culinary Enthusiast',
    description: 'Share recipes and culinary knowledge',
    icon: UtensilsCrossed,
  },
  {
    id: 'travel_blogger',
    name: 'Travel Blogger / Cultural Ambassador',
    description: 'Share travel tips and cultural insights',
    icon: Plane,
  },
  {
    id: 'tech_support',
    name: 'Tech Support / Help Desk Assistant',
    description: 'Provide technical assistance and troubleshooting',
    icon: Laptop,
  },
  {
    id: 'gaming_streamer',
    name: 'Gaming Streamer / eSports Personality',
    description: 'Discuss gaming and esports content',
    icon: Gamepad,
  },
  {
    id: 'life_coach',
    name: 'Life Coach / Motivational Speaker',
    description: 'Provide motivation and life guidance',
    icon: Target,
  },
  {
    id: 'virtual_therapist',
    name: 'Virtual Therapist / Mental Health Coach',
    description: 'Support emotional wellbeing (with disclaimers)',
    icon: Heart,
  },
  {
    id: 'virtual_dj',
    name: 'Virtual DJ / Music Curator',
    description: 'Create and share music playlists',
    icon: Music,
  },
  {
    id: 'news_anchor',
    name: 'News Anchor / Reporter',
    description: 'Present and discuss news content',
    icon: Radio,
  },
  {
    id: 'language_partner',
    name: 'Language Partner / Translator',
    description: 'Help with language learning and translation',
    icon: Languages,
  },
  {
    id: 'storyteller',
    name: 'Storyteller / Narrator',
    description: 'Create and share engaging stories',
    icon: BookOpen,
  },
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

const RoleSelector = ({ onSelect }: RoleSelectorProps) => {
  return (
    <RadioGroup 
      defaultValue="influencer" 
      className="space-y-4 max-h-[400px] overflow-y-auto pr-4"
      onValueChange={(value) => onSelect(value as PersonaRole)}
    >
      {roles.map((role) => (
        <div key={role.id} className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
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
