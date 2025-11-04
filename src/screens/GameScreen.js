import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from '../context/GameContext';
import { speak, stop as stopSpeech } from '../services/ttsService';
import { interpretAction } from '../services/claudeService';
import storyData from '../data/storyExample.json';

export default function GameScreen({ onBackToHome }) {
  const { gameState, goToParagraph, startNewGame } = useGame();
  const [currentParagraph, setCurrentParagraph] = useState(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Initialize game on mount
  useEffect(() => {
    // For MVP, start with basic character stats
    startNewGame({
      endurance: 20,
      combatSkill: 15,
      kaiDisciplines: ['Caccia', 'Sesto Senso', 'Armi', 'Guarigione', 'Mimetismo'],
    });
  }, []);

  // Load current paragraph when game state changes
  useEffect(() => {
    const paragraph = storyData.paragraphs.find(
      (p) => p.id === gameState.story.currentParagraphId
    );
    if (paragraph) {
      setCurrentParagraph(paragraph);
      narrateParagraph(paragraph);
    }
  }, [gameState.story.currentParagraphId]);

  /**
   * Narrate the current paragraph using TTS
   */
  const narrateParagraph = async (paragraph) => {
    try {
      setIsNarrating(true);
      await speak(paragraph.text);
    } catch (error) {
      console.error('Error narrating:', error);
    } finally {
      setIsNarrating(false);
    }
  };

  /**
   * Handle direct choice selection (for MVP testing)
   */
  const handleChoiceSelection = async (choiceIndex) => {
    if (!currentParagraph) return;

    const choice = currentParagraph.choices[choiceIndex];
    setUserInput(choice.action);

    try {
      setIsProcessing(true);

      // Navigate to the chosen paragraph
      const targetParagraphId = choice.targetParagraphId;

      // Check if target paragraph exists in our data
      const targetExists = storyData.paragraphs.find((p) => p.id === targetParagraphId);
      if (!targetExists) {
        alert(
          `Fine del prototipo! Il paragrafo ${targetParagraphId} non è disponibile nel dataset limitato.`
        );
        return;
      }

      // Small delay to show the choice
      await new Promise((resolve) => setTimeout(resolve, 500));

      goToParagraph(targetParagraphId);
    } catch (error) {
      console.error('Error processing choice:', error);
      alert('Errore durante la navigazione.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUserInput(''), 2000);
    }
  };

  /**
   * Handle voice input (simulated for MVP - real STT to be implemented)
   */
  const handleVoiceInput = async () => {
    if (!currentParagraph) return;

    // For MVP, we'll use Claude to interpret a simulated voice command
    // In production, this would use actual Speech-to-Text
    setIsListening(true);

    // Simulate voice input by using the first choice as example
    const simulatedInput = currentParagraph.choices[0]?.action || 'Prosegui';

    setUserInput(`"${simulatedInput}" (simulato)`);

    try {
      setIsProcessing(true);

      // Interpret the user's action using Claude
      const choiceIndex = await interpretAction(simulatedInput, currentParagraph);

      if (choiceIndex === null) {
        alert('Non ho capito la tua scelta. Per favore riprova o usa i pulsanti diretti.');
        return;
      }

      // Navigate to the chosen paragraph
      const targetParagraphId = currentParagraph.choices[choiceIndex - 1].targetParagraphId;

      // Check if target paragraph exists in our data
      const targetExists = storyData.paragraphs.find((p) => p.id === targetParagraphId);
      if (!targetExists) {
        alert(
          `Fine del prototipo! Il paragrafo ${targetParagraphId} non è disponibile nel dataset limitato.`
        );
        return;
      }

      goToParagraph(targetParagraphId);
    } catch (error) {
      console.error('Error processing voice input:', error);
      alert('Errore durante il processamento. Verifica la configurazione API nel file .env');
    } finally {
      setIsListening(false);
      setIsProcessing(false);
      setTimeout(() => setUserInput(''), 2000);
    }
  };

  /**
   * Repeat the current paragraph narration
   */
  const repeatNarration = () => {
    if (currentParagraph) {
      narrateParagraph(currentParagraph);
    }
  };

  if (!currentParagraph) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f3460" />
          <Text style={styles.loadingText}>Caricamento avventura...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Road Quest</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>❤️ {gameState.character.endurance}</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Paragraph Text */}
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraphType}>
            {currentParagraph.type === 'combat' && '⚔️ Combattimento'}
            {currentParagraph.type === 'item' && '🎒 Oggetto'}
            {currentParagraph.type === 'narrative' && '📖 Narrativa'}
          </Text>
          <Text style={styles.paragraphText}>{currentParagraph.text}</Text>
        </View>

        {/* Available Choices */}
        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>Scelte disponibili:</Text>
          {currentParagraph.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.choiceItem, isProcessing && styles.choiceItemDisabled]}
              onPress={() => handleChoiceSelection(index)}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <Text style={styles.choiceNumber}>{index + 1}.</Text>
              <Text style={styles.choiceText}>{choice.action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User Input Display */}
        {userInput && (
          <View style={styles.userInputContainer}>
            <Text style={styles.userInputLabel}>Hai detto:</Text>
            <Text style={styles.userInputText}>"{userInput}"</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.secondaryButton, isNarrating && styles.buttonDisabled]}
          onPress={repeatNarration}
          disabled={isNarrating}
        >
          <Text style={styles.secondaryButtonText}>🔄 Ripeti</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (isProcessing || isListening) && styles.buttonDisabled,
          ]}
          onPress={handleVoiceInput}
          disabled={isProcessing || isListening}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.primaryButtonText}> Elaborazione...</Text>
            </>
          ) : (
            <Text style={styles.primaryButtonText}>
              {isListening ? '🎤 Ascolto...' : '🎙️ Parla'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#a0a0b0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#a0a0b0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  paragraphContainer: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  paragraphType: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 12,
    fontWeight: '600',
  },
  paragraphText: {
    fontSize: 18,
    color: '#e0e0f0',
    lineHeight: 28,
  },
  choicesContainer: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  choicesTitle: {
    fontSize: 16,
    color: '#a0a0b0',
    marginBottom: 12,
    fontWeight: '600',
  },
  choiceItem: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  choiceItemDisabled: {
    opacity: 0.5,
  },
  choiceNumber: {
    fontSize: 16,
    color: '#0f3460',
    fontWeight: 'bold',
    marginRight: 8,
  },
  choiceText: {
    fontSize: 16,
    color: '#d0d0e0',
    flex: 1,
  },
  userInputContainer: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  userInputLabel: {
    fontSize: 14,
    color: '#a0a0b0',
    marginBottom: 6,
  },
  userInputText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0f3460',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 0.4,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a0a0b0',
  },
});
