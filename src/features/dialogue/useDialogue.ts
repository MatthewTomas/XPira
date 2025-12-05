import { useCallback, useMemo } from 'react';
import { usePlayerStore, useGameStore, useSkillStore } from '../../core/stores';
import { findDialogueNode } from './dialogueContent';
import { useDialogueStore } from './dialogueStore';
import { getServiceFactory } from '../../core/services';
import type { DialogueResponse, DialogueContext } from '../../core/types';

/**
 * Hook for managing dialogue interactions
 * 
 * ARCHITECTURE NOTE:
 * This hook uses the ServiceFactory to get the appropriate response evaluator
 * based on the user's tier (free vs premium). This allows swapping between:
 * 
 * FREE MODE (current):
 * - FreeResponseEvaluator: Levenshtein-based pattern matching
 * - Matches against predefined expectedSpeech arrays
 * 
 * PREMIUM MODE (future):
 * - PremiumResponseEvaluator: AI-powered semantic understanding
 * - Accepts paraphrases, provides pronunciation feedback
 * - Generates corrections and learning tips
 */
export function useDialogue() {
  const { addExperience, addItem, learnWord, stats, learnedWords } = usePlayerStore();
  const { userTier, targetLanguage } = useGameStore();
  const { addSkillXp } = useSkillStore();
  
  const {
    isActive,
    currentNpcId,
    currentTree,
    currentNode,
    failedAttempts,
    showHint,
    lastSpokenText,
    matchResult,
    initDialogue,
    setCurrentNode,
    setMatchResult,
    setLastSpokenText,
    incrementFailedAttempts,
    resetFailedAttempts,
    closeDialogue,
  } = useDialogueStore();

  // Get the appropriate evaluator based on user tier
  // PREMIUM: This will return PremiumResponseEvaluator when available
  const evaluator = useMemo(() => {
    const factory = getServiceFactory(userTier);
    return factory.createResponseEvaluator();
  }, [userTier]);

  // Build dialogue context for evaluator
  // PREMIUM: AI uses this context to understand conversation flow
  const buildContext = useCallback((): DialogueContext => {
    return {
      npcId: currentNpcId || '',
      npcName: currentNpcId || 'Unknown',
      npcRole: 'vendor', // TODO: Get from NPC data
      currentNodeId: currentNode?.id || '',
      previousNodes: [], // TODO: Track conversation history
      playerLevel: stats.level,
      targetLanguage,
      learnedWords: learnedWords.map(w => w.word),
      currentMission: undefined,
      // PREMIUM: Add full conversation history for AI context
      conversationHistory: undefined,
    };
  }, [currentNpcId, currentNode, stats.level, targetLanguage, learnedWords]);

  const executeAction = useCallback((action: { type: string; payload: Record<string, unknown> }) => {
    switch (action.type) {
      case 'give_xp':
        addExperience(action.payload.amount as number);
        break;
      case 'give_item':
        addItem({
          id: action.payload.itemId as string,
          name: action.payload.itemId as string,
          nameInTargetLanguage: '',
          quantity: action.payload.quantity as number,
          category: 'food',
          description: '',
        });
        break;
      case 'teach_word':
        const words = action.payload.words as Array<{ word: string; translation: string }>;
        words?.forEach((w) => {
          learnWord({
            id: w.word,
            word: w.word,
            translation: w.translation,
            pronunciation: '',
            category: 'marketplace',
            timesUsed: 0,
            lastUsed: new Date(),
            proficiency: 20,
          });
        });
        break;
    }
  }, [addExperience, addItem, learnWord]);

  const advanceToNode = useCallback((nodeId: string) => {
    if (!currentTree) return;

    const nextNode = findDialogueNode(currentTree, nodeId);
    if (!nextNode) {
      console.error(`Node not found: ${nodeId}`);
      return;
    }

    // Execute any actions on the current node before advancing
    if (nextNode.action) {
      executeAction(nextNode.action);
    }

    // Check if this is a terminal node (no responses)
    if (!nextNode.responses || nextNode.responses.length === 0) {
      // End dialogue after a short delay
      setTimeout(() => {
        closeDialogue();
      }, 3000);
    }

    setCurrentNode(nextNode);
    setMatchResult(null);
    resetFailedAttempts();
  }, [currentTree, executeAction, setCurrentNode, setMatchResult, resetFailedAttempts, closeDialogue]);

  /**
   * Handle player speech/text input
   * 
   * FREE MODE: Uses FreeResponseEvaluator with Levenshtein matching
   * PREMIUM MODE: Would use AI for semantic understanding
   */
  const handleSpeechInput = useCallback(async (transcript: string) => {
    if (!currentNode?.responses) return;

    setLastSpokenText(transcript);
    const context = buildContext();

    // Find matching response using the appropriate evaluator
    for (const response of currentNode.responses) {
      if (response.requiresType === 'speak' && response.expectedSpeech) {
        // Use the service-based evaluator instead of direct matchSpeech
        const result = await evaluator.evaluate(
          transcript,
          response.expectedSpeech,
          context
        );
        
        if (result.matched) {
          // Success! Navigate to next node
          setMatchResult({ matched: true, similarity: result.similarity });
          resetFailedAttempts();
          advanceToNode(response.nextNodeId);
          
          // Award skill XP based on response type and language
          // Map target language to skill ID (e.g., 'es' -> 'spanish')
          const languageSkillMap: Record<string, string> = {
            'es': 'spanish',
            'fr': 'french',
            'de': 'german',
            'it': 'italian',
            'pt': 'portuguese',
            'ja': 'japanese',
          };
          const skillId = languageSkillMap[targetLanguage.code] || 'spanish';
          
          // Award XP: base 10, bonus for higher similarity
          const baseXp = 10;
          const bonusXp = Math.floor(result.similarity * 5);
          addSkillXp(skillId, baseXp + bonusXp, 'in-game');
          
          // Also award sub-skill XP based on response type
          if (response.requiresType === 'speak') {
            addSkillXp(`${skillId}-pronunciation`, 5, 'in-game');
          }
          addSkillXp(`${skillId}-vocabulary`, 3, 'in-game');
          addSkillXp(`${skillId}-comprehension`, 3, 'in-game');
          
          // PREMIUM: Could also show AI feedback here
          // if (result.feedback) showFeedback(result.feedback);
          // if (result.pronunciationScore) updatePronunciationStats(result.pronunciationScore);
          
          return;
        }
      }
    }

    // No match found
    setMatchResult({ matched: false, similarity: 0 });
    incrementFailedAttempts();

    // After 3 fails, offer to write instead
    if (failedAttempts >= 2 && currentTree) {
      const notUnderstoodNode = findDialogueNode(currentTree, 'not-understood');
      if (notUnderstoodNode) {
        setCurrentNode(notUnderstoodNode);
      }
    }
  }, [currentNode, currentTree, failedAttempts, evaluator, buildContext, setLastSpokenText, setMatchResult, incrementFailedAttempts, resetFailedAttempts, setCurrentNode, advanceToNode]);

  const handleWrittenInput = useCallback((text: string) => {
    handleSpeechInput(text);
  }, [handleSpeechInput]);

  const selectResponse = useCallback((response: DialogueResponse) => {
    if (response.requiresType === 'choice') {
      advanceToNode(response.nextNodeId);
    }
  }, [advanceToNode]);

  return {
    isActive,
    currentNpcId,
    currentNode,
    failedAttempts,
    showHint,
    lastSpokenText,
    matchResult,
    initDialogue,
    handleSpeechInput,
    handleWrittenInput,
    selectResponse,
    closeDialogue,
  };
}
