/**
 * Marketplace2D - Cozy 2D grid-based marketplace
 * 
 * A warm, illustrated-style marketplace where players can:
 * - Move with arrow keys or WASD
 * - Approach vendor stalls
 * - Talk to NPCs and practice language
 * 
 * Keeps all the dialogue and speech recognition from the 3D version!
 */

import { useState, useEffect, useRef } from 'react';
import { useDialogueStore } from '../features/dialogue/dialogueStore';
import { playSound } from '../features/audio';
import { DialogueBox } from '../ui/DialogueBox';

// Grid configuration
const GRID_SIZE = 12; // 12x12 grid
const TILE_SIZE = 64; // pixels per tile

// Tile types
type TileType = 'grass' | 'path' | 'stall' | 'decoration' | 'blocked';

// NPC definitions
interface NPC {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  color: string;
  stallType: string;
  greeting: string;
}

const NPCS: NPC[] = [
  { 
    id: 'vendor-maria', 
    name: 'María', 
    emoji: '👩‍🌾',
    x: 3, 
    y: 2, 
    color: '#f59e0b',
    stallType: '🍎 Frutas',
    greeting: '¡Hola! ¿Qué frutas te gustaría?'
  },
  { 
    id: 'vendor-carlos', 
    name: 'Carlos', 
    emoji: '👨‍🍳',
    x: 8, 
    y: 2, 
    color: '#3b82f6',
    stallType: '🥖 Panadería',
    greeting: '¡Buenos días! Tenemos pan fresco.'
  },
  { 
    id: 'teacher-elena', 
    name: 'Profesora Elena', 
    emoji: '👩‍🏫',
    x: 6, 
    y: 8, 
    color: '#8b5cf6',
    stallType: '📚 Escuela',
    greeting: '¡Hola estudiante! ¿Listo para aprender?'
  },
];

// Market stall positions (blocked tiles with decorations)
const STALLS: Array<{ x: number; y: number; emoji: string; name: string }> = [
  { x: 2, y: 1, emoji: '🏪', name: 'Fruit Stand' },
  { x: 3, y: 1, emoji: '🍊', name: '' },
  { x: 4, y: 1, emoji: '🍇', name: '' },
  { x: 7, y: 1, emoji: '🏪', name: 'Bakery' },
  { x: 8, y: 1, emoji: '🥐', name: '' },
  { x: 9, y: 1, emoji: '🍞', name: '' },
  { x: 5, y: 7, emoji: '🏫', name: 'School' },
  { x: 6, y: 7, emoji: '📖', name: '' },
  { x: 7, y: 7, emoji: '✏️', name: '' },
];

// Decorations
const DECORATIONS: Array<{ x: number; y: number; emoji: string }> = [
  { x: 0, y: 0, emoji: '🌳' },
  { x: 11, y: 0, emoji: '🌳' },
  { x: 0, y: 11, emoji: '🌲' },
  { x: 11, y: 11, emoji: '🌲' },
  { x: 1, y: 5, emoji: '🌻' },
  { x: 10, y: 6, emoji: '🌷' },
  { x: 0, y: 8, emoji: '🪨' },
  { x: 11, y: 4, emoji: '⛲' },
];

// Generate the tile map
function generateTileMap(): TileType[][] {
  const map: TileType[][] = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      // Default to grass
      let tile: TileType = 'grass';
      
      // Create paths
      if (y === 5 || y === 6) tile = 'path'; // Horizontal main path
      if (x === 5 || x === 6) tile = 'path'; // Vertical main path
      
      // Check for stalls
      if (STALLS.some(s => s.x === x && s.y === y)) {
        tile = 'stall';
      }
      
      // Check for decorations
      if (DECORATIONS.some(d => d.x === x && d.y === y)) {
        tile = 'decoration';
      }
      
      row.push(tile);
    }
    map.push(row);
  }
  
  return map;
}

const TILE_MAP = generateTileMap();

