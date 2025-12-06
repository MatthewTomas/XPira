/**
 * Whisper Speech Service
 * 
 * Uses OpenAI's Whisper API via Supabase Edge Function for speech-to-text.
 * Works in ALL browsers (Safari, Arc, Firefox, Chrome).
 * 
 * This is the premium speech service for Beta and Pro users.
 */

import type { SpeechResult } from '../../core/types';
import type { ISpeechService } from './SpeechService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export class WhisperSpeechService implements ISpeechService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private synthesis: SpeechSynthesis | null = null;
  
  private resultCallback: ((result: SpeechResult) => void) | null = null;
  private errorCallback: ((error: string) => void) | null = null;
  private endCallback: (() => void) | null = null;
  
  private isRecording: boolean = false;
  private currentLanguage: string = 'es';

  constructor() {
    console.log('WhisperSpeechService: Initializing');
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    // MediaRecorder is supported in all modern browsers
    return typeof MediaRecorder !== 'undefined' && navigator.mediaDevices?.getUserMedia !== undefined;
  }

  async startListening(languageCode: string): Promise<void> {
    if (!this.isSupported()) {
      this.errorCallback?.('Audio recording not supported in this browser');
      return;
    }

    this.currentLanguage = languageCode;
    this.audioChunks = [];
    this.isRecording = true;

    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      // Determine best audio format
      const mimeType = this.getSupportedMimeType();
      console.log('WhisperSpeechService: Using MIME type:', mimeType);

      this.mediaRecorder = new MediaRecorder(this.stream, { 
        mimeType,
        audioBitsPerSecond: 128000 
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        console.log('WhisperSpeechService: Recording stopped, processing...');
        await this.processAudio();
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('WhisperSpeechService: MediaRecorder error', event);
        this.errorCallback?.('Recording error occurred');
        this.cleanup();
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect chunks every second
      console.log('WhisperSpeechService: Recording started');

    } catch (err: any) {
      console.error('WhisperSpeechService: Failed to start recording', err);
      if (err.name === 'NotAllowedError') {
        this.errorCallback?.('Microphone access denied');
      } else if (err.name === 'NotFoundError') {
        this.errorCallback?.('No microphone found');
      } else {
        this.errorCallback?.(err.message || 'Failed to access microphone');
      }
      this.cleanup();
    }
  }

  stopListening(): void {
    console.log('WhisperSpeechService: stopListening called');
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.isRecording = false;
      this.mediaRecorder.stop();
    } else {
      this.cleanup();
      this.endCallback?.();
    }
  }

  private async processAudio(): Promise<void> {
    if (this.audioChunks.length === 0) {
      console.log('WhisperSpeechService: No audio data to process');
      this.endCallback?.();
      this.cleanup();
      return;
    }

    // Combine audio chunks
    const mimeType = this.getSupportedMimeType();
    const audioBlob = new Blob(this.audioChunks, { type: mimeType });
    console.log('WhisperSpeechService: Audio blob size:', audioBlob.size, 'bytes');

    // Skip if too short (likely no speech)
    if (audioBlob.size < 1000) {
      console.log('WhisperSpeechService: Audio too short, skipping');
      this.endCallback?.();
      this.cleanup();
      return;
    }

    try {
      // Send to Whisper Edge Function
      const transcript = await this.transcribeWithWhisper(audioBlob);
      
      if (transcript && transcript.trim()) {
        console.log('WhisperSpeechService: Transcription result:', transcript);
        this.resultCallback?.({
          transcript: transcript.trim(),
          confidence: 0.9, // Whisper is generally high confidence
          isFinal: true,
        });
      } else {
        console.log('WhisperSpeechService: No speech detected');
      }
    } catch (err: any) {
      console.error('WhisperSpeechService: Transcription error', err);
      this.errorCallback?.(err.message || 'Transcription failed');
    }

    this.endCallback?.();
    this.cleanup();
  }

  private async transcribeWithWhisper(audioBlob: Blob): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured - Whisper transcription unavailable');
    }

    // Get auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated - please log in for voice features');
    }

    // Create FormData with audio file
    const formData = new FormData();
    
    // Determine file extension from MIME type
    const extension = this.getFileExtension(audioBlob.type);
    formData.append('audio', audioBlob, `recording.${extension}`);
    formData.append('language', this.currentLanguage);

    // Get Supabase Edge Function URL
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whisper-transcribe`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Transcription failed: ${response.status}`);
    }

    const data = await response.json();
    return data.transcript || '';
  }

  private getSupportedMimeType(): string {
    // Try formats in order of preference for Whisper
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback
    return 'audio/webm';
  }

  private getFileExtension(mimeType: string): string {
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('mp4')) return 'mp4';
    if (mimeType.includes('ogg')) return 'ogg';
    if (mimeType.includes('wav')) return 'wav';
    return 'webm';
  }

  private cleanup(): void {
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
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
    // Use browser's built-in TTS (same as WebSpeechService)
    return new Promise((resolve) => {
      if (!this.synthesis) {
        console.warn('WhisperSpeechService: Speech synthesis not available');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => {
        console.warn('WhisperSpeechService: TTS error');
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }
}
