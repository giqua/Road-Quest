# Piano Prototipo: GDR Vocale per Auto
## "Road Quest" - Adventure Gamebook Voice Experience

**Versione:** 1.0  
**Data:** Novembre 2025  
**Tipo:** Prototipo MVP (Minimum Viable Product)

---

## 🎯 Vision del Progetto

Creare un'esperienza di gioco di ruolo audio-first per viaggi in auto, dove i giocatori vivono avventure interattive tipo "librogame" utilizzando solo la voce. Il prototipo utilizzerà una storia predefinita (stile Lone Wolf) per validare il concetto prima di passare a contenuti generati dinamicamente.

### Perché questo approccio?

- **Sicurezza**: Nessuna distrazione visiva per il conducente
- **Accessibilità**: Mani libere, perfetto per passeggeri
- **Sociale**: Esperienza condivisibile durante i viaggi
- **Innovazione**: Unisce nostalgia dei librogame con tecnologia LLM moderna

---

## 📋 Scope del Prototipo

### Cosa INCLUDE il Prototipo

✅ **Una avventura completa** basata su struttura Lone Wolf (libro "Flight from the Dark")  
✅ **Interazione vocale bidirezionale** (parlare e ascoltare)  
✅ **Sistema di gioco base** (paragrafi numerati, inventario, combattimenti)  
✅ **Single player** (un giocatore alla volta)  
✅ **Sessioni di 15-30 minuti** (adatte a viaggi brevi/medi)  
✅ **Salvataggio progressi** (riprendi dove hai lasciato)

### Cosa NON INCLUDE il Prototipo

❌ Multiplayer sincronizzato (più giocatori contemporaneamente)  
❌ Storie generate dinamicamente dall'AI  
❌ Funzionalità offline complete  
❌ Personalizzazione grafica/temi  
❌ Sistema di achievement/statistiche avanzate  
❌ Integrazione con altri sistemi (Spotify, GPS, ecc.)

---

## 🏗️ Architettura Generale

### Componenti Principali

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
    │   to     │         │          │    │          │
    │  Text)   │         │          │    │          │
    └──────────┘         └──────────┘    └──────────┘
           │                    │                │
           └────────────────────┴────────────────┘
                           │
                    ┌──────────────┐
                    │  Story Data  │
                    │   (JSON DB)  │
                    └──────────────┘
