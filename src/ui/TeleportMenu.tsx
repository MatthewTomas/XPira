/**
 * TeleportMenu - Quick travel to unlocked buildings
 * 
 * Allows players to teleport to any unlocked building in the world.
 * Can be disabled in settings for a more immersive experience.
 */

import { useWorldStore, BUILDINGS, type BuildingId } from '../core/worldStore';

interface TeleportMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeleportMenu({ isOpen, onClose }: TeleportMenuProps) {
  const { unlockedBuildings, teleportEnabled, enterBuilding, teleportTo } = useWorldStore();
  
  if (!isOpen || !teleportEnabled) return null;

  const handleTeleportNear = (buildingId: BuildingId) => {
    // Teleport to just outside the building
    if (unlockedBuildings.includes(buildingId)) {
      teleportTo(buildingId);
      onClose();
    }
  };

  const handleEnterBuilding = (buildingId: BuildingId) => {
    if (unlockedBuildings.includes(buildingId)) {
      enterBuilding(buildingId);
      onClose();
    }
  };

  // Attribute-based color mapping
  const getAttributeColor = (attr?: string) => {
    switch (attr) {
      case 'STR': return '#ef4444'; // red
      case 'DEX': return '#22c55e'; // green
      case 'CON': return '#f97316'; // orange
      case 'INT': return '#3b82f6'; // blue
      case 'WIS': return '#a855f7'; // purple
      case 'CHA': return '#ec4899'; // pink
      default: return '#fbbf24'; // amber for non-skill buildings
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, #ecfdf5, #d1fae5)',
          border: '3px solid #065f46',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">Quick Travel</h2>
              <p className="text-sm text-emerald-600">Choose a destination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-200 rounded-lg transition-colors text-emerald-700"
          >
            ✕
          </button>
        </div>

        {/* Building list */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {Object.values(BUILDINGS).map(building => {
            const isUnlocked = unlockedBuildings.includes(building.id);
            
            return (
              <div
                key={building.id}
                className={`rounded-xl overflow-hidden transition-all ${
                  isUnlocked 
                    ? 'bg-white/70 hover:bg-white hover:shadow-lg' 
                    : 'bg-gray-100/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{
                      background: isUnlocked ? getAttributeColor(building.attribute) : '#d1d5db',
                    }}
                  >
                    {isUnlocked ? building.icon : '🔒'}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-emerald-900">
                      {isUnlocked ? building.name : '???'}
                    </h3>
                    <p className="text-sm text-emerald-600">
                      {isUnlocked ? building.description : building.unlockCondition.description}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  {isUnlocked && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTeleportNear(building.id)}
                        className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                        title="Teleport near building"
                      >
                        📍
                      </button>
                      <button
                        onClick={() => handleEnterBuilding(building.id)}
                        className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-medium transition-colors"
                        title="Enter building"
                      >
                        Enter →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="p-3 border-t border-emerald-200 text-center text-sm text-emerald-600">
          💡 Explore the world to unlock more locations!
        </div>
      </div>
    </div>
  );
}
