/**
 * Game Design Sandbox
 * 
 * Interactive playground for tweaking game visuals:
 * - Character sizes and designs
 * - NPC appearances and expressions
 * - Tile sizes and icons
 * - Building icons and scales
 * 
 * Access at /game-sandbox
 * 
 * NOTE: This sandbox uses emoji placeholders. When custom art is added,
 * it will be loaded from the AssetRegistry (src/core/assets/AssetRegistry.ts).
 * The Sprite component handles rendering both emoji and image-based assets.
 */

import { useState, useEffect } from 'react';
import { AssetRegistry, AssetIds, Sprite, Character } from '../core/assets';

// ============================================================================
// DESIGN CONFIGURATION
// Tweak these values and see changes in real-time
// ============================================================================

export interface GameDesignConfig {
  // Player settings
  player: {
    emoji: string;
    size: number; // font size in px
    shadowIntensity: number; // 0-1
    bounceAnimation: boolean;
  };
  
  // NPC settings
  npc: {
    size: number;
    highlightGlow: boolean;
    hoverScale: number;
    showExpressions: boolean;
    expressionSize: number;
  };
  
  // Tile settings
  tile: {
    size: number; // pixels per tile
    gap: number; // gap between tiles
    borderRadius: number;
  };
  
  // World settings
  world: {
    visibleTilesX: number;
    visibleTilesY: number;
  };
  
  // Building settings
  building: {
    baseSize: number;
    maxSize: number;
    levelScaling: number; // px per level
  };
}

const DEFAULT_CONFIG: GameDesignConfig = {
  player: {
    emoji: '🧑‍🎓',
    size: 32,
    shadowIntensity: 0.3,
    bounceAnimation: true,
  },
  npc: {
    size: 36,
    highlightGlow: true,
    hoverScale: 1.15,
    showExpressions: true,
    expressionSize: 16,
  },
  tile: {
    size: 48,
    gap: 1,
    borderRadius: 4,
  },
  world: {
    visibleTilesX: 11,
    visibleTilesY: 9,
  },
  building: {
    baseSize: 56,
    maxSize: 88,
    levelScaling: 4,
  },
};

// ============================================================================
// CHARACTER GALLERY
// ============================================================================

const CHARACTER_OPTIONS = {
  players: ['🧑‍🎓', '🧙', '🧝', '🦸', '🥷', '👨‍🚀', '🧑‍🌾', '🧑‍🎨', '🧑‍🔬', '🧑‍💻', '🦊', '🐱', '🐰'],
  npcs: {
    vendors: ['👩‍🌾', '👨‍🍳', '🧑‍🍳', '👩‍🔧', '🧑‍🏭', '👨‍🌾'],
    teachers: ['👩‍🏫', '👨‍🏫', '🧑‍🏫', '👴', '👵', '🧙‍♂️', '🧙‍♀️'],
    citizens: ['🧑', '👩', '👨', '🧒', '👧', '👦', '👴', '👵'],
    special: ['👸', '🤴', '🧚', '🧜‍♀️', '🧞', '🦹', '🥷'],
  },
  expressions: ['😊', '😃', '🤔', '😮', '😠', '😢', '🤩', '😴', '🤗', '👋', '👆', '👉', '🙌', '❓', '❗', '💭', '💬', '✨'],
};

const TILE_OPTIONS = {
  terrain: ['🌿', '🌱', '🍀', '🌾', '🏜️', '❄️', '🌊', '💧'],
  nature: ['🌳', '🌲', '🌴', '🌵', '🪨', '⛰️', '🌸', '🌻', '🌷', '🌺', '🍄'],
  paths: ['🟫', '⬛', '🟨', '⬜', '🧱'],
  buildings: ['🏠', '🏡', '🏢', '🏛️', '🏪', '🏥', '📚', '🏋️', '⛩️', '🎭', '🏰', '⛪', '🕌', '🕍'],
  decorations: ['⛲', '🪑', '🪴', '🏮', '🎪', '🎡', '🎢', '🗿', '🪦'],
  items: ['📦', '💰', '🎁', '🔑', '⚔️', '🛡️', '💎', '🍎', '🥖', '🧪'],
};

// ============================================================================
// COMPONENT
// ============================================================================

