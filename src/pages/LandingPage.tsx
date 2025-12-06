/**
 * Landing Page
 * 
 * Marketing page for unauthenticated users.
 * "Level up your life" - emphasizes languages with more domains coming.
 */

import { useState } from 'react';

interface LandingPageProps {
  onPlayFree: () => void;
  onRequestBeta: () => void;
  onLogin: () => void;
}

export function LandingPage({ onPlayFree, onRequestBeta, onLogin }: LandingPageProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-[#f5ede0]">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-2xl font-bold text-[#3d3428]">XPira</span>
        </div>
        <button
          onClick={onLogin}
          className="px-4 py-2 text-[#6b5d4d] hover:text-[#3d3428] font-medium transition-colors"
        >
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#3d3428] mb-6">
          Level Up Your{' '}
          <span className="bg-gradient-to-r from-[#7cb56b] to-[#5bb5a6] bg-clip-text text-transparent">
            Real Life
          </span>
        </h1>
        <p className="text-xl text-[#6b5d4d] mb-8 max-w-2xl mx-auto">
          A game where you earn XP by actually learning and doing things in the real world. 
          No streaks. No guilt. Just real growth at your own pace.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onPlayFree}
            className="px-8 py-4 bg-[#7cb56b] hover:bg-[#5a9a4a] text-white font-semibold rounded-xl text-lg transition-all hover:scale-105 shadow-lg"
          >
            🎮 Play Free
          </button>
          <button
            onClick={onRequestBeta}
            className="px-8 py-4 bg-[#9b7bb5] hover:bg-[#8a6aa4] text-white font-semibold rounded-xl text-lg transition-all hover:scale-105 shadow-lg"
          >
            ⭐ Join Beta
          </button>
        </div>

        {/* Game Preview */}
        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ebe3d5]">
          <div className="bg-[#2a2520] aspect-video flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4">🏘️</div>
              <p className="text-lg">Game Preview Coming Soon</p>
              <p className="text-sm">Explore a living world that grows with you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#3d3428] text-center mb-4">
          Your Skills, Gamified
        </h2>
        <p className="text-[#6b5d4d] text-center mb-12 max-w-2xl mx-auto">
          XPira tracks your real-world growth across multiple life domains. 
          Start with languages today, with more skills coming soon.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages - Live */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#7cb56b]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">🗣️</div>
              <span className="px-3 py-1 bg-[#7cb56b] text-white text-xs font-bold rounded-full">
                LIVE NOW
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#3d3428] mb-2">Languages</h3>
            <p className="text-[#6b5d4d] text-sm mb-4">
              Learn Spanish, French, and more by speaking with NPCs in an immersive village. 
              Practice real conversations, not flashcards.
            </p>
            <ul className="text-sm text-[#6b5d4d] space-y-1">
              <li>✓ Voice recognition practice</li>
              <li>✓ NPC conversations</li>
              <li>✓ Vocabulary tracking</li>
            </ul>
          </div>

          {/* Fitness - Coming Soon */}
          <div className="bg-white/60 rounded-2xl p-6 shadow-lg border-2 border-[#ebe3d5]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">💪</div>
              <span className="px-3 py-1 bg-[#e8a855] text-white text-xs font-bold rounded-full">
                COMING SOON
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#3d3428] mb-2">Fitness</h3>
            <p className="text-[#6b5d4d] text-sm mb-4">
              Sync with Apple Health to track steps, workouts, and physical activities. 
              Your real exercise = in-game STR and CON.
            </p>
            <ul className="text-sm text-[#9a8b7a] space-y-1">
              <li>◦ Apple Health integration</li>
              <li>◦ Workout logging</li>
              <li>◦ Physical skill trees</li>
            </ul>
          </div>

          {/* Cognitive - Coming Soon */}
          <div className="bg-white/60 rounded-2xl p-6 shadow-lg border-2 border-[#ebe3d5]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">🧠</div>
              <span className="px-3 py-1 bg-[#9b7bb5] text-white text-xs font-bold rounded-full">
                COMING SOON
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#3d3428] mb-2">Cognitive</h3>
            <p className="text-[#6b5d4d] text-sm mb-4">
              Train mental math, memory, logic, and critical thinking through in-game puzzles 
              and real-world challenges.
            </p>
            <ul className="text-sm text-[#9a8b7a] space-y-1">
              <li>◦ Mental math games</li>
              <li>◦ Memory challenges</li>
              <li>◦ Logic puzzles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Anti-Dark-Pattern Section */}
      <section className="bg-[#ebe3d5] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#3d3428] text-center mb-4">
            Playful Growth, No Guilt
          </h2>
          <p className="text-[#6b5d4d] text-center mb-12 max-w-2xl mx-auto">
            We reject dark patterns. XPira is designed to enhance your life, not hijack it.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '🚫', title: 'No Streaks', desc: 'Life happens. Take breaks guilt-free.' },
              { icon: '🔕', title: 'No Push Notifications', desc: "We don't interrupt your real life." },
              { icon: '📊', title: 'No Leaderboards', desc: 'Compete with yesterday-you, not strangers.' },
              { icon: '🎲', title: 'No Loot Boxes', desc: 'Predictable progress, no gambling.' },
              { icon: '⏰', title: 'Session Boundaries', desc: 'Clear endings. Go live your life.' },
              { icon: '📈', title: 'Meaningful XP', desc: 'Numbers reflect real growth.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-[#3d3428] mb-1">{item.title}</h4>
                <p className="text-xs text-[#6b5d4d]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-[#3d3428] mb-4">
          Get Early Access
        </h2>
        <p className="text-[#6b5d4d] mb-8 max-w-xl mx-auto">
          Join our beta to get voice recognition in all browsers, early access to new features, 
          and help shape the future of XPira.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#d4c9b8] focus:border-[#7cb56b] outline-none text-[#3d3428]"
          />
          <button
            onClick={onRequestBeta}
            className="px-6 py-3 bg-[#9b7bb5] hover:bg-[#8a6aa4] text-white font-semibold rounded-xl transition-all hover:scale-105"
          >
            Request Access
          </button>
        </div>
        <p className="text-xs text-[#9a8b7a] mt-3">
          Already have a beta code? <button onClick={onLogin} className="text-[#7cb56b] hover:underline">Log in here</button>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#3d3428] text-white/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-bold text-white">XPira</span>
            <span className="text-sm">• XP for Real Life</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://stats.name" className="hover:text-white transition-colors">stats.name</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
