/**
 * SkillPractice - The actual gameplay/practice screen for a skill
 * 
 * This is where users actively practice their skills:
 * - Language skills: Conversation practice, vocabulary, etc.
 * - Fitness skills: Log workouts, see progress
 * - Cognitive skills: Mini-games, puzzles
 * - Other: Activity logging, timers
 */

import { useState } from 'react';
import { useSkillStore } from '../core/stores';
import { getSkill } from '../core/skills';
import { ATTRIBUTES } from '../core/types';

interface SkillPracticeProps {
  skillId: string;
  onBack: () => void;
  onComplete: (xpEarned: number) => void;
}

// Language practice component - the original conversation game
function LanguagePractice({ onComplete }: { onComplete: (xp: number) => void }) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  // Simple phrases to practice
  const phrases = [
    { prompt: 'Say "Hello"', target: 'Hola', hint: 'Oh-la' },
    { prompt: 'Say "Thank you"', target: 'Gracias', hint: 'Grah-see-as' },
    { prompt: 'Say "Good morning"', target: 'Buenos días', hint: 'Bway-nos dee-as' },
    { prompt: 'Say "How are you?"', target: '¿Cómo estás?', hint: 'Koh-mo es-tahs' },
    { prompt: 'Say "My name is..."', target: 'Me llamo...', hint: 'May yah-mo' },
  ];

  const phrase = phrases[currentPhrase];

  const handleNext = () => {
    if (currentPhrase < phrases.length - 1) {
      setCurrentPhrase(currentPhrase + 1);
    } else {
      // Completed all phrases
      onComplete(50); // Award XP
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-sm text-amber-600 mb-2">
          <span>Phrase {currentPhrase + 1} of {phrases.length}</span>
          <span>{Math.round((currentPhrase / phrases.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
            style={{ width: `${(currentPhrase / phrases.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current phrase card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-amber-200">
        <p className="text-amber-600 text-sm mb-2">{phrase.prompt}</p>
        <p className="text-3xl font-bold text-amber-900 mb-4">{phrase.target}</p>
        <p className="text-amber-500 text-sm italic">({phrase.hint})</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleNext}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all hover:scale-105"
        >
          {currentPhrase < phrases.length - 1 ? 'Next →' : '✓ Complete'}
        </button>
      </div>

      {/* Future: Add speech recognition, audio playback, etc. */}
      <p className="text-amber-400 text-xs mt-8">
        🎤 Speech recognition coming soon!
      </p>
    </div>
  );
}

// Generic activity logger for skills without in-game scenes
function ActivityLogger({ skillId, onComplete }: { skillId: string; onComplete: (xp: number) => void }) {
  const skill = getSkill(skillId);
  const [duration, setDuration] = useState(15);
  const [notes, setNotes] = useState('');

  const handleLog = () => {
    // Calculate XP based on duration
    const xp = Math.floor(duration * 2);
    onComplete(xp);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-amber-200">
        <div className="text-center mb-6">
          <span className="text-4xl">{skill?.icon || '📝'}</span>
          <h2 className="text-xl font-bold text-amber-900 mt-2">{skill?.name}</h2>
          <p className="text-amber-600 text-sm">Log your practice session</p>
        </div>

        {/* Duration slider */}
        <div className="mb-6">
          <label className="block text-sm text-amber-700 mb-2">
            How long did you practice?
          </label>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="text-center text-2xl font-bold text-emerald-600 mt-2">
            {duration} minutes
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm text-amber-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you work on?"
            className="w-full p-3 border border-amber-200 rounded-xl text-amber-900 resize-none"
            rows={3}
          />
        </div>

        {/* XP preview */}
        <div className="bg-amber-50 rounded-xl p-4 text-center mb-6">
          <span className="text-amber-600 text-sm">You'll earn</span>
          <div className="text-2xl font-bold text-emerald-600">+{duration * 2} XP</div>
        </div>

        <button
          onClick={handleLog}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold shadow-md transition-all"
        >
          ✓ Log Activity
        </button>
      </div>
    </div>
  );
}

export function SkillPractice({ skillId, onBack, onComplete }: SkillPracticeProps) {
  const skill = getSkill(skillId);
  const { addSkillXp } = useSkillStore();
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  if (!skill) {
    return (
      <div className="fixed inset-0 bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-600">Skill not found</p>
          <button onClick={onBack} className="mt-4 text-emerald-600 underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const attrDef = ATTRIBUTES[skill.attribute];

  const handleComplete = (xp: number) => {
    setXpEarned(xp);
    setCompleted(true);
    addSkillXp(skillId, xp, 'in-game');
  };

  // Determine which practice component to show
  const isLanguageSkill = skill.attribute === 'INT' && 
    (skillId.includes('spanish') || skillId.includes('french') || 
     skillId.includes('german') || skillId.includes('japanese') ||
     skillId.includes('italian') || skillId.includes('portuguese'));

  return (
    <div 
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #f0fdf4, #fefce8, #fffbeb)' }}
    >
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-amber-200/50">
        <button
          onClick={onBack}
          className="bg-white/80 hover:bg-white text-amber-800 px-4 py-2 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
        >
          ← Back
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">{skill.icon || attrDef.icon}</span>
          <div>
            <h1 className="font-bold text-amber-900">{skill.name}</h1>
            <p className="text-xs text-amber-600">{attrDef.name}</p>
          </div>
        </div>
      </header>

      {/* Practice content */}
      <div className="flex-1 overflow-y-auto">
        {completed ? (
          // Completion screen
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Great job!</h2>
            <p className="text-amber-600 mb-6">You earned experience in {skill.name}</p>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-200">
              <div className="text-4xl font-bold text-emerald-500">+{xpEarned} XP</div>
            </div>

            <button
              onClick={() => {
                onComplete(xpEarned);
                onBack();
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all"
            >
              Continue
            </button>
          </div>
        ) : isLanguageSkill ? (
          <LanguagePractice skillId={skillId} onComplete={handleComplete} />
        ) : (
          <ActivityLogger skillId={skillId} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
