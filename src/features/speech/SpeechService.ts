// Platform-agnostic speech service interface
import type { SpeechResult } from '../../core/types';

// Type declarations for Web Speech API
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface ISpeechService {
  isSupported(): boolean;
  startListening(languageCode: string): void;
  stopListening(): void;
  onResult(callback: (result: SpeechResult) => void): void;
  onError(callback: (error: string) => void): void;
  onEnd(callback: () => void): void;
  speak(text: string, languageCode: string): Promise<void>;
}

// ============================================================================
// SPEECH SERVICE FACTORY
// Chooses the right implementation based on user tier and browser
// ============================================================================

import { WhisperSpeechService } from './WhisperSpeechService';
import { isSupabaseConfigured, getProfile } from '../../lib/supabase';

export type SpeechServiceTier = 'free' | 'beta' | 'pro';

/**
 * Factory function to get the appropriate speech service
 * 
 * - Free users: Web Speech API (Chrome-only)
 * - Beta/Pro users: Whisper API (all browsers)
 * - Fallback: Web Speech if Whisper unavailable
 */
export async function createSpeechServiceForTier(tier?: SpeechServiceTier): Promise<ISpeechService> {
  // If tier not provided, try to get from user profile
  let userTier = tier;
  if (!userTier && isSupabaseConfigured) {
    try {
      const profile = await getProfile();
      userTier = (profile?.subscription_tier as SpeechServiceTier) || 'free';
    } catch {
      userTier = 'free';
    }
  }
  
  // Beta and Pro users get Whisper
  if ((userTier === 'beta' || userTier === 'pro') && isSupabaseConfigured) {
    console.log('SpeechFactory: Creating WhisperSpeechService for', userTier, 'user');
    const whisper = new WhisperSpeechService();
    if (whisper.isSupported()) {
      return whisper;
    }
    console.warn('SpeechFactory: Whisper not supported, falling back to WebSpeechService');
  }
  
  // Free users or fallback: Web Speech API
  console.log('SpeechFactory: Creating WebSpeechService for', userTier || 'free', 'user');
  return new WebSpeechService();
}

// Synchronous factory for immediate use (legacy, uses Web Speech)
export function createSpeechService(): ISpeechService {
  // For now, always return web implementation
  // Use createSpeechServiceForTier() for tier-aware service
  return new WebSpeechService();
}

