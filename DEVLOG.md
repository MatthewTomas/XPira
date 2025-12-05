# Xpira Development Log

> Project diary tracking plans, progress, and problems. Pairs with stats.name for professional profiles.

---

## 2024-12-04: Visual Identity & Design Philosophy Decisions

### Visual Style: "Cozy Craft"
- **Warm & Playful**: Golden hour lighting, sunset palettes, cozy not cold
- **Lighthearted**: Humor welcome, puns and jokes (tasteful), not taking itself too seriously
- **Handcrafted feel**: Slightly imperfect lines, like a journal, organic growth metaphors
- **NOT Zelda but inspired by**: Grid clarity + Stardew warmth + Spiritfarer emotion

### Color Direction
- Warm cream/parchment backgrounds (not stark white or dark)
- Soft greens, warm oranges, golden yellows
- Accent purples/teals for XP/magic elements
- Avoid: harsh blacks, neon, cold blues

### World Structure: "Living City"
- One connected world that evolves with the user
- Empty storefronts become bowling alleys, language schools, etc. as user adds skills
- Roads lead to new cities/areas for major skill domains
- Map for teleporting (fast travel) to avoid tedium
- World serves learning, not distraction

### Avatar System
- Player creates unique avatar that grows with them
- Range: cute to mature, human to animal to humanimal
- Visual progression tied to real skill growth
- Deep personalization = emotional connection

### Collectible Beautiful Tools
- Spanish Phrasebook: Fills in as you learn, beautifully illustrated
- Recipe Book, Lab Notebook, Training Log, etc. per domain
- These are proof of learning - shareable, personal, beautiful

### Anti-Dark-Pattern Commitment ("Playful Growth, No Guilt")

| Traditional Gamification | XPira Alternative | Why |
|-------------------------|-------------------|-----|
| Streaks | "Days active this month" | Life happens, no punishment |
| Daily login rewards | "Welcome back!" catch-up | No FOMO, no obligation |
| Leaderboards | Personal bests only | Compete with yesterday-you |
| Loot boxes / RNG | Predictable progression | No gambling psychology |
| Push notifications | User-initiated only | Don't interrupt real life |
| Infinite scroll | Clear session boundaries | Go live your life |
| XP treadmills | Meaningful progress | Numbers = real growth |

---

## 2024-12-04: Project Evolution - Language RPG → Xpira

### Vision
Transform language learning RPG into **Xpira** (xpira.gg) - a universal life skills game with:
- D&D-style 6-attribute system (STR, DEX, CON, INT, WIS, CHA)
- Hierarchical skill trees across all life domains
- Real-world activity tracking (Apple Health, manual logging)
- Anti-addiction "Real Life First" mechanics
- Multi-platform: web, mobile app, audio mode
- Shareable profiles via stats.name integration

### Domain Decision
- **Game:** xpira.gg (~$15-20) - "XP for real life"
- **Professional dashboard:** stats.name (already owned)
- **Future:** stats.game ($1700) if traction

### Architecture Plan

#### Phase 1: Core Data Model Refactor ✅ COMPLETE
- [x] 1.1 Create D&D attribute system in types.ts
- [x] 1.2 Add skill source tracking (in-game, real-world, verified)
- [x] 1.3 Refactor stores.ts with new PlayerProfile structure

#### Phase 2: Skill Domain Registry ✅ COMPLETE (MVP)
- [x] 2.1 Create skillRegistry.ts with full taxonomy
- [x] 2.2 Define MVP skill domains (languages, physical, cognitive)
- [ ] 2.3 Create skill evaluator registry (deferred - using existing evaluator)

#### Phase 3: Real-World Activity System
- [ ] 3.1 Build activity tracker (manual logging)
- [ ] 3.2 Add health integrations (Apple Health via Capacitor)
- [ ] 3.3 Implement proof system (photos, GPS, device sync)

#### Phase 4: Anti-Addiction "Real Life First"
- [ ] 4.1 Daily play limits, "touch grass" prompts
- [ ] 4.2 Life balance tracking and nudges

#### Phase 5: Modular Scene System
- [ ] 5.1 Abstract IScene interface
- [ ] 5.2 Refactor MarketplaceScene to use interface
- [ ] 5.3 Plan future scenes (Bank, Gym, Library, Workshop)

#### Phase 6: Multi-Platform Support
- [ ] 6.1 Platform abstraction layer
- [ ] 6.2 Audio mode for eligible skills
- [ ] 6.3 Mobile preparation (Capacitor plugins)

#### Phase 7: Profile & Sync ⏳ PARTIAL
- [x] 7.1 Character sheet UI with radar chart (basic version done)
- [ ] 7.2 stats.name API sync layer
- [ ] 7.3 Shareable public profile

### Tech Stack
- React 19 + TypeScript + Vite
- React Three Fiber + @react-three/drei (3D)
- Zustand with subscribeWithSelector (state)
- Tailwind CSS (styling)
- Web Speech API (speech recognition)
- Howler.js (audio)
- Capacitor (mobile)

