/**
 * Character Sheet
 * 
 * D&D-style character sheet displaying the player's attributes,
 * skill progression, and stats.name integration status.
 */

import { useState } from 'react';
import { useSkillStore } from '../core/stores';
import { ATTRIBUTES, getAttributeModifier } from '../core/types';
import { getSkillsByAttribute, getSkill, getChildSkills } from '../core/skills';
import type { Attribute, SkillProgress } from '../core/types';

interface SkillRowProps {
  skillId: string;
  progress?: SkillProgress;
  depth?: number;
}

function SkillRow({ skillId, progress, depth = 0 }: SkillRowProps) {
  const [expanded, setExpanded] = useState(false);
  const skill = getSkill(skillId);
  const children = getChildSkills(skillId);
  
  if (!skill) return null;
  
  const level = progress?.level || 1;
  const currentXp = progress?.currentXp || 0;
  const xpNeeded = Math.floor(skill.xpPerLevel * Math.pow(1.5, level - 1));
  const xpPercent = (currentXp / xpNeeded) * 100;
  
  return (
    <>
      <div 
        className={`flex items-center gap-2 py-1 hover:bg-white/5 rounded px-2 cursor-pointer`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => children.length > 0 && setExpanded(!expanded)}
      >
        {children.length > 0 && (
          <span className="text-gray-500 w-4">
            {expanded ? '▼' : '▶'}
          </span>
        )}
        {children.length === 0 && <span className="w-4" />}
        
        <span className="text-lg">{skill.icon || '📊'}</span>
        <span className="flex-1 text-sm">{skill.name}</span>
        <span className="text-xs text-gray-400 w-8 text-right">Lv{level}</span>
        
        {/* Mini XP bar */}
        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
      
      {expanded && children.map(child => (
        <SkillRow 
          key={child.id}
          skillId={child.id}
          progress={useSkillStore.getState().profile.skills[child.id]}
          depth={depth + 1}
        />
      ))}
    </>
  );
}

interface AttributeCardProps {
  attribute: Attribute;
  score: number;
  expanded: boolean;
  onToggle: () => void;
}

function AttributeCard({ attribute, score, expanded, onToggle }: AttributeCardProps) {
  const { profile } = useSkillStore();
  const def = ATTRIBUTES[attribute];
  const modifier = getAttributeModifier(score);
  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  // Get root skills for this attribute
  const rootSkills = getSkillsByAttribute(attribute).filter(s => !s.parentId);
  
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      {/* Attribute Header */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
      >
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: def.color + '33' }}
        >
          {def.icon}
        </div>
        
        <div className="flex-1 text-left">
          <div className="font-bold text-white">{def.name}</div>
          <div className="text-xs text-gray-400">{def.description}</div>
        </div>
        
        {/* D&D-style score display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div 
            className="text-sm font-medium"
            style={{ color: def.color }}
          >
            {modifierStr}
          </div>
        </div>
        
        <span className="text-gray-500">
          {expanded ? '▼' : '▶'}
        </span>
      </button>
      
      {/* Skill List */}
      {expanded && (
        <div className="border-t border-gray-700 py-2">
          {rootSkills.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-4">
              No skills unlocked yet
            </div>
          ) : (
            rootSkills.map(skill => (
              <SkillRow 
                key={skill.id}
                skillId={skill.id}
                progress={profile.skills[skill.id]}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function CharacterSheet() {
  const { profile, statsName } = useSkillStore();
  const [expandedAttr, setExpandedAttr] = useState<Attribute | null>('INT');
  
  const toggleAttribute = (attr: Attribute) => {
    setExpandedAttr(expandedAttr === attr ? null : attr);
  };
  
  // Calculate total skill levels
  const totalSkillLevels = Object.values(profile.skills).reduce(
    (sum, s) => sum + s.level, 
    0
  );
  
  return (
    <div className="character-sheet bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-xl border border-gray-700 max-w-md w-full max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <div className="text-sm text-gray-400">
            Level {profile.totalLevel} • {profile.totalXp.toLocaleString()} XP
          </div>
        </div>
        
        {/* stats.name connection */}
        <div className="text-right">
          {statsName.connected ? (
            <div className="text-green-400 text-xs">
              ✓ Connected to stats.name
            </div>
          ) : (
            <button className="text-xs text-purple-400 hover:text-purple-300">
              Connect stats.name
            </button>
          )}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-yellow-400">🪙 {profile.coins}</div>
          <div className="text-xs text-gray-400">Coins</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-orange-400">🔥 {profile.currentStreak}</div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-400">📊 {totalSkillLevels}</div>
          <div className="text-xs text-gray-400">Skill Levels</div>
        </div>
      </div>
      
      {/* Attributes */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
          Attributes & Skills
        </h3>
        
        {(Object.keys(ATTRIBUTES) as Attribute[]).map(attr => (
          <AttributeCard
            key={attr}
            attribute={attr}
            score={profile.attributes[attr]}
            expanded={expandedAttr === attr}
            onToggle={() => toggleAttribute(attr)}
          />
        ))}
      </div>
      
      {/* Real Life First Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Today's Play Time</span>
          <span className="text-white">
            {profile.dailyPlayTime} / {profile.dailyPlayLimit + profile.realWorldUnlocks} min
          </span>
        </div>
        {profile.realWorldUnlocks > 0 && (
          <div className="text-xs text-green-400 mt-1">
            +{profile.realWorldUnlocks} min from real-world activities
          </div>
        )}
      </div>
    </div>
  );
}
