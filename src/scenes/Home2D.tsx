/**
 * Home2D - The player's home interior
 * 
 * A multi-room home with:
 * - Bedroom (spawn point on new day)
 * - Bathroom
 * - Kitchen
 * - Dining Room
 * - Living Room
 * - Guest Room
 * - Backyard with garden
 * - Frontyard
 * - Garage (exit to street)
 * 
 * Uses a single grid with room zones and doorway tiles.
 */

import { useState, useEffect, useRef } from 'react';
import { playSound } from '../features/audio';

// Grid dimensions for the home
const HOME_WIDTH = 24;
const HOME_HEIGHT = 20;
const TILE_SIZE = 40;

// Room definitions (zones within the grid)
interface Room {
  name: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floorColor: string;
  wallColor: string;
}

const ROOMS: Record<string, Room> = {
  bedroom: {
    name: 'Bedroom',
    icon: '🛏️',
    x: 0, y: 0,
    width: 6, height: 5,
    floorColor: '#ddd6c3', // warm wood
    wallColor: '#a8d5ba', // sage green
  },
  bathroom: {
    name: 'Bathroom',
    icon: '🚿',
    x: 6, y: 0,
    width: 4, height: 5,
    floorColor: '#e8e8e8', // tile white
    wallColor: '#b8d4e3', // light blue
  },
  kitchen: {
    name: 'Kitchen',
    icon: '🍳',
    x: 10, y: 0,
    width: 6, height: 5,
    floorColor: '#f5e6d3', // cream tile
    wallColor: '#ffeaa7', // sunny yellow
  },
  diningRoom: {
    name: 'Dining Room',
    icon: '🍽️',
    x: 16, y: 0,
    width: 5, height: 5,
    floorColor: '#ddd6c3',
    wallColor: '#fab1a0', // coral
  },
  hallway: {
    name: 'Hallway',
    icon: '🚪',
    x: 0, y: 5,
    width: 21, height: 2,
    floorColor: '#c9b896', // darker wood
    wallColor: '#ffeaa7',
  },
  livingRoom: {
    name: 'Living Room',
    icon: '🛋️',
    x: 0, y: 7,
    width: 8, height: 6,
    floorColor: '#ddd6c3',
    wallColor: '#81ecec', // teal
  },
  guestRoom: {
    name: 'Guest Room',
    icon: '🛌',
    x: 8, y: 7,
    width: 6, height: 6,
    floorColor: '#ddd6c3',
    wallColor: '#dfe6e9', // light gray
  },
  garage: {
    name: 'Garage',
    icon: '🚗',
    x: 14, y: 7,
    width: 7, height: 6,
    floorColor: '#95a5a6', // concrete
    wallColor: '#636e72', // dark gray
  },
  frontyard: {
    name: 'Front Yard',
    icon: '🌳',
    x: 0, y: 13,
    width: 14, height: 4,
    floorColor: '#7cb56b', // grass
    wallColor: 'transparent',
  },
  backyard: {
    name: 'Backyard',
    icon: '🌻',
    x: 14, y: 13,
    width: 7, height: 4,
    floorColor: '#7cb56b',
    wallColor: 'transparent',
  },
  garden: {
    name: 'Garden',
    icon: '🥕',
    x: 17, y: 14,
    width: 4, height: 3,
    floorColor: '#8b4513', // soil brown
    wallColor: 'transparent',
  },
  street: {
    name: 'Street',
    icon: '🛤️',
    x: 0, y: 17,
    width: 24, height: 3,
    floorColor: '#4a4a4a', // asphalt
    wallColor: 'transparent',
  },
};

// Tile types for home interior
type HomeTileType = 
  | 'floor' 
  | 'wall' 
  | 'door' 
  | 'furniture' 
  | 'grass' 
  | 'garden' 
  | 'path'
  | 'road'
  | 'sidewalk'
  | 'exit';

interface HomeTile {
  type: HomeTileType;
  room: string;
  emoji?: string;
  walkable: boolean;
  exitTo?: 'world'; // For exit tiles
}

