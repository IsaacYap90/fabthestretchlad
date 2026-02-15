export default function StreakCounter({ current, best }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className={`text-lg ${current >= 4 ? 'animate-pulse' : ''}`}>🔥</span>
        <span className="text-white font-bold text-sm">{current} week{current !== 1 ? 's' : ''}</span>
      </div>
      <div className="text-gray-500 text-xs">Best: {best} week{best !== 1 ? 's' : ''}</div>
    </div>
  )
}
