/**
 * XPira Supabase Client
 * 
 * Provides Supabase client with auth helpers.
 * Includes fallback to localStorage-only mode when not authenticated.
 * 
 * NOTE: Run `supabase gen types typescript --local > src/lib/database.types.ts`
 * after creating the Supabase project to get proper type safety.
 */

import { createClient, type User, type Session } from '@supabase/supabase-js'

// Environment variables (set in .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// Create client (or null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

// ============================================================================
// AUTH HELPERS
// ============================================================================

export async function signUp(email: string, password: string, username?: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser(): Promise<User | null> {
  if (!supabase) return null
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!supabase) return () => {}
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ?? null)
  })
  
  return () => subscription.unsubscribe()
}

// ============================================================================
// PROFILE HELPERS
// ============================================================================

export type SubscriptionTier = 'free' | 'pro'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  target_language: string
  subscription_tier: SubscriptionTier
  stripe_customer_id: string | null
  coins: number
  total_xp: number
}

export async function getProfile(): Promise<Profile | null> {
  if (!supabase) return null
  
  const user = await getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data as Profile
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  if (!supabase) return null
  
  const user = await getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    return null
  }
  
  return data as Profile
}

export async function isProUser(): Promise<boolean> {
  const profile = await getProfile()
  return profile?.subscription_tier === 'pro'
}

// ============================================================================
// SKILL PROGRESS HELPERS
// ============================================================================

export interface SkillProgress {
  id: string
  user_id: string
  skill_id: string
  xp: number
  level: number
  last_practiced: string | null
}

export async function getSkillProgress(): Promise<SkillProgress[]> {
  if (!supabase) return []
  
  const user = await getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('skill_progress')
    .select('*')
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error fetching skill progress:', error)
    return []
  }
  
  return (data || []) as SkillProgress[]
}

export async function upsertSkillProgress(
  skillId: string,
  xp: number,
  level: number
): Promise<void> {
  if (!supabase) return
  
  const user = await getUser()
  if (!user) return
  
  const { error } = await supabase
    .from('skill_progress')
    .upsert({
      user_id: user.id,
      skill_id: skillId,
      xp,
      level,
      last_practiced: new Date().toISOString(),
    }, {
      onConflict: 'user_id,skill_id',
    })
  
  if (error) {
    console.error('Error upserting skill progress:', error)
  }
}

// ============================================================================
// VOCABULARY HELPERS
// ============================================================================

export interface Vocabulary {
  id: string
  user_id: string
  word: string
  translation: string | null
  language: string
  times_correct: number
  times_seen: number
}

export async function getVocabulary(language?: string): Promise<Vocabulary[]> {
  if (!supabase) return []
  
  const user = await getUser()
  if (!user) return []
  
  let query = supabase
    .from('vocabulary')
    .select('*')
    .eq('user_id', user.id)
  
  if (language) {
    query = query.eq('language', language)
  }
  
  const { data, error } = await query.order('next_review', { ascending: true })
  
  if (error) {
    console.error('Error fetching vocabulary:', error)
    return []
  }
  
  return (data || []) as Vocabulary[]
}

export async function upsertVocabulary(
  word: string,
  translation: string,
  language: string,
  correct?: boolean
): Promise<void> {
  if (!supabase) return
  
  const user = await getUser()
  if (!user) return
  
  // Get existing entry to update stats
  const { data: existing } = await supabase
    .from('vocabulary')
    .select('times_correct, times_incorrect, times_seen')
    .eq('user_id', user.id)
    .eq('word', word)
    .eq('language', language)
    .single()
  
  const existingData = existing as { times_correct?: number; times_incorrect?: number; times_seen?: number } | null
  const times_correct = (existingData?.times_correct || 0) + (correct === true ? 1 : 0)
  const times_incorrect = (existingData?.times_incorrect || 0) + (correct === false ? 1 : 0)
  const times_seen = (existingData?.times_seen || 0) + 1
  
  const { error } = await supabase
    .from('vocabulary')
    .upsert({
      user_id: user.id,
      word,
      translation,
      language,
      times_correct,
      times_incorrect,
      times_seen,
    }, {
      onConflict: 'user_id,word,language',
    })
  
  if (error) {
    console.error('Error upserting vocabulary:', error)
  }
}

// ============================================================================
// EDGE FUNCTION HELPERS
// ============================================================================

export async function callAIDialogue(
  message: string,
  npcId: string,
  conversationId?: string,
  context?: Record<string, unknown>
): Promise<{ reply: string; conversationId: string }> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  
  const response = await supabase.functions.invoke('ai-dialogue', {
    body: { message, npcId, conversationId, context },
  })
  
  if (response.error) throw response.error
  return response.data
}

export async function callWhisperTranscribe(audioBlob: Blob): Promise<{ text: string }> {
  if (!supabase) throw new Error('Supabase not configured')
  
  const session = await getSession()
  if (!session) throw new Error('Not authenticated')
  
  const formData = new FormData()
  formData.append('audio', audioBlob, 'audio.webm')
  
  // For file uploads, we need to use fetch directly
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/whisper-transcribe`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    }
  )
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Transcription failed')
  }
  
  return response.json()
}

export async function syncProgress(data: {
  skills?: Array<{ skillId: string; xp: number; level: number }>
  vocabulary?: Array<{ word: string; translation: string; language: string }>
  profile?: { coins?: number; totalXp?: number; dailyPlayMinutes?: number }
}): Promise<{ success: boolean }> {
  if (!supabase) return { success: false }
  
  const session = await getSession()
  if (!session) return { success: false }
  
  const response = await supabase.functions.invoke('sync-progress', {
    body: data,
  })
  
  if (response.error) {
    console.error('Sync failed:', response.error)
    return { success: false }
  }
  
  return response.data
}
