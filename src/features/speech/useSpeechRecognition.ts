import { useEffect, useCallback } from 'react';
import { useSpeechStore, useGameStore } from '../../core/stores';
import { getSpeechService } from './SpeechService';

export function useSpeechRecognition() {
  const { 
    isListening, 
    transcript, 
    confidence, 
    error,
    isSupported,
    setListening, 
    setTranscript, 
    setError,
    setSupported,
    reset 
  } = useSpeechStore();
  
  const { targetLanguage } = useGameStore();

  useEffect(() => {
    const service = getSpeechService();
    setSupported(service.isSupported());

    service.onResult((result) => {
      setTranscript(result.transcript, result.confidence);
    });

    service.onError((err) => {
      setError(err);
    });

    service.onEnd(() => {
      setListening(false);
    });
  }, [setSupported, setTranscript, setError, setListening]);

  const startListening = useCallback(() => {
    reset();
    setListening(true);
    getSpeechService().startListening(targetLanguage.speechRecognitionCode);
  }, [targetLanguage.speechRecognitionCode, reset, setListening]);

  const stopListening = useCallback(() => {
    setListening(false);
    getSpeechService().stopListening();
  }, [setListening]);

  const speak = useCallback(async (text: string) => {
    await getSpeechService().speak(text, targetLanguage.speechRecognitionCode);
  }, [targetLanguage.speechRecognitionCode]);

  return {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    speak,
    reset,
  };
}

// Utility to compare spoken text with expected phrases
export function matchSpeech(
  spoken: string,
  expected: string[],
  threshold: number = 0.6
): { matched: boolean; bestMatch: string; similarity: number } {
  const spokenLower = spoken.toLowerCase().trim();
  
  let bestMatch = '';
  let bestSimilarity = 0;

  for (const phrase of expected) {
    const expectedLower = phrase.toLowerCase().trim();
    const similarity = calculateSimilarity(spokenLower, expectedLower);
    
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = phrase;
    }
  }

  return {
    matched: bestSimilarity >= threshold,
    bestMatch,
    similarity: bestSimilarity,
  };
}

// Simple Levenshtein-based similarity calculation
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}
