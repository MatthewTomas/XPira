// XPira Edge Function: Sync Progress
// Batch syncs client-side progress to Supabase
// Called periodically or on key events (level up, session end, etc.)
//
// POST /sync-progress
// Body: { skills: SkillProgress[], vocabulary: VocabItem[], profile: ProfileUpdate }
// Returns: { success: boolean, synced: { skills: number, vocabulary: number } }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SkillProgress {
  skillId: string
  xp: number
  level: number
  timesPracticed?: number
  lastPracticed?: string
}

interface VocabItem {
  word: string
  translation: string
  language: string
  timesCorrect?: number
  timesIncorrect?: number
  timesSeen?: number
}

interface ProfileUpdate {
  coins?: number
  totalXp?: number
  dailyPlayMinutes?: number
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { skills, vocabulary, profile } = await req.json() as {
      skills?: SkillProgress[]
      vocabulary?: VocabItem[]
      profile?: ProfileUpdate
    }

    let syncedSkills = 0
    let syncedVocab = 0

    // Sync skill progress (upsert)
    if (skills && skills.length > 0) {
      const skillRows = skills.map(s => ({
        user_id: user.id,
        skill_id: s.skillId,
        xp: s.xp,
        level: s.level,
        times_practiced: s.timesPracticed || 0,
        last_practiced: s.lastPracticed || new Date().toISOString(),
      }))

      const { error: skillError } = await supabase
        .from('skill_progress')
        .upsert(skillRows, { 
          onConflict: 'user_id,skill_id',
          ignoreDuplicates: false 
        })

      if (skillError) {
        console.error('Skill sync error:', skillError)
      } else {
        syncedSkills = skills.length
      }
    }

    // Sync vocabulary (upsert)
    if (vocabulary && vocabulary.length > 0) {
      const vocabRows = vocabulary.map(v => ({
        user_id: user.id,
        word: v.word,
        translation: v.translation,
        language: v.language,
        times_correct: v.timesCorrect || 0,
        times_incorrect: v.timesIncorrect || 0,
        times_seen: v.timesSeen || 0,
      }))

      const { error: vocabError } = await supabase
        .from('vocabulary')
        .upsert(vocabRows, { 
          onConflict: 'user_id,word,language',
          ignoreDuplicates: false 
        })

      if (vocabError) {
        console.error('Vocabulary sync error:', vocabError)
      } else {
        syncedVocab = vocabulary.length
      }
    }

    // Update profile if provided
    if (profile) {
      const profileUpdate: Record<string, any> = {}
      if (profile.coins !== undefined) profileUpdate.coins = profile.coins
      if (profile.totalXp !== undefined) profileUpdate.total_xp = profile.totalXp
      if (profile.dailyPlayMinutes !== undefined) {
        profileUpdate.daily_play_minutes = profile.dailyPlayMinutes
        profileUpdate.last_play_date = new Date().toISOString().split('T')[0]
      }

      if (Object.keys(profileUpdate).length > 0) {
        await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: {
          skills: syncedSkills,
          vocabulary: syncedVocab,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Sync progress error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
