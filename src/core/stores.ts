import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import type { 
  PlayerStats, 
  InventoryItem, 
  Mission, 
  LearnedWord, 
  LanguageConfig, 
  UserTier,
  Attribute,
  SkillProgress,
  RealWorldActivity,
  SkillEvent,
  SkillSource,
  PlayerProfile,
  RealLifeFirstConfig,
  StatsNameProfile,
} from './types';
import { SKILLS } from './skills/skillRegistry';

// Player State Store
interface PlayerState {
  stats: PlayerStats;
  inventory: InventoryItem[];
  activeMissions: Mission[];
  completedMissionIds: string[];
  learnedWords: LearnedWord[];
  
  // Actions
  addExperience: (amount: number) => void;
  updateStat: (stat: keyof PlayerStats, value: number) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  addMission: (mission: Mission) => void;
  completeMission: (missionId: string) => void;
  learnWord: (word: LearnedWord) => void;
  updateWordProficiency: (wordId: string, proficiency: number) => void;
}

const initialStats: PlayerStats = {
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  vocabulary: 10,
  pronunciation: 5,
  comprehension: 5,
  grammar: 5,
  confidence: 20,
  reputation: 50,
  coins: 100,
};

export const usePlayerStore = create<PlayerState>()(
  subscribeWithSelector((set, _get) => ({
    stats: initialStats,
    inventory: [],
    activeMissions: [],
    completedMissionIds: [],
    learnedWords: [],

    addExperience: (amount) => set((state) => {
      let newExp = state.stats.experience + amount;
      let newLevel = state.stats.level;
      let expToNext = state.stats.experienceToNextLevel;

      while (newExp >= expToNext) {
        newExp -= expToNext;
        newLevel++;
        expToNext = Math.floor(expToNext * 1.5);
      }

      return {
        stats: {
          ...state.stats,
          experience: newExp,
          level: newLevel,
          experienceToNextLevel: expToNext,
        },
      };
    }),

    updateStat: (stat, value) => set((state) => ({
      stats: {
        ...state.stats,
        [stat]: Math.max(0, Math.min(100, value)),
      },
    })),

    addItem: (item) => set((state) => {
      const existing = state.inventory.find((i) => i.id === item.id);
      if (existing) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { inventory: [...state.inventory, item] };
    }),

    removeItem: (itemId, quantity = 1) => set((state) => {
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item) return state;

      if (item.quantity <= quantity) {
        return { inventory: state.inventory.filter((i) => i.id !== itemId) };
      }
      return {
        inventory: state.inventory.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
        ),
      };
    }),

    addMission: (mission) => set((state) => ({
      activeMissions: [...state.activeMissions, { ...mission, status: 'active' }],
    })),

    completeMission: (missionId) => set((state) => ({
      activeMissions: state.activeMissions.filter((m) => m.id !== missionId),
      completedMissionIds: [...state.completedMissionIds, missionId],
    })),

    learnWord: (word) => set((state) => {
      const existing = state.learnedWords.find((w) => w.id === word.id);
      if (existing) return state;
      return { learnedWords: [...state.learnedWords, word] };
    }),

    updateWordProficiency: (wordId, proficiency) => set((state) => ({
      learnedWords: state.learnedWords.map((w) =>
        w.id === wordId
          ? { ...w, proficiency: Math.min(100, proficiency), lastUsed: new Date() }
          : w
      ),
    })),
  }))
);

// Game State Store
interface GameState {
  currentScene: 'menu' | 'marketplace' | 'home' | 'school';
  isPaused: boolean;
  isDialogueActive: boolean;
  currentNpcId: string | null;
  targetLanguage: LanguageConfig;
  nativeLanguage: LanguageConfig;
  
  /**
   * Whether a language transition (wind effect) is in progress
   */
  isLanguageTransitioning: boolean;
  
  /**
   * User subscription tier - determines which service implementations to use
   * FREE: Hard-coded dialogues, pattern matching
   * PREMIUM: AI-powered responses, semantic understanding, pronunciation feedback
   */
  userTier: UserTier;
  
