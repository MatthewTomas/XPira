/**
 * WorldGrid - 2D Isometric-ish Grid World
 * 
 * A cozy village that grows as the user adds skills.
 * Each skill category has its own district/building type.
 * Buildings appear and upgrade as skills level up.
 * 
 * Visual style: Cozy, warm, pixel-art inspired but smooth
 */

import { useState, useMemo } from 'react';
import { useSkillStore } from '../core/stores';
import { ATTRIBUTES } from '../core/types';
import { getSkill } from '../core/skills';
import type { Attribute } from '../core/types';

interface WorldGridProps {
  onSelectBuilding: (skillId: string) => void;
  onBack: () => void;
}

// Building definitions for each attribute
const DISTRICT_THEMES: Record<Attribute, {
  name: string;
  icon: string;
  buildingEmoji: string;
  color: string;
  bgGradient: string;
}> = {
  STR: {
    name: 'Training Grounds',
    icon: '💪',
    buildingEmoji: '🏋️',
    color: '#e07b6b',
    bgGradient: 'from-red-100 to-orange-100',
  },
  DEX: {
    name: 'Artisan Quarter',
    icon: '🎯',
    buildingEmoji: '🎨',
    color: '#7cb56b',
    bgGradient: 'from-green-100 to-emerald-100',
  },
  CON: {
    name: 'Wellness Garden',
    icon: '❤️',
    buildingEmoji: '🏡',
    color: '#e8a855',
    bgGradient: 'from-amber-100 to-yellow-100',
  },
  INT: {
    name: 'Scholar District',
    icon: '📚',
    buildingEmoji: '🏛️',
    color: '#5ba8c9',
    bgGradient: 'from-blue-100 to-cyan-100',
  },
  WIS: {
    name: 'Temple Gardens',
    icon: '🧘',
    buildingEmoji: '⛩️',
    color: '#9b7bb5',
    bgGradient: 'from-purple-100 to-violet-100',
  },
  CHA: {
    name: 'Social Plaza',
    icon: '💬',
    buildingEmoji: '🎭',
    color: '#e8a0b5',
    bgGradient: 'from-pink-100 to-rose-100',
  },
};

// Building component for a single skill
interface BuildingProps {
  skillId: string;
  level: number;
  onClick: () => void;
  style?: React.CSSProperties;
}

function Building({ skillId, level, onClick, style }: BuildingProps) {
  const skill = getSkill(skillId);
  if (!skill) return null;

  // Building size scales with level
  const size = Math.min(48 + level * 4, 80);
  const theme = DISTRICT_THEMES[skill.attribute];
  
  // Building evolves visually at certain levels
  const getBuildingStage = () => {
    if (level >= 20) return '🏰'; // Castle/mastery
    if (level >= 10) return '🏠'; // House
    if (level >= 5) return '🏕️'; // Tent/camp
    return '📍'; // Marker/foundation
  };

  return (
    <button
      onClick={onClick}
      className="group relative transition-all duration-200 hover:scale-110 hover:z-10"
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      {/* Building shadow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 rounded-full blur-sm"
      />
      
      {/* Building icon */}
      <div 
        className="relative flex items-center justify-center w-full h-full text-2xl"
        style={{ fontSize: size * 0.6 }}
      >
        {skill.icon || getBuildingStage()}
      </div>
      
      {/* Level badge */}
      {level > 0 && (
        <div 
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: theme.color }}
        >
          {level}
        </div>
      )}
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        <div className="bg-amber-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
          <div className="font-bold">{skill.name}</div>
          <div className="text-amber-200">Level {level}</div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-900" />
      </div>
    </button>
  );
}

// District section showing all buildings for one attribute
interface DistrictProps {
  attribute: Attribute;
  skills: Array<{ id: string; level: number }>;
  onSelectSkill: (skillId: string) => void;
  expanded: boolean;
  onToggle: () => void;
}

