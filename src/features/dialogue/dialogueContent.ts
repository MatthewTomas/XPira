import type { DialogueTree, DialogueNode } from '../../core/types';

// Dialogue content for the marketplace vendor
export const marketVendorDialogue: DialogueTree = {
  id: 'market-vendor-fruits',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'npc',
      text: 'Hello! Welcome to my fruit stand. What would you like to buy?',
      textInTargetLanguage: '¡Hola! Bienvenido a mi puesto de frutas. ¿Qué te gustaría comprar?',
      responses: [
        {
          id: 'ask-apples',
          text: 'Ask for apples',
          expectedSpeech: ['manzanas', 'quiero manzanas', 'dame manzanas', 'manzanas por favor'],
          nextNodeId: 'apples-response',
          requiresType: 'speak',
        },
        {
          id: 'ask-oranges',
          text: 'Ask for oranges',
          expectedSpeech: ['naranjas', 'quiero naranjas', 'dame naranjas', 'naranjas por favor'],
          nextNodeId: 'oranges-response',
          requiresType: 'speak',
        },
        {
          id: 'ask-bananas',
          text: 'Ask for bananas',
          expectedSpeech: ['plátanos', 'bananas', 'quiero plátanos', 'dame plátanos'],
          nextNodeId: 'bananas-response',
          requiresType: 'speak',
        },
        {
          id: 'write-fallback',
          text: 'Write your order instead',
          nextNodeId: 'write-prompt',
          requiresType: 'choice',
        },
      ],
    },
    {
      id: 'apples-response',
      speaker: 'npc',
      text: 'Great choice! Here are some fresh apples. That will be 5 coins.',
      textInTargetLanguage: '¡Buena elección! Aquí tienes unas manzanas frescas. Son 5 monedas.',
      action: {
        type: 'give_item',
        payload: { itemId: 'apple', quantity: 3 },
      },
      responses: [
        {
          id: 'say-thanks',
          text: 'Say thank you',
          expectedSpeech: ['gracias', 'muchas gracias', 'te lo agradezco'],
          nextNodeId: 'farewell',
          requiresType: 'speak',
        },
      ],
    },
    {
      id: 'oranges-response',
      speaker: 'npc',
      text: 'Excellent! These oranges are very juicy. That will be 6 coins.',
      textInTargetLanguage: '¡Excelente! Estas naranjas son muy jugosas. Son 6 monedas.',
      action: {
        type: 'give_item',
        payload: { itemId: 'orange', quantity: 3 },
      },
      responses: [
        {
          id: 'say-thanks',
          text: 'Say thank you',
          expectedSpeech: ['gracias', 'muchas gracias', 'te lo agradezco'],
          nextNodeId: 'farewell',
          requiresType: 'speak',
        },
      ],
    },
    {
      id: 'bananas-response',
      speaker: 'npc',
      text: 'Perfect! Here are some ripe bananas. That will be 4 coins.',
      textInTargetLanguage: '¡Perfecto! Aquí tienes unos plátanos maduros. Son 4 monedas.',
      action: {
        type: 'give_item',
        payload: { itemId: 'banana', quantity: 3 },
      },
      responses: [
        {
          id: 'say-thanks',
          text: 'Say thank you',
          expectedSpeech: ['gracias', 'muchas gracias', 'te lo agradezco'],
          nextNodeId: 'farewell',
          requiresType: 'speak',
        },
      ],
    },
    {
      id: 'write-prompt',
      speaker: 'npc',
      text: "No problem! You can write down what you'd like. Here are the words you might need:",
      textInTargetLanguage: '¡No hay problema! Puedes escribir lo que quieras. Aquí están las palabras que podrías necesitar:',
      action: {
        type: 'teach_word',
        payload: {
          words: [
            { word: 'manzanas', translation: 'apples' },
            { word: 'naranjas', translation: 'oranges' },
            { word: 'plátanos', translation: 'bananas' },
            { word: 'quiero', translation: 'I want' },
            { word: 'por favor', translation: 'please' },
          ],
        },
      },
      responses: [
        {
          id: 'write-order',
          text: 'Type your order',
          nextNodeId: 'greeting',
          requiresType: 'write',
        },
      ],
    },
    {
      id: 'not-understood',
      speaker: 'npc',
      text: "I'm sorry, I didn't understand. Could you try again? Remember to speak clearly.",
      textInTargetLanguage: 'Lo siento, no entendí. ¿Puedes intentarlo de nuevo? Recuerda hablar claramente.',
      responses: [
        {
          id: 'try-again',
          text: 'Try speaking again',
          expectedSpeech: ['manzanas', 'naranjas', 'plátanos', 'quiero', 'dame'],
          nextNodeId: 'greeting',
          requiresType: 'speak',
        },
        {
          id: 'get-help',
          text: 'Ask for help',
          nextNodeId: 'write-prompt',
          requiresType: 'choice',
        },
      ],
    },
    {
      id: 'farewell',
      speaker: 'npc',
      text: "You're welcome! Come back anytime. Goodbye!",
      textInTargetLanguage: '¡De nada! Vuelve cuando quieras. ¡Adiós!',
      action: {
        type: 'give_xp',
        payload: { amount: 25 },
      },
    },
  ],
};

// Helper to find a node by ID
export function findDialogueNode(tree: DialogueTree, nodeId: string): DialogueNode | undefined {
  return tree.nodes.find((node) => node.id === nodeId);
}

// Get all available dialogue trees
export const dialogueTrees: Record<string, DialogueTree> = {
  'market-vendor-fruits': marketVendorDialogue,
};
