
import type { Database } from '@/integrations/supabase/types';

type PersonaRole = Database['public']['Enums']['persona_role'];

export type PersonalityTraits = {
  // Big Five
  extroversion: number;
  openness: number;
  conscientiousness: number;
  agreeableness: number;
  emotionalStability: number;
  // Advanced Traits
  communicationStyle: number;
  directness: number;
  emotionalTone: number;
  expressiveness: number;
  humor: number;
  empathy: number;
  assertiveness: number;
  creativity: number;
  energyLevel: number;
  knowledgeFocus: number;
  socialSensitivity: number;
  linguisticStyle: number;
};

export const defaultTraits: Record<PersonaRole, PersonalityTraits> = {
  personal_trainer: {
    extroversion: 80,
    openness: 60,
    conscientiousness: 75,
    agreeableness: 70,
    emotionalStability: 80,
    communicationStyle: 40,
    directness: 80,
    emotionalTone: 20,
    expressiveness: 75,
    humor: 60,
    empathy: 70,
    assertiveness: 80,
    creativity: 60,
    energyLevel: 90,
    knowledgeFocus: 50,
    socialSensitivity: 60,
    linguisticStyle: 50
  },
  virtual_tutor: {
    extroversion: 60,
    openness: 75,
    conscientiousness: 80,
    agreeableness: 80,
    emotionalStability: 70,
    communicationStyle: 50,
    directness: 60,
    emotionalTone: 40,
    expressiveness: 50,
    humor: 40,
    empathy: 75,
    assertiveness: 60,
    creativity: 70,
    energyLevel: 60,
    knowledgeFocus: 70,
    socialSensitivity: 70,
    linguisticStyle: 60
  },
  financial_advisor: {
    extroversion: 50,
    openness: 50,
    conscientiousness: 90,
    agreeableness: 60,
    emotionalStability: 80,
    communicationStyle: 30,
    directness: 70,
    emotionalTone: 50,
    expressiveness: 40,
    humor: 30,
    empathy: 60,
    assertiveness: 70,
    creativity: 40,
    energyLevel: 50,
    knowledgeFocus: 80,
    socialSensitivity: 60,
    linguisticStyle: 40
  },
  fashion_stylist: {
    extroversion: 70,
    openness: 80,
    conscientiousness: 60,
    agreeableness: 70,
    emotionalStability: 70,
    communicationStyle: 70,
    directness: 60,
    emotionalTone: 30,
    expressiveness: 80,
    humor: 50,
    empathy: 65,
    assertiveness: 60,
    creativity: 90,
    energyLevel: 80,
    knowledgeFocus: 40,
    socialSensitivity: 70,
    linguisticStyle: 70
  },
  food_blogger: {
    extroversion: 65,
    openness: 85,
    conscientiousness: 60,
    agreeableness: 75,
    emotionalStability: 70,
    communicationStyle: 60,
    directness: 50,
    emotionalTone: 30,
    expressiveness: 75,
    humor: 50,
    empathy: 70,
    assertiveness: 50,
    creativity: 80,
    energyLevel: 70,
    knowledgeFocus: 50,
    socialSensitivity: 70,
    linguisticStyle: 70
  },
  // ... continuing with all other roles
  travel_blogger: {
    extroversion: 70,
    openness: 90,
    conscientiousness: 60,
    agreeableness: 70,
    emotionalStability: 75,
    communicationStyle: 70,
    directness: 50,
    emotionalTone: 40,
    expressiveness: 80,
    humor: 60,
    empathy: 60,
    assertiveness: 60,
    creativity: 85,
    energyLevel: 80,
    knowledgeFocus: 60,
    socialSensitivity: 70,
    linguisticStyle: 75
  },
  tech_support: {
    extroversion: 50,
    openness: 60,
    conscientiousness: 80,
    agreeableness: 70,
    emotionalStability: 70,
    communicationStyle: 40,
    directness: 70,
    emotionalTone: 50,
    expressiveness: 40,
    humor: 30,
    empathy: 70,
    assertiveness: 50,
    creativity: 50,
    energyLevel: 50,
    knowledgeFocus: 80,
    socialSensitivity: 60,
    linguisticStyle: 40
  },
  gaming_streamer: {
    extroversion: 85,
    openness: 70,
    conscientiousness: 50,
    agreeableness: 60,
    emotionalStability: 70,
    communicationStyle: 80,
    directness: 60,
    emotionalTone: 30,
    expressiveness: 90,
    humor: 80,
    empathy: 50,
    assertiveness: 70,
    creativity: 70,
    energyLevel: 90,
    knowledgeFocus: 40,
    socialSensitivity: 50,
    linguisticStyle: 60
  },
  life_coach: {
    extroversion: 80,
    openness: 75,
    conscientiousness: 70,
    agreeableness: 80,
    emotionalStability: 80,
    communicationStyle: 60,
    directness: 60,
    emotionalTone: 20,
    expressiveness: 80,
    humor: 60,
    empathy: 80,
    assertiveness: 70,
    creativity: 60,
    energyLevel: 80,
    knowledgeFocus: 50,
    socialSensitivity: 70,
    linguisticStyle: 70
  },
  virtual_therapist: {
    extroversion: 60,
    openness: 80,
    conscientiousness: 80,
    agreeableness: 85,
    emotionalStability: 90,
    communicationStyle: 40,
    directness: 50,
    emotionalTone: 40,
    expressiveness: 60,
    humor: 20,
    empathy: 90,
    assertiveness: 40,
    creativity: 50,
    energyLevel: 50,
    knowledgeFocus: 60,
    socialSensitivity: 80,
    linguisticStyle: 50
  },
  virtual_dj: {
    extroversion: 75,
    openness: 80,
    conscientiousness: 50,
    agreeableness: 70,
    emotionalStability: 70,
    communicationStyle: 70,
    directness: 50,
    emotionalTone: 30,
    expressiveness: 80,
    humor: 70,
    empathy: 50,
    assertiveness: 60,
    creativity: 80,
    energyLevel: 80,
    knowledgeFocus: 40,
    socialSensitivity: 60,
    linguisticStyle: 60
  },
  news_anchor: {
    extroversion: 70,
    openness: 70,
    conscientiousness: 80,
    agreeableness: 60,
    emotionalStability: 70,
    communicationStyle: 30,
    directness: 70,
    emotionalTone: 60,
    expressiveness: 50,
    humor: 30,
    empathy: 60,
    assertiveness: 70,
    creativity: 50,
    energyLevel: 60,
    knowledgeFocus: 70,
    socialSensitivity: 60,
    linguisticStyle: 50
  },
  language_partner: {
    extroversion: 50,
    openness: 80,
    conscientiousness: 70,
    agreeableness: 75,
    emotionalStability: 70,
    communicationStyle: 50,
    directness: 50,
    emotionalTone: 40,
    expressiveness: 50,
    humor: 40,
    empathy: 70,
    assertiveness: 50,
    creativity: 50,
    energyLevel: 50,
    knowledgeFocus: 80,
    socialSensitivity: 70,
    linguisticStyle: 60
  },
  storyteller: {
    extroversion: 65,
    openness: 90,
    conscientiousness: 60,
    agreeableness: 70,
    emotionalStability: 70,
    communicationStyle: 60,
    directness: 40,
    emotionalTone: 30,
    expressiveness: 85,
    humor: 60,
    empathy: 65,
    assertiveness: 50,
    creativity: 90,
    energyLevel: 70,
    knowledgeFocus: 50,
    socialSensitivity: 60,
    linguisticStyle: 80
  },
  influencer: {
    extroversion: 85,
    openness: 75,
    conscientiousness: 60,
    agreeableness: 70,
    emotionalStability: 75,
    communicationStyle: 80,
    directness: 60,
    emotionalTone: 20,
    expressiveness: 90,
    humor: 70,
    empathy: 60,
    assertiveness: 75,
    creativity: 80,
    energyLevel: 85,
    knowledgeFocus: 40,
    socialSensitivity: 65,
    linguisticStyle: 70
  },
  companion: {
    extroversion: 70,
    openness: 70,
    conscientiousness: 65,
    agreeableness: 85,
    emotionalStability: 80,
    communicationStyle: 60,
    directness: 50,
    emotionalTone: 30,
    expressiveness: 70,
    humor: 60,
    empathy: 85,
    assertiveness: 50,
    creativity: 60,
    energyLevel: 65,
    knowledgeFocus: 50,
    socialSensitivity: 80,
    linguisticStyle: 60
  },
  assistant: {
    extroversion: 60,
    openness: 70,
    conscientiousness: 85,
    agreeableness: 75,
    emotionalStability: 80,
    communicationStyle: 40,
    directness: 70,
    emotionalTone: 40,
    expressiveness: 60,
    humor: 40,
    empathy: 70,
    assertiveness: 60,
    creativity: 65,
    energyLevel: 70,
    knowledgeFocus: 70,
    socialSensitivity: 75,
    linguisticStyle: 50
  },
  actor: {
    extroversion: 80,
    openness: 85,
    conscientiousness: 70,
    agreeableness: 70,
    emotionalStability: 75,
    communicationStyle: 60,
    directness: 50,
    emotionalTone: 30,
    expressiveness: 90,
    humor: 70,
    empathy: 75,
    assertiveness: 70,
    creativity: 85,
    energyLevel: 80,
    knowledgeFocus: 60,
    socialSensitivity: 70,
    linguisticStyle: 75
  }
};

export const traitDefinitions = [
  // Big Five
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
  {
    name: 'Emotional Stability',
    key: 'emotionalStability',
    description: 'Emotional balance and resilience',
    min: 'Sensitive',
    max: 'Stable'
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
    name: 'Expressiveness',
    key: 'expressiveness',
    description: 'Style of expression',
    min: 'Reserved',
    max: 'Animated'
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
  }
];
