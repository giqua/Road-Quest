import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' or 'game'

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <GameProvider>
      <View style={styles.container}>
        {currentScreen === 'home' ? (
          <HomeScreen onStartGame={handleStartGame} />
        ) : (
          <GameScreen onBackToHome={handleBackToHome} />
        )}
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
