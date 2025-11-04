import * as Speech from 'expo-speech';

/**
 * Text-to-Speech service using Expo Speech API
 */

/**
 * Speaks the given text using device's TTS
 * @param {string} text - Text to speak
 * @param {Object} options - Speech options (language, pitch, rate)
 * @returns {Promise<void>}
 */
export async function speak(text, options = {}) {
  const defaultOptions = {
    language: 'it-IT', // Italian
    pitch: 1.0,
    rate: 0.9, // Slightly slower for better comprehension
    ...options,
  };

  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      ...defaultOptions,
      onDone: resolve,
      onError: reject,
    });
  });
}

/**
 * Stops any ongoing speech
 */
export function stop() {
  Speech.stop();
}

/**
 * Checks if speech is currently playing
 * @returns {Promise<boolean>}
 */
export async function isSpeaking() {
  return await Speech.isSpeakingAsync();
}

/**
 * Gets available voices for the device
 * @returns {Promise<Array>}
 */
export async function getAvailableVoices() {
  return await Speech.getAvailableVoicesAsync();
}
