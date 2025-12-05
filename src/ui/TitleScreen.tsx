/**
 * TitleScreen - Game entry point
 * 
 * Simple, warm welcome screen with:
 * - Game logo/title
 * - Continue/New Game buttons
 * - Settings access
 */

import { useState } from 'react';
import { useWorldStore } from '../core/worldStore';
import { useSkillStore } from '../core/stores';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export function TitleScreen({ onStart, onOpenSettings }: TitleScreenProps) {
  const { exploredTiles } = useWorldStore();
  const { profile } = useSkillStore();
  const [isHovering, setIsHovering] = useState(false);
  
  const hasSaveData = exploredTiles.size > 0 || Object.keys(profile.skills).length > 0;
  const totalLevel = Object.values(profile.skills).reduce((sum, s) => sum + s.level, 0);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #fef3c7, #fde68a, #fcd34d)',
      }}
    >
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating clouds */}
        <div className="absolute top-[10%] left-[5%] text-6xl opacity-40 animate-pulse" style={{ animationDuration: '4s' }}>☁️</div>
        <div className="absolute top-[15%] right-[10%] text-5xl opacity-30 animate-pulse" style={{ animationDuration: '5s' }}>☁️</div>
        <div className="absolute top-[5%] left-[40%] text-4xl opacity-50 animate-pulse" style={{ animationDuration: '6s' }}>☁️</div>
        
        {/* Sun */}
        <div className="absolute top-[8%] right-[15%] text-7xl animate-pulse" style={{ animationDuration: '3s' }}>🌤️</div>
        
        {/* Trees and nature */}
        <div className="absolute bottom-[5%] left-[5%] text-5xl">🌳</div>
        <div className="absolute bottom-[8%] left-[15%] text-4xl">🌲</div>
        <div className="absolute bottom-[5%] right-[5%] text-5xl">🌳</div>
        <div className="absolute bottom-[10%] right-[12%] text-4xl">🌻</div>
        <div className="absolute bottom-[6%] left-[30%] text-3xl">🌷</div>
        <div className="absolute bottom-[4%] right-[30%] text-3xl">🌸</div>
        
        {/* Buildings in distance */}
        <div className="absolute bottom-[15%] left-[25%] text-4xl opacity-60">🏠</div>
        <div className="absolute bottom-[18%] left-[45%] text-5xl opacity-70">🏛️</div>
        <div className="absolute bottom-[16%] right-[25%] text-4xl opacity-60">🏪</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          className="mb-8 transition-transform duration-300"
          style={{ transform: isHovering ? 'scale(1.05)' : 'scale(1)' }}
        >
          <h1 
            className="text-7xl font-bold mb-2 tracking-tight"
            style={{ 
              color: '#78350f',
              textShadow: '3px 3px 0 #fbbf24, 6px 6px 0 rgba(120, 53, 15, 0.2)',
              fontFamily: 'Nunito, system-ui, sans-serif',
            }}
          >
            🌱 XPira
          </h1>
          <p 
            className="text-xl text-center"
            style={{ color: '#92400e' }}
          >
            Grow your real-life skills
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-64">
          {/* Main play button */}
          <button
            onClick={onStart}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full py-4 px-8 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
              color: 'white',
              boxShadow: '0 4px 0 #15803d, 0 6px 20px rgba(0,0,0,0.2)',
            }}
          >
            {hasSaveData ? '▶ Continue' : '▶ Start Adventure'}
          </button>

          {/* Save info */}
          {hasSaveData && (
            <div 
              className="text-center py-2 px-4 rounded-xl text-sm"
              style={{ 
                background: 'rgba(255,255,255,0.6)',
                color: '#78350f',
              }}
            >
              <span className="font-medium">Level {totalLevel}</span>
              <span className="mx-2">•</span>
              <span>{Object.keys(profile.skills).length} skills tracked</span>
            </div>
          )}

          {/* New game (if save exists) */}
          {hasSaveData && (
            <button
              onClick={() => {
                if (confirm('Start a new adventure? Your current progress will be lost.')) {
                  // Clear save data
                  localStorage.removeItem('xpira-world');
                  localStorage.removeItem('xpira-skills');
                  window.location.reload();
                }
              }}
              className="w-full py-2 px-4 rounded-xl font-medium transition-all hover:bg-white/50"
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: '#92400e',
              }}
            >
              + New Game
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-full py-2 px-4 rounded-xl font-medium transition-all hover:bg-white/50"
            style={{
              background: 'rgba(255,255,255,0.3)',
              color: '#92400e',
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Version / credits */}
      <div 
        className="absolute bottom-4 text-sm opacity-60"
        style={{ color: '#78350f' }}
      >
        v0.1.0 • Made with 💚
      </div>
    </div>
  );
}
