// Core game types

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Player stats for language learning RPG
export interface PlayerStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Language proficiency stats
  vocabulary: number;      // Word knowledge (0-100)
  pronunciation: number;   // Speaking clarity (0-100)
  comprehension: number;   // Listening/understanding (0-100)
  grammar: number;         // Sentence structure (0-100)
  
  // RPG stats
  confidence: number;      // Affects dialogue options (0-100)
  reputation: number;      // NPC friendliness (0-100)
  coins: number;           // In-game currency
}

export interface InventoryItem {
  id: string;
  name: string;
  nameInTargetLanguage: string;
  quantity: number;
  category: 'food' | 'tool' | 'quest' | 'consumable';
  description: string;
}

// Mission/Quest system
export interface Mission {
  id: string;
  title: string;
  titleInTargetLanguage: string;
  description: string;
  type: 'main' | 'side' | 'daily';
  status: 'available' | 'active' | 'completed' | 'failed';
  objectives: MissionObjective[];
  rewards: MissionRewards;
  requiredLevel: number;
  targetLanguageLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface MissionObjective {
  id: string;
  description: string;
  type: 'speak' | 'buy' | 'deliver' | 'learn' | 'practice';
  target: string;
  current: number;
  required: number;
  completed: boolean;
}

export interface MissionRewards {
  experience: number;
  coins: number;
  items?: InventoryItem[];
  statBoosts?: Partial<PlayerStats>;
}

// NPC system
export interface NPC {
  id: string;
  name: string;
  role: 'vendor' | 'teacher' | 'questgiver' | 'citizen';
  position: Vector3;
  dialogue: DialogueTree;
  inventory?: InventoryItem[];
  patience: number;  // How many attempts before offering help (1-10)
}

// Dialogue system
export interface DialogueTree {
  id: string;
  nodes: DialogueNode[];
  startNodeId: string;
}

export interface DialogueNode {
  id: string;
  speaker: 'npc' | 'player';
  text: string;
  textInTargetLanguage: string;
  audioUrl?: string;
  responses?: DialogueResponse[];
  action?: DialogueAction;
}

export interface DialogueResponse {
  id: string;
  text: string;
  expectedSpeech?: string[];  // Acceptable spoken phrases
  nextNodeId: string;
  requiresType: 'speak' | 'write' | 'choice';
}

export interface DialogueAction {
  type: 'give_item' | 'take_item' | 'give_xp' | 'start_mission' | 'complete_mission' | 'teach_word';
  payload: Record<string, unknown>;
}

// Speech recognition
export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives?: Array<{ transcript: string; confidence: number }>;
}

// Language learning
export interface LearnedWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl?: string;
  category: string;
  timesUsed: number;
  lastUsed: Date;
  proficiency: number;  // 0-100, based on spaced repetition
}

export interface LanguageConfig {
  code: string;           // e.g., 'es', 'fr', 'de'
  name: string;           // e.g., 'Spanish'
  speechRecognitionCode: string;  // e.g., 'es-ES'
  textToSpeechVoice?: string;
}

// ============================================================================
// DUAL-MODE ARCHITECTURE TYPES
// Supports both free (hard-coded) and premium (AI-powered) modes
// ============================================================================

/**
 * User subscription tier
 * FREE: Hard-coded dialogue trees, pattern matching for speech
 * PREMIUM: AI-generated responses, semantic understanding, pronunciation feedback
 */
export type UserTier = 'free' | 'premium';

/**
 * Result of evaluating a player's spoken/written response
 * 
 * FREE MODE: Uses Levenshtein distance matching against expectedSpeech arrays
 * PREMIUM MODE: Uses AI for semantic understanding, accepts paraphrases,
 *               provides detailed pronunciation and grammar feedback
 */
export interface ResponseEvaluation {
  matched: boolean;
  similarity: number;           // 0-1, how close to expected
  bestMatch?: string;           // The phrase it matched against
  
  // PREMIUM: AI-enhanced feedback fields
  semanticMatch?: boolean;      // True if meaning is correct even if words differ
  pronunciationScore?: number;  // 0-100, detailed pronunciation accuracy
  grammarCorrect?: boolean;     // Whether grammar was correct
  corrections?: string[];       // Suggested corrections
  feedback?: string;            // Natural language feedback from AI
}

/**
 * Context passed to evaluators and content providers
 * Enables AI to generate contextually appropriate responses
 */
export interface DialogueContext {
  npcId: string;
  npcName: string;
  npcRole: NPC['role'];
  currentNodeId: string;
  previousNodes: string[];      // Conversation history
  playerLevel: number;
  targetLanguage: LanguageConfig;
  learnedWords: string[];       // Words the player knows
  currentMission?: string;      // Active mission context
  
