/**
 * Settings Screen
 * 
 * Configuration panel for stats.name connection, play limits,
 * language preferences, and other options.
 */

import { useState } from 'react';
import { useSkillStore, useGameStore } from '../core/stores';

interface SettingsScreenProps {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { statsName, connectStatsName, disconnectStatsName, realLifeFirst, profile } = useSkillStore();
  const { targetLanguage, setTargetLanguage } = useGameStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats-name' | 'preferences'>('profile');
  
  const languages = [
    { code: 'es', name: 'Spanish', speechCode: 'es-ES', flag: '🇪🇸' },
    { code: 'fr', name: 'French', speechCode: 'fr-FR', flag: '🇫🇷' },
    { code: 'de', name: 'German', speechCode: 'de-DE', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', speechCode: 'it-IT', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', speechCode: 'pt-BR', flag: '🇧🇷' },
    { code: 'ja', name: 'Japanese', speechCode: 'ja-JP', flag: '🇯🇵' },
  ];
  
  return (
    <div className="fixed inset-0 bg-amber-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200">
          <h2 className="text-xl font-bold text-amber-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-amber-200">
          {[
            { id: 'profile', label: '👤 Profile' },
            { id: 'stats-name', label: '📊 stats.name' },
            { id: 'preferences', label: '⚙️ Preferences' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'text-emerald-600 border-b-2 border-emerald-500' 
                  : 'text-amber-600 hover:text-amber-800'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-amber-700 mb-1">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => useSkillStore.getState().updateUsername(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-amber-900 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-amber-700 mb-1">Primary Language to Learn</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setTargetLanguage({
                        code: lang.code,
                        name: lang.name,
                        speechRecognitionCode: lang.speechCode,
                      })}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                        ${targetLanguage.code === lang.code
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                          : 'bg-white border border-amber-200 text-amber-800 hover:bg-amber-50'
                        }
                      `}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-amber-200">
                <h3 className="text-sm font-medium text-amber-900 mb-2">Account Stats</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white border border-amber-200 rounded-xl p-2">
                    <div className="text-amber-600">Created</div>
                    <div className="text-amber-900">{new Date(profile.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-white border border-amber-200 rounded-xl p-2">
                    <div className="text-amber-600">Longest Streak</div>
                    <div className="text-amber-900">{profile.longestStreak} days</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'stats-name' && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-bold text-amber-900 mb-1">Connect to stats.name</h3>
                <p className="text-sm text-amber-600">
                  Sync your skills to your public profile and share your progress
                </p>
              </div>
              
              {statsName.connected ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <span>✓</span>
                      <span className="font-medium">Connected</span>
                    </div>
                    <div className="text-sm text-amber-700">
                      <div>Username: <span className="text-amber-900 font-medium">{statsName.username}</span></div>
                      <div>Profile: <a href={statsName.publicUrl} className="text-emerald-600 hover:underline">{statsName.publicUrl}</a></div>
                      {statsName.lastSynced && (
                        <div>Last synced: {new Date(statsName.lastSynced).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={statsName.syncSkills} className="rounded accent-emerald-500" readOnly />
                      <span className="text-sm text-amber-900">Sync skill levels</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={statsName.syncAchievements} className="rounded accent-emerald-500" readOnly />
                      <span className="text-sm text-amber-900">Sync achievements</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={statsName.syncRealWorld} className="rounded accent-emerald-500" readOnly />
                      <span className="text-sm text-amber-900">Sync real-world activities</span>
                    </label>
                  </div>
                  
                  <button
                    onClick={() => useSkillStore.getState().syncToStatsName()}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded-xl font-medium transition-colors"
                  >
                    Sync Now
                  </button>
                  
                  <button
                    onClick={disconnectStatsName}
                    className="w-full text-rose-500 hover:text-rose-600 text-sm py-2"
                  >
                    Disconnect Account
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // TODO: Real OAuth flow
                      connectStatsName('user123', 'adventurer');
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-3 rounded-xl font-medium shadow-md transition-all"
                  >
                    Connect stats.name Account
                  </button>
                  
                  <p className="text-xs text-amber-500 text-center">
                    Don't have an account? <a href="https://stats.name" className="text-emerald-600 hover:underline">Sign up at stats.name</a>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-amber-700 mb-2">Daily Play Limit</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={realLifeFirst.dailyPlayLimitMinutes}
                    className="flex-1 accent-emerald-500"
                    readOnly
                  />
                  <span className="text-amber-900 font-medium w-16 text-right">{realLifeFirst.dailyPlayLimitMinutes} min</span>
                </div>
                <p className="text-xs text-amber-500 mt-1">
                  Limit your daily game time. Earn more by logging real-world activities!
                </p>
              </div>
              
              <div className="pt-4 border-t border-amber-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm text-amber-900">Touch Grass Mode 🌿</div>
                    <div className="text-xs text-amber-500">Require outdoor time to unlock daily play</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={realLifeFirst.touchGrassEnabled} 
                    className="rounded accent-emerald-500"
                    readOnly
                  />
                </label>
              </div>
              
              <div className="pt-4 border-t border-amber-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm text-amber-900">Real-World XP Multiplier</div>
                    <div className="text-xs text-amber-500">Bonus XP after logging real activities</div>
                  </div>
                  <span className="text-emerald-600 font-bold">{realLifeFirst.realWorldMultiplier}x</span>
                </label>
              </div>
              
              <div className="pt-4 border-t border-amber-200">
                <h3 className="text-sm font-medium text-amber-900 mb-2">Audio & Accessibility</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-amber-800">Sound Effects</span>
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-amber-800">Speech Synthesis (NPC voices)</span>
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
