-- XPira Database Schema
-- Migration: 001_initial_schema
-- Created: 2025-01-XX
-- Description: Core tables for user profiles, skill tracking, vocabulary, and conversations

-- ============================================================================
-- PROFILES TABLE
-- Core user identity, synced with Supabase Auth
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  target_language TEXT DEFAULT 'spanish',
  native_language TEXT DEFAULT 'english',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  -- Game state (synced from client)
  coins INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  -- Anti-addiction tracking
  daily_play_minutes INTEGER DEFAULT 0,
  last_play_date DATE,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Adventurer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SKILL_PROGRESS TABLE
-- Tracks XP and levels for each skill
-- ============================================================================
CREATE TABLE IF NOT EXISTS skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,  -- e.g., 'languages.spanish.vocabulary'
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  times_practiced INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Index for efficient user lookups
CREATE INDEX IF NOT EXISTS idx_skill_progress_user_id ON skill_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_progress_skill_id ON skill_progress(skill_id);

-- ============================================================================
-- VOCABULARY TABLE
-- Individual word mastery for spaced repetition
-- ============================================================================
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT,
  language TEXT NOT NULL,  -- 'spanish', 'french', etc.
  phonetic TEXT,  -- IPA pronunciation
  -- Spaced repetition fields
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  times_seen INTEGER DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,  -- SM-2 algorithm
  interval_days INTEGER DEFAULT 1,
  next_review TIMESTAMPTZ DEFAULT now(),
  -- Metadata
  source TEXT,  -- 'npc:vendor', 'skill_book:basics', etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, word, language)
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review ON vocabulary(next_review);
CREATE INDEX IF NOT EXISTS idx_vocabulary_language ON vocabulary(language);

-- ============================================================================
-- CONVERSATIONS TABLE
-- AI conversation history (Pro tier)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  npc_id TEXT NOT NULL,  -- 'vendor', 'maria', 'chef', etc.
  scene TEXT NOT NULL,  -- 'marketplace', 'restaurant', etc.
  -- Conversation content
  messages JSONB DEFAULT '[]',  -- Array of {role, content, timestamp}
  -- Learning metadata
  vocabulary_practiced TEXT[] DEFAULT '{}',
  corrections_given INTEGER DEFAULT 0,
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_npc_id ON conversations(npc_id);

-- ============================================================================
-- ACTIVITIES TABLE
-- Real-world activity logging (future feature)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('practice', 'real_world', 'verified')),
  -- XP and rewards
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  -- Proof/metadata
  metadata JSONB DEFAULT '{}',  -- GPS coords, photo URL, health data, etc.
  verified BOOLEAN DEFAULT false,
  -- Timestamps
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_skill_id ON activities(skill_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Users can only access their own data
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Profiles: users own their profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Skill Progress: users own their skills
CREATE POLICY "Users can view own skill progress"
  ON skill_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill progress"
  ON skill_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill progress"
  ON skill_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Vocabulary: users own their vocabulary
CREATE POLICY "Users can view own vocabulary"
  ON vocabulary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary"
  ON vocabulary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary"
  ON vocabulary FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vocabulary"
  ON vocabulary FOR DELETE
  USING (auth.uid() = user_id);

-- Conversations: users own their conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Activities: users own their activities
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_progress_updated_at
  BEFORE UPDATE ON skill_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON vocabulary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE profiles IS 'User profiles synced with Supabase Auth';
COMMENT ON TABLE skill_progress IS 'XP and level tracking for each skill';
COMMENT ON TABLE vocabulary IS 'Individual word mastery with spaced repetition';
COMMENT ON TABLE conversations IS 'AI conversation history for Pro tier';
COMMENT ON TABLE activities IS 'Real-world activity logging for future gamification';
