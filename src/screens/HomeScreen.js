import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ onStartGame }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🎮 Road Quest</Text>
          <Text style={styles.subtitle}>Adventure Gamebook Voice Experience</Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Vivi un'avventura interattiva usando solo la tua voce.
          </Text>
          <Text style={styles.descriptionText}>
            Perfetto per viaggi in auto, completamente hands-free.
          </Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureItem}>🎙️ Interazione completamente vocale</Text>
          <Text style={styles.featureItem}>⚔️ Combattimenti epici</Text>
          <Text style={styles.featureItem}>📖 Storia basata su Lone Wolf</Text>
          <Text style={styles.featureItem}>💾 Salva e riprendi quando vuoi</Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Inizia Avventura</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0 - Prototipo MVP</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0b0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  description: {
    alignItems: 'center',
    marginVertical: 20,
  },
  descriptionText: {
    fontSize: 18,
    color: '#d0d0e0',
    textAlign: 'center',
    marginVertical: 6,
    lineHeight: 26,
  },
  features: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
  },
  featureItem: {
    fontSize: 16,
    color: '#e0e0f0',
    marginVertical: 8,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  version: {
    fontSize: 12,
    color: '#606070',
    textAlign: 'center',
    marginTop: 12,
  },
});
