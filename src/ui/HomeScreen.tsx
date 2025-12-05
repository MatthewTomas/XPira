/**
 * XPira Home Screen
 * 
 * The main dashboard showing the player's skill profile with
 * expandable folder-style navigation. Click an attribute to see
 * categories, click a category to see skills, add new skills to track.
 */

import { useState } from 'react';
import { useSkillStore } from '../core/stores';
import { ATTRIBUTES, getAttributeModifier } from '../core/types';
import { 
  getSkillsByAttribute, 
  getSkill, 
  getChildSkills,
} from '../core/skills';
import type { Attribute } from '../core/types';

interface HomeScreenProps {
  onStartActivity: (skillId: string) => void;
  onOpenSettings: () => void;
}

// Folder/file icons
const FolderIcon = ({ open }: { open: boolean }) => (
  <span className="text-yellow-400">{open ? '📂' : '📁'}</span>
);

const SkillIcon = ({ icon }: { icon?: string }) => (
  <span>{icon || '📄'}</span>
);

interface SkillNodeRowProps {
  skillId: string;
  depth: number;
  onStartActivity: (skillId: string) => void;
}

function SkillNodeRow({ skillId, depth, onStartActivity }: SkillNodeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { profile, addSkillXp } = useSkillStore();
  const skill = getSkill(skillId);
  const children = getChildSkills(skillId);
  const progress = profile.skills[skillId];
  
  if (!skill) return null;
  
  const hasChildren = children.length > 0;
  const isTracked = !!progress;
  const level = progress?.level || 0;
  const currentXp = progress?.currentXp || 0;
  const xpNeeded = Math.floor(skill.xpPerLevel * Math.pow(1.5, Math.max(0, level - 1)));
  const xpPercent = level > 0 ? (currentXp / xpNeeded) * 100 : 0;
  
  // Can practice if the skill has an in-game scene (we'll auto-track when starting)
  const canPractice = skill.hasInGameScene;
  
  const handleStartPractice = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Auto-track the skill if not already tracked
    if (!isTracked) {
      addSkillXp(skillId, 0, 'in-game');
    }
    onStartActivity(skillId);
  };
  
  return (
    <>
      <div 
        className={`
          flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer
          hover:bg-amber-100/50 transition-colors group
          ${isTracked ? 'text-amber-900' : 'text-amber-700/60'}
        `}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => hasChildren ? setExpanded(!expanded) : null}
      >
        {/* Expand/collapse or skill icon */}
        {hasChildren ? (
          <FolderIcon open={expanded} />
        ) : (
          <SkillIcon icon={skill.icon} />
        )}
        
        {/* Skill name */}
        <span className="flex-1 font-medium">{skill.name}</span>
        
        {/* Level badge or Add button */}
        {isTracked ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-600/60">Lv</span>
            <span className="font-bold text-emerald-600 w-6">{level}</span>
            
            {/* Mini XP bar */}
            <div className="w-20 h-2 bg-amber-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            
            {/* Practice button - always visible for practicable skills */}
            {canPractice && (
              <button
                onClick={handleStartPractice}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all shadow-sm hover:scale-105"
              >
                ▶ Play
              </button>
            )}
          </div>
        ) : (
          /* Not tracked yet - show Play or Track button */
          canPractice ? (
            <button
              onClick={handleStartPractice}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all shadow-sm hover:scale-105"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Start tracking this skill
                addSkillXp(skillId, 0, 'in-game');
              }}
              className="opacity-0 group-hover:opacity-100 bg-amber-500 hover:bg-amber-400 text-white px-2 py-1 rounded-lg text-xs font-medium transition-all shadow-sm"
            >
              + Track
            </button>
          )
        )}
      </div>
      
      {/* Children */}
      {expanded && children.map(child => (
        <SkillNodeRow 
          key={child.id}
          skillId={child.id}
          depth={depth + 1}
          onStartActivity={onStartActivity}
        />
      ))}
    </>
  );
}

interface AttributeSectionProps {
  attribute: Attribute;
  expanded: boolean;
  onToggle: () => void;
  onStartActivity: (skillId: string) => void;
}