// Generate the home layout
function generateHomeLayout(): HomeTile[][] {
  const tiles: HomeTile[][] = [];
  
  // Initialize with floor tiles based on rooms
  for (let y = 0; y < HOME_HEIGHT; y++) {
    tiles[y] = [];
    for (let x = 0; x < HOME_WIDTH; x++) {
      // Find which room this tile belongs to
      let roomId = 'outside';
      for (const [id, room] of Object.entries(ROOMS)) {
        if (x >= room.x && x < room.x + room.width &&
            y >= room.y && y < room.y + room.height) {
          roomId = id;
          break;
        }
      }
      
      tiles[y][x] = {
        type: 'floor',
        room: roomId,
        walkable: true,
      };
    }
  }
  
  // ===== WALLS BETWEEN ROOMS =====
  // Interior walls are impassable - doorways are explicitly added later
  
  // Top exterior wall (y=0, entire row for indoor rooms)
  for (let x = 0; x < 21; x++) {
    tiles[0][x] = { type: 'wall', room: 'exterior', emoji: '🧱', walkable: false };
  }
  
  // Bottom wall of upstairs rooms (between upstairs and hallway at y=5)
  for (let x = 0; x < 21; x++) {
    tiles[5][x] = { type: 'wall', room: 'hallway', walkable: false };
  }
  
  // Left exterior wall
  for (let y = 0; y < 13; y++) {
    tiles[y][0] = { type: 'wall', room: 'exterior', emoji: '🧱', walkable: false };
  }
  
  // Right exterior wall (at x=20 for indoor area)
  for (let y = 0; y < 13; y++) {
    tiles[y][20] = { type: 'wall', room: 'exterior', emoji: '🧱', walkable: false };
  }
  
  // Walls between upstairs rooms (vertical walls)
  // Between bedroom and bathroom (x=6)
  for (let y = 0; y < 5; y++) {
    tiles[y][6] = { type: 'wall', room: 'bedroom', walkable: false };
  }
  // Between bathroom and kitchen (x=10)
  for (let y = 0; y < 5; y++) {
    tiles[y][10] = { type: 'wall', room: 'bathroom', walkable: false };
  }
  // Between kitchen and dining (x=16)
  for (let y = 0; y < 5; y++) {
    tiles[y][16] = { type: 'wall', room: 'kitchen', walkable: false };
  }
  
  // Bottom wall of downstairs rooms (y=13, between indoor and yard)
  for (let x = 0; x < 21; x++) {
    tiles[13][x] = { type: 'wall', room: 'exterior', emoji: '🧱', walkable: false };
  }
  
  // Walls between downstairs rooms (y=7-12)
  // Between living room and guest room (x=8)
  for (let y = 7; y < 13; y++) {
    tiles[y][8] = { type: 'wall', room: 'livingRoom', walkable: false };
  }
  // Between guest room and garage (x=14)
  for (let y = 7; y < 13; y++) {
    tiles[y][14] = { type: 'wall', room: 'guestRoom', walkable: false };
  }
  
  // ===== DOORWAYS (walkable openings in walls) =====
  // Upstairs to hallway doors
  tiles[5][3] = { type: 'door', room: 'bedroom', emoji: '🚪', walkable: true };
  tiles[5][8] = { type: 'door', room: 'bathroom', emoji: '🚪', walkable: true };
  tiles[5][13] = { type: 'door', room: 'kitchen', emoji: '🚪', walkable: true };
  tiles[5][18] = { type: 'door', room: 'diningRoom', emoji: '🚪', walkable: true };
  
  // Hallway to downstairs rooms (at y=6 bottom of hallway)
  tiles[6][4] = { type: 'door', room: 'hallway', emoji: '🚪', walkable: true };
  tiles[6][11] = { type: 'door', room: 'hallway', emoji: '🚪', walkable: true };
  tiles[6][17] = { type: 'door', room: 'hallway', emoji: '🚪', walkable: true };
  
  // Front door (living room to frontyard at y=13)
  tiles[13][4] = { type: 'door', room: 'frontyard', emoji: '🚪', walkable: true };
  
  // Back door (garage to backyard at y=13)
  tiles[13][17] = { type: 'door', room: 'backyard', emoji: '🚪', walkable: true };
  
  // Internal doorways between downstairs rooms (in the vertical walls)
  tiles[9][8] = { type: 'door', room: 'livingRoom', walkable: true }; // Living to Guest
  tiles[9][14] = { type: 'door', room: 'guestRoom', walkable: true }; // Guest to Garage
  
  // Add furniture and decorations
  // Bedroom
  tiles[1][1] = { type: 'furniture', room: 'bedroom', emoji: '🛏️', walkable: false };
  tiles[1][2] = { type: 'furniture', room: 'bedroom', emoji: '🛏️', walkable: false };
  tiles[1][4] = { type: 'furniture', room: 'bedroom', emoji: '🪟', walkable: false };
  tiles[3][1] = { type: 'furniture', room: 'bedroom', emoji: '👕', walkable: false };
  tiles[3][4] = { type: 'furniture', room: 'bedroom', emoji: '📚', walkable: false };
  
  // Bathroom
  tiles[1][7] = { type: 'furniture', room: 'bathroom', emoji: '🚿', walkable: false };
  tiles[1][8] = { type: 'furniture', room: 'bathroom', emoji: '🪞', walkable: false };
  tiles[3][7] = { type: 'furniture', room: 'bathroom', emoji: '🚽', walkable: false };
  tiles[3][8] = { type: 'furniture', room: 'bathroom', emoji: '🧴', walkable: false };
  
  // Kitchen
  tiles[1][11] = { type: 'furniture', room: 'kitchen', emoji: '🍳', walkable: false };
  tiles[1][12] = { type: 'furniture', room: 'kitchen', emoji: '🧊', walkable: false };
  tiles[1][14] = { type: 'furniture', room: 'kitchen', emoji: '🪟', walkable: false };
  tiles[3][11] = { type: 'furniture', room: 'kitchen', emoji: '🍽️', walkable: false };
  tiles[3][14] = { type: 'furniture', room: 'kitchen', emoji: '🗑️', walkable: false };
  
  // Dining Room
  tiles[1][17] = { type: 'furniture', room: 'diningRoom', emoji: '🪟', walkable: false };
  tiles[2][17] = { type: 'furniture', room: 'diningRoom', emoji: '🪑', walkable: false };
  tiles[2][18] = { type: 'furniture', room: 'diningRoom', emoji: '🍽️', walkable: false };
  tiles[2][19] = { type: 'furniture', room: 'diningRoom', emoji: '🪑', walkable: false };
  tiles[3][18] = { type: 'furniture', room: 'diningRoom', emoji: '🕯️', walkable: false };
  
  // Living Room
  tiles[8][1] = { type: 'furniture', room: 'livingRoom', emoji: '🛋️', walkable: false };
  tiles[8][2] = { type: 'furniture', room: 'livingRoom', emoji: '🛋️', walkable: false };
  tiles[8][5] = { type: 'furniture', room: 'livingRoom', emoji: '📺', walkable: false };
  tiles[10][1] = { type: 'furniture', room: 'livingRoom', emoji: '🪴', walkable: false };
  tiles[10][6] = { type: 'furniture', room: 'livingRoom', emoji: '🎮', walkable: false };
  tiles[11][3] = { type: 'furniture', room: 'livingRoom', emoji: '☕', walkable: false };
  
  // Guest Room
  tiles[8][9] = { type: 'furniture', room: 'guestRoom', emoji: '🛌', walkable: false };
  tiles[8][10] = { type: 'furniture', room: 'guestRoom', emoji: '🛌', walkable: false };
  tiles[8][12] = { type: 'furniture', room: 'guestRoom', emoji: '🪟', walkable: false };
  tiles[10][9] = { type: 'furniture', room: 'guestRoom', emoji: '🧳', walkable: false };
  tiles[11][12] = { type: 'furniture', room: 'guestRoom', emoji: '🪴', walkable: false };
  
  // Garage
  tiles[8][16] = { type: 'furniture', room: 'garage', emoji: '🚗', walkable: false };
  tiles[8][17] = { type: 'furniture', room: 'garage', emoji: '🚗', walkable: false };
  tiles[10][15] = { type: 'furniture', room: 'garage', emoji: '🔧', walkable: false };
  tiles[10][19] = { type: 'furniture', room: 'garage', emoji: '🧹', walkable: false };
  tiles[11][15] = { type: 'furniture', room: 'garage', emoji: '📦', walkable: false };
  tiles[11][19] = { type: 'furniture', room: 'garage', emoji: '🪣', walkable: false };
  
  // Frontyard decorations
  tiles[14][2] = { type: 'furniture', room: 'frontyard', emoji: '🌳', walkable: false };
  tiles[14][7] = { type: 'furniture', room: 'frontyard', emoji: '🌷', walkable: true };
  tiles[15][9] = { type: 'furniture', room: 'frontyard', emoji: '🪨', walkable: false };
  tiles[14][11] = { type: 'furniture', room: 'frontyard', emoji: '🌳', walkable: false };
  tiles[15][6] = { type: 'furniture', room: 'frontyard', emoji: '💐', walkable: true };
  
  // Path from front door to street (front door is at x=4)
  for (let y = 14; y < 17; y++) {
    tiles[y][4] = { type: 'path', room: 'frontyard', walkable: true };
    tiles[y][5] = { type: 'path', room: 'frontyard', walkable: true };
  }
  
  // Backyard decorations
  tiles[14][15] = { type: 'furniture', room: 'backyard', emoji: '🌻', walkable: true };
  tiles[14][19] = { type: 'furniture', room: 'backyard', emoji: '🌸', walkable: true };
  tiles[15][21] = { type: 'furniture', room: 'backyard', emoji: '🌳', walkable: false };
  
  // Garden (soil with crops)
  for (let y = 14; y < 17; y++) {
    for (let x = 17; x < 21; x++) {
      if (tiles[y] && tiles[y][x]) {
        tiles[y][x] = { type: 'garden', room: 'garden', walkable: true };
      }
    }
  }
  tiles[15][17] = { type: 'furniture', room: 'garden', emoji: '🥕', walkable: true };
  tiles[15][18] = { type: 'furniture', room: 'garden', emoji: '🍅', walkable: true };
  tiles[15][19] = { type: 'furniture', room: 'garden', emoji: '🥬', walkable: true };
  tiles[15][20] = { type: 'furniture', room: 'garden', emoji: '🌽', walkable: true };
  
  // Street with sidewalk
  for (let x = 0; x < HOME_WIDTH; x++) {
    tiles[17][x] = { type: 'sidewalk', room: 'street', walkable: true };
    tiles[18][x] = { type: 'road', room: 'street', walkable: true };
    tiles[19][x] = { type: 'road', room: 'street', walkable: true };
  }
  
  // Exit to world (at the edges of the street)
  tiles[18][0] = { type: 'exit', room: 'street', emoji: '◀️', walkable: true, exitTo: 'world' };
  tiles[19][0] = { type: 'exit', room: 'street', emoji: '◀️', walkable: true, exitTo: 'world' };
  tiles[18][HOME_WIDTH - 1] = { type: 'exit', room: 'street', emoji: '▶️', walkable: true, exitTo: 'world' };
  tiles[19][HOME_WIDTH - 1] = { type: 'exit', room: 'street', emoji: '▶️', walkable: true, exitTo: 'world' };
  
  return tiles;
}