### MVP Skill Domains
1. **Languages** (current) - Spanish, French, etc.
2. **Physical** - Steps, workouts via Apple Health
3. **Cognitive** - Mental math, memory, logic

---

## Progress Log

### 2024-12-04
- ✅ Fixed DialogueBox.tsx mic permission and vocabulary display
- ✅ Created MicPermissionModal component
- ✅ Implemented dual-mode architecture (free/premium services)
- ✅ Finalized domain choice: xpira.gg + stats.name
- ✅ Phase 1.1: Created D&D attribute system in types.ts
  - Added `Attribute` type (STR, DEX, CON, INT, WIS, CHA)
  - Added `ATTRIBUTES` constant with full metadata
  - Added `SkillNode`, `SkillProgress`, `SkillEvent` interfaces
  - Added `SkillSource` and `SkillTrackingMethod` types
  - Added `PlayerProfile` interface (replaces PlayerStats for new system)
  - Added `RealLifeFirstConfig` and `StatsNameProfile` types
  - Added utility functions: `getAttributeModifier()`, `toD20Scale()`, `xpForLevel()`
- ✅ Phase 2.1: Created skill registry (src/core/skills/skillRegistry.ts)
  - MVP skills: Languages (Spanish, French, etc.), Cognitive (mental math, memory, logic), Fitness (walking, running, strength), Health (sleep, nutrition)
  - Helper functions: `getSkill()`, `getSkillsByAttribute()`, `getChildSkills()`, `getSkillPath()`, etc.
- ✅ Phase 1.3: Added useSkillStore to stores.ts
  - Full skill XP progression with level-ups
  - Real-world activity logging
  - Session tracking for anti-addiction
  - stats.name connection stubs
  - Persisted to localStorage
- ✅ Integrated skill XP into dialogue system (useDialogue.ts)
  - Successful speech recognition awards XP to language skills
  - Speaking awards pronunciation bonus, all interactions award vocab/comprehension
- ✅ Created CharacterSheet component (src/ui/CharacterSheet.tsx)
  - D&D-style attribute cards with expandable skill trees
  - Shows level, XP, coins, streak, total skill levels
  - Real Life First stats (play time, unlocks)
  - stats.name connection status
- ✅ Added "Skills" button to GameHUD to toggle CharacterSheet
- ✅ **Renamed project to XPira** (package.json, index.html, README)
- ✅ **Created new HomeScreen** (src/ui/HomeScreen.tsx)
  - Folder-style expandable skill tree as main UI
  - Click attribute → see skill categories → see individual skills
  - "+ Track" button to start tracking new skills
  - "▶ Practice" button to launch in-game activity
  - Stats bar: coins, streak, total levels, skills count
  - Play time tracking with daily limit display
  - "+ Log Activity" for real-world tracking
- ✅ **Created SettingsScreen** (src/ui/SettingsScreen.tsx)
  - Profile tab: username, language selection
  - stats.name tab: connect/disconnect, sync options
  - Preferences tab: play limits, touch grass mode, audio settings
- ✅ **Updated App.tsx** for new flow
  - HomeScreen is now the main menu (skill-focused)
  - "Home" button in game scenes to return
  - Settings modal overlay

### Problems Encountered
- Dialogue state wasn't shared between components → Fixed with Zustand dialogueStore
- Microphone permission denied without user-friendly prompt → Fixed with MicPermissionModal
- JSX syntax errors from missing variable destructuring → Fixed micPermissionStatus

---

## Notes
- Skill taxonomy: 3-4 levels max (e.g., INT → Languages → Spanish → Vocabulary)
- Audio mode MVP: Languages only (proven model)
- Monetization: Free tier (limited skills) + Premium (unlimited + integrations + AI)
- Anti-addiction: Real-world activity unlocks game time, not vice versa

---

## 2025-01-XX: Backend Architecture & Freemium Model

### Philosophy
XPira prioritizes **real learning over engagement metrics**. No streaks, no dark patterns. 
The game incentivizes learners to:
1. Actually learn the material
2. Apply it in real-world contexts
3. Graduate to real conversations and experiences

### Freemium Model

#### Free Tier (Scripted NPC Mode)
- **Marketplace NPCs**: Pre-scripted dialogue trees with vocabulary focus
- **Speech Recognition**: Web Speech API for pronunciation practice
- **Skill Book System**: Hand-curated lessons with structured progression
- **Constraints**: Limited daily interactions, fixed conversation paths
- **Cost to Operate**: ~$0 (all client-side)

#### Pro Tier ($X/month - Stripe)
- **AI-Powered NPCs**: GPT-4o-mini for dynamic, contextual conversations
- **Voice Input**: Whisper API for robust speech-to-text (~$0.006/min)
- **Unlimited Practice**: No interaction caps
- **Cultural Context**: AI adapts to situation, provides corrections
- **Cost to Operate**: ~$0.01-0.02 per conversation turn

