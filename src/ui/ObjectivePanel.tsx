import { useState, useEffect } from 'react';
import { useGameStore } from '../core/stores';

interface TutorialStep {
  id: string;
  message: string;
  icon: string;
  condition?: () => boolean;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    message: 'Welcome to the marketplace! Use WASD or Arrow keys to move around.',
    icon: '🎮',
  },
  {
    id: 'find-npc',
    message: 'Walk towards María (the vendor with 🛒) to practice your Spanish!',
    icon: '👋',
  },
  {
    id: 'interact',
    message: 'Press E or click on the NPC to start a conversation.',
    icon: '💬',
  },
  {
    id: 'speak',
    message: 'Click the microphone button and speak in Spanish to respond!',
    icon: '🎤',
  },
];

export function ObjectivePanel() {
  const { isDialogueActive, targetLanguage } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Auto-advance tutorial based on game state
  useEffect(() => {
    if (isDialogueActive && currentStep < 3) {
      setCurrentStep(3);
    }
  }, [isDialogueActive, currentStep]);

  // Auto-dismiss after completing tutorial
  useEffect(() => {
    if (currentStep >= tutorialSteps.length) {
      const timer = setTimeout(() => setDismissed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  if (dismissed) return null;

  const step = tutorialSteps[Math.min(currentStep, tutorialSteps.length - 1)];

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
      {/* Current Objective */}
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-sm rounded-xl px-6 py-4 text-white shadow-lg border border-purple-500/30 max-w-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{step.icon}</span>
          <div>
            <div className="text-xs text-purple-300 uppercase tracking-wide mb-1">
              Current Objective
            </div>
            <p className="text-sm font-medium">{step.message}</p>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1.5 mt-3 justify-center">
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i <= currentStep ? 'bg-purple-400' : 'bg-purple-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Language badge */}
      <div className="mt-2 text-center">
        <span className="inline-block bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          Learning: <strong>{targetLanguage.name}</strong>
        </span>
      </div>
    </div>
  );
}

export function TutorialOverlay() {
  const [showTutorial, setShowTutorial] = useState(true);
  const { isDialogueActive } = useGameStore();

  // Hide when dialogue starts
  useEffect(() => {
    if (isDialogueActive) {
      setShowTutorial(false);
    }
  }, [isDialogueActive]);

  if (!showTutorial) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {/* Movement hint - bottom left */}
      <div className="absolute bottom-24 left-5 bg-black/70 rounded-lg p-3 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-400">⌨️</span>
          <span className="text-sm font-medium">Movement</span>
        </div>
        <div className="grid grid-cols-3 gap-1 w-20">
          <div></div>
          <div className="bg-gray-700 rounded text-center text-xs py-1">W</div>
          <div></div>
          <div className="bg-gray-700 rounded text-center text-xs py-1">A</div>
          <div className="bg-gray-700 rounded text-center text-xs py-1">S</div>
          <div className="bg-gray-700 rounded text-center text-xs py-1">D</div>
        </div>
      </div>

      {/* Interaction hint - shows arrow toward nearest NPC */}
      <div className="absolute bottom-24 right-5 bg-black/70 rounded-lg p-3 text-white">
        <div className="flex items-center gap-2">
          <span className="text-green-400">E</span>
          <span className="text-sm">or</span>
          <span className="text-blue-400">Click</span>
          <span className="text-sm">to interact</span>
        </div>
      </div>
    </div>
  );
}
