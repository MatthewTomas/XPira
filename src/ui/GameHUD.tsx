import { useState } from 'react';
import { StatsPanel } from './StatsPanel';
import { DialogueBox } from './DialogueBox';
import { MissionPanel } from './MissionPanel';
import { SpeechIndicator } from './SpeechIndicator';
import { ObjectivePanel, TutorialOverlay } from './ObjectivePanel';
import { CharacterSheet } from './CharacterSheet';

export function GameHUD() {
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  
  return (
    <div className="hud-overlay">
      {/* Objective/Tutorial - Top Center */}
      <ObjectivePanel />
      <TutorialOverlay />
      
      {/* Stats - Top Left */}
      <StatsPanel />
      
      {/* Missions - Top Right */}
      <MissionPanel />
      
      {/* Character Sheet Toggle Button - Below Stats */}
      <button
        onClick={() => setShowCharacterSheet(!showCharacterSheet)}
        className="absolute top-44 left-5 bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors z-50"
      >
        📊 {showCharacterSheet ? 'Hide' : 'Skills'}
      </button>
      
      {/* Character Sheet Panel */}
      {showCharacterSheet && (
        <div className="absolute top-56 left-5 z-40">
          <CharacterSheet />
        </div>
      )}
      
      {/* Speech Indicator - Bottom Center */}
      <SpeechIndicator />
      
      {/* Dialogue Box - Bottom Center (above speech indicator) */}
      <DialogueBox />

      {/* Controls hint */}
      <div className="absolute bottom-5 right-5 bg-black/50 rounded-lg px-4 py-2 text-white text-xs">
        <div className="flex gap-4">
          <span>WASD - Move</span>
          <span>E - Interact</span>
          <span>ESC - Menu</span>
        </div>
      </div>
    </div>
  );
}
