import { usePlayerStore } from '../core/stores';

export function StatsPanel() {
  const { stats } = usePlayerStore();

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );

  const xpPercent = (stats.experience / stats.experienceToNextLevel) * 100;

  return (
    <div className="stats-panel text-white text-sm">
      {/* Level and XP */}
      <div className="mb-3 pb-2 border-b border-gray-600">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg">Level {stats.level}</span>
          <span className="text-yellow-400">🪙 {stats.coins}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-purple-500 transition-all duration-300"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 text-right">
          {stats.experience} / {stats.experienceToNextLevel} XP
        </div>
      </div>

      {/* Language Skills */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Language Skills</div>
        <StatBar label="📚 Vocabulary" value={stats.vocabulary} color="#22c55e" />
        <StatBar label="🎤 Pronunciation" value={stats.pronunciation} color="#3b82f6" />
        <StatBar label="👂 Comprehension" value={stats.comprehension} color="#f59e0b" />
        <StatBar label="📝 Grammar" value={stats.grammar} color="#8b5cf6" />
      </div>

      {/* RPG Stats */}
      <div>
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Character</div>
        <StatBar label="💪 Confidence" value={stats.confidence} color="#ef4444" />
        <StatBar label="⭐ Reputation" value={stats.reputation} color="#fbbf24" />
      </div>
    </div>
  );
}
