/**
 * Microphone Permission Modal
 * 
 * Shows a friendly prompt to request microphone access before
 * the browser's permission dialog appears. This helps users understand
 * why we need microphone access and reduces permission denial rates.
 */

import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../core/stores';
import { playSound } from '../features/audio';

interface MicPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
}

export function MicPermissionModal({ 
  isOpen, 
  onClose, 
  onPermissionGranted 
}: MicPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setMicPermissionStatus } = useGameStore();

  const requestMicPermission = useCallback(async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // IMPORTANT: Stop the stream immediately to prevent buzzing!
      // The permission is remembered by the browser even after stopping.
      // Keeping the stream alive causes audio feedback/buzzing in Safari.
      stream.getTracks().forEach(track => track.stop());
      
      // Update store and callback
      setMicPermissionStatus('granted');
      playSound('success');
      onPermissionGranted();
      onClose();
    } catch (err) {
      console.error('Microphone permission error:', err);
      const error = err as Error;
      const errorName = (err as { name?: string }).name || '';
      
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        setMicPermissionStatus('denied');
        setError('Microphone access was denied. Please click the camera/mic icon in your browser\'s address bar to allow access.');
      } else if (errorName === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone or use the text input option.');
      } else {
        setError(`Could not access microphone: ${error.message || 'Unknown error'}`);
      }
      
      playSound('error');
    } finally {
      setIsRequesting(false);
    }
  }, [onClose, onPermissionGranted, setMicPermissionStatus]);

  const handleSkip = useCallback(() => {
    setMicPermissionStatus('denied');
    onClose();
  }, [onClose, setMicPermissionStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 border-2 border-indigo-500 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎤</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Enable Voice Practice
          </h2>
          <p className="text-gray-400">
            Speaking is the best way to learn a language! Allow microphone access to practice pronunciation.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300 mb-3">With voice enabled, you can:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-green-400">
              <span>✓</span> Practice speaking in {useGameStore.getState().targetLanguage.name}
            </li>
            <li className="flex items-center gap-2 text-green-400">
              <span>✓</span> Get instant feedback on your pronunciation
            </li>
            <li className="flex items-center gap-2 text-green-400">
              <span>✓</span> Complete missions by talking to NPCs
            </li>
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={requestMicPermission}
            disabled={isRequesting}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all
              ${isRequesting 
                ? 'bg-gray-600 cursor-wait' 
                : 'bg-green-600 hover:bg-green-500 active:scale-98'
              }
            `}
          >
            {isRequesting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Requesting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                🎤 Allow Microphone
              </span>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Skip for now (use text input instead)
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Your voice is processed locally and never stored.
        </p>
      </div>
    </div>
  );
}

/**
 * Hook to manage microphone permission flow
 */
export function useMicPermission() {
  const { micPermissionStatus, setMicPermissionStatus } = useGameStore();
  const [showModal, setShowModal] = useState(false);

  // Check permission status on mount and sync with browser state
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // First check if we have an active mic stream (means permission was granted this session)
        if ((window as unknown as { __micStream?: MediaStream }).__micStream) {
          setMicPermissionStatus('granted');
          return;
        }
        
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ 
            name: 'microphone' as PermissionName 
          });
          
          console.log('Microphone permission state:', result.state);
          
          if (result.state === 'granted') {
            setMicPermissionStatus('granted');
          } else if (result.state === 'denied') {
            setMicPermissionStatus('denied');
          } else {
            setMicPermissionStatus('prompt');
          }
          
          // Listen for permission changes
          result.onchange = () => {
            console.log('Microphone permission changed to:', result.state);
            if (result.state === 'granted') {
              setMicPermissionStatus('granted');
            } else if (result.state === 'denied') {
              setMicPermissionStatus('denied');
            }
          };
        }
      } catch (e) {
        // Permissions API not fully supported, will prompt on first use
        console.log('Permissions API not available, will prompt on first use');
      }
    };

    checkPermission();
  }, [setMicPermissionStatus]);

  const requestPermission = useCallback(() => {
    if (micPermissionStatus === 'granted') {
      return true; // Already have permission
    }
    setShowModal(true);
    return false;
  }, [micPermissionStatus]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    micPermissionStatus,
    showModal,
    requestPermission,
    closeModal,
    hasPermission: micPermissionStatus === 'granted',
  };
}
