/**
 * WindTransition - Full-screen wind effect for language switching
 * 
 * When a player switches languages, a magical wind blows through
 * the world, transforming all place names and text to the new language.
 */

import { useEffect, useState, useCallback } from 'react';

interface WindTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  newLanguageName?: string;
}

// Wind particle for the animation
interface WindParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
  size: number;
  opacity: number;
  rotation: number;
}

// Leaf and wind emojis for particles
const WIND_EMOJIS = ['🍃', '🌿', '🍂', '🌬️', '💨', '🌸', '✨', '🌊'];

export function WindTransition({ isActive, onComplete, newLanguageName }: WindTransitionProps) {
  const [particles, setParticles] = useState<WindParticle[]>([]);
  const [phase, setPhase] = useState<'idle' | 'wind' | 'transform' | 'settle'>('idle');
  const [showText, setShowText] = useState(false);
  
  // Generate particles
  const generateParticles = useCallback(() => {
    const newParticles: WindParticle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: -100 - Math.random() * 200, // Start off-screen left
        y: Math.random() * 100, // Random vertical position (%)
        emoji: WIND_EMOJIS[Math.floor(Math.random() * WIND_EMOJIS.length)],
        speed: 2 + Math.random() * 3, // Speed variation
        size: 1 + Math.random() * 2, // Size variation (rem)
        opacity: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      });
    }
    return newParticles;
  }, []);
  
  // Start animation when active
  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      setShowText(false);
      setParticles([]);
      return;
    }
    
    // Phase 1: Wind starts
    setPhase('wind');
    setParticles(generateParticles());
    
    // Phase 2: Transform text appears
    const transformTimer = setTimeout(() => {
      setPhase('transform');
      setShowText(true);
    }, 800);
    
    // Phase 3: Wind settles
    const settleTimer = setTimeout(() => {
      setPhase('settle');
    }, 1800);
    
    // Phase 4: Complete
    const completeTimer = setTimeout(() => {
      setPhase('idle');
      onComplete();
    }, 2500);
    
    return () => {
      clearTimeout(transformTimer);
      clearTimeout(settleTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete, generateParticles]);
  
  // Animate particles
  useEffect(() => {
    if (phase === 'idle' || particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speed * 3,
          rotation: p.rotation + p.speed * 2,
        })).filter(p => p.x < 150) // Remove off-screen particles
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, [phase, particles.length]);
  
  if (!isActive && phase === 'idle') return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{
        background: phase === 'transform' 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'transparent',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Wind overlay gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: phase !== 'idle' 
            ? 'linear-gradient(90deg, rgba(200, 230, 255, 0.4) 0%, transparent 50%, rgba(200, 230, 255, 0.2) 100%)'
            : 'transparent',
          opacity: phase === 'settle' ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      />
      
      {/* Wind particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}rem`,
            opacity: phase === 'settle' ? 0 : particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'opacity 0.3s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      {/* Language change text */}
      {showText && newLanguageName && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            animation: phase === 'settle' ? 'fadeOut 0.5s forwards' : 'fadeIn 0.3s forwards',
          }}
        >
          <div 
            className="text-center px-8 py-6 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              animation: 'scaleIn 0.3s ease-out',
            }}
          >
            <div className="text-4xl mb-2">🌬️✨</div>
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: '#2d3436' }}
            >
              The wind carries change...
            </div>
            <div 
              className="text-lg"
              style={{ color: '#636e72' }}
            >
              Now speaking <span className="font-bold text-emerald-600">{newLanguageName}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Wind sound visual indicator */}
      {phase === 'wind' && (
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 text-6xl opacity-60"
          style={{
            animation: 'windPush 0.5s ease-out infinite',
          }}
        >
          🌬️
        </div>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(1.1); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes windPush {
          0% { transform: translateX(-100%) translateY(-50%); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(100vw) translateY(-50%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
