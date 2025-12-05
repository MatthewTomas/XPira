/**
 * GameWorld - The main explorable 2D tiny planet town
 * 
 * A persistent world shaped like a tiny planet (Little Prince style):
 * - Walk around with WASD/arrows
 * - World wraps around when you reach edges
 * - Downtown with Main St, residential streets, wilderness
 * - Enter buildings to practice skills
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useWorldStore, BUILDINGS, type BuildingId } from '../core/worldStore';
import { useGameStore } from '../core/stores';
import { useDialogueStore } from '../features/dialogue/dialogueStore';
import { playSound } from '../features/audio';
import { Marketplace2D } from './Marketplace2D';
import { Home2D } from './Home2D';
import { getPlaceTranslation } from '../core/placeTranslations';

// World dimensions - larger for a proper town
const WORLD_WIDTH = 64;
const WORLD_HEIGHT = 64;
const TILE_SIZE = 40;
const VIEWPORT_TILES_X = 17;
const VIEWPORT_TILES_Y = 13;

// Extended tile types for the town
type TileType = 
  | 'grass' 
  | 'path' 
  | 'road'
  | 'sidewalk'
  | 'water' 
  | 'sand'
  | 'flowers' 
  | 'tree' 
  | 'forest'
  | 'rock'
  | 'mountain';

// District definitions for the town
interface District {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  primaryTile: TileType;
}

const DISTRICTS: Record<string, District> = {
  downtown: { name: 'Downtown', x: 24, y: 24, width: 16, height: 16, primaryTile: 'sidewalk' },
  residential: { name: 'Residential', x: 8, y: 28, width: 12, height: 12, primaryTile: 'grass' },
  park: { name: 'Park', x: 44, y: 28, width: 10, height: 10, primaryTile: 'grass' },
  forest: { name: 'Forest', x: 0, y: 0, width: 20, height: 20, primaryTile: 'forest' },
  beach: { name: 'Beach', x: 48, y: 0, width: 16, height: 16, primaryTile: 'sand' },
  mountains: { name: 'Mountains', x: 0, y: 48, width: 20, height: 16, primaryTile: 'mountain' },
};

// Generate world tiles with town layout
function generateWorldTiles(): TileType[][] {
  const tiles: TileType[][] = [];
  
  // Initialize with default grass
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    tiles[y] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      tiles[y][x] = 'grass';
    }
  }
  
  // Apply district base tiles
  for (const district of Object.values(DISTRICTS)) {
    for (let dy = 0; dy < district.height; dy++) {
      for (let dx = 0; dx < district.width; dx++) {
        const x = (district.x + dx) % WORLD_WIDTH;
        const y = (district.y + dy) % WORLD_HEIGHT;
        tiles[y][x] = district.primaryTile;
      }
    }
  }
  
  // Main Street (horizontal through downtown)
  for (let x = 0; x < WORLD_WIDTH; x++) {
    tiles[32][x] = 'road';
    tiles[33][x] = 'road';
    if (x >= 24 && x < 40) {
      tiles[31][x] = 'sidewalk';
      tiles[34][x] = 'sidewalk';
    }
  }
  
  // Cross streets
  for (let y = 20; y < 44; y++) {
    tiles[y][32] = 'road';
    tiles[y][33] = 'road';
    if (y >= 24 && y < 40) {
      tiles[y][31] = 'sidewalk';
      tiles[y][34] = 'sidewalk';
    }
  }
  
  // Residential street (where home is)
  for (let x = 8; x < 24; x++) {
    tiles[34][x] = 'road';
    tiles[35][x] = 'sidewalk';
  }
  
  // Path through forest
  for (let i = 0; i < 20; i++) {
    const x = i;
    const y = Math.floor(10 + Math.sin(i / 3) * 3);
    if (y >= 0 && y < WORLD_HEIGHT) {
      tiles[y][x] = 'path';
    }
  }
  
  // Beach waterfront
  for (let x = 48; x < 64; x++) {
    for (let y = 0; y < 6; y++) {
      tiles[y][x] = 'water';
    }
  }
  
  // Add trees to forest
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      if (tiles[y][x] === 'forest' && Math.random() > 0.5) {
        tiles[y][x] = 'tree';
      }
    }
  }
  
  // Add flowers randomly in park
  for (let y = 28; y < 38; y++) {
    for (let x = 44; x < 54; x++) {
      if (tiles[y][x] === 'grass' && Math.random() > 0.8) {
        tiles[y][x] = 'flowers';
      }
    }
  }
  
  // Add rocks to mountains
  for (let y = 48; y < 64; y++) {
    for (let x = 0; x < 20; x++) {
      if (tiles[y][x] === 'mountain' && Math.random() > 0.7) {
        tiles[y][x] = 'rock';
      }
    }
  }
  
  // Pond in the park
  for (let y = 30; y < 34; y++) {
    for (let x = 46; x < 50; x++) {
      tiles[y][x] = 'water';
    }
  }
  
  return tiles;
}

// Pre-generate tiles (stable across renders)
const WORLD_TILES = generateWorldTiles();

// Get tile visuals
function getTileEmoji(type: TileType): string {
  switch (type) {
    case 'grass': return '';
    case 'path': return '';
    case 'road': return '';
    case 'sidewalk': return '';
    case 'water': return '💧';
    case 'sand': return '';
    case 'flowers': return '🌸';
    case 'tree': return '🌳';
    case 'forest': return '🌲';
    case 'rock': return '🪨';
    case 'mountain': return '⛰️';
  }
}

function getTileBackground(type: TileType): string {
  switch (type) {
    case 'grass': return 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)';
    case 'path': return 'linear-gradient(135deg, #d4a373 0%, #bc8f5f 100%)';
    case 'road': return 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%)';
    case 'sidewalk': return 'linear-gradient(135deg, #d1d5db 0%, #bfc4ca 100%)';
    case 'water': return 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)';
    case 'sand': return 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)';
    case 'flowers': return 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)';
    case 'tree': return 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)';
    case 'forest': return 'linear-gradient(135deg, #166534 0%, #14532d 100%)';
    case 'rock': return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
    case 'mountain': return 'linear-gradient(135deg, #78716c 0%, #57534e 100%)';
  }
}

// Wrap coordinate for tiny planet effect
function wrapCoord(val: number, max: number): number {
  return ((val % max) + max) % max;
}

// Check if tile is walkable (with wrapping)
function isWalkable(x: number, y: number): boolean {
  // Wrap coordinates for tiny planet
  const wx = wrapCoord(x, WORLD_WIDTH);
  const wy = wrapCoord(y, WORLD_HEIGHT);
  
  const tile = WORLD_TILES[wy]?.[wx];
  if (!tile) return false;
  
  // Non-walkable tiles
  if (tile === 'water' || tile === 'tree' || tile === 'rock' || tile === 'mountain') {
    return false;
  }
  
  // Check building collisions (can walk on entrance tiles)
  for (const building of Object.values(BUILDINGS)) {
    const bx = building.position.x;
    const by = building.position.y;
    const bw = building.size.width;
    const bh = building.size.height;
    
    // Building body (not entrance) is not walkable
    if (wx >= bx && wx < bx + bw && wy >= by && wy < by + bh - 1) {
      return false;
    }
  }
  
  return true;
}

interface GameWorldProps {
  onOpenStats: () => void;
  onOpenTeleport: () => void;
}

export function GameWorld({ onOpenStats, onOpenTeleport }: GameWorldProps) {
  const {
    playerPosition,
    currentBuilding,
    currentHomeRoom,
    unlockedBuildings,
    exploredTiles,
    movePlayer,
    enterBuilding,
    exitBuilding,
    isBuildingUnlocked,
    checkDailySpawn,
  } = useWorldStore();
  
  const targetLanguage = useGameStore((state) => state.targetLanguage);
  const isDialogueActive = useDialogueStore((state) => state.isActive);
  const lastMoveTime = useRef(0);
  const [nearbyBuilding, setNearbyBuilding] = useState<BuildingId | null>(null);
  
  // Refs to avoid stale closures in keyboard handler
  const playerPosRef = useRef(playerPosition);
  const currentBuildingRef = useRef(currentBuilding);
  const isDialogueActiveRef = useRef(isDialogueActive);
  const nearbyBuildingRef = useRef(nearbyBuilding);
  
  // Keep refs in sync with state
  useEffect(() => { playerPosRef.current = playerPosition; }, [playerPosition]);
  useEffect(() => { currentBuildingRef.current = currentBuilding; }, [currentBuilding]);
  useEffect(() => { isDialogueActiveRef.current = isDialogueActive; }, [isDialogueActive]);
  useEffect(() => { nearbyBuildingRef.current = nearbyBuilding; }, [nearbyBuilding]);
  
  // Check for daily spawn on mount
  useEffect(() => {
    checkDailySpawn();
  }, [checkDailySpawn]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use refs to get current values (avoids stale closure issues)
      if (isDialogueActiveRef.current || currentBuildingRef.current) return;
      
      // Throttle movement
      const now = Date.now();
      if (now - lastMoveTime.current < 100) return;
      
      const pos = playerPosRef.current;
      let newX = pos.x;
      let newY = pos.y;
      
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          newY = pos.y - 1;
          break;
        case 'KeyS':
        case 'ArrowDown':
          newY = pos.y + 1;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          newX = pos.x - 1;
          break;
        case 'KeyD':
        case 'ArrowRight':
          newX = pos.x + 1;
          break;
        case 'KeyE':
        case 'Space':
        case 'Enter':
          // Enter nearby building
          const nearby = nearbyBuildingRef.current;
          if (nearby && isBuildingUnlocked(nearby)) {
            playSound('door');
            enterBuilding(nearby);
          }
          return;
        case 'KeyM':
          // Open teleport/map
          onOpenTeleport();
          return;
        case 'Tab':
          // Open stats
          e.preventDefault();
          onOpenStats();
          return;
        default:
          return;
      }
      
      e.preventDefault();
      
      // Wrap coordinates for tiny planet
      const wrappedX = wrapCoord(newX, WORLD_WIDTH);
      const wrappedY = wrapCoord(newY, WORLD_HEIGHT);
      
      if (isWalkable(wrappedX, wrappedY)) {
        movePlayer(wrappedX, wrappedY);
        playSound('footstep');
        lastMoveTime.current = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, enterBuilding, isBuildingUnlocked, onOpenStats, onOpenTeleport]);

  // Check for nearby buildings
  useEffect(() => {
    let foundBuilding: BuildingId | null = null;
    
    for (const building of Object.values(BUILDINGS)) {
      const bx = building.position.x;
      const by = building.position.y;
      const bw = building.size.width;
      const bh = building.size.height;
      
      // Check if player is at entrance (bottom edge of building)
      const entranceY = by + bh - 1;
      if (playerPosition.y === entranceY + 1 && 
          playerPosition.x >= bx && 
          playerPosition.x < bx + bw) {
        foundBuilding = building.id;
        break;
      }
    }
    
    setNearbyBuilding(foundBuilding);
  }, [playerPosition]);

  // Calculate viewport with wrapping support
  // For seamless wrapping, we compute viewport center around player
  const viewportCenterX = playerPosition.x;
  const viewportCenterY = playerPosition.y;
  
  // Generate visible tiles with wrapping
  const visibleTiles = useMemo(() => {
    const tiles: Array<{ x: number; y: number; worldX: number; worldY: number; tile: TileType }> = [];
    
    const startX = viewportCenterX - Math.floor(VIEWPORT_TILES_X / 2);
    const startY = viewportCenterY - Math.floor(VIEWPORT_TILES_Y / 2);
    
    for (let vy = 0; vy < VIEWPORT_TILES_Y; vy++) {
      for (let vx = 0; vx < VIEWPORT_TILES_X; vx++) {
        const worldX = wrapCoord(startX + vx, WORLD_WIDTH);
        const worldY = wrapCoord(startY + vy, WORLD_HEIGHT);
        tiles.push({
          x: vx,
          y: vy,
          worldX,
          worldY,
          tile: WORLD_TILES[worldY][worldX],
        });
      }
    }
    
    return tiles;
  }, [viewportCenterX, viewportCenterY]);

  const viewportWidth = VIEWPORT_TILES_X * TILE_SIZE;
  const viewportHeight = VIEWPORT_TILES_Y * TILE_SIZE;
  
  // Get translated place names
  const langCode = targetLanguage.code;

  // If inside home, render home interior
  if (currentBuilding === 'home') {
    return <Home2D onExit={exitBuilding} spawnRoom={currentHomeRoom || 'bedroom'} />;
  }
  
  // If inside marketplace, render marketplace
  if (currentBuilding === 'marketplace') {
    return <Marketplace2D onBack={exitBuilding} />;
  }
  
  // Other buildings - placeholder for now
  if (currentBuilding) {
    const building = BUILDINGS[currentBuilding];
    const placeName = getPlaceTranslation(currentBuilding, langCode);
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(to bottom, #fef3c7, #fde68a)' }}
      >
        <div className="text-6xl mb-4">{building.icon}</div>
        <h1 className="text-2xl font-bold text-amber-900 mb-2">{placeName.name}</h1>
        <p className="text-amber-700 mb-6">{placeName.description}</p>
        <p className="text-amber-600 mb-6 text-sm">
          🚧 This area is under construction!
        </p>
        <button
          onClick={exitBuilding}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-colors shadow-lg"
        >
          ← Exit to Village
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #7dd3fc, #bae6fd)' }}
    >
      {/* Sky with clouds */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-[10%] text-4xl opacity-70 animate-pulse" style={{ animationDuration: '4s' }}>☁️</div>
        <div className="absolute top-6 right-[20%] text-5xl opacity-60 animate-pulse" style={{ animationDuration: '5s' }}>☁️</div>
        <div className="absolute top-1 left-[50%] text-3xl opacity-80">🌤️</div>
      </div>

      {/* Header bar */}
      <header className="relative z-20 flex items-center justify-between p-2 bg-amber-100/90 border-b-2 border-amber-300">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="font-bold text-amber-900">XPira</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onOpenStats}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-800 font-medium transition-colors"
          >
            📊 Stats
          </button>
          <button
            onClick={onOpenTeleport}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-800 font-medium transition-colors"
          >
            🗺️ Map
          </button>
        </div>
        
        <div className="text-xs text-amber-600">
          WASD to move • E to enter
        </div>
      </header>

      {/* Game viewport */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{ 
            width: viewportWidth, 
            height: viewportHeight,
            border: '4px solid #92400e',
            boxShadow: '0 0 0 4px #fbbf24, 0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Tiles layer with wrapping */}
          <div className="absolute inset-0">
            {visibleTiles.map(({ x, y, worldX, worldY, tile }) => {
              const isExplored = exploredTiles.has(`${worldX},${worldY}`);
              return (
                <div
                  key={`${x}-${y}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: x * TILE_SIZE,
                    top: y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    background: getTileBackground(tile),
                    opacity: isExplored ? 1 : 0.4,
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  {getTileEmoji(tile) && (
                    <span className="text-lg select-none">{getTileEmoji(tile)}</span>
                  )}
                  {/* Road markings for roads */}
                  {tile === 'road' && worldX % 4 === 0 && (
                    <div 
                      className="absolute w-3 h-0.5 rounded"
                      style={{ background: '#fbbf24' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Buildings layer */}
          {Object.values(BUILDINGS).map(building => {
            // Calculate building position relative to viewport with wrapping
            const startX = viewportCenterX - Math.floor(VIEWPORT_TILES_X / 2);
            const startY = viewportCenterY - Math.floor(VIEWPORT_TILES_Y / 2);
            
            // Check if building is visible in wrapped viewport
            let relX = building.position.x - startX;
            let relY = building.position.y - startY;
            
            // Handle wrapping - check if building would be visible from either direction
            if (relX < -WORLD_WIDTH / 2) relX += WORLD_WIDTH;
            if (relX > WORLD_WIDTH / 2) relX -= WORLD_WIDTH;
            if (relY < -WORLD_HEIGHT / 2) relY += WORLD_HEIGHT;
            if (relY > WORLD_HEIGHT / 2) relY -= WORLD_HEIGHT;
            
            // Skip if not visible
            if (relX < -building.size.width || relX >= VIEWPORT_TILES_X ||
                relY < -building.size.height || relY >= VIEWPORT_TILES_Y) {
              return null;
            }
            
            const isUnlocked = unlockedBuildings.includes(building.id);
            const isNearby = nearbyBuilding === building.id;
            const placeName = getPlaceTranslation(building.id === 'town-hall' ? 'townHall' : building.id, langCode);
            
            return (
              <div
                key={building.id}
                className="absolute flex flex-col items-center justify-center transition-all z-10"
                style={{
                  left: relX * TILE_SIZE,
                  top: relY * TILE_SIZE,
                  width: building.size.width * TILE_SIZE,
                  height: building.size.height * TILE_SIZE,
                  opacity: isUnlocked ? 1 : 0.5,
                  filter: isUnlocked ? 'none' : 'grayscale(0.8)',
                }}
              >
                {/* Building body */}
                <div 
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg"
                  style={{
                    background: isNearby 
                      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                      : 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                    border: isNearby ? '3px solid #f59e0b' : '2px solid #92400e',
                    boxShadow: isNearby ? '0 0 20px rgba(245, 158, 11, 0.5)' : '0 4px 8px rgba(0,0,0,0.2)',
                    transform: isNearby ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span className="text-3xl">{building.icon}</span>
                  <span className="text-xs font-bold text-amber-900 mt-1 text-center px-1 leading-tight">
                    {placeName.name}
                  </span>
                  
                  {/* Lock indicator */}
                  {!isUnlocked && (
                    <span className="text-sm mt-0.5">🔒</span>
                  )}
                </div>
                
                {/* Entrance prompt */}
                {isNearby && isUnlocked && (
                  <div 
                    className="absolute -bottom-7 px-2 py-0.5 rounded-lg text-xs font-bold animate-bounce whitespace-nowrap"
                    style={{ 
                      background: '#fbbf24',
                      color: '#78350f',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    Press E to enter
                  </div>
                )}
              </div>
            );
          })}

          {/* Player - always centered in viewport */}
          <div
            className="absolute z-20"
            style={{
              left: Math.floor(VIEWPORT_TILES_X / 2) * TILE_SIZE,
              top: Math.floor(VIEWPORT_TILES_Y / 2) * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-2xl select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              🧑‍🎓
            </div>
            {/* Player shadow */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint with current location */}
      <div className="text-center py-2 text-amber-800/60 text-sm bg-amber-100/50">
        🌍 Tiny Planet • Position: ({playerPosition.x}, {playerPosition.y}) • Press M for map
      </div>
    </div>
  );
}
