/**
 * WorldStatsPanel - Collapsible in-world stats overlay
 * 
 * Shows player stats and skills while in the game world.
 * Can be expanded to show full skill tree with map markers.
 */

import { useState } from 'react';
import { useSkillStore } from '../core/stores';
import { useWorldStore, BUILDINGS } from '../core/worldStore';
import { ATTRIBUTES } from '../core/types';
import { getSkillsByAttribute } from '../core/skills';
import type { Attribute } from '../core/types';

interface WorldStatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportTo: (buildingId: string) => void;
}

export function WorldStatsPanel({ isOpen, onClose, onTeleportTo }: WorldStatsPanelProps) {
  const { profile } = useSkillStore();
  const { unlockedBuildings, teleportEnabled } = useWorldStore();
  const [expandedAttr, setExpandedAttr] = useState<Attribute | null>(null);
  
  const totalLevel = Object.values(profile.skills).reduce((sum, s) => sum + s.level, 0);
  const trackedSkillsCount = Object.keys(profile.skills).length;

  if (!isOpen) return null;

  // Find which building trains which attribute
  const getBuildingForAttribute = (attr: Attribute) => {
    return Object.values(BUILDINGS).find(b => b.attribute === attr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        style={{ 
          background: 'linear-gradient(to bottom, #fffbeb, #fef3c7)',
          border: '3px solid #92400e',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl font-bold text-amber-900">Your Stats</h2>
              <p className="text-sm text-amber-600">Level {totalLevel} • {trackedSkillsCount} skills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-200 rounded-lg transition-colors text-amber-700"
          >
            ✕
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-amber-200">
          <div className="bg-white/60 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-amber-500">🪙 {profile.coins}</div>
            <div className="text-xs text-amber-600">Coins</div>
          </div>
          <div className="bg-white/60 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-orange-500">☀️ {profile.currentStreak}</div>
            <div className="text-xs text-amber-600">Streak</div>
          </div>
          <div className="bg-white/60 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-emerald-600">📈 {totalLevel}</div>
            <div className="text-xs text-amber-600">Total Lv</div>
          </div>
          <div className="bg-white/60 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-blue-500">🏠 {unlockedBuildings.length}</div>
            <div className="text-xs text-amber-600">Locations</div>
          </div>
        </div>

        {/* Attributes and skills */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <h3 className="text-sm font-bold text-amber-800 mb-3">Skills by Attribute</h3>
          
          <div className="space-y-2">
            {(Object.keys(ATTRIBUTES) as Attribute[]).map(attr => {
              const attrDef = ATTRIBUTES[attr];
              const skills = getSkillsByAttribute(attr);
              const trackedSkills = skills.filter(s => profile.skills[s.id]);
              const attrLevel = trackedSkills.reduce((sum, s) => sum + (profile.skills[s.id]?.level || 0), 0);
              const building = getBuildingForAttribute(attr);
              const buildingUnlocked = building && unlockedBuildings.includes(building.id);
              
              return (
                <div key={attr} className="bg-white/50 rounded-xl overflow-hidden">
                  {/* Attribute header */}
                  <button
                    onClick={() => setExpandedAttr(expandedAttr === attr ? null : attr)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/50 transition-colors"
                  >
                    <span className="text-2xl">{attrDef.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-amber-900">{attrDef.name}</div>
                      <div className="text-xs text-amber-600">
                        {trackedSkills.length} skills • Level {attrLevel}
                      </div>
                    </div>
                    
                    {/* Building indicator */}
                    {building && (
                      <div className="flex items-center gap-1 text-sm">
                        <span>{building.icon}</span>
                        {buildingUnlocked ? (
                          teleportEnabled && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTeleportTo(building.id);
                              }}
                              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-2 py-0.5 rounded-lg"
                            >
                              Go
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-amber-500">🔒</span>
                        )}
                      </div>
                    )}
                    
                    <span className="text-amber-400">
                      {expandedAttr === attr ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {/* Expanded skill list */}
                  {expandedAttr === attr && (
                    <div className="px-3 pb-3 border-t border-amber-200">
                      {trackedSkills.length === 0 ? (
                        <p className="text-sm text-amber-500 py-2">
                          No skills tracked yet. Visit {building?.icon} {building?.name} to start!
                        </p>
                      ) : (
                        <div className="space-y-1 pt-2">
                          {trackedSkills.map(skill => {
                            const progress = profile.skills[skill.id];
                            return (
                              <div 
                                key={skill.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span>{skill.icon}</span>
                                <span className="flex-1 text-amber-800">{skill.name}</span>
                                <span className="text-emerald-600 font-bold">Lv {progress.level}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-amber-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
