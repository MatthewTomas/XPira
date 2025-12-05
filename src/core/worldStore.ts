/**
 * World Store - State for the explorable game world
 * 
 * Manages player position in the world, unlocked buildings,
 * current location (overworld vs inside a building), and settings.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Building definitions
export type BuildingId = 
  | 'home'           // Player's home - spawn point
  | 'town-hall'      // Profile, achievements
  | 'marketplace'    // Languages (INT)
  | 'library'        // Cognitive skills (INT)
  | 'gym'            // Fitness (STR)
  | 'clinic'         // Health (CON)
  | 'park'           // Outdoor activities (DEX)
  | 'temple'         // Mindfulness, wisdom (WIS)
  | 'plaza'          // Social skills (CHA);

export interface Building {
  id: BuildingId;
  name: string;
  icon: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  attribute?: string;        // Which D&D attribute this building trains
  skillCategories?: string[]; // Which skill categories are practiced here
  unlockCondition: {
    type: 'start' | 'level' | 'activity' | 'explore';
    value?: number | string;
    description: string;
  };
}

// All buildings in the world
// 64x64 world layout:
// - Main Street (downtown): x=30-33, y=25-40
// - Residential: y=15-24 (side streets branching from main)
// - Forest: y>=50
// - Mountains: y>=48, x<20
// - Beach: y>=55, x>=45
export const BUILDINGS: Record<BuildingId, Building> = {
  'home': {
    id: 'home',
    name: 'Your Home',
    icon: '🏠',
    description: 'Rest, save, and customize your character',
    position: { x: 25, y: 18 },  // Residential street, north of downtown
    size: { width: 2, height: 2 },
    unlockCondition: { type: 'start', description: 'Always available' },
  },
  'town-hall': {
    id: 'town-hall',
    name: 'Town Hall',
    icon: '🏛️',
    description: 'View achievements, stats, and quests',
    position: { x: 30, y: 26 },  // Top of Main Street (downtown center)
    size: { width: 3, height: 2 },
    unlockCondition: { type: 'start', description: 'Always available' },
  },
  'marketplace': {
    id: 'marketplace',
    name: 'El Mercado',
    icon: '🏪',
    description: 'Practice languages with friendly vendors',
    position: { x: 30, y: 30 },  // Main Street, downtown
    size: { width: 3, height: 2 },
    attribute: 'INT',
    skillCategories: ['languages'],
    unlockCondition: { type: 'start', description: 'Always available' },
  },
  'library': {
    id: 'library',
    name: 'Library',
    icon: '📚',
    description: 'Train cognitive skills: math, memory, logic',
    position: { x: 35, y: 28 },  // East side of Main Street
    size: { width: 2, height: 2 },
    attribute: 'INT',
    skillCategories: ['cognitive'],
    unlockCondition: { type: 'level', value: 5, description: 'Reach total level 5' },
  },
  'gym': {
    id: 'gym',
    name: 'Fitness Center',
    icon: '🏋️',
    description: 'Track workouts and physical activities',
    position: { x: 38, y: 18 },  // East residential area
    size: { width: 2, height: 2 },
    attribute: 'STR',
    skillCategories: ['fitness'],
    unlockCondition: { type: 'activity', value: 'first-real-world', description: 'Log your first real-world activity' },
  },
  'clinic': {
    id: 'clinic',
    name: 'Wellness Clinic',
    icon: '🏥',
    description: 'Track health habits: sleep, nutrition, hydration',
    position: { x: 35, y: 34 },  // Main Street, south downtown
    size: { width: 2, height: 2 },
    attribute: 'CON',
    skillCategories: ['health'],
    unlockCondition: { type: 'level', value: 10, description: 'Reach total level 10' },
  },
  'park': {
    id: 'park',
    name: 'Village Park',
    icon: '🌳',
    description: 'Outdoor activities and nature walks',
    position: { x: 40, y: 40 },  // East side, transition to wilderness
    size: { width: 3, height: 3 },
    attribute: 'DEX',
    skillCategories: ['outdoor'],
    unlockCondition: { type: 'explore', value: 'forest-path', description: 'Discover the forest path' },
  },
  'temple': {
    id: 'temple',
    name: 'Meditation Temple',
    icon: '⛩️',
    description: 'Mindfulness, meditation, and wisdom practices',
    position: { x: 15, y: 45 },  // Secluded, near mountain/forest edge
    size: { width: 2, height: 2 },
    attribute: 'WIS',
    skillCategories: ['mindfulness'],
    unlockCondition: { type: 'level', value: 15, description: 'Reach total level 15' },
  },
  'plaza': {
    id: 'plaza',
    name: 'Social Plaza',
    icon: '🎭',
    description: 'Practice social and communication skills',
    position: { x: 30, y: 38 },  // Main Street, south of marketplace
    size: { width: 3, height: 2 },
    attribute: 'CHA',
    skillCategories: ['social'],
    unlockCondition: { type: 'level', value: 8, description: 'Reach total level 8' },
  },
};

// Default unlocked buildings
const DEFAULT_UNLOCKED: BuildingId[] = ['home', 'town-hall', 'marketplace'];

// Get today's date as a string for daily spawn tracking
function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

interface WorldState {
  // Player position in the overworld
  playerPosition: { x: number; y: number };
  
  // Which building the player is currently inside (null = overworld)
  currentBuilding: BuildingId | null;
  
  // Which room in the home (for home interior tracking)
  currentHomeRoom: string | null;
  
  // Unlocked buildings
  unlockedBuildings: BuildingId[];
  
  // Areas the player has explored (for fog of war)
  exploredTiles: Set<string>; // "x,y" format
  
  // Daily tracking for spawn-at-home
  lastLoginDate: string | null;
  
  // Settings
  teleportEnabled: boolean;
  showMinimap: boolean;
  
  // Actions
  movePlayer: (x: number, y: number) => void;
  enterBuilding: (buildingId: BuildingId) => void;
  exitBuilding: () => void;
  unlockBuilding: (buildingId: BuildingId) => void;
  exploreTile: (x: number, y: number) => void;
  setTeleportEnabled: (enabled: boolean) => void;
  teleportTo: (buildingId: BuildingId) => void;
  checkDailySpawn: () => boolean; // Returns true if this is first login of day
  setHomeRoom: (room: string | null) => void;
  
  // Queries
  isBuildingUnlocked: (buildingId: BuildingId) => boolean;
  getBuildingAt: (x: number, y: number) => Building | null;
}

export const useWorldStore = create<WorldState>()(
  persist(
    (set, get) => ({
      // Initial state
      playerPosition: { x: 25, y: 20 }, // Start near home (residential street)
      currentBuilding: null,
      currentHomeRoom: null,
      unlockedBuildings: [...DEFAULT_UNLOCKED],
      exploredTiles: new Set<string>(),
      lastLoginDate: null,
      teleportEnabled: true, // Respect user's time by default
      showMinimap: true,
      
      // Actions
      movePlayer: (x, y) => {
        set({ playerPosition: { x, y } });
        // Auto-explore tiles as player moves
        get().exploreTile(x, y);
      },
      
      enterBuilding: (buildingId) => {
        if (get().isBuildingUnlocked(buildingId)) {
          set({ currentBuilding: buildingId });
          // If entering home, set to bedroom by default
          if (buildingId === 'home') {
            set({ currentHomeRoom: 'bedroom' });
          }
        }
      },
      
      exitBuilding: () => {
        const building = get().currentBuilding;
        if (building) {
          const buildingData = BUILDINGS[building];
          // Place player just outside the building
          set({ 
            currentBuilding: null,
            currentHomeRoom: null,
            playerPosition: { 
              x: buildingData.position.x, 
              y: buildingData.position.y + buildingData.size.height 
            }
          });
        }
      },
      
      unlockBuilding: (buildingId) => {
        const current = get().unlockedBuildings;
        if (!current.includes(buildingId)) {
          set({ unlockedBuildings: [...current, buildingId] });
        }
      },
      
      exploreTile: (x, y) => {
        const key = `${x},${y}`;
        const explored = get().exploredTiles;
        if (!explored.has(key)) {
          const newExplored = new Set(explored);
          // Explore a 3x3 area around the player
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              newExplored.add(`${x + dx},${y + dy}`);
            }
          }
          set({ exploredTiles: newExplored });
        }
      },
      
      setTeleportEnabled: (enabled) => set({ teleportEnabled: enabled }),
      
      teleportTo: (buildingId) => {
        if (get().teleportEnabled && get().isBuildingUnlocked(buildingId)) {
          const building = BUILDINGS[buildingId];
          set({ 
            playerPosition: { 
              x: building.position.x, 
              y: building.position.y + building.size.height 
            },
            currentBuilding: null,
            currentHomeRoom: null,
          });
        }
      },
      
      checkDailySpawn: () => {
        const today = getTodayString();
        const lastLogin = get().lastLoginDate;
        
        if (lastLogin !== today) {
          // First login of the day - spawn at home bedroom
          set({ 
            lastLoginDate: today,
            currentBuilding: 'home',
            currentHomeRoom: 'bedroom',
          });
          return true;
        }
        return false;
      },
      
      setHomeRoom: (room) => set({ currentHomeRoom: room }),
      
      // Queries
      isBuildingUnlocked: (buildingId) => {
        return get().unlockedBuildings.includes(buildingId);
      },
      
      getBuildingAt: (x, y) => {
        for (const building of Object.values(BUILDINGS)) {
          if (
            x >= building.position.x &&
            x < building.position.x + building.size.width &&
            y >= building.position.y &&
            y < building.position.y + building.size.height
          ) {
            return building;
          }
        }
        return null;
      },
    }),
    {
      name: 'xpira-world',
      // Custom serialization for Set
      partialize: (state) => ({
        playerPosition: state.playerPosition,
        currentBuilding: state.currentBuilding,
        currentHomeRoom: state.currentHomeRoom,
        unlockedBuildings: state.unlockedBuildings,
        exploredTiles: Array.from(state.exploredTiles),
        lastLoginDate: state.lastLoginDate,
        teleportEnabled: state.teleportEnabled,
        showMinimap: state.showMinimap,
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...persisted,
        exploredTiles: new Set(persisted?.exploredTiles || []),
      }),
    }
  )
);