```

### Flusso Dati Principale

1. **Utente parla** → STT converte in testo
2. **Testo** → LLM interpreta l'azione e determina il prossimo paragrafo
3. **Game State** → Aggiorna inventario, statistiche, posizione
4. **Paragrafo** → TTS legge la narrazione
5. **Opzioni** → TTS elenca le scelte disponibili
6. **Loop** → Ritorna al punto 1

---

## 📚 Content Strategy: Approccio Lone Wolf

### Perché Lone Wolf?

- **Struttura testata**: 40+ anni di design comprovato
- **Disponibilità**: Libri gratuiti su Project Aon (autorizzati dall'autore)
- **Qualità narrativa**: Vincitore di multipli premi
- **Sistema di gioco**: Meccaniche semplici ma profonde
- **Coerenza**: Storia lineare con ramificazioni controllate

### Struttura di un Libro Lone Wolf

- **~350 paragrafi numerati** per libro
- **Sistema di combattimento** con tiri di dado
- **Inventario limitato** (max 8 oggetti)
- **Discipline Kai** (abilità speciali del personaggio)
- **Scelte narrative** (2-4 opzioni per paragrafo)

### Adattamento per il Prototipo

Il prototipo utilizzerà **"Flight from the Dark"** (primo libro) perché:
- È l'introduzione alla saga
- Durata ~2-3 ore di gioco
- Non richiede conoscenze pregresse
- Bilanciamento già ottimizzato

---

## 🔧 Stack Tecnologico

### Frontend (App Mobile)

**Piattaforma**: React Native con Expo
- Cross-platform (iOS/Android)
- Sviluppo rapido
- Buon supporto per audio e sensori

### Backend Services

**Speech-to-Text (STT)**
- **Fase 1**: API native dispositivo (iOS Speech / Android SpeechRecognizer)
- **Fase 2**: Whisper API o Google Cloud Speech (se necessario migliorare accuracy)

**Large Language Model**
- **Primary**: Claude API (Anthropic) - modello Sonnet 4.5
- Ruolo: Interpretare azioni vocali e mapparle alle scelte disponibili

**Text-to-Speech (TTS)**
- **Fase 1**: Voci native dispositivo (testing rapido)
- **Fase 2**: ElevenLabs o Google Cloud TTS (qualità superiore)

### Data Storage

**Locale (dispositivo)**
- AsyncStorage o SQLite
- Salva: progressi, personaggio, inventory, paragrafo corrente

**Content Database**
- JSON statico con tutti i paragrafi del libro
- Incluso nell'app (no download runtime)

---

## 📅 Piano di Sviluppo

### FASE 0: Preparazione (1 settimana)

**Obiettivi**
- Setup ambiente di sviluppo
- Acquisizione e parsing contenuti
- Prototipazione prompt LLM

**Deliverable**
- [ ] Repository GitHub configurato
- [ ] Ambiente React Native funzionante
- [ ] Database JSON con "Flight from the Dark" parsato
- [ ] Account API (Anthropic, TTS, STT) configurati
- [ ] Prompt template ottimizzato per interpretazione azioni

**Attività Chiave**
1. Download libro da Project Aon (HTML)
2. Script di parsing: HTML → JSON strutturato
3. Test manuali prompt con Claude
4. Setup progetto React Native con Expo

---

### FASE 1: Core Loop (2 settimane)

**Obiettivi**
- Implementare il flusso base del gioco
- Navigazione tra paragrafi
- Audio bidirezionale funzionante

**Deliverable**
- [ ] App che riproduce un paragrafo via TTS
- [ ] Bottone "Parla" che cattura input vocale
- [ ] LLM che interpreta azione → scelta paragrafo
- [ ] Navigazione sequenziale tra 5-10 paragrafi di test

**User Flow Minimo**
```
1. Utente apre app
2. Preme "Inizia Avventura"
3. Ascolta primo paragrafo
4. Vede "Tocca per parlare"
5. Dice: "Voglio andare a nord"
6. App processa e va al paragrafo successivo
7. Loop continua
```

**Metriche di Successo**
- Latenza totale < 5 secondi (da fine input a inizio narrazione)
- Accuracy interpretazione azioni > 80%
- Zero crash in 10 turni consecutivi

---

### FASE 2: Game State Management (1 settimana)

**Obiettivi**
- Gestione personaggio e inventario
- Sistema di combattimento
- Salvataggio e caricamento partita

**Deliverable**
- [ ] Scheda personaggio (Endurance, Combat Skill, Discipline Kai)
- [ ] Sistema inventario (max 8 oggetti)
- [ ] Meccanica combattimento (tiri dado, calcolo danno)
- [ ] Salvataggio automatico ogni turno
- [ ] "Continua partita" all'avvio

**Sistemi da Implementare**

**Personaggio**
- Generazione random iniziale (o scelta guidata)
- Tracking Endurance (vita)
- Combat Skill
- 5 Discipline Kai scelte dall'utente

**Inventario**
- Add/Remove oggetti
- Verifica capacità (max 8)
- Oggetti speciali (armi, pozioni, chiavi)

**Combattimento**
- Tiro dado per giocatore e nemico
- Calcolo danno
- Vittoria/sconfitta/fuga
- Narrazione dinamica del combattimento

---

### FASE 3: Polish & Testing (1 settimana)

**Obiettivi**
- Migliorare UX audio
- Gestione errori
- Test completo di un'avventura

**Deliverable**
- [ ] Feedback audio per azioni (suoni conferma/errore)
- [ ] Gestione interruzioni (chiamata, GPS, ecc.)
- [ ] Prompt ottimizzati per ridurre errori interpretazione
- [ ] Help vocale ("Aiuto", "Ripeti", "Stato")
- [ ] Test completo: dall'inizio alla fine del libro

**Miglioramenti UX**
- Indicatori visivi minimali (stato corrente, vita, inventario)
- "Ripeti" ultima narrazione
- "Salta narrazione" (per replay)
- Conferma vocale per azioni importanti ("Sei sicuro di voler usare la pozione?")

**Gestione Errori**
- LLM non capisce input → chiedi chiarimento
- Connessione persa → modalità offline limitata
- Rumore eccessivo → richiesta di ripetere
- Azione impossibile → spiegazione gentile

---

### FASE 4: Beta Testing (1 settimana)

**Obiettivi**
- Validare l'esperienza con utenti reali
- Raccogliere feedback
- Identificare bug critici

**Deliverable**
- [ ] 5-10 tester esterni (amici, famiglia)
- [ ] Test in auto reale (passeggero e guidatore)
- [ ] Report feedback strutturato
- [ ] Lista bug e priorità fix

**Scenari di Test**
1. **Viaggio corto** (15-20 min): avvio rapido, salvataggio funziona
2. **Viaggio lungo** (1+ ora): fluidità, batteria, heating
3. **Rumore alto** (finestrini aperti, autostrada): STT ancora funziona?
4. **Multiplayer informale** (2 persone si alternano): esperienza condivisa OK?

**Metriche da Raccogliere**
- Net Promoter Score (lo consiglieresti?)
- Task Success Rate (riesci a completare azioni?)
- Tempo medio di risposta
- Numero interruzioni/errori per sessione
- Soddisfazione narrazione vocale (1-10)

---

## 🎮 Meccaniche di Gioco Dettagliate

### Sistema di Paragrafi

Ogni paragrafo contiene:
```json
{
  "id": 142,
  "testo": "Entri nella taverna. L'aria è densa di fumo...",
  "tipo": "narrativo|combattimento|scelta_oggetto|game_over",
  "scelte": [
    {
      "azione": "vai al bancone",
      "paragrafo_destinazione": 87,
      "condizione": null
    },
    {
      "azione": "esci dalla taverna",
      "paragrafo_destinazione": 12,
      "condizione": null
    }
  ],
  "combattimento": null,
  "modificatori": {
    "endurance": 0,
    "inventory_add": [],
    "inventory_remove": []
  }
}
```

### Interpretazione LLM delle Azioni

**Input Vocale**: "Voglio parlare con l'oste"

**Contesto inviato all'LLM**:
```
Paragrafo corrente: 142 - "Entri nella taverna..."
Opzioni disponibili:
1. Vai al bancone (paragrafo 87)
2. Esci dalla taverna (paragrafo 12)