  /**
   * Whether microphone permission has been requested/granted
   * Used to show permission modal on first interaction
   */
  micPermissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
  
  // Actions
  setScene: (scene: GameState['currentScene']) => void;
  setPaused: (paused: boolean) => void;
  startDialogue: (npcId: string) => void;
  endDialogue: () => void;
  setTargetLanguage: (config: LanguageConfig) => void;
  setLanguageWithTransition: (config: LanguageConfig) => void;
  completeLanguageTransition: () => void;
  setIsLanguageTransitioning: (transitioning: boolean) => void;
  setUserTier: (tier: UserTier) => void;
  setMicPermissionStatus: (status: GameState['micPermissionStatus']) => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set) => ({
    currentScene: 'menu',
    isPaused: false,
    isDialogueActive: false,
    currentNpcId: null,
    targetLanguage: {
      code: 'es',
      name: 'Spanish',
      speechRecognitionCode: 'es-ES',
    },
    nativeLanguage: {
      code: 'en',
      name: 'English',
      speechRecognitionCode: 'en-US',
    },
    isLanguageTransitioning: false,
    userTier: 'free', // Default to free tier
    micPermissionStatus: 'unknown',

    setScene: (scene) => set({ currentScene: scene }),
    setPaused: (paused) => set({ isPaused: paused }),
    startDialogue: (npcId) => set({ isDialogueActive: true, currentNpcId: npcId }),
    endDialogue: () => set({ isDialogueActive: false, currentNpcId: null }),
    setTargetLanguage: (config) => set({ targetLanguage: config }),
    setLanguageWithTransition: (config) => set({ 
      isLanguageTransitioning: true,
      // The actual language change happens when transition completes
    }),
    completeLanguageTransition: () => set((state) => ({
      isLanguageTransitioning: false,
      // Language was already set, just mark transition complete
    })),
    setIsLanguageTransitioning: (transitioning) => set({ isLanguageTransitioning: transitioning }),
    setUserTier: (tier) => set({ userTier: tier }),
    setMicPermissionStatus: (status) => set({ micPermissionStatus: status }),
  }))
);

// Speech State Store
interface SpeechState {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
  
  // Actions
  setListening: (listening: boolean) => void;
  setTranscript: (transcript: string, confidence: number) => void;
  setError: (error: string | null) => void;
  setSupported: (supported: boolean) => void;
  reset: () => void;
}

export const useSpeechStore = create<SpeechState>()((set) => ({
  isListening: false,
  transcript: '',
  confidence: 0,
  error: null,
  isSupported: true,

  setListening: (listening) => set({ isListening: listening }),
  setTranscript: (transcript, confidence) => set({ transcript, confidence }),
  setError: (error) => set({ error, isListening: false }),
  setSupported: (supported) => set({ isSupported: supported }),
  reset: () => set({ transcript: '', confidence: 0, error: null }),
}));

// ============================================================================
// XPIRA: SKILL PROGRESSION STORE
// Manages the new D&D-style attribute and skill system
// ============================================================================

interface SkillState {
  // Player profile with all skills
  profile: PlayerProfile;
  
  // Real-world tracking
  activities: RealWorldActivity[];
  pendingEvents: SkillEvent[]; // Events waiting to sync to stats.name
  
  // Anti-addiction
  realLifeFirst: RealLifeFirstConfig;
  sessionStartTime: Date | null;
  
  // stats.name integration
  statsName: StatsNameProfile;
  
  // Actions - XP and Progression
  addSkillXp: (skillId: string, amount: number, source: SkillSource) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  
  // Actions - Real World
  logActivity: (activity: Omit<RealWorldActivity, 'id'>) => void;
  verifyActivity: (activityId: string) => void;
  
  // Actions - Anti-addiction
  startSession: () => void;
  endSession: () => void;
  addRealWorldUnlock: (minutes: number) => void;
  
  // Actions - stats.name
  connectStatsName: (userId: string, username: string) => void;
  disconnectStatsName: () => void;
  syncToStatsName: () => Promise<void>;
  
