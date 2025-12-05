import { usePlayerStore, useGameStore } from '../core/stores';
import type { Mission, MissionObjective } from '../core/types';

export function MissionPanel() {
  const { activeMissions, completedMissionIds } = usePlayerStore();
  const { isDialogueActive } = useGameStore();

  // Don't show during dialogue
  if (isDialogueActive) return null;

  if (activeMissions.length === 0 && completedMissionIds.length === 0) {
    return (
      <div className="absolute top-20 right-5 bg-black/70 rounded-lg p-4 text-white max-w-xs">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-2">
          Missions
        </h3>
        <p className="text-sm text-gray-300">
          Talk to NPCs to start missions!
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-20 right-5 bg-black/70 rounded-lg p-4 text-white max-w-xs">
      <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-3">
        Active Missions
      </h3>
      
      {activeMissions.map((mission: Mission) => (
        <div key={mission.id} className="mb-3 last:mb-0">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">❗</span>
            <div>
              <p className="font-medium text-sm">{mission.title}</p>
              <p className="text-xs text-gray-400 mt-1">{mission.description}</p>
              
              {/* Objectives */}
              <div className="mt-2">
                {mission.objectives.map((obj: MissionObjective) => (
                  <div 
                    key={obj.id}
                    className={`text-xs flex items-center gap-1 ${
                      obj.completed ? 'text-green-400' : 'text-gray-300'
                    }`}
                  >
                    <span>{obj.completed ? '✓' : '○'}</span>
                    <span>{obj.description}</span>
                    {obj.required > 1 && (
                      <span className="text-gray-500">
                        ({obj.current}/{obj.required})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Completed count */}
      {completedMissionIds.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
          ✓ {completedMissionIds.length} mission{completedMissionIds.length !== 1 ? 's' : ''} completed
        </div>
      )}
    </div>
  );
}
