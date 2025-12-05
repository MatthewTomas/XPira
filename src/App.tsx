import { useState } from 'react';
import { TitleScreen } from './ui/TitleScreen';
import { SettingsScreen } from './ui';
import { WorldStatsPanel } from './ui/WorldStatsPanel';
import { TeleportMenu } from './ui/TeleportMenu';
import { WindTransition } from './ui/WindTransition';
import { GameWorld } from './scenes/GameWorld';
import { useWorldStore } from './core/worldStore';
import { useGameStore } from './core/stores';
import './index.css';

type AppScreen = 'title' | 'world';

function App() {
  const [screen, setScreen] = useState<AppScreen>('title');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTeleport, setShowTeleport] = useState(false);
  
  const teleportTo = useWorldStore(state => state.teleportTo);
  const { isLanguageTransitioning, setIsLanguageTransitioning } = useGameStore();

  const handleStartGame = () => {
    setScreen('world');
  };

  const handleBackToTitle = () => {
    setScreen('title');
  };

  const handleTeleportFromStats = (buildingId: string) => {
    teleportTo(buildingId as any);
    setShowStats(false);
  };

  return (
    <div className="game-container">
      {/* Title Screen - Game entry point */}
      {screen === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Game World - The main explorable village */}
      {screen === 'world' && (
        <GameWorld 
          onOpenStats={() => setShowStats(true)}
          onOpenTeleport={() => setShowTeleport(true)}
        />
      )}
      
      {/* Settings Modal - Available everywhere */}
      {showSettings && (
        <SettingsScreen onClose={() => setShowSettings(false)} />
      )}
      
      {/* Stats Panel - Shows skills and progress */}
      <WorldStatsPanel 
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onTeleportTo={handleTeleportFromStats}
      />
      
      {/* Teleport Menu - Quick travel */}
      <TeleportMenu 
        isOpen={showTeleport}
        onClose={() => setShowTeleport(false)}
      />
      
      {/* Wind Transition - Language change effect */}
      {isLanguageTransitioning && (
        <WindTransition onComplete={() => setIsLanguageTransitioning(false)} />
      )}
    </div>
  );
}

export default App;
