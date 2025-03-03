export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avatar_settings: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          persona_id: string
          style_settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          persona_id: string
          style_settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          persona_id?: string
          style_settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatar_settings_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          age: string | null
          body_type: string | null
          config: Json
          created_at: string
          description: string | null
          ethnicity: string | null
          eye_color: string | null
          facial_features: Json | null
          gender: string | null
          hair_color: string | null
          hair_style: string | null
          id: string
          name: string
          personality_traits: Json | null
          primary_image_url: string | null
          role: string | null
          style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: string | null
          body_type?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          ethnicity?: string | null
          eye_color?: string | null
          facial_features?: Json | null
          gender?: string | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          name: string
          personality_traits?: Json | null
          primary_image_url?: string | null
          role?: string | null
          style: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: string | null
          body_type?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          ethnicity?: string | null
          eye_color?: string | null
          facial_features?: Json | null
          gender?: string | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          name?: string
          personality_traits?: Json | null
          primary_image_url?: string | null
          role?: string | null
          style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          persona_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          persona_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          persona_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          additional_params: Json | null
          avatar_id: string
          created_at: string
          id: string
          prompt: string
          scene_description: string | null
          style: string | null
          type: string
          url: string
          user_id: string
        }
        Insert: {
          additional_params?: Json | null
          avatar_id: string
          created_at?: string
          id?: string
          prompt: string
          scene_description?: string | null
          style?: string | null
          type: string
          url: string
          user_id: string
        }
        Update: {
          additional_params?: Json | null
          avatar_id?: string
          created_at?: string
          id?: string
          prompt?: string
          scene_description?: string | null
          style?: string | null
          type?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generations_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      personality_traits: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          trait_type: string
          trait_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          trait_type: string
          trait_value: string
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          trait_type?: string
          trait_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_personality_traits_persona"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personality_traits_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          interaction_count: number | null
          last_interaction: string | null
          name: string
          personality_settings: Json
          relationship_level: number | null
          role: Database["public"]["Enums"]["persona_role"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          name: string
          personality_settings?: Json
          relationship_level?: number | null
          role: Database["public"]["Enums"]["persona_role"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          name?: string
          personality_settings?: Json
          relationship_level?: number | null
          role?: Database["public"]["Enums"]["persona_role"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          subscription_expires_at: string | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          subscription_expires_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      relationship_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          impact: number | null
          persona_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          impact?: number | null
          persona_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          impact?: number | null
          persona_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          prompt: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          prompt: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          prompt?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          action: string
          created_at: string
          credits_used: number
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          credits_used?: number
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          credits_used?: number
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user" | "premium"
      persona_role:
        | "personal_trainer"
        | "virtual_tutor"
        | "financial_advisor"
        | "fashion_stylist"
        | "food_blogger"
        | "travel_blogger"
        | "tech_support"
        | "gaming_streamer"
        | "life_coach"
        | "virtual_therapist"
        | "virtual_dj"
        | "news_anchor"
        | "language_partner"
        | "storyteller"
        | "influencer"
        | "companion"
        | "assistant"
        | "actor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
