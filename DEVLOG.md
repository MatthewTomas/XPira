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