// Web Speech API implementation
class WebSpeechService implements ISpeechService {
  private recognition: SpeechRecognitionInstance | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private resultCallback: ((result: SpeechResult) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;
  private endCallback: (() => void) | null = null;
  private isArcBrowser: boolean = false;
  private isSafariBrowser: boolean = false;
  private gotResult: boolean = false; // Track if we received any result

  constructor() {
    console.log('WebSpeechService constructor called');
    if (typeof window !== 'undefined') {
      // Detect problematic browsers
      const userAgent = navigator.userAgent.toLowerCase();
      // Arc browser detection - check multiple patterns
      // Arc may appear as "Arc/" or just have Arc somewhere in the UA
      this.isArcBrowser = userAgent.includes('arc/') || userAgent.includes(' arc ') || /\barc\b/.test(userAgent);
      this.isSafariBrowser = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium');
      const isVSCodeBrowser = userAgent.includes('vscode') || window.parent !== window;
      const isFirefox = userAgent.includes('firefox');
      
      if (this.isArcBrowser) {
        console.warn('Arc browser detected - Web Speech API may not work properly. Text input recommended.');
      }
      if (this.isSafariBrowser) {
        console.warn('Safari browser detected - Will use extra precautions for mic handling');
      }
      if (isVSCodeBrowser) {
        console.warn('VS Code embedded browser detected - Web Speech API not supported');
      }
      if (isFirefox) {
        console.warn('Firefox detected - Web Speech API not supported');
      }
      
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('SpeechRecognition API available:', !!SpeechRecognitionAPI);
      
      if (SpeechRecognitionAPI && !isFirefox) {
        try {
          this.recognition = new SpeechRecognitionAPI();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 3;

          this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            this.gotResult = true; // Mark that we got a result
            const result = event.results[event.results.length - 1];
            const speechResult: SpeechResult = {
              transcript: result[0].transcript,
              confidence: result[0].confidence,
              isFinal: result.isFinal,
              alternatives: Array.from({ length: result.length - 1 }, (_, i) => ({
                transcript: result[i + 1].transcript,
                confidence: result[i + 1].confidence,
              })),
            };
            this.resultCallback?.(speechResult);
            
            // IMPORTANT: When we get a final result, explicitly stop recognition
            // This prevents Safari from keeping the mic open and causing buzzing
            if (result.isFinal && this.recognition) {
              console.log('Final result received, stopping recognition');
              this.recognition.stop();
            }
          };

          this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            // Translate error codes to user-friendly messages
            let errorMessage = event.error;
            switch (event.error) {
              case 'not-allowed':
                if (this.isArcBrowser) {
                  errorMessage = 'Arc browser has limited speech support. Please open in Chrome/Safari, or use text input.';
                } else {
                  errorMessage = 'Microphone access denied. Click the lock icon in your address bar to allow.';
                }
                break;
              case 'no-speech':
                errorMessage = 'No speech detected. Try speaking louder or closer to the mic.';
                break;
              case 'audio-capture':
                errorMessage = 'No microphone found. Please connect a microphone.';
                break;
              case 'network':
                if (this.isArcBrowser) {
                  errorMessage = "Arc browser blocks Google's speech servers for privacy. Use the text input below, or open in Chrome/Safari for voice.";
                } else {
                  errorMessage = 'Speech recognition requires internet connection. Use the "Type instead" option for offline practice.';
                }
                break;
              case 'aborted':
                // This is normal when stopping, don't show error
                return;
              case 'service-not-allowed':
                errorMessage = 'Speech service unavailable. Please use Chrome browser.';
                break;
            }
            this.errorCallback?.(errorMessage);
          };

          this.recognition.onend = () => {
            console.log('Speech recognition ended, gotResult:', this.gotResult);
            
            // If recognition ended but we never got a result or error,
            // it's likely a silent failure (common in Arc browser)
            if (!this.gotResult) {
              console.warn('Recognition ended with no result - possible browser issue');
              this.errorCallback?.('Speech recognition failed silently. This browser may block speech services. Try typing your response instead.');
            }
            
            this.endCallback?.();
          };
        } catch (e) {
          console.error('Failed to initialize speech recognition:', e);
          this.recognition = null;
        }
      }

      this.synthesis = window.speechSynthesis;
      console.log('SpeechSynthesis available:', !!this.synthesis);
      
      // Trigger voice loading (needed for some browsers)
      if (this.synthesis) {
        const voices = this.synthesis.getVoices();
        console.log('Initial voices count:', voices.length);
        // Chrome loads voices async
        if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded:', this.synthesis?.getVoices().length);
          };
        }
      }
    }
  }

  isSupported(): boolean {
    const supported = this.recognition !== null;
    console.log('isSupported check:', supported);
    return supported;
  }

  startListening(languageCode: string): void {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      this.errorCallback?.('Speech recognition not supported. Please use Chrome or Edge browser.');
      return;
    }

    // IMPORTANT: Cancel any ongoing speech synthesis before listening
    // This prevents audio feedback/buzzing in Safari where the mic picks up the speaker
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    
    // Reset result tracking
    this.gotResult = false;

    console.log('Starting speech recognition for language:', languageCode);
    this.recognition.lang = languageCode;
    
    // Start speech recognition directly - mic permission should already be granted
    // The onerror handler will catch any permission issues
    try {
      this.recognition.start();
      console.log('Speech recognition started successfully');
    } catch (e: unknown) {
      const error = e as Error;
      console.warn('Recognition start error:', error);
      
      if (error.message?.includes('already started')) {
        // Already started, stop and restart
        this.recognition.stop();
        setTimeout(() => {
          try {
            this.recognition?.start();
            console.log('Speech recognition restarted');
          } catch (e2) {
            console.error('Failed to restart speech recognition:', e2);
            this.errorCallback?.('Failed to start speech recognition. Please refresh the page.');
          }
        }, 200);
      } else {
        this.errorCallback?.(`Speech recognition error: ${error.message || 'Unknown error'}`);
      }
    }
  }

  stopListening(): void {
    console.log('Stopping speech recognition');
    
    // Cancel any speech synthesis to prevent audio feedback
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    
    // For Safari, we need to be more aggressive about stopping
    if (this.recognition) {
      try {
        // Try abort first (more forceful than stop)
        if ('abort' in this.recognition) {
          (this.recognition as unknown as { abort: () => void }).abort();
        } else {
          this.recognition.stop();
        }
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
  }

  onResult(callback: (result: SpeechResult) => void): void {
    this.resultCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.errorCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.endCallback = callback;
  }

  async speak(text: string, languageCode: string): Promise<void> {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      utterance.rate = 0.85; // Slower for learning
      utterance.volume = 1.0;
      utterance.pitch = 1.0;

      // Try to find a voice for this language
      const voices = this.synthesis!.getVoices();
      const langVoice = voices.find(v => v.lang.startsWith(languageCode.split('-')[0]));
      if (langVoice) {
        utterance.voice = langVoice;
      }

      utterance.onend = () => {
        console.log('Speech synthesis ended');
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        resolve();
      };

      console.log('Speaking:', text, 'in', languageCode);
      this.synthesis!.speak(utterance);

      // Fallback timeout in case onend doesn't fire
      setTimeout(() => resolve(), text.length * 100 + 2000);
    });
  }
}

// Singleton instance
let speechServiceInstance: ISpeechService | null = null;

export function getSpeechService(): ISpeechService {
  if (!speechServiceInstance) {
    speechServiceInstance = createSpeechService();
  }
  return speechServiceInstance;
}
