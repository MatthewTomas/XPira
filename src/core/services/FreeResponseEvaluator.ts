/**
 * Free-tier Response Evaluator
 * 
 * Uses Levenshtein distance to match player speech against expected phrases.
 * This is the default evaluator for free users.
 * 
 * UPGRADE PATH TO PREMIUM:
 * Replace with PremiumResponseEvaluator which uses AI for:
 * - Semantic understanding (accepts paraphrases)
 * - Pronunciation scoring
 * - Grammar checking
 * - Detailed corrections
 */

import type { IResponseEvaluator } from './interfaces';
import type { ResponseEvaluation, DialogueContext } from '../types';

export class FreeResponseEvaluator implements IResponseEvaluator {
  private readonly threshold: number;

  constructor(threshold: number = 0.5) {
    this.threshold = threshold;
  }

  getSimilarityThreshold(): number {
    return this.threshold;
  }

  async evaluate(
    transcript: string,
    expectedPhrases: string[],
    _context: DialogueContext // Unused in free mode, but available for premium
  ): Promise<ResponseEvaluation> {
    const spokenLower = transcript.toLowerCase().trim();
    
    let bestMatch = '';
    let bestSimilarity = 0;

    for (const phrase of expectedPhrases) {
      const expectedLower = phrase.toLowerCase().trim();
      const similarity = this.calculateSimilarity(spokenLower, expectedLower);
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = phrase;
      }
    }

    const matched = bestSimilarity >= this.threshold;

    // PREMIUM: Would add these fields with AI analysis:
    // - semanticMatch: AI determines if meaning is correct
    // - pronunciationScore: AI scores pronunciation accuracy
    // - grammarCorrect: AI checks grammar
    // - corrections: AI suggests fixes
    // - feedback: AI provides natural language feedback

    return {
      matched,
      similarity: bestSimilarity,
      bestMatch: matched ? bestMatch : undefined,
      
      // Premium fields left undefined in free mode
      semanticMatch: undefined,
      pronunciationScore: undefined,
      grammarCorrect: undefined,
      corrections: undefined,
      feedback: undefined,
    };
  }

  /**
   * Calculate similarity between two strings using Levenshtein distance
   * Returns a value between 0 (completely different) and 1 (identical)
   */
  private calculateSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;

    // Check for substring match (helps with partial phrases)
    if (a.includes(b) || b.includes(a)) {
      const shorter = a.length < b.length ? a : b;
      const longer = a.length >= b.length ? a : b;
      return shorter.length / longer.length;
    }

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
}

// Export a default instance for convenience
export const freeResponseEvaluator = new FreeResponseEvaluator();