  // Actions - Profile
  updateUsername: (username: string) => void;
  recalculateAttributes: () => void;
}

/**
 * Calculate attribute score (1-20) from related skill levels
 */
function calculateAttributeScore(
  skills: Record<string, SkillProgress>,
  attribute: Attribute
): number {
  const attributeSkills = Object.entries(SKILLS)
    .filter(([_, skill]) => skill.attribute === attribute)
    .map(([id]) => skills[id])
    .filter(Boolean);
  
  if (attributeSkills.length === 0) return 10; // Default D&D score
  
  // Average of all skill levels under this attribute, scaled to 1-20
  const avgLevel = attributeSkills.reduce((sum, s) => sum + s.level, 0) / attributeSkills.length;
  return Math.max(1, Math.min(20, Math.round(avgLevel / 5)));
}

/**
 * Calculate XP needed for next level
 */
function xpForNextLevel(currentLevel: number, baseXp: number = 100): number {
  return Math.floor(baseXp * Math.pow(1.5, currentLevel - 1));
}

const initialProfile: PlayerProfile = {
  id: crypto.randomUUID(),
  username: 'Adventurer',
  createdAt: new Date(),
  totalLevel: 1,
  totalXp: 0,
  attributes: {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  },
  skills: {},
  coins: 100,
  realWorldActivities: [],
  currentStreak: 0,
  longestStreak: 0,
  dailyPlayTime: 0,
  dailyPlayLimit: 60,
  realWorldUnlocks: 0,
};

const initialRealLifeFirst: RealLifeFirstConfig = {
  dailyPlayLimitMinutes: 60,
  realWorldMultiplier: 2.0,
  realWorldUnlockMinutes: 15,
  touchGrassEnabled: false, // Off by default
  touchGrassMinutes: 10,
  realWorldNudgeFrequency: 30,
};

const initialStatsName: StatsNameProfile = {
  connected: false,
  syncEnabled: true,
  syncSkills: true,
  syncAchievements: true,
  syncRealWorld: false, // Privacy default
};

