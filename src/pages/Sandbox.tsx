/**
 * Design Sandbox
 * 
 * A development-only page for experimenting with visual styles,
 * colors, typography, and components without rebuilding the game world.
 * 
 * Access via: http://localhost:5173/?sandbox=true
 */

import { useState } from 'react';

// Theme presets for quick switching
const THEME_PRESETS = {
  cozycraft: {
    name: 'Cozy Craft (Current)',
    bgPrimary: '#faf6f0',
    bgSecondary: '#f5ede0',
    bgCard: '#fffbf5',
    textPrimary: '#3d3428',
    textSecondary: '#6b5d4d',
    accentGreen: '#7cb56b',
    accentOrange: '#e8a855',
    accentCoral: '#e07b6b',
    accentTeal: '#5bb5a6',
    accentPurple: '#9b7bb5',
  },
  forest: {
    name: 'Deep Forest',
    bgPrimary: '#1a2e1a',
    bgSecondary: '#243524',
    bgCard: '#2d422d',
    textPrimary: '#e8f5e8',
    textSecondary: '#b8d4b8',
    accentGreen: '#6bcf6b',
    accentOrange: '#f5b858',
    accentCoral: '#ff8a7a',
    accentTeal: '#58c9b9',
    accentPurple: '#b088d0',
  },
  sunset: {
    name: 'Golden Sunset',
    bgPrimary: '#fff8f0',
    bgSecondary: '#ffe8d0',
    bgCard: '#fffaf5',
    textPrimary: '#4a3020',
    textSecondary: '#7a5a4a',
    accentGreen: '#8bc96b',
    accentOrange: '#ff9f40',
    accentCoral: '#ff7060',
    accentTeal: '#50c0b0',
    accentPurple: '#a070c0',
  },
  midnight: {
    name: 'Midnight Blue',
    bgPrimary: '#0f1729',
    bgSecondary: '#1a2540',
    bgCard: '#243050',
    textPrimary: '#e8eef8',
    textSecondary: '#a8b8d0',
    accentGreen: '#50d890',
    accentOrange: '#ffb060',
    accentCoral: '#ff6080',
    accentTeal: '#40d0e0',
    accentPurple: '#b080ff',
  },
};

type ThemeKey = keyof typeof THEME_PRESETS;

interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  accentGreen: string;
  accentOrange: string;
  accentCoral: string;
  accentTeal: string;
  accentPurple: string;
}

