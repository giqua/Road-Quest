# 🚀 Opzione 2: Prototipo Rapido MVP - Quick Win

**Obiettivo:** Validare rapidamente l'esperienza utente core (UX) implementando il game loop completo con contenuti limitati (3 paragrafi test).

**Tempo Stimato:** 4-6 ore
**Difficoltà:** Bassa-Media
**Prerequisiti:** Account Anthropic Claude, dipendenze già installate

---

## 🎯 Filosofia Opzione 2

**"Build to Learn, Not to Complete"**

Invece di creare tutto il content database (Opzione 1), costruiamo rapidamente un prototipo funzionante che permette di:
- ✅ Testare l'intero game loop
- ✅ Validare UX audio
- ✅ Identificare problemi di latenza
- ✅ Ottenere feedback rapido

Una volta validata l'esperienza, si può investire nel content database completo.

---

## 📋 Task Overview

### Task 1: Setup API Rapido
### Task 2: UI Components Base
### Task 3: Integrazione Game Loop
### Task 4: Testing End-to-End

---

## 🔑 TASK 1: Setup API Rapido (30 min)

### Obiettivo
Configurare solo l'essenziale per far funzionare l'app.

### Step-by-Step

#### 1.1 Configurare .env

```bash
# Copia il file esempio
cp .env.example .env
```

**Contenuto minimo .env:**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
NODE_ENV=development
```

#### 1.2 Test Rapido Claude API

**Creare:** `scripts/quick-test-api.js`

```javascript
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

async function quickTest() {
  console.log('⚡ Quick API Test...');

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say OK' }]
    });

    console.log('✅ API Ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ API Error:', error.message);
    console.log('\n💡 Fix: Check your ANTHROPIC_API_KEY in .env file');
    process.exit(1);
  }
}

quickTest();
```

```bash
npm install dotenv
node scripts/quick-test-api.js
```

Se vedi "✅ API Ready!", procedi! Altrimenti controlla la API key.

---

## 🎨 TASK 2: UI Components Base (2 hours)

### Obiettivo
Creare le schermate minimali per giocare.

### 2.1 Creare HomeScreen

**File:** `src/screens/HomeScreen.js`

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ onStartGame }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛣️ Road Quest</Text>
      <Text style={styles.subtitle}>Adventure Awaits...</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={onStartGame}
      >
        <Text style={styles.buttonText}>🎮 Start Adventure</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Put on headphones and enjoy the journey!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#aaa',
    marginBottom: 60,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#16213e',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0f3460',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
  },
  hint: {
    marginTop: 40,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
```

### 2.2 Creare GameScreen

**File:** `src/screens/GameScreen.js`

```javascript
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { GameContext } from '../context/GameContext';
import * as Speech from 'expo-speech';

export default function GameScreen() {
  const {
    currentParagraph,
    playerState,
    processAction,
    isLoading
  } = useContext(GameContext);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Auto-read paragraph when loaded
  useEffect(() => {
    if (currentParagraph) {
      readParagraph();
    }
  }, [currentParagraph?.id]);

  const readParagraph = async () => {
    if (!currentParagraph) return;

    // Read main text
    await Speech.speak(currentParagraph.text, {
      language: 'it-IT',
      pitch: 1.0,
      rate: 0.85,
    });

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Read choices
    const choicesText = "Le tue opzioni sono: " +
      currentParagraph.choices.map((c, i) =>
        `${i + 1}. ${c.action}`
      ).join('. ');

    await Speech.speak(choicesText, {
      language: 'it-IT',
      pitch: 1.1,
      rate: 0.9,
    });
  };

  const handleVoiceInput = () => {
    // Per il prototipo, simuliamo con input manuale
    // In produzione, qui integreremmo STT
    setIsListening(true);

    // Simulazione: dopo 2 secondi, "ascoltiamo" una scelta random
    setTimeout(() => {
      const randomChoice = Math.floor(Math.random() * currentParagraph.choices.length);
      const simulatedInput = currentParagraph.choices[randomChoice].action;
      setTranscript(simulatedInput);
      setIsListening(false);

      // Processa l'azione
      processAction(simulatedInput);
    }, 2000);
  };

  if (!currentParagraph) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Loading adventure...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.header}>
        <Text style={styles.statsText}>
          ❤️ {playerState.endurance} | ⚔️ {playerState.combatSkill}
        </Text>
      </View>

      {/* Story text */}
      <ScrollView style={styles.storyContainer}>
        <Text style={styles.paragraphNumber}>§ {currentParagraph.id}</Text>
        <Text style={styles.storyText}>{currentParagraph.text}</Text>

        {/* Choices (visual reference) */}
        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>Choices:</Text>
          {currentParagraph.choices.map((choice, index) => (
            <Text key={index} style={styles.choiceText}>
              {index + 1}. {choice.action}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Voice input button */}
      <View style={styles.controlsContainer}>
        {transcript ? (
          <Text style={styles.transcript}>You said: "{transcript}"</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.voiceButtonActive,
            isLoading && styles.voiceButtonDisabled
          ]}
          onPress={handleVoiceInput}
          disabled={isLoading || isListening}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.voiceButtonText}>
              {isListening ? '🎤 Listening...' : '🎤 Speak'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.repeatButton}
          onPress={readParagraph}
        >
          <Text style={styles.repeatButtonText}>🔁 Repeat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
  },
  statsText: {
    fontSize: 18,
    color: '#eee',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  storyContainer: {
    flex: 1,
    padding: 20,
  },
  paragraphNumber: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 18,
    color: '#eee',
    lineHeight: 28,
    marginBottom: 20,
  },
  choicesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#16213e',
    borderRadius: 10,
  },
  choicesTitle: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#16213e',
    borderTopWidth: 2,
    borderTopColor: '#0f3460',
  },
  transcript: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  voiceButton: {
    backgroundColor: '#e94560',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#ff6b81',
  },
  voiceButtonDisabled: {
    backgroundColor: '#555',
  },
  voiceButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  repeatButton: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  repeatButtonText: {
    fontSize: 16,
    color: '#aaa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#aaa',
  },
});
```

