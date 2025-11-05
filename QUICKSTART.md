# 🚀 Road Quest - Guida Rapida al Prototipo

## ✅ Setup Iniziale (5 minuti)

### 1. Configura l'API Key di Anthropic

1. Apri il file `.env` nella root del progetto
2. Sostituisci `your_anthropic_api_key_here` con la tua API key di Anthropic
3. Per ottenere una API key:
   - Vai su https://console.anthropic.com/
   - Crea un account o fai login
   - Vai su "API Keys" e crea una nuova key
   - Copia la key nel file `.env`

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx  # Inserisci qui la tua key
```

**⚠️ IMPORTANTE:**
- Il file `.env` è già in `.gitignore` e non sarà mai committato
- Non condividere mai la tua API key
- Le prime chiamate API potrebbero avere un costo (controlla il tuo piano Anthropic)

### 2. Verifica le Dipendenze

```bash
# Assicurati che tutte le dipendenze siano installate
npm install
```

### 3. Avvia il Prototipo

```bash
# Avvia Expo
npm start
```

Questo aprirà Expo Dev Tools nel browser. Puoi quindi:
- Premere `i` per iOS Simulator (richiede macOS + Xcode)
- Premere `a` per Android Emulator (richiede Android Studio)
- Scansionare il QR code con l'app Expo Go sul tuo telefono

---

## 🎮 Come Testare il Prototipo

### Flusso di Test Completo

1. **Home Screen**
   - ✅ Verifica che appaia la schermata "Road Quest"
   - ✅ Clicca su "Inizia Avventura"

2. **Game Screen - Paragrafo 1**
   - ✅ Ascolta la narrazione vocale (TTS)
   - ✅ Leggi le scelte disponibili
   - ✅ Clicca su una delle scelte per proseguire

3. **Navigazione tra Paragrafi**
   - ✅ Verifica che il nuovo paragrafo si carichi
   - ✅ Verifica che la narrazione continui
   - ✅ Testa tutte le scelte disponibili

4. **Test Pulsante "Ripeti"**
   - ✅ Clicca su "🔄 Ripeti" per riascoltare il paragrafo

5. **Test Input Vocale Simulato** (opzionale)
   - ✅ Clicca su "🎙️ Parla"
   - ✅ Questo simulerà un input vocale e userà Claude API per interpretarlo

### Cosa Aspettarsi

**Paragrafi Disponibili nel Prototipo:**
- Paragrafo 1: Inizio al Monastero Kai
- Paragrafo 87: La taverna sulla strada
- Paragrafo 142: Combattimento con Giakan
- Paragrafo 200: Spada abbandonata

**⚠️ Limitazione:**
Se arrivi a un paragrafo non presente nel dataset limitato, vedrai un messaggio:
"Fine del prototipo! Il paragrafo XXX non è disponibile nel dataset limitato."

---

## 🔧 Troubleshooting

### Errore: "API key non configurata"
- Verifica di aver inserito la API key nel file `.env`
- Riavvia Expo con `npm start`

### Errore: "Error interpreting action"
- Controlla che la API key sia valida
- Verifica la connessione internet
- Controlla il saldo del tuo account Anthropic

### La narrazione TTS non funziona
- Verifica che il volume del dispositivo non sia a zero
- Verifica i permessi audio del dispositivo
- Su iOS/Android potrebbero essere richiesti permessi specifici

### L'app non si avvia
```bash
# Prova a pulire la cache e reinstallare
rm -rf node_modules
npm install
npm start -- --clear
```

---

## 📊 Metriche da Testare

Durante il testing, presta attenzione a:

1. **Latenza TTS**: Quanto ci mette la narrazione a partire?
2. **Latenza Claude API**: Quanto ci mette a interpretare la scelta?
3. **Qualità TTS**: La voce è comprensibile?
4. **UX Generale**: Il flusso è fluido e intuitivo?

---

## 🎯 Prossimi Passi Dopo il Testing

Dopo aver testato il prototipo:

1. **Se funziona bene:**
   - Procedi con la Fase 2 (Game State completo)
   - Implementa il database completo "Flight from the Dark"
   - Aggiungi Speech-to-Text reale

2. **Se ci sono problemi:**
   - Documenta gli errori
   - Condividi feedback
   - Itera sul prototipo

---

## 📱 Opzioni di Rilascio

### Opzione 1: Testing Interno (Expo Go)
**Vantaggi:**
- Veloce e immediato
- Non richiede build
- Ideale per sviluppo

**Come:**
1. Condividi il link Expo con i tester
2. I tester installano Expo Go
3. Scansionano il QR code

### Opzione 2: Build Standalone (EAS Build)
**Vantaggi:**
- App nativa completa
- Funziona senza Expo Go
- Più performante

**Come:**
```bash
# Installa EAS CLI
npm install -g eas-cli

# Login con account Expo
eas login

# Build per Android/iOS
eas build --platform android  # o ios
```

### Opzione 3: TestFlight (iOS) / Internal Testing (Android)
**Vantaggi:**
- Testing ufficiale Apple/Google
- Distribuzione a beta tester
- Feedback integrato

**Come:**
- iOS: Usa EAS Build + TestFlight
- Android: Usa EAS Build + Google Play Internal Testing

---

## 🙋 Domande Frequenti

**Q: Quanto costa usare Claude API?**
A: Dipende dal piano. Controlla su https://www.anthropic.com/pricing

**Q: Posso testare senza API key?**
A: No, l'interpretazione delle scelte richiede Claude API. Puoi però cliccare direttamente sulle scelte senza usare il pulsante "Parla".

**Q: Quando sarà disponibile il libro completo?**
A: Dopo aver validato il prototipo, procederemo con il parsing completo di "Flight from the Dark" (~350 paragrafi).

---

**Buon testing! 🎮🚗⚔️**
