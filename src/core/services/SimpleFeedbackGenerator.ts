/**
 * Simple Feedback Generator (Free Tier)
 * 
 * Generates basic feedback messages for speech attempts.
 * 
 * UPGRADE PATH TO PREMIUM:
 * Replace with AIFeedbackGenerator which provides:
 * - Detailed pronunciation tips ("Try rolling your R's")
 * - Grammar explanations with examples
 * - Personalized encouragement based on progress history
 * - Audio examples of correct pronunciation
 * - Comparison with native speaker patterns
 */

import type { ISpeechFeedbackGenerator } from './interfaces';
import type { ResponseEvaluation, DialogueContext, SpeechFeedback } from '../types';

export class SimpleFeedbackGenerator implements ISpeechFeedbackGenerator {
  
  async generateFeedback(
    transcript: string,
    evaluation: ResponseEvaluation,
    context: DialogueContext
  ): Promise<SpeechFeedback> {
    if (evaluation.matched) {
      return this.generateSuccessFeedback(evaluation);
    }
    
    if (evaluation.similarity > 0.3) {
      return this.generatePartialFeedback(transcript, evaluation, context);
    }
    
    return this.generateIncorrectFeedback(evaluation, context);
  }

  private generateSuccessFeedback(evaluation: ResponseEvaluation): SpeechFeedback {
    const messages = [
      '¡Perfecto! Excellent!',
      '¡Muy bien! Very good!',
      '¡Correcto! Correct!',
      '¡Excelente! Excellent!',
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];

    return {
      type: 'success',
      message,
      // PREMIUM: Would include:
      // pronunciationTips: AI-analyzed tips
      // encouragement: Personalized based on progress
      // audioExample: Link to native pronunciation
    };
  }

  private generatePartialFeedback(
    transcript: string,
    evaluation: ResponseEvaluation,
    _context: DialogueContext
  ): SpeechFeedback {
    // Close but not quite - give helpful hint
    const hint = evaluation.bestMatch 
      ? `Try saying: "${evaluation.bestMatch}"`
      : 'Listen to the phrase again and try once more.';

    return {
      type: 'partial',
      message: `Almost! You said "${transcript}"`,
      hint,
      // PREMIUM: Would include:
      // pronunciationTips: ["You said 'manszanas' - try 'mahn-SAH-nahs'"]
      // grammarExplanation: AI explanation of what went wrong
    };
  }

  private generateIncorrectFeedback(
    evaluation: ResponseEvaluation,
    _context: DialogueContext
  ): SpeechFeedback {
    const hints = [
      'Click "Listen again" to hear the correct phrase.',
      'Try speaking more slowly and clearly.',
      'You can also switch to writing if speaking is difficult.',
    ];

    return {
      type: 'incorrect',
      message: "I didn't quite catch that.",
      hint: evaluation.bestMatch 
        ? `The expected phrase was: "${evaluation.bestMatch}"`
        : hints[Math.floor(Math.random() * hints.length)],
      // PREMIUM: Would include:
      // pronunciationTips: Detailed AI analysis
      // grammarExplanation: What grammar rules apply
      // encouragement: "You've improved 20% this week!"
    };
  }
}

// Export a default instance
export const simpleFeedbackGenerator = new SimpleFeedbackGenerator();