### 2.3 Creare Directory Screens

```bash
mkdir -p src/screens
# Copia i file sopra nelle rispettive posizioni
```

---

## 🔗 TASK 3: Integrazione Game Loop (1.5 hours)

### Obiettivo
Collegare tutto insieme nell'App.js principale.

### 3.1 Aggiornare GameContext

Il file `src/context/GameContext.js` esiste già, ma verifichiamo che abbia tutte le funzioni necessarie.

**Verifica che includa:**
- `currentParagraph` - paragrafo corrente
- `playerState` - stato giocatore (endurance, combatSkill, inventory)
- `loadParagraph(id)` - carica un paragrafo
- `processAction(userInput)` - interpreta azione e naviga
- `isLoading` - stato loading

### 3.2 Aggiornare App.js

**File:** `App.js`

```javascript
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <GameProvider>
      <StatusBar style="light" />
      {gameStarted ? (
        <GameScreen />
      ) : (
        <HomeScreen onStartGame={() => setGameStarted(true)} />
      )}
    </GameProvider>
  );
}
```

### 3.3 Verificare storyExample.json

Il file `src/data/storyExample.json` dovrebbe avere almeno 3 paragrafi collegati:

```json
{
  "title": "Road Quest - Test Story",
  "book_number": 0,
  "total_paragraphs": 3,
  "paragraphs": [
    {
      "id": 1,
      "text": "Sei Lone Wolf, ultimo dei Kai Lords. Il monastero è sotto attacco! Devi fuggire immediatamente.",
      "type": "narrative",
      "choices": [
        {
          "action": "Fuggi attraverso la foresta",
          "destination": 2,
          "condition": null
        },
        {
          "action": "Prendi l'equipaggiamento dalla armeria",
          "destination": 3,
          "condition": null
        }
      ],
      "combat": null,
      "modifiers": {
        "endurance": 0,
        "inventory_add": [],
        "inventory_remove": []
      }
    },
    {
      "id": 2,
      "text": "Corri nella foresta oscura. Gli alberi ti nascondono dai nemici, ma il sentiero è pericoloso.",
      "type": "narrative",
      "choices": [
        {
          "action": "Continua a correre",
          "destination": 1,
          "condition": null
        }
      ],
      "combat": null,
      "modifiers": {
        "endurance": -2,
        "inventory_add": [],
        "inventory_remove": []
      }
    },
    {
      "id": 3,
      "text": "Entri nell'armeria e prendi una spada. È una buona scelta! Ora puoi difenderti meglio.",
      "type": "narrative",
      "choices": [
        {
          "action": "Esci e fuggi nella foresta",
          "destination": 2,
          "condition": null
        }
      ],
      "combat": null,
      "modifiers": {
        "endurance": 0,
        "inventory_add": ["Spada"],
        "inventory_remove": []
      }
    }
  ]
}
```

---

## 🧪 TASK 4: Testing End-to-End (1 hour)

### Obiettivo
Validare che tutto funzioni insieme.

### 4.1 Avviare l'App

```bash
# Terminal 1: Avvia Expo
npm start

# Terminal 2 (opzionale): Avvia su iOS
npm run ios

# Terminal 3 (opzionale): Avvia su Android
npm run android
```

### 4.2 Test Checklist

**Scenario di test completo:**

1. **Avvio App**
   - [ ] HomeScreen appare con titolo "Road Quest"
   - [ ] Pulsante "Start Adventure" è visibile

2. **Inizio Gioco**
   - [ ] Tap su "Start Adventure"
   - [ ] GameScreen carica
   - [ ] Stats bar mostra Endurance e Combat Skill
   - [ ] TTS legge il paragrafo 1 automaticamente

3. **Narrazione Audio**
   - [ ] Testo del paragrafo è leggibile
   - [ ] TTS legge tutte le scelte disponibili
   - [ ] Qualità audio è accettabile
   - [ ] Durata totale < 30 secondi

