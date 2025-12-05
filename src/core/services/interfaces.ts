/**
 * Service interfaces for dual-mode architecture
 * 
 * These interfaces define the contract for services that can be swapped
 * between free (hard-coded) and premium (AI-powered) implementations.
 * 
 * ARCHITECTURE OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                        ServiceFactory                           │
 * │  (creates appropriate services based on UserTier)               │
 * └─────────────────────────────────────────────────────────────────┘
 *                              │
 *         ┌────────────────────┼────────────────────┐
 *         ▼                    ▼                    ▼
 * ┌───────────────┐  ┌─────────────────┐  ┌──────────────────┐
 * │ IResponse     │  │ IDialogue       │  │ ISpeechFeedback  │
 * │ Evaluator     │  │ ContentProvider │  │ Generator        │
 * └───────────────┘  └─────────────────┘  └──────────────────┘
 *         │                    │                    │
 *    ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
 *    ▼         ▼          ▼         ▼          ▼         ▼
 * [Free]   [Premium]   [Free]   [Premium]   [Free]   [Premium]
 * Pattern   AI/LLM    Static    AI Gen    Simple    AI Tips
 * Match    Semantic    Trees    Dynamic   Msgs      Detailed
 */

import type {
  DialogueNode,
  DialogueTree,
  DialogueContext,
  ResponseEvaluation,
  SpeechFeedback,
  DialogueProviderResponse,
} from '../types';

// ============================================================================
// RESPONSE EVALUATOR
// Determines if player's spoken/written input matches expected responses
// ============================================================================

/**
 * Evaluates player responses against expected answers
 * 
 * FREE IMPLEMENTATION (FreeResponseEvaluator):
 * - Uses Levenshtein distance for string similarity
 * - Matches against predefined expectedSpeech arrays
 * - Returns simple matched/not-matched result
 * 
 * PREMIUM IMPLEMENTATION (PremiumResponseEvaluator):
 * - Sends transcript + context to AI (OpenAI/Claude/etc)
 * - Understands semantic meaning (accepts paraphrases)
 * - Provides pronunciation scoring
 * - Returns detailed feedback with corrections
 */
export interface IResponseEvaluator {
  /**
   * Evaluate a player's response
   * @param transcript - What the player said/wrote
   * @param expectedPhrases - Acceptable answers (for free mode)
   * @param context - Full dialogue context (for premium mode)
   * @returns Evaluation result with match status and feedback
   */
  evaluate(
    transcript: string,
    expectedPhrases: string[],
    context: DialogueContext
  ): Promise<ResponseEvaluation>;

  /**
   * Get the similarity threshold used for matching
   * Premium mode may use lower threshold since AI understands meaning
   */
  getSimilarityThreshold(): number;
}

// ============================================================================
// DIALOGUE CONTENT PROVIDER
// Provides dialogue trees and nodes for conversations
// ============================================================================

/**
 * Provides dialogue content for NPC conversations
 * 
 * FREE IMPLEMENTATION (StaticDialogueProvider):
 * - Returns pre-defined dialogue trees from dialogueContent.ts
 * - Fixed conversation paths
 * - Predictable learning outcomes
 * 
 * PREMIUM IMPLEMENTATION (AIDialogueProvider):
 * - Can generate dynamic responses based on context
 * - Adapts to player's level and learning history
 * - Creates personalized practice scenarios
 * - Still uses static trees as base, enhances with AI
 */
export interface IDialogueContentProvider {
  /**
   * Get a dialogue tree for an NPC
   * @param treeId - Identifier for the dialogue tree
   * @param context - Game context for AI customization
   */
  getDialogueTree(
    treeId: string,
    context?: Partial<DialogueContext>
  ): Promise<DialogueTree | null>;

  /**
   * Get a specific node from a tree
   * @param tree - The dialogue tree
   * @param nodeId - Node identifier
   */
  getNode(tree: DialogueTree, nodeId: string): DialogueNode | undefined;

  /**
   * Generate a dynamic response (premium only)
   * Falls back to static content in free mode
   * 
   * PREMIUM: This is where AI generates contextual NPC responses
   * based on what the player said, even if unexpected
   */
  generateDynamicResponse?(
    playerInput: string,
    context: DialogueContext
  ): Promise<DialogueProviderResponse>;
}

// ============================================================================
// SPEECH FEEDBACK GENERATOR
// Creates feedback messages for player's speech attempts
// ============================================================================

/**
 * Generates feedback for speech/writing attempts
 * 
 * FREE IMPLEMENTATION (SimpleFeedbackGenerator):
 * - "Correct!" or "Try again"
 * - Shows hint after N failures
 * - Basic encouragement
 * 
 * PREMIUM IMPLEMENTATION (AIFeedbackGenerator):
 * - Detailed pronunciation tips ("Roll your R's more")
 * - Grammar explanations with examples
 * - Personalized encouragement based on progress
 * - Audio examples of correct pronunciation
 */
export interface ISpeechFeedbackGenerator {
  /**
   * Generate feedback for a response attempt
   * @param transcript - What the player said
   * @param evaluation - The evaluation result
   * @param context - Dialogue context
   */
  generateFeedback(
    transcript: string,
    evaluation: ResponseEvaluation,
    context: DialogueContext
  ): Promise<SpeechFeedback>;
}

// ============================================================================
// SERVICE FACTORY
// Creates appropriate service implementations based on user tier
// ============================================================================

export interface IServiceFactory {
  createResponseEvaluator(): IResponseEvaluator;
  createDialogueProvider(): IDialogueContentProvider;
  createFeedbackGenerator(): ISpeechFeedbackGenerator;
}