Giocatore ha detto: "Voglio parlare con l'oste"

Quale scelta corrisponde meglio all'intenzione del giocatore?
Rispondi SOLO con il numero della scelta (1 o 2).
Se nessuna scelta corrisponde, rispondi "UNCLEAR".
```

**Output LLM**: "1"

→ App va al paragrafo 87

### Sistema di Combattimento

**Meccanica**:
1. Estrai nemico da paragrafo
2. Calcola Combat Ratio (CS giocatore - CS nemico)
3. Ogni turno: tiro dado (0-9) + Combat Ratio = risultato
4. Consulta tabella danno
5. Sottrai Endurance a perdente
6. Ripeti fino a vittoria/sconfitta/fuga

**Narrazione Combattimento**:
```
"Affronti un Giakan! [pausa]
Combat Skill nemico: 13 [pausa]
Il tuo Combat Skill è 15. [pausa]
Tiri il dado... 6! [pausa]
Colpisci il nemico per 4 punti! [pausa]
Endurance nemico: 6 rimanenti."
```

---

## 🚨 Rischi e Mitigazioni

### Rischi Tecnici

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| STT non accurato con rumore auto | Alta | Alto | Test in condizioni reali early, considerare microfoni esterni Bluetooth |
| Latenza API troppo alta | Media | Alto | Caching risposte comuni, fallback a TTS veloce |
| LLM interpreta male azioni | Alta | Medio | Prompt engineering iterativo, log e feedback loop |
| Batteria si scarica rapidamente | Media | Medio | Ottimizzazione uso CPU, modalità risparmio energetico |
| Connessione internet instabile | Alta | Alto | Implementare modalità offline ridotta (solo TTS locale) |

### Rischi di Prodotto

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Esperienza troppo lenta (noiosa) | Media | Alto | Testing velocità narrazione, opzione skip, ritmo variabile |
| Guidatore si distrae | Bassa | Critico | Warning esplicito, testing sicurezza, design audio-only |
| Utenti non capiscono come giocare | Alta | Medio | Tutorial interattivo obbligatorio, comandi vocali chiari |
| Storia Lone Wolf troppo complessa | Bassa | Medio | Semplificare paragrafi se necessario, focus su main path |

---

## 💰 Budget Stimato Prototipo

### Sviluppo (Self-Funded)

| Voce | Ore | Costo Opportunity |
|------|-----|-------------------|
| Setup & Preparazione | 40h | - |
| Sviluppo Core | 80h | - |
| Testing & Debug | 40h | - |
| **Totale** | **160h** | **~2 mesi part-time** |

### Costi Operativi (Testing - 100 ore di gioco)

| Servizio | Costo Mensile |
|----------|---------------|
| Claude API (Anthropic) | $10-20 |
| TTS Premium (opzionale) | $10-15 |
| Hosting/Backend (opzionale) | $0-5 |
| Apple Developer Account | $99/anno |
| Google Play Developer | $25 one-time |
| **Totale** | **~$30-50/mese** |

### Hardware Necessario

- Mac per sviluppo iOS (se target iOS)
- Smartphone Android/iOS per testing
- Auricolari Bluetooth con microfono decente
- Auto per test in condizioni reali

---

## 📊 Metriche di Successo MVP

### Metriche Tecniche

- ✅ **Latenza end-to-end**: < 5 secondi (95% dei casi)
- ✅ **Accuracy STT**: > 85% in condizioni auto normali
- ✅ **Accuracy interpretazione LLM**: > 90%
- ✅ **Crash rate**: < 1% delle sessioni
- ✅ **Completamento libro**: almeno 1 persona finisce "Flight from the Dark"

### Metriche di Esperienza

- ✅ **NPS (Net Promoter Score)**: > 7/10
- ✅ **Engagement**: sessioni medie > 20 minuti
- ✅ **Retention**: 3+ sessioni per utente test
- ✅ **Feedback qualitativo positivo**: "È divertente" da almeno 70% tester

### Gate per Passare a Fase Successiva

Il prototipo è considerato **validato** se:
1. ✅ Esperienza core funziona senza blocchi critici
2. ✅ Almeno 5 persone diverse completano 30+ minuti di gioco
3. ✅ Feedback indica chiaramente: "Voglio giocare ancora"
4. ✅ Nessun problema di sicurezza per guidatore

---

## 🔄 Next Steps Post-Prototipo

### Se Validato → Roadmap Futura

**V1.0 - Espansione Contenuti** (2-3 mesi)
- Tutti i 31 libri Lone Wolf
- Gestione progressione tra libri
- Transfer personaggio tra avventure

**V1.5 - Social Features** (2-3 mesi)
- Multiplayer asincrono (turni alternati)
- Condivisione progressi
- Leaderboard

**V2.0 - Contenuti Dinamici** (3-4 mesi)
- LLM genera variazioni su paragrafi esistenti
- Personalismi basati su scelte precedenti
- Eventi casuali durante viaggio

**V3.0 - Storie Generate** (4-6 mesi)
- LLM crea avventure complete
- Temi personalizzabili
- Integrazione con contesto (meteo, luogo, ecc.)

### Se Non Validato → Pivot Options

- **Pivot 1**: Focus solo su podcast narrativo (no scelte)
- **Pivot 2**: App per bambini (storie più semplici)
- **Pivot 3**: Tool per Dungeon Master (assistente GDR)

---

## 👥 Team & Ruoli Ideali

### Competenze Necessarie per Prototipo

**Sviluppatore Mobile** (1 persona - lead)
- React Native / Flutter
- Gestione stato app
- Integrazione API

**Backend/LLM Engineer** (1 persona o shared)
- Prompt engineering
- Integrazione API Claude
- Ottimizzazione latenza

**Content Designer** (0.5 persona o shared)
- Parsing libri Lone Wolf
- Strutturazione JSON
- Testing narrativa

**QA/Tester** (0.5 persona o community)
- Test in condizioni reali
- Bug reporting
- Feedback collection

**Totale**: 2-3 persone equivalenti full-time

---

## 📝 Documenti di Supporto da Creare

### Durante lo Sviluppo

- [ ] **Technical Architecture Document**: dettagli implementazione
- [ ] **API Integration Guide**: come usare Claude, STT, TTS
- [ ] **Content Database Schema**: struttura JSON paragrafi
- [ ] **Prompt Templates Library**: tutti i prompt per LLM
- [ ] **Testing Checklist**: scenari e casi d'uso

### Per Testing

- [ ] **Beta Testing Guide**: istruzioni per tester
- [ ] **Feedback Form**: template raccolta feedback
- [ ] **Bug Report Template**: come segnalare problemi

### Per Futuro

- [ ] **Product Roadmap**: visione 12-24 mesi
- [ ] **Monetization Strategy**: se/come monetizzare
- [ ] **Licensing Research**: diritti Lone Wolf, altre IP

---

## 🎯 Milestone Summary

| Milestone | Timeline | Key Deliverable |
|-----------|----------|-----------------|
| **M0: Setup** | Settimana 1 | Ambiente pronto, content parsed |
| **M1: Core Loop** | Settimane 2-3 | Audio bidirezionale funzionante |
| **M2: Game State** | Settimana 4 | Combattimento e inventario |
| **M3: Polish** | Settimana 5 | UX rifinta, error handling |
| **M4: Beta** | Settimana 6 | Feedback da 5-10 utenti reali |
| **M5: Go/No-Go** | Fine Settimana 6 | Decisione su next phase |

**Target Totale Prototipo**: **6 settimane** (1.5 mesi)

---

## 📞 Contatti & Collaborazione

### Come Contribuire

Questo progetto è aperto a collaboratori con competenze in:
- Sviluppo mobile (React Native / Flutter)
- Machine Learning / LLM engineering
- Game design
- UX/UI design
- Testing & QA

### Comunicazione

- **Repository**: [Da creare su GitHub]
- **Chat**: [Discord/Slack/Telegram da definire]
- **Project Management**: [Trello/Notion/GitHub Projects]
- **Documentazione**: [Notion/Google Docs/Wiki]

---

## ✅ Checklist Pre-Avvio

Prima di iniziare lo sviluppo, assicurarsi di avere:

- [ ] Almeno 1 sviluppatore mobile committed
- [ ] Account API creati (Anthropic, eventuali STT/TTS)
- [ ] Repository GitHub setup
- [ ] Tool di project management scelto e configurato
- [ ] Canale comunicazione team attivo
- [ ] "Flight from the Dark" scaricato e studiato
- [ ] Primo sprint planning meeting schedulato
- [ ] Budget operativo approvato (~$50/mese per 2 mesi)

---

## 📚 Risorse Utili

### Documentazione Tecnica
- [Project Aon - Lone Wolf Books](https://www.projectaon.org/)
- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

### Ispirazione & Riferimenti
- Libri Lone Wolf originali
- App "AI Dungeon"
- App "Storyline" (Alexa interactive stories)
- Podcast interattivi Spotify

### Community
- r/gamebooks (Reddit)
- Project Aon Forums
- React Native Community Discord

---

**Documento redatto**: Novembre 2025  
**Versione**: 1.0  
**Prossima review**: Fine Fase 0

---

*Questo è un documento vivente. Aggiornare regolarmente in base a feedback del team e progress del progetto.*