  // PREMIUM: Additional context for AI
  conversationHistory?: Array<{
    speaker: 'npc' | 'player';
    text: string;
    textInTargetLanguage: string;
  }>;
}

/**
 * Feedback to show the player after a speech attempt
 * 
 * FREE MODE: Simple correct/incorrect with hint
 * PREMIUM MODE: Detailed pronunciation tips, grammar explanations, encouragement
 */
export interface SpeechFeedback {
  type: 'success' | 'partial' | 'incorrect';
  message: string;              // Display message
  hint?: string;                // Help text if incorrect
  
  // PREMIUM: Detailed AI feedback
  pronunciationTips?: string[]; // "Try emphasizing the 'rr' sound"
  grammarExplanation?: string;  // "In Spanish, adjectives come after nouns"
  encouragement?: string;       // "Great effort! You're improving"
  audioExample?: string;        // URL to correct pronunciation audio
}

/**
 * Response from dialogue content provider
 * 
 * FREE MODE: Returns pre-defined DialogueNode from static trees
 * PREMIUM MODE: Can generate dynamic nodes based on conversation context
 */
export interface DialogueProviderResponse {
  node: DialogueNode;
  isGenerated: boolean;         // True if AI-generated (premium)
  suggestedResponses?: string[]; // AI-suggested things the player could say
}

// ============================================================================
// XPIRA: UNIVERSAL LIFE SKILLS SYSTEM
// D&D-inspired attribute and skill tree architecture
// ============================================================================

/**
 * The six core D&D-inspired attributes
 * Each attribute governs a category of life skills
 */
export type Attribute = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

/**
 * Attribute definitions with full metadata
 */
export interface AttributeDefinition {
  id: Attribute;
  name: string;
  description: string;
  icon: string;
  color: string;
  skillCategories: string[]; // Top-level skill categories under this attribute
}

/**
 * The six attributes and their domains:
 * STR (Strength)     - Physical fitness, sports, manual labor
 * DEX (Dexterity)    - Fine motor skills, crafts, instruments, sports precision
 * CON (Constitution) - Health, nutrition, sleep, endurance, habits
 * INT (Intelligence) - Academic knowledge, languages, programming, sciences
 * WIS (Wisdom)       - Emotional intelligence, mindfulness, financial literacy, life skills
 * CHA (Charisma)     - Communication, leadership, networking, social skills
 */
export const ATTRIBUTES: Record<Attribute, AttributeDefinition> = {
  STR: {
    id: 'STR',
    name: 'Strength',
    description: 'Physical power and athletic ability',
    icon: '💪',
    color: '#ef4444', // red
    skillCategories: ['Fitness', 'Sports', 'Labor'],
  },
  DEX: {
    id: 'DEX',
    name: 'Dexterity',
    description: 'Agility, precision, and fine motor control',
    icon: '🎯',
    color: '#22c55e', // green
    skillCategories: ['Crafts', 'Instruments', 'Precision Sports'],
  },
  CON: {
    id: 'CON',
    name: 'Constitution',
    description: 'Health, endurance, and well-being',
    icon: '❤️',
    color: '#f97316', // orange
    skillCategories: ['Health', 'Nutrition', 'Sleep', 'Habits'],
  },
  INT: {
    id: 'INT',
    name: 'Intelligence',
    description: 'Knowledge, reasoning, and learning',
    icon: '🧠',
    color: '#3b82f6', // blue
    skillCategories: ['Languages', 'Sciences', 'Programming', 'Mathematics', 'History'],
  },
  WIS: {
    id: 'WIS',
    name: 'Wisdom',
    description: 'Insight, judgment, and practical knowledge',
    icon: '🦉',
    color: '#8b5cf6', // purple
    skillCategories: ['Financial', 'Mindfulness', 'Life Skills', 'Emotional Intelligence'],
  },
  CHA: {
    id: 'CHA',
    name: 'Charisma',
    description: 'Social influence and communication',
    icon: '✨',
    color: '#ec4899', // pink
    skillCategories: ['Communication', 'Leadership', 'Networking', 'Public Speaking'],
  },
};

/**
 * A node in the skill tree hierarchy
 * Skills can be nested (e.g., INT → Languages → Spanish → Vocabulary)
 */
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon?: string;
  attribute: Attribute;
  parentId?: string;           // null for root skills
  children?: string[];         // Child skill IDs
  
  // Skill configuration
  maxLevel: number;            // Usually 20 (D&D style) or 100 (percentage)
  xpPerLevel: number;          // Base XP needed per level (scales)
  
  // Platform availability
  platforms: Platform[];       // Which platforms support this skill
  
  // Tracking configuration
  trackingMethods: SkillTrackingMethod[];
  hasInGameScene: boolean;     // Can practice in 3D world
  realWorldTrackable: boolean; // Can log real-world practice
  
  // Integration info
  integrationSources?: string[]; // e.g., ['duolingo', 'github', 'strava']
}

