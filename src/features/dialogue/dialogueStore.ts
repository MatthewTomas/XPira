import { create } from 'zustand';
import type { DialogueNode, DialogueTree } from '../../core/types';
import { findDialogueNode, dialogueTrees } from './dialogueContent';

interface DialogueState {
  // State
  isActive: boolean;
  currentNpcId: string | null;
  currentTree: DialogueTree | null;
  currentNode: DialogueNode | null;
  failedAttempts: number;
  showHint: boolean;
  lastSpokenText: string;
  matchResult: { matched: boolean; similarity: number } | null;
  
  // Actions
  initDialogue: (treeId: string, npcId: string) => void;
  setCurrentNode: (node: DialogueNode | null) => void;
  setMatchResult: (result: { matched: boolean; similarity: number } | null) => void;
  setLastSpokenText: (text: string) => void;
  incrementFailedAttempts: () => void;
  resetFailedAttempts: () => void;
  setShowHint: (show: boolean) => void;
  closeDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set) => ({
  // Initial state
  isActive: false,
  currentNpcId: null,
  currentTree: null,
  currentNode: null,
  failedAttempts: 0,
  showHint: false,
  lastSpokenText: '',
  matchResult: null,

  // Actions
  initDialogue: (treeId: string, npcId: string) => {
    console.log('initDialogue called:', treeId, npcId);
    const tree = dialogueTrees[treeId];
    if (!tree) {
      console.error(`Dialogue tree not found: ${treeId}`);
      return;
    }

    const startNode = findDialogueNode(tree, tree.startNodeId);
    if (!startNode) {
      console.error(`Start node not found: ${tree.startNodeId}`);
      return;
    }

    console.log('Setting dialogue state with node:', startNode.id);
    set({
      isActive: true,
      currentNpcId: npcId,
      currentTree: tree,
      currentNode: startNode,
      failedAttempts: 0,
      showHint: false,
      lastSpokenText: '',
      matchResult: null,
    });
  },

  setCurrentNode: (node) => set({ currentNode: node }),
  
  setMatchResult: (result) => set({ matchResult: result }),
  
  setLastSpokenText: (text) => set({ lastSpokenText: text }),
  
  incrementFailedAttempts: () => set((state) => {
    const newCount = state.failedAttempts + 1;
    return {
      failedAttempts: newCount,
      showHint: newCount >= 2,
    };
  }),
  
  resetFailedAttempts: () => set({ failedAttempts: 0, showHint: false }),
  
  setShowHint: (show) => set({ showHint: show }),

  closeDialogue: () => {
    console.log('closeDialogue called');
    set({
      isActive: false,
      currentNpcId: null,
      currentTree: null,
      currentNode: null,
      failedAttempts: 0,
      showHint: false,
      lastSpokenText: '',
      matchResult: null,
    });
  },
}));
