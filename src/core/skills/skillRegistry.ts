/**
 * Skill Registry
 * 
 * Defines the complete skill taxonomy for Xpira.
 * Skills are organized hierarchically under the 6 D&D attributes.
 * 
 * MVP Domains:
 * - Languages (INT) - Current functionality
 * - Physical (STR/CON) - Steps, workouts
 * - Cognitive (INT) - Mental math, memory
 */

import type { SkillNode, Attribute } from '../types';

// ============================================================================
// SKILL DEFINITIONS
// ============================================================================

/**
 * All skills in the system, keyed by ID
 */
export const SKILLS: Record<string, SkillNode> = {
  // -------------------------------------------------------------------------
  // INTELLIGENCE: Languages
  // -------------------------------------------------------------------------
  'languages': {
    id: 'languages',
    name: 'Languages',
    description: 'Communication in foreign languages',
    icon: '🌍',
    attribute: 'INT',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
    children: ['spanish', 'french', 'german', 'italian', 'portuguese', 'japanese'],
  },
  
  'spanish': {
    id: 'spanish',
    name: 'Spanish',
    description: 'Español - spoken by 500M+ people worldwide',
    icon: '🇪🇸',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
    children: ['spanish-vocabulary', 'spanish-pronunciation', 'spanish-grammar', 'spanish-comprehension'],
  },
  
  'spanish-vocabulary': {
    id: 'spanish-vocabulary',
    name: 'Vocabulary',
    description: 'Spanish word knowledge',
    icon: '📚',
    attribute: 'INT',
    parentId: 'spanish',
    maxLevel: 100,
    xpPerLevel: 50,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['text-input', 'multiple-choice', 'speech'],
    hasInGameScene: true,
    realWorldTrackable: true,
  },
  
  'spanish-pronunciation': {
    id: 'spanish-pronunciation',
    name: 'Pronunciation',
    description: 'Spanish speaking clarity',
    icon: '🎤',
    attribute: 'INT',
    parentId: 'spanish',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech'],
    hasInGameScene: true,
    realWorldTrackable: true,
  },
  
  'spanish-grammar': {
    id: 'spanish-grammar',
    name: 'Grammar',
    description: 'Spanish sentence structure',
    icon: '📝',
    attribute: 'INT',
    parentId: 'spanish',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['web', 'mobile'],
    trackingMethods: ['text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: false,
  },
  
  'spanish-comprehension': {
    id: 'spanish-comprehension',
    name: 'Comprehension',
    description: 'Spanish listening and understanding',
    icon: '👂',
    attribute: 'INT',
    parentId: 'spanish',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['multiple-choice', 'text-input'],
    hasInGameScene: true,
    realWorldTrackable: true,
  },
  
  'french': {
    id: 'french',
    name: 'French',
    description: 'Français - the language of love',
    icon: '🇫🇷',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
    children: ['french-vocabulary', 'french-pronunciation', 'french-grammar', 'french-comprehension'],
  },
  
  'german': {
    id: 'german',
    name: 'German',
    description: 'Deutsch - precision and engineering',
    icon: '🇩🇪',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
  },
  
  'italian': {
    id: 'italian',
    name: 'Italian',
    description: 'Italiano - art, music, and cuisine',
    icon: '🇮🇹',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
  },
  
  'portuguese': {
    id: 'portuguese',
    name: 'Portuguese',
    description: 'Português - Brazil and beyond',
    icon: '🇧🇷',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
  },
  
  'japanese': {
    id: 'japanese',
    name: 'Japanese',
    description: '日本語 - anime, tech, and tradition',
    icon: '🇯🇵',
    attribute: 'INT',
    parentId: 'languages',
    maxLevel: 100,
    xpPerLevel: 150, // Harder language
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['speech', 'text-input', 'multiple-choice'],
    hasInGameScene: true,
    realWorldTrackable: true,
    integrationSources: ['duolingo'],
  },

  // -------------------------------------------------------------------------
  // INTELLIGENCE: Cognitive Skills (MVP)
  // -------------------------------------------------------------------------
  'cognitive': {
    id: 'cognitive',
    name: 'Cognitive Skills',
    description: 'Mental agility and reasoning',
    icon: '🧠',
    attribute: 'INT',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['text-input', 'multiple-choice', 'timed-challenge'],
    hasInGameScene: true,
    realWorldTrackable: false,
    children: ['mental-math', 'memory', 'logic'],
  },
  
  'mental-math': {
    id: 'mental-math',
    name: 'Mental Math',
    description: 'Quick calculations without a calculator',
    icon: '🔢',
    attribute: 'INT',
    parentId: 'cognitive',
    maxLevel: 100,
    xpPerLevel: 50,
    platforms: ['web', 'mobile', 'audio'],
    trackingMethods: ['text-input', 'timed-challenge'],
    hasInGameScene: true,
    realWorldTrackable: false,
  },
  
  'memory': {
    id: 'memory',
    name: 'Memory',
    description: 'Recall and retention',
    icon: '🧩',
    attribute: 'INT',
    parentId: 'cognitive',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['web', 'mobile'],
    trackingMethods: ['multiple-choice', 'timed-challenge'],
    hasInGameScene: true,
    realWorldTrackable: false,
  },
  
  'logic': {
    id: 'logic',
    name: 'Logic',
    description: 'Puzzles and reasoning',
    icon: '🔮',
    attribute: 'INT',
    parentId: 'cognitive',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile'],
    trackingMethods: ['multiple-choice', 'timed-challenge'],
    hasInGameScene: true,
    realWorldTrackable: false,
  },

  // -------------------------------------------------------------------------
  // STRENGTH: Physical Fitness (MVP)
  // -------------------------------------------------------------------------
  'fitness': {
    id: 'fitness',
    name: 'Fitness',
    description: 'Physical strength and endurance',
    icon: '💪',
    attribute: 'STR',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile'],
    trackingMethods: ['manual-log', 'device-sync'],
    hasInGameScene: false, // Real-world focused
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'strava', 'fitbit'],
    children: ['walking', 'running', 'strength-training', 'cardio'],
  },
  
  'walking': {
    id: 'walking',
    name: 'Walking',
    description: 'Daily step count and walks',
    icon: '🚶',
    attribute: 'STR',
    parentId: 'fitness',
    maxLevel: 100,
    xpPerLevel: 25, // Lower barrier
    platforms: ['mobile'], // Needs device
    trackingMethods: ['device-sync', 'manual-log'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'google-fit'],
  },
  
  'running': {
    id: 'running',
    name: 'Running',
    description: 'Jogs, runs, and races',
    icon: '🏃',
    attribute: 'STR',
    parentId: 'fitness',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['mobile'],
    trackingMethods: ['device-sync', 'manual-log', 'gps-checkin'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'strava', 'nike-run'],
  },
  
  'strength-training': {
    id: 'strength-training',
    name: 'Strength Training',
    description: 'Weight lifting and resistance',
    icon: '🏋️',
    attribute: 'STR',
    parentId: 'fitness',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile'],
    trackingMethods: ['manual-log', 'device-sync'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'strong-app'],
  },
  
  'cardio': {
    id: 'cardio',
    name: 'Cardio',
    description: 'Heart-pumping exercises',
    icon: '❤️‍🔥',
    attribute: 'STR',
    parentId: 'fitness',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['mobile'],
    trackingMethods: ['device-sync', 'manual-log'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'strava'],
  },

  // -------------------------------------------------------------------------
  // CONSTITUTION: Health (MVP)
  // -------------------------------------------------------------------------
  'health': {
    id: 'health',
    name: 'Health',
    description: 'Overall well-being and habits',
    icon: '❤️',
    attribute: 'CON',
    maxLevel: 100,
    xpPerLevel: 100,
    platforms: ['web', 'mobile'],
    trackingMethods: ['manual-log', 'device-sync'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health'],
    children: ['sleep', 'nutrition', 'hydration'],
  },
  
  'sleep': {
    id: 'sleep',
    name: 'Sleep',
    description: 'Quality rest and recovery',
    icon: '😴',
    attribute: 'CON',
    parentId: 'health',
    maxLevel: 100,
    xpPerLevel: 50,
    platforms: ['mobile'],
    trackingMethods: ['device-sync', 'manual-log'],
    hasInGameScene: false,
    realWorldTrackable: true,
    integrationSources: ['apple-health', 'oura', 'whoop'],
  },
  
  'nutrition': {
    id: 'nutrition',
    name: 'Nutrition',
    description: 'Healthy eating habits',
    icon: '🥗',
    attribute: 'CON',
    parentId: 'health',
    maxLevel: 100,
    xpPerLevel: 75,
    platforms: ['web', 'mobile'],
    trackingMethods: ['manual-log', 'photo-proof'],
    hasInGameScene: true, // Cooking minigame potential
    realWorldTrackable: true,
    integrationSources: ['myfitnesspal'],
  },
  
  'hydration': {
    id: 'hydration',
    name: 'Hydration',
    description: 'Staying well-hydrated',
    icon: '💧',
    attribute: 'CON',
    parentId: 'health',
    maxLevel: 100,
    xpPerLevel: 25,
    platforms: ['mobile'],
    trackingMethods: ['manual-log'],
    hasInGameScene: false,
    realWorldTrackable: true,
  },
};

// ============================================================================
// SKILL REGISTRY FUNCTIONS
// ============================================================================

/**
 * Get a skill by ID
 */
export function getSkill(skillId: string): SkillNode | undefined {
  return SKILLS[skillId];
}

/**
 * Get all root skills (no parent)
 */
export function getRootSkills(): SkillNode[] {
  return Object.values(SKILLS).filter(skill => !skill.parentId);
}

/**
 * Get all skills under a specific attribute
 */
export function getSkillsByAttribute(attribute: Attribute): SkillNode[] {
  return Object.values(SKILLS).filter(skill => skill.attribute === attribute);
}

/**
 * Get child skills of a parent
 */
export function getChildSkills(parentId: string): SkillNode[] {
  return Object.values(SKILLS).filter(skill => skill.parentId === parentId);
}

/**
 * Get the full path to a skill (e.g., ["languages", "spanish", "vocabulary"])
 */
export function getSkillPath(skillId: string): string[] {
  const path: string[] = [];
  let current = SKILLS[skillId];
  
  while (current) {
    path.unshift(current.id);
    current = current.parentId ? SKILLS[current.parentId] : undefined;
  }
  
  return path;
}

/**
 * Get all skills that support a specific platform
 */
export function getSkillsForPlatform(platform: 'web' | 'mobile' | 'audio'): SkillNode[] {
  return Object.values(SKILLS).filter(skill => skill.platforms.includes(platform));
}

/**
 * Get all skills that can be tracked via real-world activities
 */
export function getRealWorldTrackableSkills(): SkillNode[] {
  return Object.values(SKILLS).filter(skill => skill.realWorldTrackable);
}

/**
 * Get all skills with in-game scenes
 */
export function getInGameSkills(): SkillNode[] {
  return Object.values(SKILLS).filter(skill => skill.hasInGameScene);
}

/**
 * Calculate total skills count
 */
export function getTotalSkillsCount(): number {
  return Object.keys(SKILLS).length;
}

/**
 * Get leaf skills (skills with no children)
 */
export function getLeafSkills(): SkillNode[] {
  return Object.values(SKILLS).filter(skill => !skill.children || skill.children.length === 0);
}
