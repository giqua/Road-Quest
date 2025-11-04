/**
 * Speech-to-Text service
 *
 * This will use device native STT APIs:
 * - iOS: Speech Recognition API
 * - Android: SpeechRecognizer
 *
 * For now, this is a placeholder.
 * We'll implement this using expo-speech or react-native-voice
 */

/**
 * Starts listening to user's voice
 * @returns {Promise<string>} - Transcribed text
 */
export async function startListening() {
  // TODO: Implement STT using device native API
  // or expo-speech / react-native-voice library
  console.log('STT: Starting to listen...');
  return new Promise((resolve) => {
    // Placeholder - will be implemented with actual STT
    setTimeout(() => {
      resolve('voglio andare a nord');
    }, 2000);
  });
}

/**
 * Stops listening
 */
export function stopListening() {
  // TODO: Implement
  console.log('STT: Stopped listening');
}

/**
 * Checks if microphone permission is granted
 * @returns {Promise<boolean>}
 */
export async function checkPermissions() {
  // TODO: Implement microphone permission check
  return true;
}

/**
 * Requests microphone permission
 * @returns {Promise<boolean>}
 */
export async function requestPermissions() {
  // TODO: Implement permission request
  return true;
}
