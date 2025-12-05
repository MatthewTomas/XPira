/**
 * XPira Database Types
 * 
 * Generated from Supabase schema. Update this file when schema changes.
 * Run `supabase gen types typescript --local > src/lib/database.types.ts` to regenerate.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          target_language: string
          native_language: string
          subscription_tier: 'free' | 'pro'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          coins: number
          total_xp: number
          daily_play_minutes: number
          last_play_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          target_language?: string
          native_language?: string
          subscription_tier?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          coins?: number
          total_xp?: number
          daily_play_minutes?: number
          last_play_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          target_language?: string
          native_language?: string
          subscription_tier?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          coins?: number
          total_xp?: number
          daily_play_minutes?: number
          last_play_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skill_progress: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          xp: number
          level: number
          times_practiced: number
          last_practiced: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          xp?: number
          level?: number
          times_practiced?: number
          last_practiced?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          xp?: number
          level?: number
          times_practiced?: number
          last_practiced?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          user_id: string
          word: string
          translation: string | null
          language: string
          phonetic: string | null
          times_correct: number
          times_incorrect: number
          times_seen: number
          ease_factor: number
          interval_days: number
          next_review: string
          source: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          translation?: string | null
          language: string
          phonetic?: string | null
          times_correct?: number
          times_incorrect?: number
          times_seen?: number
          ease_factor?: number
          interval_days?: number
          next_review?: string
          source?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          translation?: string | null
          language?: string
          phonetic?: string | null
          times_correct?: number
          times_incorrect?: number
          times_seen?: number
          ease_factor?: number
          interval_days?: number
          next_review?: string
          source?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          npc_id: string
          scene: string
          messages: Array<{
            role: 'user' | 'assistant'
            content: string
            timestamp: string
          }>
          vocabulary_practiced: string[]
          corrections_given: number
          started_at: string
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          npc_id: string
          scene: string
          messages?: Array<{
            role: 'user' | 'assistant'
            content: string
            timestamp: string
          }>
          vocabulary_practiced?: string[]
          corrections_given?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          npc_id?: string
          scene?: string
          messages?: Array<{
            role: 'user' | 'assistant'
            content: string
            timestamp: string
          }>
          vocabulary_practiced?: string[]
          corrections_given?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          activity_type: 'practice' | 'real_world' | 'verified'
          xp_earned: number
          coins_earned: number
          metadata: Record<string, any>
          verified: boolean
          started_at: string | null
          ended_at: string | null
          duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          activity_type: 'practice' | 'real_world' | 'verified'
          xp_earned?: number
          coins_earned?: number
          metadata?: Record<string, any>
          verified?: boolean
          started_at?: string | null
          ended_at?: string | null
          duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          activity_type?: 'practice' | 'real_world' | 'verified'
          xp_earned?: number
          coins_earned?: number
          metadata?: Record<string, any>
          verified?: boolean
          started_at?: string | null
          ended_at?: string | null
          duration_minutes?: number | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      subscription_tier: 'free' | 'pro'
      activity_type: 'practice' | 'real_world' | 'verified'
    }
  }
}
