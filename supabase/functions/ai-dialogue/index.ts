// XPira Edge Function: AI Dialogue
// Provides GPT-4o-mini powered NPC conversations for Pro tier users
//
// POST /ai-dialogue
// Body: { message: string, npcId: string, conversationId?: string, context?: object }
// Returns: { reply: string, conversationId: string, corrections?: string[], vocabulary?: string[] }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// NPC personality prompts
const NPC_PROMPTS: Record<string, string> = {
  vendor: `You are a friendly market vendor in a Spanish-speaking town. 
You sell fruits, vegetables, and local goods. 
You speak in simple Spanish appropriate for a beginner learner.
Occasionally use English to clarify, but encourage Spanish use.
Correct major errors gently and teach common market vocabulary.
Keep responses short (1-3 sentences).`,

  maria: `You are María, a warm elderly woman who runs a small café.
You speak in Spanish with patience for learners.
You love sharing recipes and local culture.
Use simple vocabulary and offer corrections kindly.
Keep responses conversational and encouraging.`,

  chef: `You are a passionate chef at a local restaurant.
You speak in Spanish about food, cooking, and ingredients.
You're enthusiastic and use lots of food vocabulary.
Help learners practice ordering and discussing meals.
Keep responses lively and educational.`,
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
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_tier !== 'pro') {
      return new Response(
        JSON.stringify({ error: 'Pro subscription required for AI dialogue' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const { message, npcId, conversationId, context } = await req.json()

    if (!message || !npcId) {
      return new Response(
        JSON.stringify({ error: 'Missing message or npcId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create conversation
    let conversation: any
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()
      conversation = data
    }

    const messages = conversation?.messages || []
    const systemPrompt = NPC_PROMPTS[npcId] || NPC_PROMPTS.vendor

    // Build OpenAI messages
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        max_tokens: 150,
        temperature: 0.8,
      }),
    })

    const openaiData = await openaiResponse.json()
    const reply = openaiData.choices?.[0]?.message?.content || 'Lo siento, no entendí.'

    // Update conversation in database
    const newMessages = [
      ...messages,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
    ]

    let finalConversationId = conversationId
    if (conversationId && conversation) {
      await supabase
        .from('conversations')
        .update({ messages: newMessages })
        .eq('id', conversationId)
    } else {
      const { data: newConvo } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          npc_id: npcId,
          scene: context?.scene || 'marketplace',
          messages: newMessages,
        })
        .select('id')
        .single()
      finalConversationId = newConvo?.id
    }

    return new Response(
      JSON.stringify({
        reply,
        conversationId: finalConversationId,
        // TODO: Extract corrections and vocabulary from AI response
        corrections: [],
        vocabulary: [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Dialogue error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
