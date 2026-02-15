import { getLevel } from '../../lib/gamification'

export default function LevelBadge({ totalSessions, size = 'md' }) {
  const level = getLevel(totalSessions)
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className="flex items-center gap-2">
      <span className={sizes[size]}>{level.badge}</span>
      <div>
        <p className={`font-bold ${level.color} ${textSizes[size]}`}>{level.name}</p>
        <p className="text-gray-500 text-xs">Level {level.level}</p>
      </div>
    </div>
  )
}
