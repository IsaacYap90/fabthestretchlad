export const LEVELS = [
  { level: 1, name: 'Beginner', badge: '🌱', color: 'text-green-500', bg: 'bg-green-500', min: 1, max: 5 },
  { level: 2, name: 'Regular', badge: '⭐', color: 'text-blue-500', bg: 'bg-blue-500', min: 6, max: 15 },
  { level: 3, name: 'Committed', badge: '🔥', color: 'text-orange-500', bg: 'bg-orange-500', min: 16, max: 30 },
  { level: 4, name: 'Athlete', badge: '💪', color: 'text-red-500', bg: 'bg-red-500', min: 31, max: 50 },
  { level: 5, name: 'Legend', badge: '🏆', color: 'text-yellow-500', bg: 'bg-yellow-500', min: 51, max: Infinity },
]

export function getLevel(totalSessions) {
  if (totalSessions >= 51) return LEVELS[4]
  if (totalSessions >= 31) return LEVELS[3]
  if (totalSessions >= 16) return LEVELS[2]
  if (totalSessions >= 6) return LEVELS[1]
  return LEVELS[0]
}

export function getLevelProgress(totalSessions) {
  const current = getLevel(totalSessions)
  if (current.level === 5) return { current, next: null, progress: 100, remaining: 0 }
  const next = LEVELS[current.level]
  const inLevel = totalSessions - current.min + 1
  const levelRange = next.min - current.min
  const progress = Math.min(100, Math.round((inLevel / levelRange) * 100))
  return { current, next, progress, remaining: next.min - totalSessions }
}

export const MILESTONES_DEF = [
  { name: 'First Session! 🎉', sessions: 1 },
  { name: 'Getting Started 🌟', sessions: 5 },
  { name: 'Double Digits 💪', sessions: 10 },
  { name: 'Quarter Century 🔥', sessions: 25 },
  { name: 'Half Century 🏆', sessions: 50 },
  { name: 'Century Club 💎', sessions: 100 },
]