// Pre-generate the layout
const HOME_LAYOUT = generateHomeLayout();

// Get tile background color
function getTileBackground(tile: HomeTile): string {
  const room = ROOMS[tile.room];
  
  switch (tile.type) {
    case 'wall':
      return room?.wallColor || '#95a5a6';
    case 'door':
      return '#c9b896'; // door color
    case 'path':
      return '#d4a373'; // tan path
    case 'sidewalk':
      return '#bdc3c7'; // gray sidewalk
    case 'road':
      return '#4a4a4a'; // dark asphalt
    case 'garden':
      return '#8b4513'; // soil
    case 'exit':
      return '#2c3e50'; // dark to indicate exit
    case 'grass':
    case 'floor':
    default:
      return room?.floorColor || '#ddd6c3';
  }
}

interface Home2DProps {
  onExit: () => void;
  spawnRoom?: string; // Which room to spawn in (default: bedroom)
}

export function Home2D({ onExit, spawnRoom = 'bedroom' }: Home2DProps) {
  // Get spawn position for the room
  const getSpawnPosition = (roomId: string) => {
    const room = ROOMS[roomId];
    if (!room) return { x: 3, y: 2 }; // Default to bedroom area
    
    // Spawn in the middle of the room
    return {
      x: Math.floor(room.x + room.width / 2),
      y: Math.floor(room.y + room.height / 2),
    };
  };
  
  const spawn = getSpawnPosition(spawnRoom);
  const [playerPos, setPlayerPos] = useState(spawn);
  const [currentRoom, setCurrentRoom] = useState(spawnRoom);
  const lastMoveTime = useRef(0);
  
  // Ref to avoid stale closure in keyboard handler
  const playerPosRef = useRef(playerPos);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  
  // Update current room based on position
  useEffect(() => {
    for (const [id, room] of Object.entries(ROOMS)) {
      if (playerPos.x >= room.x && playerPos.x < room.x + room.width &&
          playerPos.y >= room.y && playerPos.y < room.y + room.height) {
        if (id !== currentRoom) {
          setCurrentRoom(id);
        }
        break;
      }
    }
  }, [playerPos, currentRoom]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        case 'Escape':
          // Quick exit
          onExit();
          return;
        default:
          return;
      }
      
      e.preventDefault();
      
      // Check bounds
      if (newX < 0 || newX >= HOME_WIDTH || newY < 0 || newY >= HOME_HEIGHT) {
        return;
      }
      
      const tile = HOME_LAYOUT[newY]?.[newX];
      if (!tile) return;
      
      // Check if walkable
      if (!tile.walkable) return;
      
      // Check for exit
      if (tile.exitTo === 'world') {
        playSound('door');
        onExit();
        return;
      }
      
      setPlayerPos({ x: newX, y: newY });
      playSound('footstep');
      lastMoveTime.current = now;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);
  
  // Calculate viewport to follow player
  const viewportTilesX = 16;
  const viewportTilesY = 12;
  const viewportX = Math.max(0, Math.min(
    playerPos.x - Math.floor(viewportTilesX / 2),
    HOME_WIDTH - viewportTilesX
  ));
  const viewportY = Math.max(0, Math.min(
    playerPos.y - Math.floor(viewportTilesY / 2),
    HOME_HEIGHT - viewportTilesY
  ));
  
  const room = ROOMS[currentRoom];
  
  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #fef3c7, #fde68a)' }}
    >
      {/* Header */}
      <header 
        className="relative z-20 flex items-center justify-between p-3"
        style={{ 
          background: room?.wallColor || '#a8d5ba',
          borderBottom: '3px solid rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room?.icon || '🏠'}</span>
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#2d3436' }}>
              {room?.name || 'Home'}
            </h1>
            <p className="text-xs opacity-70">Your cozy home</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">
            WASD to move • Walk to street to exit
          </span>
          <button
            onClick={onExit}
            className="px-3 py-1 rounded-lg font-medium text-sm transition-colors"
            style={{ 
              background: 'rgba(255,255,255,0.5)',
              color: '#2d3436',
            }}
          >
            Exit 🚪
          </button>
        </div>
      </header>
      
      {/* Game viewport */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: viewportTilesX * TILE_SIZE,
            height: viewportTilesY * TILE_SIZE,
            border: '4px solid #2d3436',
          }}
        >
          {/* Tile grid */}
          <div
            className="absolute"
            style={{
              width: HOME_WIDTH * TILE_SIZE,
              height: HOME_HEIGHT * TILE_SIZE,
              transform: `translate(${-viewportX * TILE_SIZE}px, ${-viewportY * TILE_SIZE}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {HOME_LAYOUT.map((row, y) =>
              row.map((tile, x) => (
                <div
                  key={`${x}-${y}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: x * TILE_SIZE,
                    top: y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    background: getTileBackground(tile),
                    borderRight: tile.type === 'wall' ? '2px solid rgba(0,0,0,0.1)' : undefined,
                    borderBottom: tile.type === 'wall' ? '2px solid rgba(0,0,0,0.1)' : undefined,
                  }}
                >
                  {/* Tile emoji */}
                  {tile.emoji && (
                    <span 
                      className="text-lg select-none"
                      style={{ filter: tile.walkable ? undefined : 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}
                    >
                      {tile.emoji}
                    </span>
                  )}
                  
                  {/* Road markings */}
                  {tile.type === 'road' && x % 4 === 2 && (
                    <div 
                      className="absolute w-4 h-1 rounded"
                      style={{ background: '#f1c40f' }}
                    />
                  )}
                </div>
              ))
            )}
            
            {/* Player */}
            <div
              className="absolute z-10 transition-all duration-100 ease-out"
              style={{
                left: playerPos.x * TILE_SIZE,
                top: playerPos.y * TILE_SIZE,
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
              {/* Shadow */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Room legend / mini-map hint */}
      <div className="text-center py-2 text-sm" style={{ color: '#78350f', background: 'rgba(255,255,255,0.3)' }}>
        🛏️ Bedroom • 🚿 Bathroom • 🍳 Kitchen • 🍽️ Dining • 🛋️ Living • 🛌 Guest • 🚗 Garage • 🌻 Backyard • 🌳 Frontyard
      </div>
    </div>
  );
}
