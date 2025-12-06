import { useState, useEffect } from 'react';
import { TitleScreen } from './ui/TitleScreen';
import { SettingsScreen } from './ui';
import { WorldStatsPanel } from './ui/WorldStatsPanel';
import { TeleportMenu } from './ui/TeleportMenu';
import { WindTransition } from './ui/WindTransition';
import { AuthModal } from './ui/AuthModal';
import { GameWorld } from './scenes/GameWorld';
import { LandingPage } from './pages/LandingPage';
import { Sandbox } from './pages/Sandbox';
import { GameSandbox } from './pages/GameSandbox';
import { useWorldStore } from './core/worldStore';
import { useGameStore } from './core/stores';
import './index.css';

type AppScreen = 'landing' | 'title' | 'world' | 'sandbox' | 'game-sandbox';

function App() {
  // Check URL for dev routes
  const getInitialScreen = (): AppScreen => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/sandbox') return 'sandbox';
      if (path === '/game-sandbox') return 'game-sandbox';
      if (path === '/game') return 'title';
      // For now, skip landing and go to title (enable landing later)
      // return 'landing';
    }
    return 'title';
  };

  const [screen, setScreen] = useState<AppScreen>(getInitialScreen);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTeleport, setShowTeleport] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  const teleportTo = useWorldStore(state => state.teleportTo);
  const { isLanguageTransitioning, setIsLanguageTransitioning } = useGameStore();

  // Handle URL changes for SPA routing
  useEffect(() => {
    const handlePopState = () => {
      setScreen(getInitialScreen());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newScreen: AppScreen) => {
    setScreen(newScreen);
    // Update URL for dev routes
    if (newScreen === 'sandbox') {
      window.history.pushState({}, '', '/sandbox');
    } else if (newScreen === 'game-sandbox') {
      window.history.pushState({}, '', '/game-sandbox');
    } else if (newScreen === 'landing') {
      window.history.pushState({}, '', '/');
    } else if (newScreen === 'title' || newScreen === 'world') {
      window.history.pushState({}, '', '/game');
    }
  };

  const handleStartGame = () => {
    navigateTo('world');
  };

  const handleBackToTitle = () => {
    navigateTo('title');
  };

  const handleTeleportFromStats = (buildingId: string) => {
    teleportTo(buildingId as any);
    setShowStats(false);
  };

  // Landing page handlers
  const handlePlayFree = () => {
    navigateTo('title');
  };

  const handleRequestBeta = () => {
    setShowAuth(true);
  };

  const handleLogin = () => {
    setShowAuth(true);
  };

  return (
    <div className="game-container">
      {/* Landing Page - Marketing for new users */}
      {screen === 'landing' && (
        <LandingPage
          onPlayFree={handlePlayFree}
          onRequestBeta={handleRequestBeta}
          onLogin={handleLogin}
        />
      )}

      {/* Design Sandbox - Dev tool at /sandbox */}
      {screen === 'sandbox' && (
        <Sandbox />
      )}

      {/* Game Design Sandbox - Dev tool at /game-sandbox */}
      {screen === 'game-sandbox' && (
        <GameSandbox />
      )}

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

      {/* Auth Modal - Login/Signup/Beta */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          navigateTo('title');
        }}
      />
      
      {/* Wind Transition - Language change effect */}
      {isLanguageTransitioning && (
        <WindTransition onComplete={() => setIsLanguageTransitioning(false)} />
      )}
    </div>
  );
}

export default App;
