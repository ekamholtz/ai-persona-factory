
export interface Avatar {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  primary_image_url?: string;
  style: string;
  gender?: string;
  ethnicity?: string;
  age?: string;
  body_type?: string;
  hair_style?: string;
  hair_color?: string;
  eye_color?: string;
  facial_features?: Record<string, any>;
  personality_traits?: Record<string, any>;
  role?: string;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  avatar_id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  scene_description?: string;
  style?: string;
  additional_params?: Record<string, any>;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'user' | 'premium';
  credits: number;
  subscription_tier?: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  prompt: string;
  is_public: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
