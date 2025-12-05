import { useState, useEffect, useCallback, useRef } from 'react';
import { useDialogue } from '../features/dialogue';
import { useSpeechRecognition } from '../features/speech';
import { useGameStore, useSpeechStore } from '../core/stores';
import { playSound } from '../features/audio';
import { MicPermissionModal, useMicPermission } from './MicPermissionModal';
import type { DialogueResponse } from '../core/types';

export function DialogueBox() {
  const {
    isActive,
    currentNode,
    failedAttempts,
    showHint,
    lastSpokenText,
    matchResult,
    handleSpeechInput,
    handleWrittenInput,
    selectResponse,
    closeDialogue,
  } = useDialogue();

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    reset,
  } = useSpeechRecognition();

  const { targetLanguage } = useGameStore();
  const { error: speechError } = useSpeechStore();
  const { showModal, requestPermission, closeModal, hasPermission, micPermissionStatus } = useMicPermission();
  const [writtenInput, setWrittenInput] = useState('');
  const [showWriteMode, setShowWriteMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastNodeIdRef = useRef<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('DialogueBox state:', { isActive, currentNode: currentNode?.id, isSupported, isListening, transcript });
  }, [isActive, currentNode, isSupported, isListening, transcript]);

  // Auto-speak NPC dialogue when node changes
  useEffect(() => {
    if (currentNode && currentNode.id !== lastNodeIdRef.current) {
      lastNodeIdRef.current = currentNode.id;
      // Small delay then speak
      const timer = setTimeout(async () => {
        setIsSpeaking(true);
        try {
          await speak(currentNode.textInTargetLanguage);
        } catch (e) {
          console.log('Speech synthesis not available');
        }
        setIsSpeaking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentNode, speak]);

  // Handle speech results - only when we get a final result
  useEffect(() => {
    if (transcript && !isListening) {
      handleSpeechInput(transcript);
    }
  }, [transcript, isListening, handleSpeechInput]);

  // Play sound when match result changes
  useEffect(() => {
    if (matchResult?.matched) {
      playSound('success');
    } else if (matchResult !== null && lastSpokenText) {
      playSound('error');
    }
  }, [matchResult, lastSpokenText]);

  // Handle ESC key to close dialogue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isActive) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  const handleStartListening = useCallback(() => {
    console.log('handleStartListening called');
    
    // Check/request mic permission first
    if (!hasPermission) {
      const alreadyHasPermission = requestPermission();
      if (!alreadyHasPermission) {
        return; // Modal will open, user needs to grant permission
      }
    }
    
    reset();
    playSound('speak-start');
    startListening();
  }, [reset, startListening, hasPermission, requestPermission]);

  const handleStopListening = useCallback(() => {
    console.log('handleStopListening called');
    playSound('speak-end');
    stopListening();
  }, [stopListening]);

  const handleClose = useCallback(() => {
    playSound('click');
    closeDialogue();
  }, [closeDialogue]);

  if (!isActive || !currentNode) return null;

  const handleSpeak = async () => {
    console.log('handleSpeak called for:', currentNode.textInTargetLanguage);
    playSound('click');
    setIsSpeaking(true);
    await speak(currentNode.textInTargetLanguage);
    setIsSpeaking(false);
  };

  const handleSubmitWritten = () => {
    if (writtenInput.trim()) {
      playSound('click');
      handleWrittenInput(writtenInput.trim());
      setWrittenInput('');
    }
  };

  return (
    <>
      {/* Mic Permission Modal */}
      <MicPermissionModal
        isOpen={showModal}
        onClose={closeModal}
        onPermissionGranted={() => {
          // Start listening after permission granted
          reset();
          playSound('speak-start');
          startListening();
        }}
      />

      <div className="dialogue-box">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl p-1"
          title="Close (ESC)"
        >
          ✕
        </button>

        {/* NPC Speech */}
        <div className="mb-4 pr-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{isSpeaking ? '🗣️' : '👤'}</div>
            <div className="flex-1">
              <p className="text-white text-lg mb-1">{currentNode.textInTargetLanguage}</p>
              <p className="text-gray-400 text-sm italic">{currentNode.text}</p>
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`mt-2 text-sm flex items-center gap-1 ${
                  isSpeaking ? 'text-gray-500' : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Listen again'}
              </button>
            </div>
          </div>
        </div>

        {/* Vocabulary helper - show when node has teach_word action */}
        {currentNode.action?.type === 'teach_word' && (
          <div className="mb-4 bg-indigo-900/50 border border-indigo-500 rounded-lg p-3">
            <p className="text-indigo-300 text-sm font-medium mb-2">📚 Vocabulary:</p>
            <div className="grid grid-cols-2 gap-2">
              {(currentNode.action.payload.words as Array<{word: string; translation: string}>)?.map((w, i) => (
                <div key={i} className="flex justify-between text-sm bg-indigo-900/30 rounded px-2 py-1">
                  <span className="text-white font-medium">{w.word}</span>
                  <span className="text-gray-400">= {w.translation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response options */}
        {currentNode.responses && currentNode.responses.length > 0 && (
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm mb-3">Your response:</p>

            {/* Speech input section */}
          {!showWriteMode && (
            <div className="mb-4">
              {isSupported ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={isListening ? handleStopListening : handleStartListening}
                    disabled={isSpeaking}
                    className={`
                      px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                      ${isSpeaking 
                        ? 'bg-gray-600 cursor-not-allowed'
                        : isListening 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }
                    `}
                  >
                    {isSpeaking ? (
                      <>⏳ Wait for NPC to finish...</>
                    ) : isListening ? (
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-300"></span>
                        </span>
                        🎤 Listening... (click to stop)
                      </>
                    ) : (
                      <>🎤 Click to Speak in {targetLanguage.name}</>
                    )}
                  </button>

                  {/* Real-time transcript while listening */}
                  {isListening && (
                    <div className="bg-gray-800 border border-yellow-500 p-3 rounded-lg animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-lg">🎙️</span>
                        <div className="flex-1">
                          <p className="text-yellow-300 text-sm font-medium">Recording...</p>
                          {transcript ? (
                            <p className="text-white">"{transcript}"</p>
                          ) : (
                            <p className="text-gray-400 italic">Speak now...</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <span className="w-1 h-4 bg-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-4 bg-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-4 bg-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Speech error display */}
                  {speechError && (
                    <div className="bg-red-900/50 border border-red-500 p-3 rounded-lg">
                      <p className="text-red-300 text-sm">⚠️ Microphone error: {speechError}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try refreshing the page or check browser permissions
                      </p>
                    </div>
                  )}

                  {/* Microphone permission hint */}
                  {!isListening && !lastSpokenText && !speechError && (
                    <div className="text-xs text-gray-500 text-center space-y-1">
                      {micPermissionStatus === 'denied' ? (
                        <p className="text-red-400">❌ Microphone access denied. Please enable it in browser settings.</p>
                      ) : micPermissionStatus === 'unknown' || micPermissionStatus === 'prompt' ? (
                        <p>💡 Click the button and allow microphone access when prompted</p>
                      ) : (
                        <p className="text-green-400">✓ Microphone ready</p>
                      )}
                    </div>
                  )}

                  {/* Show what was heard */}
                  {lastSpokenText && !isListening && (
                    <div className={`
                      p-3 rounded-lg border
                      ${matchResult?.matched 
                        ? 'bg-green-900/50 border-green-500' 
                        : 'bg-red-900/50 border-red-500'
                      }
                    `}>
                      <p className="text-sm text-gray-300">You said:</p>
                      <p className="text-white font-medium">"{lastSpokenText}"</p>
                      {matchResult?.matched ? (
                        <p className="text-green-400 text-sm mt-1">✓ Correct!</p>
                      ) : (
                        <p className="text-red-400 text-sm mt-1">
                          ✗ Try again ({failedAttempts} attempt{failedAttempts !== 1 ? 's' : ''})
                        </p>
                      )}
                    </div>
                  )}

                  {/* Hint after failures */}
                  {showHint && currentNode.responses.some((r: DialogueResponse) => r.expectedSpeech) && (
                    <div className="bg-blue-900/50 border border-blue-500 p-3 rounded-lg">
                      <p className="text-sm text-blue-300 mb-1">💡 Hint - Try saying:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentNode.responses
                          .filter((r: DialogueResponse) => r.expectedSpeech)
                          .flatMap((r: DialogueResponse) => r.expectedSpeech || [])
                          .slice(0, 3)
                          .map((phrase: string, i: number) => (
                            <span 
                              key={i}
                              className="bg-blue-800 px-2 py-1 rounded text-sm"
                            >
                              {phrase}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-yellow-400">
                  Speech recognition not supported in this browser.
                </p>
              )}
            </div>
          )}

          {/* Written input mode */}
          {showWriteMode && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={writtenInput}
                  onChange={(e) => setWrittenInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitWritten()}
                  placeholder={`Type in ${targetLanguage.name}...`}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSubmitWritten}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Toggle between speak/write */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowWriteMode(!showWriteMode)}
              className="text-sm text-gray-400 hover:text-white"
            >
              {showWriteMode ? '🎤 Switch to speaking' : '✏️ Switch to writing'}
            </button>

            {/* Choice-based responses */}
            {currentNode.responses
              .filter((r: DialogueResponse) => r.requiresType === 'choice')
              .map((response: DialogueResponse) => (
                <button
                  key={response.id}
                  onClick={() => selectResponse(response)}
                  className="text-sm text-purple-400 hover:text-purple-300 ml-auto"
                >
                  {response.text}
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Close button for terminal nodes */}
      {(!currentNode.responses || currentNode.responses.length === 0) && (
        <div className="border-t border-gray-700 pt-4 text-center">
          <button
            onClick={closeDialogue}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
      </div>
    </>
  );
}
