/**
 * Static Dialogue Content Provider
 * 
 * Returns pre-defined dialogue trees from dialogueContent.ts.
 * This is the default provider for free users.
 * 
 * UPGRADE PATH TO PREMIUM:
 * Replace with AIDialogueProvider which can:
 * - Generate dynamic NPC responses based on context
 * - Handle unexpected player inputs gracefully
 * - Create personalized practice scenarios
 * - Adapt difficulty to player's level
 */

import type { IDialogueContentProvider } from './interfaces';
import type { DialogueTree, DialogueNode, DialogueContext, DialogueProviderResponse } from '../types';
import { dialogueTrees, findDialogueNode } from '../../features/dialogue/dialogueContent';

export class StaticDialogueProvider implements IDialogueContentProvider {
  
  async getDialogueTree(
    treeId: string,
    _context?: Partial<DialogueContext> // Unused in free mode
  ): Promise<DialogueTree | null> {
    // Free mode: Simply return the static tree
    const tree = dialogueTrees[treeId];
    
    if (!tree) {
      console.error(`Dialogue tree not found: ${treeId}`);
      return null;
    }

    // PREMIUM: Would customize tree based on context:
    // - Filter responses based on player's vocabulary level
    // - Add additional hints for struggling players
    // - Inject personalized vocabulary practice
    
    return tree;
  }

  getNode(tree: DialogueTree, nodeId: string): DialogueNode | undefined {
    return findDialogueNode(tree, nodeId);
  }

  /**
   * Generate dynamic response - NOT AVAILABLE IN FREE MODE
   * 
   * PREMIUM IMPLEMENTATION WOULD:
   * 1. Send player input + context to AI
   * 2. AI generates appropriate NPC response
   * 3. AI suggests next dialogue options
   * 4. Returns dynamically generated DialogueNode
   * 
   * Example premium flow:
   * - Player says something unexpected: "¿Tienes aguacates?"
   * - AI understands they're asking for avocados
   * - AI generates: "Lo siento, no tenemos aguacates hoy. 
   *                  ¿Quieres unas naranjas en su lugar?"
   * - Conversation continues naturally
   */
  async generateDynamicResponse(
    playerInput: string,
    context: DialogueContext
  ): Promise<DialogueProviderResponse> {
    // Free mode: Return a generic fallback response
    console.log('Dynamic responses are a premium feature');
    console.log('Player said:', playerInput);
    console.log('Context:', context.currentNodeId);

    // Return a helpful fallback node
    const fallbackNode: DialogueNode = {
      id: 'fallback-response',
      speaker: 'npc',
      text: "I'm not sure I understood. Could you try again with one of the phrases I suggested?",
      textInTargetLanguage: 'No estoy seguro de haber entendido. ¿Puedes intentarlo de nuevo con una de las frases que sugerí?',
      responses: [
        {
          id: 'return-to-main',
          text: 'Try again',
          nextNodeId: context.currentNodeId, // Return to current node
          requiresType: 'choice',
        },
      ],
    };

    return {
      node: fallbackNode,
      isGenerated: false, // Not AI-generated
      suggestedResponses: undefined, // Premium feature
    };
  }
}

// Export a default instance
export const staticDialogueProvider = new StaticDialogueProvider();