export function GameSandbox() {
  const [config, setConfig] = useState<GameDesignConfig>(DEFAULT_CONFIG);
  const [selectedNPC, setSelectedNPC] = useState<number | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 5, y: 4 });
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState<'characters' | 'tiles' | 'world' | 'preview' | 'assets'>('preview');
  
  // NPC state for preview
  const [npcs] = useState([
    { id: 1, emoji: '👩‍🌾', x: 3, y: 2, name: 'Rosa', expression: '😊' },
    { id: 2, emoji: '👨‍🍳', x: 7, y: 2, name: 'Marco', expression: '😃' },
    { id: 3, emoji: '👩‍🏫', x: 5, y: 6, name: 'Elena', expression: '👆' },
  ]);

  // Sample tiles for preview
  const [tiles] = useState<string[][]>(() => {
    const grid: string[][] = [];
    for (let y = 0; y < 9; y++) {
      const row: string[] = [];
      for (let x = 0; x < 11; x++) {
        // Create a varied landscape
        if (x === 0 || x === 10 || y === 0 || y === 8) {
          row.push('🌲'); // Border trees
        } else if ((x === 5 && y >= 3 && y <= 5) || (y === 4 && x >= 3 && x <= 7)) {
          row.push('🟫'); // Paths
        } else if (x === 3 && y === 2) {
          row.push('🏪'); // Market stall
        } else if (x === 7 && y === 2) {
          row.push('🍳'); // Food stall
        } else if (x === 5 && y === 6) {
          row.push('📚'); // Library
        } else if (Math.random() < 0.1) {
          row.push('🌸'); // Random flowers
        } else {
          row.push('🌿'); // Grass
        }
      }
      grid.push(row);
    }
    return grid;
  });

  // Keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'preview') return;
      
      const newPos = { ...playerPos };
      switch (e.key) {
        case 'ArrowUp': case 'w': newPos.y = Math.max(0, newPos.y - 1); break;
        case 'ArrowDown': case 's': newPos.y = Math.min(8, newPos.y + 1); break;
        case 'ArrowLeft': case 'a': newPos.x = Math.max(0, newPos.x - 1); break;
        case 'ArrowRight': case 'd': newPos.x = Math.min(10, newPos.x + 1); break;
        default: return;
      }
      e.preventDefault();
      setPlayerPos(newPos);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, activeTab]);

  const updateConfig = <K extends keyof GameDesignConfig>(
    section: K,
    key: keyof GameDesignConfig[K],
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const exportConfig = () => {
    const code = `// Game Design Configuration
// Generated from GameSandbox
export const GAME_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code);
    setShowExport(true);
    setTimeout(() => setShowExport(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2a2520] text-white">
      {/* Header */}
      <header className="bg-[#3d3428] border-b border-[#5a4d3a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎮 Game Design Sandbox</h1>
            <p className="text-[#9a8b7a] text-sm">Tweak characters, tiles, and world settings in real-time</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setConfig(DEFAULT_CONFIG)}
              className="px-4 py-2 bg-[#5a4d3a] hover:bg-[#6b5d4d] rounded-lg transition-colors"
            >
              Reset Defaults
            </button>
            <button
              onClick={exportConfig}
              className="px-4 py-2 bg-[#7cb56b] hover:bg-[#5a9a4a] rounded-lg transition-colors"
            >
              {showExport ? '✓ Copied!' : '📋 Export Config'}
            </button>
            <a
              href="/sandbox"
              className="px-4 py-2 bg-[#9b7bb5] hover:bg-[#8a6aa4] rounded-lg transition-colors"
            >
              🎨 UI Sandbox
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#3d3428] border-b border-[#5a4d3a]">
        <div className="max-w-7xl mx-auto flex gap-1 px-6">
          {[
            { id: 'preview', label: '🎮 Live Preview', icon: '🎮' },
            { id: 'characters', label: '👥 Characters', icon: '👥' },
            { id: 'tiles', label: '🗺️ Tiles & World', icon: '🗺️' },
            { id: 'assets', label: '📦 Asset Registry', icon: '📦' },
            { id: 'world', label: '⚙️ Settings', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2a2520] text-white border-t-2 border-[#7cb56b]'
                  : 'text-[#9a8b7a] hover:text-white hover:bg-[#2a2520]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* LIVE PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game World Preview */}
            <div className="lg:col-span-2 bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">Live World Preview</h2>
              <p className="text-[#9a8b7a] text-sm mb-4">Use arrow keys or WASD to move. Click NPCs to interact.</p>
              
              <div 
                className="mx-auto overflow-hidden rounded-xl border-4 border-[#5a4d3a]"
                style={{
                  width: config.world.visibleTilesX * (config.tile.size + config.tile.gap) + config.tile.gap,
                }}
              >
                <div
                  className="grid bg-[#1a1815]"
                  style={{
                    gridTemplateColumns: `repeat(${config.world.visibleTilesX}, ${config.tile.size}px)`,
                    gap: `${config.tile.gap}px`,
                    padding: `${config.tile.gap}px`,
                  }}
                >
                  {tiles.slice(0, config.world.visibleTilesY).map((row, y) => (
                    row.slice(0, config.world.visibleTilesX).map((tile, x) => {
                      const isPlayerHere = playerPos.x === x && playerPos.y === y;
                      const npcHere = npcs.find(n => n.x === x && n.y === y);
                      const isNearPlayer = Math.abs(playerPos.x - x) <= 1 && Math.abs(playerPos.y - y) <= 1;
                      
                      return (
                        <div
                          key={`${x}-${y}`}
                          className="relative flex items-center justify-center"
                          style={{
                            width: config.tile.size,
                            height: config.tile.size,
                            backgroundColor: '#3d5a3d',
                            borderRadius: config.tile.borderRadius,
                          }}
                          onClick={() => {
                            if (npcHere) {
                              setSelectedNPC(selectedNPC === npcHere.id ? null : npcHere.id);
                            }
                          }}
                        >
                          {/* Base tile */}
                          <span style={{ fontSize: config.tile.size * 0.6 }}>{tile}</span>
                          
                          {/* NPC layer */}
                          {npcHere && (
                            <div
                              className="absolute inset-0 flex items-center justify-center cursor-pointer transition-transform"
                              style={{
                                transform: selectedNPC === npcHere.id 
                                  ? `scale(${config.npc.hoverScale})` 
                                  : 'scale(1)',
                                filter: (isNearPlayer && config.npc.highlightGlow) 
                                  ? 'drop-shadow(0 0 8px gold)' 
                                  : `drop-shadow(0 2px 4px rgba(0,0,0,${config.player.shadowIntensity}))`,
                                zIndex: 10,
                              }}
                            >
                              <span style={{ fontSize: config.npc.size }}>{npcHere.emoji}</span>
                              
                              {/* Expression bubble */}
                              {config.npc.showExpressions && isNearPlayer && (
                                <div
                                  className="absolute -top-2 -right-2 bg-white rounded-full flex items-center justify-center"
                                  style={{
                                    width: config.npc.expressionSize + 8,
                                    height: config.npc.expressionSize + 8,
                                    fontSize: config.npc.expressionSize,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                  }}
                                >
                                  {npcHere.expression}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Player layer */}
                          {isPlayerHere && (
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${config.player.bounceAnimation ? 'animate-bounce' : ''}`}
                              style={{
                                filter: `drop-shadow(0 2px 4px rgba(0,0,0,${config.player.shadowIntensity}))`,
                                zIndex: 20,
                                animationDuration: '1s',
                              }}
                            >
                              <span style={{ fontSize: config.player.size }}>{config.player.emoji}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              {/* Dialogue preview when NPC selected */}
              {selectedNPC && (
                <div className="mt-4 bg-[#faf6f0] text-[#3d3428] rounded-xl p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{npcs.find(n => n.id === selectedNPC)?.emoji}</span>
                    <div>
                      <h4 className="font-bold">{npcs.find(n => n.id === selectedNPC)?.name}</h4>
                      <p className="text-[#6b5d4d]">
                        "¡Hola! Look at this..." 
                        <span className="inline-block ml-2 text-2xl animate-bounce">👆</span>
                        <span className="ml-2">🍎</span>
                        <span className="ml-1 font-bold text-[#7cb56b]">manzana</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Controls */}
            <div className="space-y-4">
              {/* Player Quick Config */}
              <div className="bg-[#3d3428] rounded-2xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">{config.player.emoji}</span> Player
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-[#9a8b7a]">Size: {config.player.size}px</label>
                    <input
                      type="range"
                      min="20"
                      max="64"
                      value={config.player.size}
                      onChange={(e) => updateConfig('player', 'size', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CHARACTER_OPTIONS.players.slice(0, 8).map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => updateConfig('player', 'emoji', emoji)}
                        className={`text-2xl p-1 rounded transition-all ${
                          config.player.emoji === emoji ? 'bg-[#7cb56b] scale-110' : 'hover:bg-[#5a4d3a]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* NPC Quick Config */}
              <div className="bg-[#3d3428] rounded-2xl p-4">
                <h3 className="font-bold mb-3">👥 NPCs</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-[#9a8b7a]">Size: {config.npc.size}px</label>
                    <input
                      type="range"
                      min="24"
                      max="72"
                      value={config.npc.size}
                      onChange={(e) => updateConfig('npc', 'size', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9a8b7a]">Expression Size: {config.npc.expressionSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={config.npc.expressionSize}
                      onChange={(e) => updateConfig('npc', 'expressionSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.npc.showExpressions}
                      onChange={(e) => updateConfig('npc', 'showExpressions', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Show expressions</span>
                  </label>
                </div>
              </div>

              {/* Tile Quick Config */}
              <div className="bg-[#3d3428] rounded-2xl p-4">
                <h3 className="font-bold mb-3">🗺️ Tiles</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-[#9a8b7a]">Tile Size: {config.tile.size}px</label>
                    <input
                      type="range"
                      min="32"
                      max="80"
                      value={config.tile.size}
                      onChange={(e) => updateConfig('tile', 'size', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9a8b7a]">Visible Tiles: {config.world.visibleTilesX} × {config.world.visibleTilesY}</label>
                    <input
                      type="range"
                      min="7"
                      max="15"
                      value={config.world.visibleTilesX}
                      onChange={(e) => {
                        const x = parseInt(e.target.value);
                        updateConfig('world', 'visibleTilesX', x);
                        updateConfig('world', 'visibleTilesY', Math.max(5, x - 2));
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHARACTERS TAB */}
        {activeTab === 'characters' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Character */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">🧑‍🎓 Player Character</h2>
              
              <div className="flex items-center gap-6 mb-6">
                {/* Player preview */}
                <div 
                  className={`flex items-center justify-center bg-[#3d5a3d] rounded-xl ${config.player.bounceAnimation ? 'animate-bounce' : ''}`}
                  style={{
                    width: 120,
                    height: 120,
                    filter: `drop-shadow(0 4px 8px rgba(0,0,0,${config.player.shadowIntensity}))`,
                  }}
                >
                  <span style={{ fontSize: config.player.size * 2 }}>{config.player.emoji}</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm text-[#9a8b7a] block mb-1">Character Size</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="20"
                        max="64"
                        value={config.player.size}
                        onChange={(e) => updateConfig('player', 'size', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{config.player.size}px</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-[#9a8b7a] block mb-1">Shadow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={config.player.shadowIntensity * 100}
                      onChange={(e) => updateConfig('player', 'shadowIntensity', parseInt(e.target.value) / 100)}
                      className="w-full"
                    />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.player.bounceAnimation}
                      onChange={(e) => updateConfig('player', 'bounceAnimation', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Idle bounce animation</span>
                  </label>
                </div>
              </div>

              <h3 className="font-medium mb-2 text-[#9a8b7a]">Choose Character</h3>
              <div className="flex flex-wrap gap-2">
                {CHARACTER_OPTIONS.players.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => updateConfig('player', 'emoji', emoji)}
                    className={`text-3xl p-2 rounded-lg transition-all ${
                      config.player.emoji === emoji 
                        ? 'bg-[#7cb56b] ring-2 ring-white scale-110' 
                        : 'bg-[#5a4d3a] hover:bg-[#6b5d4d] hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* NPC Characters */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">👥 NPC Characters</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">NPC Size: {config.npc.size}px</label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={config.npc.size}
                    onChange={(e) => updateConfig('npc', 'size', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Hover Scale: {config.npc.hoverScale}x</label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={config.npc.hoverScale * 100}
                    onChange={(e) => updateConfig('npc', 'hoverScale', parseInt(e.target.value) / 100)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.npc.highlightGlow}
                      onChange={(e) => updateConfig('npc', 'highlightGlow', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Golden glow when nearby</span>
                  </label>
                </div>
              </div>

              {/* NPC Gallery by type */}
              {Object.entries(CHARACTER_OPTIONS.npcs).map(([category, emojis]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-[#9a8b7a] capitalize mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        className="text-2xl p-2 rounded-lg bg-[#5a4d3a] hover:bg-[#6b5d4d] hover:scale-110 transition-all"
                        style={{ fontSize: config.npc.size * 0.6 }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Expressions */}
            <div className="bg-[#3d3428] rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">💬 NPC Expressions & Gestures</h2>
              <p className="text-[#9a8b7a] mb-4">
                Expressions appear as bubbles above NPCs. Great for teaching - NPCs can point 👆 at objects!
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.npc.showExpressions}
                    onChange={(e) => updateConfig('npc', 'showExpressions', e.target.checked)}
                    className="rounded"
                  />
                  <span>Enable expressions</span>
                </label>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[#9a8b7a]">Size:</label>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={config.npc.expressionSize}
                    onChange={(e) => updateConfig('npc', 'expressionSize', parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm">{config.npc.expressionSize}px</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {CHARACTER_OPTIONS.expressions.map(expr => (
                  <div
                    key={expr}
                    className="bg-white rounded-full flex items-center justify-center shadow-md"
                    style={{
                      width: config.npc.expressionSize + 16,
                      height: config.npc.expressionSize + 16,
                      fontSize: config.npc.expressionSize,
                    }}
                  >
                    {expr}
                  </div>
                ))}
              </div>

              {/* Teaching Example */}
              <div className="mt-6 p-4 bg-[#2a2520] rounded-xl">
                <h4 className="font-medium mb-3">📚 Teaching Example</h4>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span style={{ fontSize: config.npc.size }}>👩‍🏫</span>
                    <div
                      className="absolute -top-1 -right-1 bg-white rounded-full flex items-center justify-center shadow"
                      style={{
                        width: config.npc.expressionSize + 8,
                        height: config.npc.expressionSize + 8,
                        fontSize: config.npc.expressionSize,
                      }}
                    >
                      👆
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#3d3428] px-4 py-2 rounded-lg">
                    <span className="text-3xl">🍎</span>
                    <span className="text-xl font-bold text-[#7cb56b]">manzana</span>
                  </div>
                  <span className="text-[#9a8b7a]">→</span>
                  <span className="text-[#9a8b7a]">"This is an apple!"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TILES TAB */}
        {activeTab === 'tiles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tile Settings */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">🗺️ Tile Configuration</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Tile Size: {config.tile.size}px</label>
                  <input
                    type="range"
                    min="32"
                    max="80"
                    value={config.tile.size}
                    onChange={(e) => updateConfig('tile', 'size', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Gap: {config.tile.gap}px</label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={config.tile.gap}
                    onChange={(e) => updateConfig('tile', 'gap', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Border Radius: {config.tile.borderRadius}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={config.tile.borderRadius}
                    onChange={(e) => updateConfig('tile', 'borderRadius', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Tile Sample Grid */}
              <h3 className="font-medium mb-2 text-[#9a8b7a]">Preview</h3>
              <div
                className="grid bg-[#1a1815] rounded-lg p-2"
                style={{
                  gridTemplateColumns: `repeat(5, ${config.tile.size}px)`,
                  gap: `${config.tile.gap}px`,
                }}
              >
                {['🌿', '🌿', '🟫', '🌿', '🌳', '🌿', '🌸', '🟫', '🌿', '🌿', '🏠', '🌿', '🟫', '🌿', '🌲', '🌿', '🌿', '🟫', '🌻', '🌿', '🪨', '🌿', '🟫', '🌿', '⛲'].map((tile, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{
                      width: config.tile.size,
                      height: config.tile.size,
                      backgroundColor: '#3d5a3d',
                      borderRadius: config.tile.borderRadius,
                      fontSize: config.tile.size * 0.6,
                    }}
                  >
                    {tile}
                  </div>
                ))}
              </div>
            </div>

            {/* Tile Library */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">📦 Tile Library</h2>
              
              {Object.entries(TILE_OPTIONS).map(([category, tiles]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-[#9a8b7a] capitalize mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {tiles.map(tile => (
                      <div
                        key={tile}
                        className="flex items-center justify-center bg-[#3d5a3d] hover:ring-2 hover:ring-[#7cb56b] transition-all cursor-pointer"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: config.tile.borderRadius,
                          fontSize: 28,
                        }}
                      >
                        {tile}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Building Settings */}
            <div className="bg-[#3d3428] rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">🏛️ Building Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Base Size: {config.building.baseSize}px</label>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={config.building.baseSize}
                    onChange={(e) => updateConfig('building', 'baseSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Max Size: {config.building.maxSize}px</label>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={config.building.maxSize}
                    onChange={(e) => updateConfig('building', 'maxSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">Level Scaling: +{config.building.levelScaling}px/level</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={config.building.levelScaling}
                    onChange={(e) => updateConfig('building', 'levelScaling', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Building progression preview */}
              <div className="flex items-end gap-4 justify-center bg-[#2a2520] rounded-xl p-6">
                {[
                  { level: 1, icon: '📍', label: 'Foundation' },
                  { level: 5, icon: '🏕️', label: 'Camp' },
                  { level: 10, icon: '🏠', label: 'House' },
                  { level: 20, icon: '🏰', label: 'Castle' },
                ].map(({ level, icon, label }) => {
                  const size = Math.min(
                    config.building.baseSize + level * config.building.levelScaling,
                    config.building.maxSize
                  );
                  return (
                    <div key={level} className="text-center">
                      <div
                        className="flex items-center justify-center bg-[#5a4d3a] rounded-lg mb-2"
                        style={{ width: size, height: size, fontSize: size * 0.6 }}
                      >
                        {icon}
                      </div>
                      <div className="text-xs text-[#9a8b7a]">{label}</div>
                      <div className="text-xs">Lv.{level}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ASSET REGISTRY TAB */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Registry Info */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">📦 Asset Registry System</h2>
              <p className="text-[#9a8b7a] mb-4">
                All game visuals are registered in the Asset Registry. Currently using emoji placeholders 
                that will be replaced with original art. The <code className="bg-[#2a2520] px-1 rounded">Sprite</code> component 
                handles rendering both emoji and image-based assets.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-2">📁 Asset Categories</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">Players:</span>
                      <span>{AssetRegistry.getCategory('player').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">NPCs:</span>
                      <span>{AssetRegistry.getCategory('npc').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">Tiles:</span>
                      <span>{AssetRegistry.getCategory('tile').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">Buildings:</span>
                      <span>{AssetRegistry.getCategory('building').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">Expressions:</span>
                      <span>{AssetRegistry.getCategory('expression').length + AssetRegistry.getCategory('gesture').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">Items:</span>
                      <span>{AssetRegistry.getCategory('item').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9a8b7a]">UI:</span>
                      <span>{AssetRegistry.getCategory('ui').length}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{AssetRegistry.getAllIds().length}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-2">🎯 Typed Asset IDs</h4>
                  <p className="text-sm text-[#9a8b7a] mb-2">Use these constants for type safety:</p>
                  <pre className="text-xs overflow-auto max-h-32 bg-[#1a1815] p-2 rounded">
{`AssetIds.player.default  // 'player.default'
AssetIds.npc.vendor.farmer
AssetIds.tile.grass
AssetIds.gesture.pointUp`}</pre>
                </div>
              </div>
            </div>

            {/* Sprite Component Demo */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">🖼️ Sprite Component</h2>
              <p className="text-[#9a8b7a] mb-4">
                The <code className="bg-[#2a2520] px-1 rounded">Sprite</code> component renders assets with consistent styling.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-3">Basic Sprites</h4>
                  <div className="flex items-end gap-4">
                    <div className="text-center">
                      <Sprite id="player.default" size={24} />
                      <p className="text-xs text-[#9a8b7a] mt-1">24px</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="player.default" size={32} />
                      <p className="text-xs text-[#9a8b7a] mt-1">32px</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="player.default" size={48} />
                      <p className="text-xs text-[#9a8b7a] mt-1">48px</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="player.default" size={64} />
                      <p className="text-xs text-[#9a8b7a] mt-1">64px</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-3">With Effects</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Sprite id="npc.vendor.farmer" size={40} shadow />
                      <p className="text-xs text-[#9a8b7a] mt-1">shadow</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="npc.vendor.farmer" size={40} glow />
                      <p className="text-xs text-[#9a8b7a] mt-1">glow</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="npc.vendor.farmer" size={40} bounce />
                      <p className="text-xs text-[#9a8b7a] mt-1">bounce</p>
                    </div>
                    <div className="text-center">
                      <Sprite id="npc.vendor.farmer" size={40} flipX />
                      <p className="text-xs text-[#9a8b7a] mt-1">flipX</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-3">Character Component</h4>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Character characterId="npc.teacher.default" size={48} />
                      <p className="text-xs text-[#9a8b7a] mt-1">Basic</p>
                    </div>
                    <div className="text-center">
                      <Character 
                        characterId="npc.teacher.default" 
                        size={48} 
                        expressionId="gesture.point.up"
                        expressionSize={18}
                      />
                      <p className="text-xs text-[#9a8b7a] mt-1">+ Expression</p>
                    </div>
                    <div className="text-center">
                      <Character 
                        characterId="npc.teacher.default" 
                        size={48} 
                        expressionId="gesture.point.up"
                        highlighted
                      />
                      <p className="text-xs text-[#9a8b7a] mt-1">+ Highlighted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Add Custom Art */}
            <div className="bg-[#3d3428] rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">🎨 Adding Custom Art</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-2">Step 1: Create Art</h4>
                  <p className="text-sm text-[#9a8b7a]">
                    Create PNG/SVG sprites. Recommended sizes: Characters 64x64, Tiles 32x32 or 64x64, UI 24x24.
                  </p>
                </div>
                
                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-2">Step 2: Add to Public</h4>
                  <p className="text-sm text-[#9a8b7a]">
                    Place files in <code className="bg-[#1a1815] px-1 rounded">public/assets/</code> folder.
                    Example: <code className="bg-[#1a1815] px-1 rounded">public/assets/player/default.png</code>
                  </p>
                </div>
                
                <div className="p-4 bg-[#2a2520] rounded-xl">
                  <h4 className="font-medium mb-2">Step 3: Register</h4>
                  <p className="text-sm text-[#9a8b7a] mb-2">
                    Override the asset in AssetRegistry:
                  </p>
                  <pre className="text-xs bg-[#1a1815] p-2 rounded overflow-auto">
{`AssetRegistry.override(
  'player.default',
  { 
    type: 'image',
    src: '/assets/player/default.png'
  }
);`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'world' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* World Grid Settings */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">🌍 World Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">
                    Visible Tiles Horizontal: {config.world.visibleTilesX}
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="19"
                    step="2"
                    value={config.world.visibleTilesX}
                    onChange={(e) => updateConfig('world', 'visibleTilesX', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#9a8b7a] block mb-1">
                    Visible Tiles Vertical: {config.world.visibleTilesY}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="2"
                    value={config.world.visibleTilesY}
                    onChange={(e) => updateConfig('world', 'visibleTilesY', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#2a2520] rounded-xl">
                <h4 className="font-medium mb-2">📐 Calculated Viewport</h4>
                <div className="text-sm text-[#9a8b7a] space-y-1">
                  <p>Viewport: {config.world.visibleTilesX * config.tile.size}px × {config.world.visibleTilesY * config.tile.size}px</p>
                  <p>Total tiles visible: {config.world.visibleTilesX * config.world.visibleTilesY}</p>
                </div>
              </div>
            </div>

            {/* Export Configuration */}
            <div className="bg-[#3d3428] rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">📤 Export Configuration</h2>
              
              <pre className="bg-[#1a1815] rounded-xl p-4 overflow-auto text-sm max-h-80">
                {JSON.stringify(config, null, 2)}
              </pre>
              
              <button
                onClick={exportConfig}
                className="w-full mt-4 py-3 bg-[#7cb56b] hover:bg-[#5a9a4a] rounded-xl font-medium transition-colors"
              >
                {showExport ? '✓ Copied to Clipboard!' : '📋 Copy Configuration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