function District({ attribute, skills, onSelectSkill, expanded, onToggle }: DistrictProps) {
  const theme = DISTRICT_THEMES[attribute];
  const attrDef = ATTRIBUTES[attribute];
  
  return (
    <div className={`rounded-2xl overflow-hidden transition-all ${expanded ? 'col-span-2 row-span-2' : ''}`}>
      {/* District header */}
      <button
        onClick={onToggle}
        className={`w-full p-3 bg-gradient-to-br ${theme.bgGradient} flex items-center gap-2 hover:brightness-105 transition-all`}
      >
        <span className="text-xl">{attrDef.icon}</span>
        <span className="font-bold text-amber-900">{theme.name}</span>
        <span className="ml-auto text-sm text-amber-600">{skills.length} skills</span>
      </button>
      
      {/* Buildings area */}
      <div className={`bg-gradient-to-br ${theme.bgGradient} bg-opacity-50 p-4 ${expanded ? 'min-h-[200px]' : 'min-h-[100px]'}`}>
        {skills.length === 0 ? (
          <div className="flex items-center justify-center h-full text-amber-400 text-sm">
            <span>No skills tracked yet</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {skills.map((skill) => (
              <Building
                key={skill.id}
                skillId={skill.id}
                level={skill.level}
                onClick={() => onSelectSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main town square / central area
function TownSquare({ totalLevel, onOpenShop }: { totalLevel: number; onOpenShop: () => void }) {
  // Town square evolves based on total progress
  const getTownSquareStage = () => {
    if (totalLevel >= 100) return { emoji: '🏰', name: 'Grand Castle' };
    if (totalLevel >= 50) return { emoji: '🏛️', name: 'Town Hall' };
    if (totalLevel >= 20) return { emoji: '⛲', name: 'Town Square' };
    if (totalLevel >= 5) return { emoji: '🪵', name: 'Campfire' };
    return { emoji: '🌱', name: 'Your Journey Begins' };
  };

  const stage = getTownSquareStage();

  return (
    <div className="col-span-2 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4">🌳</div>
        <div className="absolute top-4 right-6">🌲</div>
        <div className="absolute bottom-3 left-8">🌻</div>
        <div className="absolute bottom-2 right-4">🌷</div>
      </div>
      
      {/* Main building */}
      <div className="text-6xl mb-2 animate-bounce" style={{ animationDuration: '3s' }}>
        {stage.emoji}
      </div>
      <div className="font-bold text-amber-900 text-lg">{stage.name}</div>
      <div className="text-amber-600 text-sm">Total Level: {totalLevel}</div>
      
      {/* Shop button */}
      <button
        onClick={onOpenShop}
        className="mt-4 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl font-medium shadow-md transition-all hover:scale-105"
      >
        🛒 Visit Shop
      </button>
    </div>
  );
}

export function WorldGrid({ onSelectBuilding, onBack }: WorldGridProps) {
  const { profile } = useSkillStore();
  const [expandedDistrict, setExpandedDistrict] = useState<Attribute | null>(null);

  // Group tracked skills by attribute
  const skillsByAttribute = useMemo(() => {
    const grouped: Record<Attribute, Array<{ id: string; level: number }>> = {
      STR: [], DEX: [], CON: [], INT: [], WIS: [], CHA: [],
    };

    Object.entries(profile.skills).forEach(([skillId, progress]) => {
      const skill = getSkill(skillId);
      if (skill) {
        grouped[skill.attribute].push({
          id: skillId,
          level: progress.level,
        });
      }
    });

    return grouped;
  }, [profile.skills]);

  const totalLevel = Object.values(profile.skills).reduce((sum, s) => sum + s.level, 0);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 overflow-hidden">
      {/* Sky with clouds */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <div className="absolute top-4 left-[10%] text-4xl opacity-80 animate-pulse" style={{ animationDuration: '4s' }}>☁️</div>
        <div className="absolute top-8 left-[40%] text-3xl opacity-60 animate-pulse" style={{ animationDuration: '5s' }}>☁️</div>
        <div className="absolute top-2 right-[20%] text-5xl opacity-70 animate-pulse" style={{ animationDuration: '6s' }}>☁️</div>
        <div className="absolute top-16 right-[35%] text-2xl opacity-50 animate-pulse" style={{ animationDuration: '4.5s' }}>☁️</div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="bg-white/80 hover:bg-white text-amber-800 px-4 py-2 rounded-xl font-medium shadow-md transition-all flex items-center gap-2"
        >
          ← Back
        </button>
        
        <div className="bg-white/80 px-4 py-2 rounded-xl shadow-md">
          <span className="font-bold text-amber-900">🏘️ Your Village</span>
        </div>
        
        <div className="bg-white/80 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
          <span className="text-amber-600">🪙</span>
          <span className="font-bold text-amber-900">{profile.coins}</span>
        </div>
      </header>

      {/* Main grid area */}
      <div className="relative z-10 p-4 h-[calc(100%-80px)] overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Town Square - Center piece */}
          <TownSquare 
            totalLevel={totalLevel}
            onOpenShop={() => console.log('Open shop')}
          />

          {/* Districts for each attribute */}
          {(Object.keys(ATTRIBUTES) as Attribute[]).map(attr => (
            <District
              key={attr}
              attribute={attr}
              skills={skillsByAttribute[attr]}
              onSelectSkill={onSelectBuilding}
              expanded={expandedDistrict === attr}
              onToggle={() => setExpandedDistrict(expandedDistrict === attr ? null : attr)}
            />
          ))}
        </div>
      </div>

      {/* Ground decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-200/50 to-transparent" />
    </div>
  );
}
