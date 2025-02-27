
export interface Persona {
  id: string;
  name: string;
  role: string;
  description?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface PersonalityTrait {
  id: string;
  persona_id: string;
  trait_type: string;
  trait_value: string;
  created_at: string;
}

export interface AvatarSettings {
  id: string;
  persona_id: string;
  image_url?: string;
  style_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}