/**
 * A player's progress on a specific skill
 */
export interface SkillProgress {
  skillId: string;
  level: number;               // Current level (1-20 or 1-100)
  currentXp: number;           // XP toward next level
  totalXp: number;             // Lifetime XP earned
  lastPracticed?: Date;
  streakDays: number;          // Consecutive days practiced
  
  // Source breakdown (what % came from where)
  sourceBreakdown: Record<SkillSource, number>;
}

/**
 * Where skill XP comes from
 */
export type SkillSource = 
  | 'in-game'        // Earned through game activities
  | 'real-world'     // Logged real-world activities
  | 'integration'    // Synced from external apps (Duolingo, Strava, etc.)
  | 'self-report'    // User claimed (lower weight)
  | 'peer-verified'  // Confirmed by another user
  | 'certification'; // Verified credential

/**
 * How a skill can be tracked/practiced
 */
export type SkillTrackingMethod =
  | 'speech'         // Voice recognition (languages)
  | 'text-input'     // Written answers (languages, math)
  | 'multiple-choice'// Quiz format
  | 'timed-challenge'// Speed-based (mental math)
  | 'manual-log'     // User logs activity (workouts, hobbies)
  | 'device-sync'    // Apple Health, Strava, etc.
  | 'photo-proof'    // Upload photo evidence
  | 'gps-checkin';   // Location-based verification

/**
 * Supported platforms
 */
export type Platform = 'web' | 'mobile' | 'audio';

/**
 * A logged real-world activity
 */
export interface RealWorldActivity {
  id: string;
  skillId: string;
  timestamp: Date;
  duration?: number;           // Minutes
  intensity?: 'low' | 'medium' | 'high';
  
  // Verification
  verificationMethod: SkillTrackingMethod;
  verified: boolean;
  proof?: {
    type: 'photo' | 'gps' | 'device-data' | 'peer';
    data: string;              // URL or serialized data
  };
  
  // XP calculation
  xpAwarded: number;
  source: SkillSource;
  notes?: string;
}

/**
 * A skill event for history/sync
 */
export interface SkillEvent {
  id: string;
  skillId: string;
  timestamp: Date;
  eventType: 'xp-gain' | 'level-up' | 'streak' | 'achievement';
  xpAmount?: number;
  source: SkillSource;
  context?: string;            // "Completed marketplace dialogue"
  synced: boolean;             // Synced to stats.name
}

/**
 * Player's complete skill profile
 * Replaces/extends the old PlayerStats for the new system
 */
export interface PlayerProfile {
  id: string;
  username: string;
  createdAt: Date;
  
  // Overall progression
  totalLevel: number;          // Sum of all skill levels / normalization
  totalXp: number;
  
  // D&D-style attribute scores (derived from skills)
  attributes: Record<Attribute, number>; // 1-20 scale
  
  // Skill progress
  skills: Record<string, SkillProgress>;
  
  // Legacy compatibility
  coins: number;
  
  // Real-life tracking
  realWorldActivities: RealWorldActivity[];
  currentStreak: number;       // Days in a row with any activity
  longestStreak: number;
  
  // Anti-addiction
  dailyPlayTime: number;       // Minutes played today
  dailyPlayLimit: number;      // Configurable limit
  realWorldUnlocks: number;    // Extra time earned via real activities
}

/**
 * Anti-addiction configuration and state
 */
export interface RealLifeFirstConfig {
  dailyPlayLimitMinutes: number;    // Default: 60
  realWorldMultiplier: number;      // XP multiplier after logging real activity
  realWorldUnlockMinutes: number;   // Extra game time per real activity logged
  
  // Prompts
  touchGrassEnabled: boolean;       // Require outdoor time to unlock game
  touchGrassMinutes: number;        // Required outdoor time
  
  // Nudges
  realWorldNudgeFrequency: number;  // How often to suggest real practice (minutes)
}

/**
 * Stats.name sync configuration
 */
export interface StatsNameProfile {
  connected: boolean;
  userId?: string;
  username?: string;
  publicUrl?: string;          // stats.name/username
  lastSynced?: Date;
  syncEnabled: boolean;
  
  // What to sync
  syncSkills: boolean;
  syncAchievements: boolean;
  syncRealWorld: boolean;
}

/**
 * Convert D&D-style score (1-20) to modifier (-5 to +10)
 */
export function getAttributeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Convert internal score (1-100) to D&D display (1-20)
 */
export function toD20Scale(score100: number): number {
  return Math.max(1, Math.min(20, Math.round(score100 / 5)));
}

/**
 * Calculate XP needed for a given level (exponential scaling)
 */
export function xpForLevel(level: number, baseXp: number = 100): number {
  return Math.floor(baseXp * Math.pow(1.5, level - 1));
}

