import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';

// Initialize Anthropic client
// Note: API key is loaded from .env file via react-native-dotenv
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY || 'your-api-key-here',
});

/**
 * Interprets user's voice input and maps it to available story choices
 * @param {string} userInput - The text from speech-to-text conversion
 * @param {Object} currentParagraph - Current story paragraph with available choices
 * @returns {Promise<number>} - The chosen option index (1-based)
 */
export async function interpretAction(userInput, currentParagraph) {
  try {
    const choices = currentParagraph.choices
      .map((choice, index) => `${index + 1}. ${choice.action}`)
      .join('\n');

    const prompt = `You are helping a player make a choice in a gamebook adventure.

Current situation: ${currentParagraph.text}

Available choices:
${choices}

Player said: "${userInput}"

Which choice best matches the player's intention?
Respond ONLY with the number of the choice (1, 2, 3, etc.).
If no choice clearly matches, respond with "UNCLEAR".`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0].text.trim();

    if (response === 'UNCLEAR') {
      return null;
    }

    const choiceNumber = parseInt(response, 10);
    if (isNaN(choiceNumber) || choiceNumber < 1 || choiceNumber > currentParagraph.choices.length) {
      return null;
    }

    return choiceNumber;
  } catch (error) {
    console.error('Error interpreting action:', error);
    throw error;
  }
}

/**
 * Generates dynamic narration for combat events
 * @param {Object} combatState - Current combat state
 * @returns {Promise<string>} - Narration text
 */
export async function generateCombatNarration(combatState) {
  // TODO: Implement combat narration generation
  // This will be used to make combat more dynamic and engaging
  return 'Combat narration placeholder';
}