### Tech Stack (Scale-Ready, Zero-Cost-to-Start)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│   React 19 + TypeScript + Vite → Vercel (free tier)             │
│   Zustand (client state) + Supabase SDK                         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE (Backend)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Auth      │  │   Postgres   │  │ Edge Funcs   │          │
│  │  (free tier) │  │  (500MB free)│  │ (pay-per-use)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                           │                   │                  │
│                           ▼                   │                  │
│                    Row Level Security         │                  │
│                    (auth.uid() checks)        │                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼ (Pro tier only)
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIs                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   OpenAI     │  │   Stripe     │  │  (Future)    │          │
│  │ GPT + Whisper│  │   Payments   │  │ Apple Health │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (Supabase Postgres)

```sql
-- Core user identity (syncs with Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  target_language TEXT DEFAULT 'spanish',
  subscription_tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skill progress (persisted from client)
CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,  -- e.g., 'languages.spanish.vocabulary'
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_practiced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Vocabulary mastery (spaced repetition ready)
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT,
  language TEXT NOT NULL,
  times_correct INTEGER DEFAULT 0,
  times_seen INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, word, language)
);

-- AI conversation logs (Pro tier only)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  npc_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]',  -- Array of {role, content, timestamp}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Real-world activity tracking (future)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,  -- 'practice', 'real_world', 'verified'
  xp_earned INTEGER,
  metadata JSONB,  -- GPS, photo proof, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users own their profiles" ON profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their skills" ON skill_progress
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their vocabulary" ON vocabulary
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their activities" ON activities
  FOR ALL USING (auth.uid() = user_id);
```

### Supabase Edge Functions

```
/functions
├── ai-dialogue/           # GPT-4o-mini for Pro tier NPC conversations
│   └── index.ts          # POST: { message, npcContext, conversationId }
├── whisper-transcribe/    # Whisper API for robust speech-to-text
│   └── index.ts          # POST: audio blob → text
├── stripe-webhook/        # Handle subscription events
│   └── index.ts          # Updates profiles.subscription_tier
└── sync-progress/         # Batch sync client state to server
    └── index.ts          # POST: { skills, vocabulary, activities }
```

### Auth Flow

```
1. User opens XPira → lands on HomeScreen
2. Free play: No auth required, localStorage only
3. "Sign Up" → Supabase Auth (email/password or OAuth)
4. On sign-in: Merge localStorage state → Supabase
5. Pro upgrade: Stripe Checkout → webhook → update tier
6. Tier check: profiles.subscription_tier === 'pro'
```

### Mobile Strategy (Future)

**Capacitor** wraps the existing React web app for iOS/Android:
- Same codebase, native distribution
- Native plugins for: Speech (more reliable than Web Speech), Health integrations, Push notifications
- Build once, deploy to web + App Store + Play Store

**Timeline**: Web-only for MVP. Mobile after validation.
**Note**: iOS development deferred (employment restriction).

### Cost Analysis

| Component | Free Tier | Pro User (active) |
|-----------|-----------|-------------------|
| Vercel | $0 | $0 |
| Supabase | $0 (500MB) | ~$0.01/user/mo |
| OpenAI (GPT-4o-mini) | $0 | ~$0.15/1M tokens |
| OpenAI (Whisper) | $0 | $0.006/min |
| Stripe | 0% | 2.9% + $0.30/tx |

**Break-even**: ~5-10 active Pro users covers infrastructure.

### Implementation Priority

1. ✅ Core game loop (movement, NPCs, dialogue)
2. 🔄 Scripted NPC dialogue trees (free tier MVP)
3. ⏳ Supabase setup (auth, database, RLS)
4. ⏳ Stripe integration (Pro subscriptions)
5. ⏳ AI Edge Function (GPT-4o-mini dialogue)
6. ⏳ Whisper Edge Function (robust transcription)
7. ⏳ Skill Book content creation
8. ⏳ Mobile (Capacitor) after web validation

---

## 2025-01-XX: Bug Fixes

### Movement Controls Freezing
**Problem**: Keyboard handlers captured stale state due to closures.
**Solution**: Added refs (`playerPosRef`, `currentBuildingRef`, etc.) that update 
via `useEffect` and are read by keyboard handlers.

### Marketplace NPC Speech Not Working
**Problem**: `DialogueBox` component wasn't rendered in `Marketplace2D.tsx`.
**Solution**: Added `<DialogueBox />` to Marketplace2D JSX.

### Home Walls Not Blocking Player
**Problem**: Wall generation logic had gaps and incorrect boundaries.
**Solution**: Rebuilt wall system with:
- Exterior walls with door opening at entrance
- Interior wall at y=5 separating upstairs/hallway
- Vertical walls between rooms with doorways
- Proper collision detection in movement handler

### Web Speech API Browser Compatibility
**Problem**: Arc Browser, Firefox, and VS Code Simple Browser don't support Web Speech API.
**Solution**: 
- Added browser detection in `SpeechService.ts`
- Show clear error messages with browser recommendations
- Added "Type instead" fallback option
- Safari works but has buzzing on stop (needs mic stream cleanup)

---
