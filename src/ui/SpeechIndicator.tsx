import { useSpeechStore } from '../core/stores';

export function SpeechIndicator() {
  const { isListening, transcript, confidence } = useSpeechStore();

  if (!isListening && !transcript) return null;

  return (
    <div className={`speech-indicator ${isListening ? 'listening' : ''}`}>
      <div className="flex items-center gap-3">
        {isListening && (
          <>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-bounce"
                  style={{
                    height: `${12 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm">Listening...</span>
          </>
        )}
        
        {transcript && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">You said:</span>
            <span className="font-medium">"{transcript}"</span>
            {confidence > 0 && (
              <span className="text-xs text-gray-500">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
