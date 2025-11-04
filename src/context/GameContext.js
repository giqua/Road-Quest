import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

/**
 * Game State Provider
 * Manages the entire game state including character, story progress, and inventory
 */
export function GameProvider({ children }) {
  const [gameState, setGameState] = useState({
    character: {
      endurance: 20,
      maxEndurance: 20,
      combatSkill: 15,
      kaiDisciplines: [], // Array of 5 selected disciplines
    },
    story: {
      currentParagraphId: 1,
      history: [], // Stack of visited paragraph IDs
    },
    inventory: {
      items: [], // Max 8 items
      maxItems: 8,
    },
    combat: {
      active: false,
      enemy: null,
      turns: [],
    },
  });

  // Load saved game on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Auto-save game state when it changes
  useEffect(() => {
    saveGame();
  }, [gameState]);

  /**
   * Saves current game state to AsyncStorage
   */
  const saveGame = async () => {
    try {
      await AsyncStorage.setItem('roadquest_save', JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  /**
   * Loads game state from AsyncStorage
   */
  const loadGame = async () => {
    try {
      const saved = await AsyncStorage.getItem('roadquest_save');
      if (saved) {
        setGameState(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  /**
   * Starts a new game with character creation
   */
  const startNewGame = (character) => {
    setGameState({
      character: {
        endurance: character.endurance,
        maxEndurance: character.endurance,
        combatSkill: character.combatSkill,
        kaiDisciplines: character.kaiDisciplines,
      },
      story: {
        currentParagraphId: 1,
        history: [],
      },
      inventory: {
        items: [],
        maxItems: 8,
      },
      combat: {
        active: false,
        enemy: null,
        turns: [],
      },
    });
  };

  /**
   * Navigates to a new story paragraph
   */
  const goToParagraph = (paragraphId) => {
    setGameState((prev) => ({
      ...prev,
      story: {
        currentParagraphId: paragraphId,
        history: [...prev.story.history, prev.story.currentParagraphId],
      },
    }));
  };

  /**
   * Adds an item to inventory
   */
  const addItem = (item) => {
    setGameState((prev) => {
      if (prev.inventory.items.length >= prev.inventory.maxItems) {
        return prev; // Inventory full
      }
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          items: [...prev.inventory.items, item],
        },
      };
    });
  };

  /**
   * Removes an item from inventory
   */
  const removeItem = (item) => {
    setGameState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        items: prev.inventory.items.filter((i) => i !== item),
      },
    }));
  };

  /**
   * Modifies character endurance
   */
  const modifyEndurance = (amount) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        endurance: Math.max(0, Math.min(prev.character.maxEndurance, prev.character.endurance + amount)),
      },
    }));
  };

  const value = {
    gameState,
    startNewGame,
    goToParagraph,
    addItem,
    removeItem,
    modifyEndurance,
    saveGame,
    loadGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook to use game context
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
