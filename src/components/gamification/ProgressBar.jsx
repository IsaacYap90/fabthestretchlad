import { getLevelProgress } from '../../lib/gamification'

export default function ProgressBar({ totalSessions }) {
  const { current, next, progress, remaining } = getLevelProgress(totalSessions)

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-semibold ${current.color}`}>{current.badge} {current.name}</span>
        {next && <span className="text-xs text-gray-500">{remaining} to {next.name}</span>}
      </div>
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${current.bg} rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {!next && <p className="text-xs text-yellow-500 mt-1">🏆 Max level achieved!</p>}
    </div>
  )
}