// Get tile color based on type
function getTileStyle(type: TileType): React.CSSProperties {
  switch (type) {
    case 'grass':
      return { background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' };
    case 'path':
      return { background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)' };
    case 'stall':
      return { background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)' };
    case 'decoration':
      return { background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)' };
    default:
      return { background: '#9ca3af' };
  }
}

// Check if a position is walkable
function isWalkable(x: number, y: number): boolean {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
  
  const tile = TILE_MAP[y][x];
  if (tile === 'stall') return false;
  
  // Can't walk on decorations (trees, etc)
  if (DECORATIONS.some(d => d.x === x && d.y === y && ['🌳', '🌲', '🪨', '⛲'].includes(d.emoji))) {
    return false;
  }
  
  // Can't walk through NPCs
  if (NPCS.some(npc => npc.x === x && npc.y === y)) return false;
  
  return true;
}

// Find nearby NPC
function getNearbyNPC(playerX: number, playerY: number): NPC | null {
  for (const npc of NPCS) {
    const dx = Math.abs(npc.x - playerX);
    const dy = Math.abs(npc.y - playerY);
    if (dx <= 1 && dy <= 1 && (dx + dy) <= 1) {
      return npc;
    }
  }
  return null;
}

interface Marketplace2DProps {
  onBack: () => void;
}

export function Marketplace2D({ onBack }: Marketplace2DProps) {
  const [playerX, setPlayerX] = useState(6);
  const [playerY, setPlayerY] = useState(9);
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
  const lastMoveTime = useRef(0);
  
  // Refs to avoid stale closures
  const playerXRef = useRef(playerX);
  const playerYRef = useRef(playerY);
  const nearbyNPCRef = useRef(nearbyNPC);
  const isDialogueActiveRef = useRef(false);
  
  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);
  useEffect(() => { nearbyNPCRef.current = nearbyNPC; }, [nearbyNPC]);
  
  const { initDialogue, isActive: isDialogueActive } = useDialogueStore();
  
  useEffect(() => { isDialogueActiveRef.current = isDialogueActive; }, [isDialogueActive]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogueActiveRef.current) return;
      
      // Throttle movement
      const now = Date.now();
      if (now - lastMoveTime.current < 150) return;
      
      let newX = playerXRef.current;
      let newY = playerYRef.current;
      let newDir = playerDirection;
      
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          newY = playerYRef.current - 1;
          newDir = 'up';
          break;
        case 'KeyS':
        case 'ArrowDown':
          newY = playerYRef.current + 1;
          newDir = 'down';
          break;
        case 'KeyA':
        case 'ArrowLeft':
          newX = playerXRef.current - 1;
          newDir = 'left';
          break;
        case 'KeyD':
        case 'ArrowRight':
          newX = playerXRef.current + 1;
          newDir = 'right';
          break;
        case 'KeyE':
        case 'Space':
          // Interact with nearby NPC
          const npc = nearbyNPCRef.current;
          if (npc) {
            playSound('npc-talk');
            initDialogue('market-vendor-fruits', npc.id);
          }
          return;
        default:
          return;
      }
      
      e.preventDefault();
      setPlayerDirection(newDir);
      
      if (isWalkable(newX, newY)) {
        setPlayerX(newX);
        setPlayerY(newY);
        playSound('footstep');
        lastMoveTime.current = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerDirection, initDialogue]);

  // Update nearby NPC
  useEffect(() => {
    setNearbyNPC(getNearbyNPC(playerX, playerY));
  }, [playerX, playerY]);

  const gridWidth = GRID_SIZE * TILE_SIZE;
  const gridHeight = GRID_SIZE * TILE_SIZE;

  return (
    <div 
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #7dd3fc, #bae6fd, #e0f2fe)' }}
    >
      {/* Sky decorations */}
      <div className="absolute top-4 left-[10%] text-4xl opacity-70 animate-pulse" style={{ animationDuration: '4s' }}>☁️</div>
      <div className="absolute top-8 right-[20%] text-5xl opacity-60 animate-pulse" style={{ animationDuration: '5s' }}>☁️</div>
      <div className="absolute top-2 left-[50%] text-3xl opacity-80">🌤️</div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl font-medium shadow-md transition-all flex items-center gap-2 hover:scale-105"
          style={{ 
            background: 'rgba(255, 251, 235, 0.95)',
            color: '#78350f',
            border: '2px solid #fcd34d'
          }}
        >
          ← Home
        </button>
        
        <div 
          className="px-4 py-2 rounded-xl shadow-md"
          style={{ 
            background: 'rgba(255, 251, 235, 0.95)',
            color: '#78350f',
            border: '2px solid #fcd34d'
          }}
        >
          <span className="font-bold">🛒 El Mercado</span>
        </div>

        <div 
          className="px-3 py-2 rounded-xl shadow-md text-sm"
          style={{ 
            background: 'rgba(255, 251, 235, 0.95)',
            color: '#78350f',
          }}
        >
          WASD to move • E to talk
        </div>
      </header>

      {/* Game area - centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative rounded-2xl shadow-2xl overflow-hidden"
          style={{ 
            width: gridWidth, 
            height: gridHeight,
            border: '4px solid #92400e',
            boxShadow: '0 0 0 4px #fbbf24, 0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          {/* Tile grid */}
          {TILE_MAP.map((row, y) => (
            <div key={y} className="flex">
              {row.map((tile, x) => (
                <div
                  key={`${x}-${y}`}
                  className="relative flex items-center justify-center"
                  style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    ...getTileStyle(tile),
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Decorations */}
                  {DECORATIONS.find(d => d.x === x && d.y === y) && (
                    <span className="text-3xl select-none">
                      {DECORATIONS.find(d => d.x === x && d.y === y)?.emoji}
                    </span>
                  )}
                  
                  {/* Stalls */}
                  {STALLS.find(s => s.x === x && s.y === y) && (
                    <span className="text-3xl select-none">
                      {STALLS.find(s => s.x === x && s.y === y)?.emoji}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* NPCs layer */}
          {NPCS.map(npc => (
            <div
              key={npc.id}
              className="absolute flex flex-col items-center transition-all duration-100"
              style={{
                left: npc.x * TILE_SIZE,
                top: npc.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              {/* NPC name tag */}
              <div 
                className="absolute -top-6 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{ 
                  background: npc.color,
                  color: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {npc.name}
              </div>
              
              {/* NPC emoji */}
              <div 
                className="w-full h-full flex items-center justify-center text-4xl select-none"
                style={{
                  filter: nearbyNPC?.id === npc.id ? 'drop-shadow(0 0 8px gold)' : 'none',
                  transform: nearbyNPC?.id === npc.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s'
                }}
              >
                {npc.emoji}
              </div>
              
              {/* Interaction prompt */}
              {nearbyNPC?.id === npc.id && !isDialogueActive && (
                <div 
                  className="absolute -bottom-8 px-3 py-1 rounded-lg text-xs font-bold animate-bounce"
                  style={{ 
                    background: '#fbbf24',
                    color: '#78350f',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Press E to talk
                </div>
              )}
            </div>
          ))}

          {/* Player */}
          <div
            className="absolute transition-all duration-150 ease-out"
            style={{
              left: playerX * TILE_SIZE,
              top: playerY * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              zIndex: 10,
            }}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-4xl select-none"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                transform: playerDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              🧑‍🎓
            </div>
            
            {/* Player shadow */}
            <div 
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-4 text-amber-800/60 text-sm">
        Walk up to vendors and press <kbd className="px-2 py-0.5 bg-amber-200 rounded">E</kbd> to practice your Spanish!
      </div>
      
      {/* Dialogue overlay */}
      <DialogueBox />
    </div>
  );
}
