import { MILESTONES_DEF } from '../../lib/gamification'

export default function Milestones({ achieved = [], totalSessions }) {
  const achievedNames = achieved.map(m => m.name)

  return (
    <div className="space-y-3">
      {MILESTONES_DEF.map((m) => {
        const done = achievedNames.some(n => n.startsWith(m.name.split(' ')[0]))
        const achievedItem = achieved.find(a => a.name.startsWith(m.name.split(' ')[0]))
        const remaining = m.sessions - totalSessions

        return (
          <div key={m.name} className={`flex items-center justify-between p-3 rounded-xl ${done ? 'bg-white/5' : 'bg-white/[0.02]'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-lg ${done ? '' : 'opacity-30 grayscale'}`}>{m.name.split(' ').pop()}</span>
              <span className={`text-sm ${done ? 'text-white font-semibold' : 'text-gray-500'}`}>
                {m.name.split(' ').slice(0, -1).join(' ')}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {done ? achievedItem?.achieved_at : remaining > 0 ? `${remaining} to go` : 'Ready!'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