export const useSkillStore = create<SkillState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      profile: initialProfile,
      activities: [],
      pendingEvents: [],
      realLifeFirst: initialRealLifeFirst,
      sessionStartTime: null,
      statsName: initialStatsName,

      addSkillXp: (skillId, amount, source) => set((state) => {
        const skill = SKILLS[skillId];
        if (!skill) {
          console.warn(`Unknown skill: ${skillId}`);
          return state;
        }

        // Get or create skill progress
        const currentProgress = state.profile.skills[skillId] || {
          skillId,
          level: 1,
          currentXp: 0,
          totalXp: 0,
          streakDays: 0,
          sourceBreakdown: {},
        };

        // Apply real-world multiplier if applicable
        const multiplier = source === 'real-world' ? state.realLifeFirst.realWorldMultiplier : 1;
        const adjustedAmount = Math.floor(amount * multiplier);

        // Calculate new XP and potential level ups
        let newXp = currentProgress.currentXp + adjustedAmount;
        let newLevel = currentProgress.level;
        let xpNeeded = xpForNextLevel(newLevel, skill.xpPerLevel);

        while (newXp >= xpNeeded && newLevel < skill.maxLevel) {
          newXp -= xpNeeded;
          newLevel++;
          xpNeeded = xpForNextLevel(newLevel, skill.xpPerLevel);
        }

        // Update source breakdown
        const sourceBreakdown = { ...currentProgress.sourceBreakdown };
        sourceBreakdown[source] = (sourceBreakdown[source] || 0) + adjustedAmount;

        // Create skill event
        const event: SkillEvent = {
          id: crypto.randomUUID(),
          skillId,
          timestamp: new Date(),
          eventType: newLevel > currentProgress.level ? 'level-up' : 'xp-gain',
          xpAmount: adjustedAmount,
          source,
          synced: false,
        };

        const updatedSkills = {
          ...state.profile.skills,
          [skillId]: {
            ...currentProgress,
            level: newLevel,
            currentXp: newXp,
            totalXp: currentProgress.totalXp + adjustedAmount,
            lastPracticed: new Date(),
            sourceBreakdown,
          },
        };

        // Recalculate total XP and level
        const totalXp = Object.values(updatedSkills).reduce((sum, s) => sum + s.totalXp, 0);
        const totalLevel = Math.floor(totalXp / 1000) + 1; // Simple formula for now

        return {
          profile: {
            ...state.profile,
            skills: updatedSkills,
            totalXp,
            totalLevel,
          },
          pendingEvents: [...state.pendingEvents, event],
        };
      }),

      setSkillLevel: (skillId, level) => set((state) => ({
        profile: {
          ...state.profile,
          skills: {
            ...state.profile.skills,
            [skillId]: {
              ...state.profile.skills[skillId],
              skillId,
              level: Math.max(1, Math.min(100, level)),
              currentXp: 0,
              totalXp: state.profile.skills[skillId]?.totalXp || 0,
              streakDays: state.profile.skills[skillId]?.streakDays || 0,
              sourceBreakdown: state.profile.skills[skillId]?.sourceBreakdown || {},
            },
          },
        },
      })),

      logActivity: (activityData) => set((state) => {
        const activity: RealWorldActivity = {
          ...activityData,
          id: crypto.randomUUID(),
        };

        // Award XP for the activity
        const xpAwarded = activity.xpAwarded || 10;
        
        return {
          activities: [...state.activities, activity],
          profile: {
            ...state.profile,
            realWorldActivities: [...state.profile.realWorldActivities, activity],
          },
        };
      }),

      verifyActivity: (activityId) => set((state) => ({
        activities: state.activities.map((a) =>
          a.id === activityId ? { ...a, verified: true } : a
        ),
      })),

      startSession: () => set({
        sessionStartTime: new Date(),
      }),

      endSession: () => set((state) => {
        if (!state.sessionStartTime) return state;
        
        const sessionMinutes = Math.floor(
          (Date.now() - state.sessionStartTime.getTime()) / 60000
        );
        
        return {
          sessionStartTime: null,
          profile: {
            ...state.profile,
            dailyPlayTime: state.profile.dailyPlayTime + sessionMinutes,
          },
        };
      }),

      addRealWorldUnlock: (minutes) => set((state) => ({
        profile: {
          ...state.profile,
          realWorldUnlocks: state.profile.realWorldUnlocks + minutes,
        },
      })),

      connectStatsName: (userId, username) => set((state) => ({
        statsName: {
          ...state.statsName,
          connected: true,
          userId,
          username,
          publicUrl: `https://stats.name/${username}`,
        },
      })),

      disconnectStatsName: () => set({
        statsName: initialStatsName,
      }),

      syncToStatsName: async () => {
        const state = get();
        if (!state.statsName.connected) return;

        // TODO: Implement actual API sync
        console.log('Syncing to stats.name:', state.pendingEvents.length, 'events');
        
        // Mark events as synced
        set({
          pendingEvents: [],
          statsName: {
            ...state.statsName,
            lastSynced: new Date(),
          },
        });
      },

      updateUsername: (username) => set((state) => ({
        profile: {
          ...state.profile,
          username,
        },
      })),

      recalculateAttributes: () => set((state) => {
        const attributes: Record<Attribute, number> = {
          STR: calculateAttributeScore(state.profile.skills, 'STR'),
          DEX: calculateAttributeScore(state.profile.skills, 'DEX'),
          CON: calculateAttributeScore(state.profile.skills, 'CON'),
          INT: calculateAttributeScore(state.profile.skills, 'INT'),
          WIS: calculateAttributeScore(state.profile.skills, 'WIS'),
          CHA: calculateAttributeScore(state.profile.skills, 'CHA'),
        };

        return {
          profile: {
            ...state.profile,
            attributes,
          },
        };
      }),
    })),
    {
      name: 'xpira-skills', // localStorage key
      partialize: (state) => ({
        profile: state.profile,
        activities: state.activities,
        statsName: state.statsName,
        realLifeFirst: state.realLifeFirst,
      }),
    }
  )
);