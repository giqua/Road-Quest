# 🎮 Road Quest
## Adventure Gamebook Voice Experience

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Status](https://img.shields.io/badge/status-prototype-yellow.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)

**Road Quest** è un'esperienza di gioco di ruolo audio-first per viaggi in auto, dove i giocatori vivono avventure interattive tipo "librogame" utilizzando solo la voce. Basato sui classici libri Lone Wolf, il gioco combina la nostalgia dei librogame con la moderna tecnologia LLM.

---

## 🎯 Vision

Creare un'esperienza di gioco **hands-free** e **eyes-free** perfetta per:
- **Guidatori**: Intrattenimento sicuro senza distrazioni visive
- **Passeggeri**: Avventure coinvolgenti durante i viaggi
- **Famiglie**: Esperienze condivise durante i trasferimenti

### Perché Road Quest?

- ✅ **Sicurezza**: Zero distrazioni visive
- ✅ **Accessibilità**: Completamente mani libere
- ✅ **Sociale**: Esperienza condivisibile
- ✅ **Innovazione**: Nostalgia + AI moderna

---

## ✨ Funzionalità

### Nel Prototipo MVP

- 🎙️ **Interazione vocale bidirezionale** - Parla e ascolta
- 📖 **Avventura completa** - Basata su "Flight from the Dark" (Lone Wolf)
- ⚔️ **Sistema di gioco completo** - Combattimenti, inventario, abilità speciali
- 💾 **Salvataggio progressi** - Riprendi dove hai lasciato
- ⏱️ **Sessioni brevi** - Perfette per viaggi di 15-30 minuti
- 🧙 **Personalizzazione personaggio** - Discipline Kai e statistiche

### Roadmap Futura

- 🌐 **Multiplayer asincrono** - Turni alternati tra giocatori
- 🤖 **Contenuti dinamici** - Variazioni generate dall'AI
- 📚 **Espansione contenuti** - Tutti i 31 libri Lone Wolf
- 🎨 **Storie personalizzate** - Avventure completamente generate dall'AI

---

## 🏗️ Architettura

```
┌─────────────────────────────────────────────────────┐
│                  APP MOBILE                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   UI Layer   │  │  Game State  │  │   Audio   │ │
│  │  (minimal)   │  │   Manager    │  │  Manager  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
           │                    │                │
           ▼                    ▼                ▼
    ┌──────────┐         ┌──────────┐    ┌──────────┐
    │   STT    │         │   LLM    │    │   TTS    │
    │ (Speech  │         │ (Claude) │    │ (Voice)  │
    │   to     │         │  Sonnet  │    │ Synth)   │
    │  Text)   │         │   4.5)   │    │          │
    └──────────┘         └──────────┘    └──────────┘
           │                    │                │
           └────────────────────┴────────────────┘
                           │
                    ┌──────────────┐
                    │  Story Data  │
                    │   (JSON)     │
                    └──────────────┘
```

### Flusso di Gioco

1. **Utente parla** → STT converte in testo
2. **Interpretazione** → LLM Claude interpreta l'azione
3. **Game State** → Aggiorna inventario e statistiche
4. **Narrazione** → TTS legge il paragrafo
5. **Loop** → Ritorna al punto 1

---

## 🔧 Stack Tecnologico

### Frontend
- **Framework**: React Native + Expo
- **State Management**: Context API / Redux
- **Storage**: AsyncStorage / SQLite

### AI & Voice Services
- **LLM**: Claude API (Anthropic Sonnet 4.5)
- **Speech-to-Text**: API native dispositivo (iOS Speech / Android SpeechRecognizer)
- **Text-to-Speech**: Voci native / ElevenLabs (opzionale)

### Data
- **Content**: JSON statico (paragrafi Lone Wolf)
- **Game State**: Locale sul dispositivo

---

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+
- npm o yarn
- Expo CLI
- Account Anthropic (per Claude API)

### Installazione

```bash
# Clone repository
git clone https://github.com/giqua/Road-Quest.git
cd Road-Quest

# Installa dipendenze
npm install

# Configura variabili d'ambiente
cp .env.example .env
# Modifica .env con la tua API key di Anthropic

# Avvia il progetto
npm start
```

### Sviluppo

```bash
# Avvia su iOS
npm run ios

# Avvia su Android
npm run android

# Run tests
npm test

# Linting
npm run lint
```

---

## 📖 Come Si Gioca

1. **Avvia l'app** e premi "Inizia Avventura"
2. **Ascolta** la narrazione del paragrafo corrente
3. **Parla** per descrivere la tua azione (es. "Vado a nord")
4. **L'AI interpreta** la tua intenzione e avanza nella storia
5. **Combatti** nemici, raccogli oggetti, prendi decisioni
6. **Salva** automaticamente e riprendi quando vuoi

### Comandi Vocali Utili

- "Aiuto" - Mostra i comandi disponibili
- "Ripeti" - Riascolta l'ultimo paragrafo
- "Stato" - Visualizza statistiche personaggio
- "Inventario" - Elenca gli oggetti posseduti

---

## 🎮 Sistema di Gioco

### Personaggio
- **Endurance**: Punti vita del personaggio
- **Combat Skill**: Abilità in combattimento
- **Discipline Kai**: 5 abilità speciali (es. Caccia, Sesto Senso, Guarigione)

### Inventario
- Massimo **8 oggetti** trasportabili
- Armi, pozioni, chiavi e oggetti speciali
- Gestione tramite comandi vocali

### Combattimento
- Sistema a **tiri di dado** (0-9)
- **Combat Ratio** (tua skill - skill nemica)
- Calcolo danno in base alla tabella Lone Wolf
- Narrazione dinamica di ogni turno

---

## 📊 Roadmap di Sviluppo

### ✅ Fase 0: Preparazione (Settimana 1)
- Setup ambiente sviluppo
- Parsing contenuti "Flight from the Dark"
- Configurazione API

### 🔄 Fase 1: Core Loop (Settimane 2-3)
- Implementazione flusso base
- Navigazione tra paragrafi
- Audio bidirezionale

### ⏳ Fase 2: Game State (Settimana 4)
- Sistema personaggio e inventario
- Meccaniche di combattimento
- Salvataggio/caricamento

### ⏳ Fase 3: Polish (Settimana 5)
- UX migliorata
- Gestione errori
- Help vocale

### ⏳ Fase 4: Beta Testing (Settimana 6)
- Test con utenti reali
- Raccolta feedback
- Bug fixing

---

## 🤝 Contribuire

Accettiamo contributi in diverse aree:

- **Sviluppo Mobile**: React Native, Flutter
- **AI Engineering**: Prompt engineering, ottimizzazione LLM
- **Game Design**: Bilanciamento, narrativa
- **Testing**: QA, user testing
- **Documentazione**: Guide, tutorial

### Come Contribuire

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

Vedi [CONTRIBUTING.md](CONTRIBUTING.md) per dettagli.

---

## 📝 Documentazione

- [Piano Prototipo Completo](piano-prototipo-gdr-vocale.md)
- [Architettura Tecnica](docs/architecture.md) _(coming soon)_
- [Guida API](docs/api-guide.md) _(coming soon)_
- [Schema Database](docs/database-schema.md) _(coming soon)_

---

## 📄 Licenza

Questo progetto è concesso in licenza sotto i termini della licenza MIT - vedi [LICENSE](LICENSE) per i dettagli.

### Contenuti Lone Wolf

I contenuti della serie Lone Wolf sono utilizzati con permesso di [Project Aon](https://www.projectaon.org/), che distribuisce i libri con licenza autorizzata dagli eredi di Joe Dever.

---

## 🙏 Ringraziamenti

- **Joe Dever** - Creatore della serie Lone Wolf
- **Project Aon** - Per aver reso disponibili i libri gratuitamente
- **Anthropic** - Per l'API Claude
- **Community Open Source** - Per gli strumenti e le librerie utilizzate

---

## 📞 Contatti

- **Repository**: [github.com/giqua/Road-Quest](https://github.com/giqua/Road-Quest)
- **Issues**: [github.com/giqua/Road-Quest/issues](https://github.com/giqua/Road-Quest/issues)
- **Discussions**: [github.com/giqua/Road-Quest/discussions](https://github.com/giqua/Road-Quest/discussions)

---

## 🎯 Metriche di Successo MVP

Il prototipo sarà considerato validato se:

- ✅ Latenza end-to-end < 5 secondi (95% dei casi)
- ✅ Accuracy interpretazione LLM > 90%
- ✅ Almeno 5 persone completano 30+ minuti di gioco
- ✅ Net Promoter Score > 7/10
- ✅ Nessun problema di sicurezza per i guidatori

---

<p align="center">
  <strong>Buon viaggio su Road Quest!</strong> 🚗🎲⚔️
</p>
