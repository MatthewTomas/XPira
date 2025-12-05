// XPira Edge Function: Whisper Transcribe
// Provides robust speech-to-text using OpenAI Whisper for Pro tier users
//
// POST /whisper-transcribe
// Body: FormData with 'audio' file (webm, wav, mp3, etc.)
// Returns: { text: string, language?: string, confidence?: number }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Verify user and check subscription
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check Pro subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, target_language')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_tier !== 'pro') {
      return new Response(
        JSON.stringify({ error: 'Pro subscription required for Whisper transcription' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'Missing audio file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Map target language to Whisper language code
    const languageMap: Record<string, string> = {
      spanish: 'es',
      french: 'fr',
      german: 'de',
      italian: 'it',
      portuguese: 'pt',
      japanese: 'ja',
      korean: 'ko',
      chinese: 'zh',
    }
    const whisperLanguage = languageMap[profile?.target_language || 'spanish'] || 'es'

    // Prepare request for OpenAI Whisper
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile, 'audio.webm')
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('language', whisperLanguage)
    whisperFormData.append('response_format', 'verbose_json')

    // Call OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: whisperFormData,
    })

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text()
      console.error('Whisper API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Transcription failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const whisperData = await whisperResponse.json()

    return new Response(
      JSON.stringify({
        text: whisperData.text || '',
        language: whisperData.language,
        duration: whisperData.duration,
        // Segments for word-level timing (if needed)
        segments: whisperData.segments?.map((s: any) => ({
          text: s.text,
          start: s.start,
          end: s.end,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Whisper transcribe error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