4. **Input Vocale (Simulato)**
   - [ ] Tap su pulsante "🎤 Speak"
   - [ ] Pulsante diventa "🎤 Listening..."
   - [ ] Dopo 2 secondi, mostra "You said: ..."
   - [ ] Loading indicator appare

5. **Interpretazione & Navigazione**
   - [ ] Claude API processa l'azione
   - [ ] App naviga al paragrafo successivo
   - [ ] Nuovo paragrafo viene letto da TTS
   - [ ] Stats si aggiornano (se modificatori presenti)

6. **Pulsante Repeat**
   - [ ] Tap su "🔁 Repeat"
   - [ ] TTS rilegge il paragrafo corrente

7. **Loop Continuo**
   - [ ] Puoi navigare tra i 3 paragrafi
   - [ ] Ogni transizione funziona smooth
   - [ ] Nessun crash o blocco

### 4.3 Metriche da Raccogliere

Durante i test, annota:

| Metrica | Target | Risultato |
|---------|--------|-----------|
| Latenza totale (input → inizio narrazione) | < 5s | ___s |
| Qualità TTS (1-10) | > 6 | ___ |
| Accuracy interpretazione (% scelta corretta) | > 80% | ___% |
| Crash durante 10 turni | 0 | ___ |
| Esperienza generale (1-10) | > 7 | ___ |

### 4.4 Bug Comuni e Fix

**Problema: TTS non parla**
```javascript
// Fix: Controlla permessi audio nel simulatore
// iOS: Settings > Privacy > Speech Recognition
// Android: Settings > Apps > Permissions > Microphone
```

**Problema: Claude API timeout**
```javascript
// Fix: Aumenta timeout nel claudeService.js
timeout: 10000, // 10 secondi
```

**Problema: App crash su Android**
```javascript
// Fix: Aggiungi permessi in android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

---

## 🎯 Miglioramenti Post-MVP (opzionali)

Se il test è positivo e vuoi continuare:

### Quick Wins (< 1 hour ciascuno)

1. **Aggiungere più paragrafi test**
   - Espandi `storyExample.json` a 10-15 paragrafi
   - Crea mini-avventura completa (inizio → fine)

2. **Visual feedback migliorato**
   - Animazioni su cambio paragrafo
   - Icone per inventario
   - Progress bar per TTS

3. **Comandi vocali speciali**
   - "Aiuto" → mostra comandi disponibili
   - "Stato" → legge stats correnti
   - "Salva" → salva progresso

4. **Persistenza base**
   - Salva paragrafo corrente su AsyncStorage
   - "Continua partita" su HomeScreen

### Medium Effort (2-4 hours)

5. **STT Reale (invece di simulato)**
   - Integra `expo-speech-recognition` o native API
   - Test in condizioni rumore

6. **Combat System Base**
   - Implementa combattimento con 1 nemico
   - Tabella danni semplificata

7. **Inventory UI**
   - Mostra oggetti posseduti
   - Uso oggetti con tap

---

## ✅ Definition of Done - Opzione 2

Il prototipo MVP è completo quando:

- [x] ✅ App avvia senza errori
- [x] ✅ HomeScreen → GameScreen funziona
- [x] ✅ TTS legge paragrafi automaticamente
- [x] ✅ Pulsante "Speak" funziona (anche se simulato)
- [x] ✅ Claude API interpreta azione
- [x] ✅ Navigazione tra paragrafi fluida
- [x] ✅ Loop completo testato per 5+ turni
- [x] ✅ Latency totale < 8s (tolleranza per prototipo)

**Tempo totale:** 4-6 ore di lavoro concentrato

---

## 🚀 Prossimi Passi (dopo Opzione 2)

### Scenario A: MVP Validato Positivamente
Se l'esperienza è fluida e piacevole:
→ **Investi in Opzione 1** (content database completo)
→ Poi procedi con Fase 1 completa (UI professionale)

### Scenario B: Problemi di Latenza
Se latency > 8s è inaccettabile:
→ **Ottimizza prompt** (meno token, modello più veloce)
→ **Considera caching** risposte comuni
→ **Valuta TTS premium** (più veloce)

### Scenario C: UX Audio Non Convincente
Se l'esperienza vocale non funziona:
→ **Pivot a UI ibrida** (testo + audio opzionale)
→ **Rivedi prompt** narrazione
→ **Testa con utenti reali**

---

## 📝 Feedback & Iteration

Dopo il test, compila questo template:

```
## MVP Test Report - Opzione 2

**Data:** [data]
**Tester:** [nome]
**Durata test:** [minuti]

### Esperienza Generale (1-10): ___

### Pro:
- ...
- ...

### Contro:
- ...
- ...

### Blockers Critici:
- ...

### Nice-to-Have:
- ...

### Decisione:
[ ] Procedi con Opzione 1 (content database)
[ ] Itera su Opzione 2 (fix problemi)
[ ] Pivot approccio
```

---

**Autore:** Road Quest Team
**Ultimo aggiornamento:** 4 Novembre 2025
**Versione:** 1.0
