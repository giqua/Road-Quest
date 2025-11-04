# Source Code Structure

This directory contains all the application source code.

## Directory Structure

```
src/
├── components/     # Reusable React components
├── screens/        # Screen components (Home, Game, Settings, etc.)
├── services/       # API services (Claude, TTS, STT)
├── utils/          # Utility functions and helpers
├── context/        # React Context providers (GameState, Audio, etc.)
└── data/           # Static data (Lone Wolf story JSON, combat tables)
```

## Naming Conventions

- **Components**: PascalCase (e.g., `GameScreen.js`, `AudioButton.js`)
- **Services**: camelCase (e.g., `claudeService.js`, `ttsService.js`)
- **Utils**: camelCase (e.g., `combatCalculator.js`, `storyParser.js`)
- **Context**: PascalCase with Context suffix (e.g., `GameContext.js`)

## Best Practices

- Keep components small and focused
- Use functional components with hooks
- Extract business logic into services and utils
- Use Context for global state management
- Add JSDoc comments for complex functions
