# 🎯 Opzione 1: Completare Fase 0 - Content Database & API Setup

**Obiettivo:** Creare una base solida per lo sviluppo completo dell'app, completando tutti i task della Fase 0 del piano originale.

**Tempo Stimato:** 1-2 giorni
**Difficoltà:** Media
**Prerequisiti:** Node.js, Python (opzionale), Account Anthropic Claude

---

## 📋 Task Overview

### Task 1: Content Database - Parsing "Flight from the Dark"
### Task 2: API Setup & Testing
### Task 3: Prompt Engineering & Documentation

---

## 📚 TASK 1: Content Database - Parsing Lone Wolf

### Obiettivo
Creare un database JSON completo con tutti i paragrafi del libro "Flight from the Dark" (primo libro Lone Wolf), strutturato per essere utilizzato dall'app.

### Step-by-Step

#### 1.1 Download Contenuti Lone Wolf

**Fonte Ufficiale:** [Project Aon](https://www.projectaon.org/en/Main/Books)

```bash
# Opzione A: Download manuale
# Visita: https://www.projectaon.org/en/xhtml/lw/01fftd/toc.htm
# Salva la pagina HTML completa in: content/raw/01fftd.html

# Opzione B: Download con wget
cd Road-Quest
mkdir -p content/raw
wget -O content/raw/01fftd.html "https://www.projectaon.org/en/xhtml/lw/01fftd/toc.htm"
```

#### 1.2 Analisi Struttura HTML

Il libro è strutturato con:
- **Paragrafi numerati**: identificati da ID tipo `sect1`, `sect2`, etc.
- **Testo narrativo**: contenuto principale del paragrafo
- **Scelte**: link ai paragrafi successivi
- **Combattimenti**: tabelle con statistiche nemici
- **Modificatori**: oggetti da aggiungere/rimuovere, danni/cure

**Esempio struttura HTML:**
```html
<div class="numbered" id="sect1">
  <h3>1</h3>
  <p>You are Lone Wolf, last of the Kai Lords...</p>
  <ul class="unbulleted">
    <li>If you wish to go north, <a href="#sect142">turn to 142</a></li>
    <li>If you wish to go south, <a href="#sect87">turn to 87</a></li>
  </ul>
</div>
```

#### 1.3 Creare Script Parser

**Creare file:** `scripts/parse-lone-wolf.js`

```javascript
const fs = require('fs');
const { JSDOM } = require('jsdom');

// Installa dipendenza: npm install jsdom

async function parseLoneWolf(htmlPath, outputPath) {
  console.log('📖 Parsing Lone Wolf book...');

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const paragraphs = [];

  // Trova tutti i paragrafi numerati
  const sections = document.querySelectorAll('.numbered[id^="sect"]');

  sections.forEach((section) => {
    const id = parseInt(section.id.replace('sect', ''));
    const heading = section.querySelector('h3')?.textContent.trim();

    // Estrai testo narrativo
    const paragraphTexts = [];
    section.querySelectorAll('p').forEach(p => {
      if (!p.classList.contains('choice')) {
        paragraphTexts.push(p.textContent.trim());
      }
    });

    // Estrai scelte
    const choices = [];
    section.querySelectorAll('a[href^="#sect"]').forEach(link => {
      const destId = parseInt(link.href.split('#sect')[1]);
      const actionText = link.parentElement.textContent.trim();

      choices.push({
        action: actionText,
        destination: destId,
        condition: null // Da analizzare manualmente se presente
      });
    });

    // Determina tipo paragrafo
    let type = 'narrative';
    if (section.querySelector('.combat')) type = 'combat';
    if (section.textContent.includes('YOU HAVE FAILED')) type = 'game_over';
    if (section.textContent.includes('YOU HAVE WON')) type = 'victory';

    paragraphs.push({
      id,
      text: paragraphTexts.join('\n\n'),
      type,
      choices,
      combat: null, // Da estrarre se type === 'combat'
      modifiers: {
        endurance: 0,
        inventory_add: [],
        inventory_remove: []
      }
    });
  });

  // Salva JSON
  const output = {
    title: "Flight from the Dark",
    book_number: 1,
    total_paragraphs: paragraphs.length,
    paragraphs
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`✅ Parsed ${paragraphs.length} paragraphs`);
  console.log(`📄 Saved to ${outputPath}`);
}

// Esegui parser
parseLoneWolf(
  'content/raw/01fftd.html',
  'src/data/flight-from-dark.json'
);
```

#### 1.4 Eseguire Parser

```bash
# Installa dipendenza
npm install jsdom

# Crea directory script se non esiste
mkdir -p scripts

# Copia lo script sopra in scripts/parse-lone-wolf.js

# Esegui parser
node scripts/parse-lone-wolf.js
```

#### 1.5 Validazione Output

**Controlla che il JSON generato contenga:**
- ✅ ~350 paragrafi (il libro originale ne ha circa 350)
- ✅ Ogni paragrafo ha: id, text, type, choices
- ✅ Choices contengono destination valide (puntano a paragrafi esistenti)
- ✅ Paragrafo 1 è presente (inizio avventura)

**Script validazione:** `scripts/validate-story.js`

```javascript
const story = require('../src/data/flight-from-dark.json');

console.log('📊 Story Validation Report');
console.log('═'.repeat(50));
console.log(`Total paragraphs: ${story.total_paragraphs}`);
console.log(`Paragraphs loaded: ${story.paragraphs.length}`);

// Controlla paragrafo iniziale
const start = story.paragraphs.find(p => p.id === 1);
console.log(`Start paragraph exists: ${start ? '✅' : '❌'}`);

// Controlla link rotti
let brokenLinks = 0;
story.paragraphs.forEach(para => {
  para.choices.forEach(choice => {
    const dest = story.paragraphs.find(p => p.id === choice.destination);
    if (!dest) {
      brokenLinks++;
      console.log(`❌ Broken link: ${para.id} → ${choice.destination}`);
    }
  });
});

console.log(`Broken links: ${brokenLinks === 0 ? '✅ None' : `❌ ${brokenLinks}`}`);
console.log('═'.repeat(50));
```

---

## 🔑 TASK 2: API Setup & Testing

### Obiettivo
Configurare e testare l'integrazione con Anthropic Claude API per interpretazione azioni vocali.

### Step-by-Step

#### 2.1 Ottenere API Key Anthropic

1. Vai su [console.anthropic.com](https://console.anthropic.com/)
2. Crea un account o fai login
3. Vai su "API Keys"
4. Crea una nuova API key
5. Copia la chiave (formato: `sk-ant-...`)

**Budget consigliato:** $10-20 per testing prototipo

#### 2.2 Configurare .env

```bash
# Copia il file esempio
cp .env.example .env

# Apri .env con editor
nano .env  # oppure code .env
```

**Contenuto .env:**
```bash
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# TTS Service (opzionale per ora, usa native)
TTS_SERVICE=native  # o 'elevenlabs' se vuoi premium

# Development
NODE_ENV=development
DEBUG=true
```

**⚠️ IMPORTANTE:** Non committare mai il file `.env`! È già in `.gitignore`.

#### 2.3 Test Base Claude API

**Creare file:** `scripts/test-claude.js`

```javascript
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config(); // npm install dotenv

async function testClaudeAPI() {
  console.log('🤖 Testing Claude API...');

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const startTime = Date.now();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: 'Rispondi solo con "OK" se mi ricevi.'
      }]
    });

    const latency = Date.now() - startTime;

    console.log('✅ API Connected!');
    console.log(`⏱️  Latency: ${latency}ms`);
    console.log(`📝 Response: ${message.content[0].text}`);
    console.log(`💰 Tokens used: ${message.usage.input_tokens + message.usage.output_tokens}`);

  } catch (error) {
    console.error('❌ API Error:', error.message);
    process.exit(1);
  }
}

testClaudeAPI();
```

**Esegui test:**
```bash
npm install dotenv
node scripts/test-claude.js
```

**Output atteso:**
```
🤖 Testing Claude API...
✅ API Connected!
⏱️  Latency: 1234ms
📝 Response: OK
💰 Tokens used: 25
```

#### 2.4 Test Interpretazione Azioni

**Creare file:** `scripts/test-action-interpretation.js`

```javascript
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const testCases = [
  {
    paragraph: "Ti trovi davanti a un bivio. A sinistra il sentiero scende verso una valle nebbiosa. A destra sale verso le montagne.",
    choices: [
      { id: 1, action: "Vai a sinistra verso la valle", destination: 87 },
      { id: 2, action: "Vai a destra verso le montagne", destination: 142 }
    ],
    userInput: "Voglio andare in montagna",
    expectedChoice: 2
  },
  {
    paragraph: "Incontri un mercante. Puoi comprare una spada (5 corone) o continuare senza.",
    choices: [
      { id: 1, action: "Compra la spada", destination: 23 },
      { id: 2, action: "Prosegui senza comprare", destination: 56 }
    ],
    userInput: "Compro la spada",
    expectedChoice: 1
  }
];

async function testInterpretation() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  console.log('🧪 Testing Action Interpretation...\n');

  let correct = 0;
  let totalLatency = 0;

  for (const testCase of testCases) {
    const prompt = `
Sei un assistente per un gioco di ruolo testuale. L'utente sta giocando a "Lone Wolf".

SITUAZIONE CORRENTE:
${testCase.paragraph}

SCELTE DISPONIBILI:
${testCase.choices.map(c => `${c.id}. ${c.action}`).join('\n')}

AZIONE DELL'UTENTE:
"${testCase.userInput}"

Quale scelta corrisponde meglio all'intenzione dell'utente?
Rispondi SOLO con il numero della scelta (1, 2, etc.).
Se nessuna scelta corrisponde, rispondi "UNCLEAR".
`;

    try {
      const startTime = Date.now();

      const message = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 10,
        messages: [{ role: 'user', content: prompt }]
      });

      const latency = Date.now() - startTime;
      totalLatency += latency;

      const response = message.content[0].text.trim();
      const choiceId = parseInt(response);

      const success = choiceId === testCase.expectedChoice;
      if (success) correct++;

      console.log(`${success ? '✅' : '❌'} Test: "${testCase.userInput}"`);
      console.log(`   Expected: ${testCase.expectedChoice}, Got: ${response}`);
      console.log(`   Latency: ${latency}ms\n`);

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  console.log('═'.repeat(50));
  console.log(`✅ Accuracy: ${correct}/${testCases.length} (${(correct/testCases.length*100).toFixed(1)}%)`);
  console.log(`⏱️  Average Latency: ${(totalLatency/testCases.length).toFixed(0)}ms`);
}

testInterpretation();
```

**Esegui test:**
```bash
node scripts/test-action-interpretation.js
```

**Target metriche:**
- ✅ Accuracy > 90% (almeno 9/10 test corretti)
- ✅ Latency media < 2000ms

#### 2.5 Test TTS Nativo

**Creare file:** `scripts/test-tts.js`

```javascript
// Questo test va eseguito nell'app React Native
// Copia questo codice in un componente temporaneo

import * as Speech from 'expo-speech';

async function testTTS() {
  const testText = "Sei Lone Wolf, ultimo dei Kai Lords. Il monastero è sotto attacco!";

  console.log('🔊 Testing TTS...');

  const startTime = Date.now();

  await Speech.speak(testText, {
    language: 'it-IT',
    pitch: 1.0,
    rate: 0.9, // Leggermente più lento per narrazione
    onDone: () => {
      const duration = Date.now() - startTime;
      console.log(`✅ TTS completed in ${duration}ms`);
    },
    onError: (error) => {
      console.error('❌ TTS Error:', error);
    }
  });
}
```

---

## 📝 TASK 3: Prompt Engineering & Documentation

### Obiettivo
Creare e documentare template di prompt ottimizzati per l'interpretazione delle azioni vocali.

### Step-by-Step

#### 3.1 Creare Documentazione Prompts

**Creare file:** `docs/prompts.md`

```markdown
# 🎯 Prompt Templates - Road Quest

Questo documento contiene tutti i prompt template utilizzati nell'app per l'interazione con Claude API.

---

## 1. Action Interpretation Prompt

**Scopo:** Interpretare l'azione vocale dell'utente e mapparla a una delle scelte disponibili.

**Template:**
\`\`\`
Sei un assistente per il gioco di ruolo "Lone Wolf". Il giocatore sta vivendo un'avventura interattiva.

SITUAZIONE CORRENTE:
{{currentParagraphText}}

SCELTE DISPONIBILI:
{{#each choices}}
{{index}}. {{action}}
{{/each}}

AZIONE DEL GIOCATORE:
"{{userInput}}"

COMPITO:
Analizza l'intenzione del giocatore e identifica quale scelta corrisponde meglio.

REGOLE:
1. Rispondi SOLO con il numero della scelta (es: "1", "2", "3")
2. Se nessuna scelta corrisponde chiaramente, rispondi "UNCLEAR"
3. Se il giocatore chiede aiuto/ripeti/stato, rispondi "COMMAND:HELP" / "COMMAND:REPEAT" / "COMMAND:STATUS"
4. Considera sinonimi e variazioni linguistiche

RISPOSTA (solo numero o keyword):
\`\`\`

**Esempio:**
\`\`\`
Input: "Voglio andare verso le montagne"
Choices: ["Vai a nord nella foresta", "Vai a est verso le montagne"]
Output: "2"
\`\`\`

---

## 2. Combat Narration Prompt

**Scopo:** Generare narrazione dinamica per i combattimenti.

**Template:**
\`\`\`
Narra un turno di combattimento in stile "Lone Wolf".

CONTESTO:
- Giocatore: Lone Wolf (Combat Skill {{playerCS}}, Endurance {{playerEndurance}})
- Nemico: {{enemyName}} (Combat Skill {{enemyCS}}, Endurance {{enemyEndurance}})

RISULTATO TIRO DADO:
- Dado giocatore: {{playerRoll}}
- Dado nemico: {{enemyRoll}}
- Combat Ratio: {{combatRatio}}
- Danno inflitto: {{damage}} a {{target}}

COMPITO:
Crea una narrazione coinvolgente di 2-3 frasi che descriva l'esito del turno.

STILE:
- Seconda persona (tu/te)
- Azione, non descrizione statica
- Max 50 parole

NARRAZIONE:
\`\`\`

**Esempio Output:**
"Sferri un colpo potente contro il Giakan! La tua lama lo colpisce al fianco, infliggendo 4 punti di danno. Il nemico indietreggia, ferito ma ancora minaccioso."

---

## 3. Item Usage Confirmation Prompt

**Scopo:** Generare conferme per uso oggetti importanti.

**Template:**
\`\`\`
Il giocatore vuole usare: {{itemName}}

Genera una domanda di conferma in stile narrativo (max 15 parole).

Esempi:
- "Sei sicuro di voler bere la pozione? Dice 'Usare con cautela'."
- "Vuoi davvero aprire il baule sospetto?"

CONFERMA:
\`\`\`

---

## Best Practices

1. **Token Efficiency:** Usa max_tokens bassi per risposte brevi (10-50 token)
2. **Consistency:** Mantieni lo stesso tono narrativo
3. **Error Handling:** Gestisci sempre risposte ambigue
4. **Latency:** Monitora e ottimizza per < 2s
5. **Testing:** Testa ogni variazione di prompt prima di deploy
\`\`\`

#### 3.2 Ottimizzazione Iterativa

**Processo:**
1. Testa con 20+ azioni reali
2. Identifica pattern di errore
3. Modifica prompt per migliorare accuracy
4. Ri-testa
5. Documenta versioni e performance

**Log template:**
```
Prompt Version: v1.2
Date: 2025-11-04
Accuracy: 94% (47/50)
Avg Latency: 1450ms
Notes: Aggiunto handling per comandi (help/repeat)
```

---

## ✅ Definition of Done - Opzione 1

La Fase 0 è completa quando:

- [x] ✅ File `src/data/flight-from-dark.json` esiste con ~350 paragrafi
- [x] ✅ Script `scripts/parse-lone-wolf.js` funziona e validato
- [x] ✅ File `.env` configurato con API key valida
- [x] ✅ Test `scripts/test-claude.js` passa (latency < 3s)
- [x] ✅ Test interpretazione azioni: accuracy > 90%
- [x] ✅ TTS testato e funzionante
- [x] ✅ Documentazione `docs/prompts.md` completa

**Tempo totale stimato:** 8-16 ore

---

## 🚀 Prossimi Passi (dopo Opzione 1)

Una volta completata la Fase 0, si può procedere con **Fase 1: Core Loop**:
1. Creare UI components (HomeScreen, GameScreen)
2. Integrare services con database completo
3. Implementare game flow end-to-end
4. Test con almeno 20 paragrafi consecutivi

Vedi: `docs/OPTION_2_QUICK_MVP.md` per implementazione UI.

---

**Autore:** Road Quest Team
**Ultimo aggiornamento:** 4 Novembre 2025
**Versione:** 1.0
