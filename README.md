# 🎮 XPira - Level Up Your Real Life

A 3D browser-based role-playing game where you learn languages through immersive gameplay. Complete missions, talk to NPCs, and level up your language skills by speaking in your target language!

## 🎮 Features

- **3D Marketplace Scene** - Explore a vibrant marketplace with vendors and NPCs
- **Speech Recognition** - Speak in your target language to interact with characters
- **Progressive Learning** - Start with hints and gradually build confidence
- **RPG Stats System** - Track vocabulary, pronunciation, comprehension, and grammar
- **Multiple Languages** - Support for Spanish, French, German, Italian, Portuguese, and Japanese
- **Mission System** - Complete quests by using language skills

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Play

1. **Select a Language** - Choose which language you want to learn from the main menu
2. **Explore** - Use WASD or Arrow keys to move around the marketplace
3. **Interact** - Approach NPCs and press E or click to start a conversation
4. **Speak** - Use the microphone button to speak in your target language
5. **Learn** - If you struggle, NPCs will help teach you the right words!

## 🏗️ Project Structure

```
/src
  /core              # Platform-agnostic game logic
    types.ts         # TypeScript interfaces for game entities
    stores.ts        # Zustand state management
  /features
    /dialogue        # NPC dialogue system
    /speech          # Speech recognition abstraction
  /scenes            # 3D game scenes
    /components      # Reusable 3D components (Player, NPC, Environment)
    MarketplaceScene.tsx
  /ui                # React UI components
    StatsPanel.tsx   # Player stats display
    DialogueBox.tsx  # NPC conversation interface
    MainMenu.tsx     # Language selection and start screen
```

## 🛠️ Tech Stack

- **React 19** + TypeScript + Vite
- **React Three Fiber** + @react-three/drei (3D graphics)
- **Zustand** (state management)
- **Tailwind CSS** (styling)
- **Web Speech API** (speech recognition)
- **Capacitor** (future mobile support)

## 📱 Mobile Support

The architecture is designed for easy mobile conversion using Capacitor.js. Speech recognition is abstracted to allow platform-specific implementations.

## 🎓 Adding New Content

### Adding a New Dialogue Tree

Edit `/src/features/dialogue/dialogueContent.ts`:

```typescript
export const newVendorDialogue: DialogueTree = {
  id: 'new-vendor',
  startNodeId: 'greeting',
  nodes: [
    {
      id: 'greeting',
      speaker: 'npc',
      text: 'English text here',
      textInTargetLanguage: 'Target language text',
      responses: [
        {
          id: 'response-1',
          expectedSpeech: ['phrase1', 'phrase2'],  // Acceptable spoken phrases
          nextNodeId: 'next-node',
          requiresType: 'speak',
        }
      ]
    }
  ]
};
```

### Adding New NPCs

Add to the MarketplaceScene.tsx or create new scene files with NPC components.

## 📋 Roadmap

- [ ] More marketplace scenarios (bakery, butcher, etc.)
- [ ] Home scene with cooking missions
- [ ] School scene with grammar lessons
- [ ] Mini-games for vocabulary practice
- [ ] Spaced repetition for learned words
- [ ] Azure Speech Services integration for pronunciation scoring
- [ ] Mobile app builds (iOS/Android)

## 📄 License

MIT