function AttributeSection({ attribute, expanded, onToggle, onStartActivity }: AttributeSectionProps) {
  const { profile } = useSkillStore();
  const def = ATTRIBUTES[attribute];
  const score = profile.attributes[attribute];
  const modifier = getAttributeModifier(score);
  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  // Get root skills for this attribute
  const rootSkills = getSkillsByAttribute(attribute).filter(s => !s.parentId);
  
  // Count tracked skills
  const trackedCount = rootSkills.filter(s => profile.skills[s.id]).length;
  
  return (
    <div className="mb-2">
      {/* Attribute Header - Folder style */}
      <button 
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all
          ${expanded ? 'bg-amber-100' : 'hover:bg-amber-50'}
        `}
      >
        <FolderIcon open={expanded} />
        
        {/* Attribute icon and name */}
        <span className="text-2xl">{def.icon}</span>
        <div className="flex-1 text-left">
          <div className="font-bold text-lg text-amber-900">{def.name}</div>
          <div className="text-xs text-amber-600/60">
            {trackedCount} skill{trackedCount !== 1 ? 's' : ''} tracked
          </div>
        </div>
        
        {/* D&D-style score */}
        <div className="text-center mr-2">
          <div 
            className="text-2xl font-bold"
            style={{ color: def.color }}
          >
            {score}
          </div>
          <div className="text-xs text-amber-600/60">
            ({modifierStr})
          </div>
        </div>
      </button>
      
      {/* Skill List */}
      {expanded && (
        <div className="ml-4 mt-1 border-l-2 border-amber-200">
          {rootSkills.length === 0 ? (
            <div className="text-amber-400 text-sm py-4 pl-4">
              No skills available in this category yet
            </div>
          ) : (
            rootSkills.map(skill => (
              <SkillNodeRow 
                key={skill.id}
                skillId={skill.id}
                depth={1}
                onStartActivity={onStartActivity}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function HomeScreen({ onStartActivity, onOpenSettings }: HomeScreenProps) {
  const { profile } = useSkillStore();
  const [expandedAttr, setExpandedAttr] = useState<Attribute | null>('INT');
  
  const toggleAttribute = (attr: Attribute) => {
    setExpandedAttr(expandedAttr === attr ? null : attr);
  };
  
  // Calculate total skill levels
  const totalSkillLevels = Object.values(profile.skills).reduce(
    (sum, s) => sum + s.level, 
    0
  );
  
  const trackedSkillsCount = Object.keys(profile.skills).length;
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed, #fef3c7)' }}
    >
      <div className="h-full flex flex-col max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #fcd34d' }}>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#78350f' }}>
              <span className="text-3xl">🌱</span> XPira
            </h1>
            <p className="text-sm" style={{ color: '#d97706' }}>Grow your real-life skills</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick stats */}
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600">
                Lv {profile.totalLevel}
              </div>
              <div className="text-xs text-amber-600/60">
                {profile.totalXp.toLocaleString()} XP
              </div>
            </div>
            
            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
            >
              ⚙️
            </button>
          </div>
        </header>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-amber-200/50">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-amber-200/30">
            <div className="text-xl font-bold text-amber-500">🪙 {profile.coins}</div>
            <div className="text-xs text-amber-600/60">Coins</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-amber-200/30">
            <div className="text-xl font-bold text-orange-500">☀️ {profile.currentStreak}</div>
            <div className="text-xs text-amber-600/60">Day Streak</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-amber-200/30">
            <div className="text-xl font-bold text-emerald-600">📊 {totalSkillLevels}</div>
            <div className="text-xs text-amber-600/60">Total Levels</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-amber-200/30">
            <div className="text-xl font-bold text-teal-500">📚 {trackedSkillsCount}</div>
            <div className="text-xs text-amber-600/60">Skills</div>
          </div>
        </div>
        
        {/* Play Time Notice - Gentle, not alarming */}
        {profile.dailyPlayTime >= profile.dailyPlayLimit && (
          <div className="mx-4 mt-4 bg-amber-100 border border-amber-300 rounded-xl p-3 text-center">
            <p className="text-amber-700 text-sm">
              ☕ Time for a break! Log a real-world activity to unlock more play time.
            </p>
          </div>
        )}
        
        {/* Skill Tree - Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-900">Your Skills</h2>
            <button className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
              + Discover Skills
            </button>
          </div>
          
          {/* Attribute folders */}
          <div className="space-y-1">
            {(Object.keys(ATTRIBUTES) as Attribute[]).map(attr => (
              <AttributeSection
                key={attr}
                attribute={attr}
                expanded={expandedAttr === attr}
                onToggle={() => toggleAttribute(attr)}
                onStartActivity={onStartActivity}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom Bar - Timer */}
        <footer className="p-4 border-t border-amber-200/50 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-amber-700">
              Today: {profile.dailyPlayTime} / {profile.dailyPlayLimit + profile.realWorldUnlocks} min
              {profile.realWorldUnlocks > 0 && (
                <span className="text-emerald-600 ml-1">(+{profile.realWorldUnlocks} bonus)</span>
              )}
            </div>
            <button 
              className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
              onClick={() => {/* TODO: Open activity log */}}
            >
              + Log Activity
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