export function Sandbox() {
  const [selectedPreset, setSelectedPreset] = useState<ThemeKey>('cozycraft');
  const [colors, setColors] = useState<ThemeColors>(THEME_PRESETS.cozycraft);
  const [showCode, setShowCode] = useState(false);

  const applyPreset = (preset: ThemeKey) => {
    setSelectedPreset(preset);
    const { name, ...themeColors } = THEME_PRESETS[preset];
    setColors(themeColors);
  };

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const generateCSS = () => {
    return `:root {
  --color-bg-primary: ${colors.bgPrimary};
  --color-bg-secondary: ${colors.bgSecondary};
  --color-bg-card: ${colors.bgCard};
  --color-text-primary: ${colors.textPrimary};
  --color-text-secondary: ${colors.textSecondary};
  --color-accent-green: ${colors.accentGreen};
  --color-accent-orange: ${colors.accentOrange};
  --color-accent-coral: ${colors.accentCoral};
  --color-accent-teal: ${colors.accentTeal};
  --color-accent-purple: ${colors.accentPurple};
}`;
  };

  const containerStyle = {
    backgroundColor: colors.bgPrimary,
    color: colors.textPrimary,
    minHeight: '100vh',
    padding: '2rem',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎨 XPira Design Sandbox</h1>
            <p style={{ color: colors.textSecondary }}>
              Experiment with colors and components. Changes preview instantly.
            </p>
          </div>
          <div className="flex gap-3">
            <a 
              href="/game-sandbox"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: colors.accentPurple,
                color: colors.bgPrimary,
              }}
            >
              🎮 Game Sandbox
            </a>
            <a 
              href="/"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: colors.accentGreen,
                color: colors.bgPrimary,
              }}
            >
              ← Back to Game
            </a>
          </div>
        </div>

        {/* Theme Presets */}
        <section className="mb-8" style={{ backgroundColor: colors.bgSecondary, borderRadius: '1rem', padding: '1.5rem' }}>
          <h2 className="text-xl font-semibold mb-4">Theme Presets</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(THEME_PRESETS) as [ThemeKey, typeof THEME_PRESETS.cozycraft][]).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: selectedPreset === key ? colors.accentGreen : colors.bgCard,
                  color: selectedPreset === key ? colors.bgPrimary : colors.textPrimary,
                  border: `2px solid ${selectedPreset === key ? colors.accentGreen : 'transparent'}`,
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        {/* Color Controls */}
        <section className="mb-8" style={{ backgroundColor: colors.bgSecondary, borderRadius: '1rem', padding: '1.5rem' }}>
          <h2 className="text-xl font-semibold mb-4">Color Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.entries(colors) as [keyof ThemeColors, string][]).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize" style={{ color: colors.textSecondary }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="flex-1 px-2 py-1 rounded text-sm font-mono"
                    style={{ 
                      backgroundColor: colors.bgCard,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.textSecondary}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Component Preview */}
        <section className="mb-8" style={{ backgroundColor: colors.bgSecondary, borderRadius: '1rem', padding: '1.5rem' }}>
          <h2 className="text-xl font-semibold mb-4">Component Preview</h2>
          
          {/* Buttons */}
          <div className="mb-6">
            <h3 className="font-medium mb-3" style={{ color: colors.textSecondary }}>Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105" 
                style={{ backgroundColor: colors.accentGreen, color: colors.bgPrimary }}>
                Primary Action
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105" 
                style={{ backgroundColor: colors.accentOrange, color: colors.bgPrimary }}>
                Secondary
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105" 
                style={{ backgroundColor: colors.accentCoral, color: colors.bgPrimary }}>
                Danger
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105" 
                style={{ backgroundColor: colors.accentTeal, color: colors.bgPrimary }}>
                Info
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105" 
                style={{ backgroundColor: colors.accentPurple, color: colors.bgPrimary }}>
                XP / Magic
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-6">
            <h3 className="font-medium mb-3" style={{ color: colors.textSecondary }}>Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl shadow-lg" style={{ backgroundColor: colors.bgCard }}>
                <div className="text-3xl mb-2">🗣️</div>
                <h4 className="font-bold text-lg mb-1">Languages</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Learn Spanish, French, and more by talking to NPCs
                </p>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.bgSecondary }}>
                  <div className="h-full rounded-full" style={{ width: '65%', backgroundColor: colors.accentGreen }} />
                </div>
              </div>
              <div className="p-4 rounded-xl shadow-lg" style={{ backgroundColor: colors.bgCard }}>
                <div className="text-3xl mb-2">💪</div>
                <h4 className="font-bold text-lg mb-1">Fitness</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Track workouts and sync with Apple Health
                </p>
                <div className="mt-3 px-3 py-1 rounded-full inline-block text-xs font-medium"
                  style={{ backgroundColor: colors.accentOrange + '30', color: colors.accentOrange }}>
                  Coming Soon
                </div>
              </div>
              <div className="p-4 rounded-xl shadow-lg" style={{ backgroundColor: colors.bgCard }}>
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-bold text-lg mb-1">Cognitive</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Mental math, memory, and logic puzzles
                </p>
                <div className="mt-3 px-3 py-1 rounded-full inline-block text-xs font-medium"
                  style={{ backgroundColor: colors.accentPurple + '30', color: colors.accentPurple }}>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-6">
            <h3 className="font-medium mb-3" style={{ color: colors.textSecondary }}>Typography</h3>
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgCard }}>
              <h1 className="text-4xl font-bold mb-2">Level Up Your Life</h1>
              <h2 className="text-2xl font-semibold mb-2">XPira - XP for Real Life</h2>
              <p className="text-lg mb-2">
                A game where you earn XP by actually learning and doing things in the real world.
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No streaks. No guilt. Just real growth at your own pace.
              </p>
            </div>
          </div>

          {/* D&D Attributes */}
          <div>
            <h3 className="font-medium mb-3" style={{ color: colors.textSecondary }}>Attribute Colors</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'STR', color: colors.accentCoral },
                { name: 'DEX', color: colors.accentGreen },
                { name: 'CON', color: colors.accentOrange },
                { name: 'INT', color: colors.accentTeal },
                { name: 'WIS', color: colors.accentPurple },
                { name: 'CHA', color: '#e8a0b5' },
              ].map(attr => (
                <div 
                  key={attr.name}
                  className="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-lg shadow-md"
                  style={{ backgroundColor: attr.color, color: colors.bgPrimary }}
                >
                  {attr.name}
                  <span className="text-xs font-normal opacity-80">12</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Export CSS */}
        <section style={{ backgroundColor: colors.bgSecondary, borderRadius: '1rem', padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Export CSS Variables</h2>
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: colors.accentTeal, color: colors.bgPrimary }}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          {showCode && (
            <div className="relative">
              <pre 
                className="p-4 rounded-lg overflow-x-auto text-sm font-mono"
                style={{ backgroundColor: colors.bgCard, color: colors.textPrimary }}
              >
                {generateCSS()}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(generateCSS())}
                className="absolute top-2 right-2 px-3 py-1 rounded text-sm font-medium"
                style={{ backgroundColor: colors.accentGreen, color: colors.bgPrimary }}
              >
                Copy
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="mt-8 text-center text-sm" style={{ color: colors.textSecondary }}>
          Tip: Adjust colors above, preview components, then copy CSS to update index.css
        </div>
      </div>
    </div>
  );
}
