import { useGameStore } from '../core/stores';

interface MainMenuProps {
  onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const { targetLanguage, setTargetLanguage } = useGameStore();

  const languages = [
    { code: 'es', name: 'Spanish', speechCode: 'es-ES' },
    { code: 'fr', name: 'French', speechCode: 'fr-FR' },
    { code: 'de', name: 'German', speechCode: 'de-DE' },
    { code: 'it', name: 'Italian', speechCode: 'it-IT' },
    { code: 'pt', name: 'Portuguese', speechCode: 'pt-BR' },
    { code: 'ja', name: 'Japanese', speechCode: 'ja-JP' },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
      <div className="text-center text-white">
        {/* Title */}
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          🌍 LinguaQuest
        </h1>
        <p className="text-xl text-purple-200 mb-12">
          Learn languages through adventure
        </p>

        {/* Language Selection */}
        <div className="bg-black/30 rounded-2xl p-8 mb-8 max-w-md mx-auto">
          <h2 className="text-lg font-medium mb-4 text-purple-200">
            Select language to learn:
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setTargetLanguage({
                  code: lang.code,
                  name: lang.name,
                  speechRecognitionCode: lang.speechCode,
                })}
                className={`
                  px-4 py-3 rounded-lg transition-all
                  ${targetLanguage.code === lang.code
                    ? 'bg-purple-600 ring-2 ring-purple-400'
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold px-12 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          🎮 Start Adventure
        </button>

        {/* Instructions */}
        <div className="mt-12 text-sm text-purple-300 max-w-lg mx-auto">
          <p className="mb-2">
            <strong>How to play:</strong>
          </p>
          <p>
            Use WASD or Arrow keys to move. Approach NPCs and press E or click to talk.
            Speak in your target language to complete interactions and earn XP!
          </p>
        </div>
      </div>
    </div>
  );
}
