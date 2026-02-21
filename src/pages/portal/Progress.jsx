import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_GAMIFICATION, DEMO_BOOKINGS } from '../../lib/demo-data'
import { formatDateLong } from '../../lib/format'
import Card from '../../components/ui/Card'
import LevelBadge from '../../components/gamification/LevelBadge'
import ProgressBar from '../../components/gamification/ProgressBar'
import StreakCounter from '../../components/gamification/StreakCounter'
import Milestones from '../../components/gamification/Milestones'

export default function Progress() {
  const { user } = useAuth()
  const [gam, setGam] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setGam(DEMO_GAMIFICATION)
      setSessions(DEMO_BOOKINGS.filter(b => b.status === 'completed'))
      setLoading(false)
      return
    }
    const [gamRes, sessRes] = await Promise.all([
      supabase.from('gamification').select('*').eq('client_id', user.id).single(),
      supabase.from('bookings').select('*, session_logs(*)').eq('client_id', user.id).eq('status', 'completed').order('date', { ascending: false }),
    ])
    setGam(gamRes.data)
    setSessions(sessRes.data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadData() // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadData])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>

  // Pain chart data
  const painData = sessions.filter(s => s.session_logs?.[0]?.pain_level_before != null).reverse()
  const maxPain = 10

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Progress</h1>

      {/* Level & Streak */}
      {gam && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <LevelBadge totalSessions={gam.total_sessions} size="lg" />
            <div className="text-right">
              <p className="text-gray-500 text-xs">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{gam.total_sessions}</p>
            </div>
          </div>
          <ProgressBar totalSessions={gam.total_sessions} />
          <div className="mt-4 pt-4 border-t border-[#262626]">
            <StreakCounter current={gam.current_streak} best={gam.best_streak} />
          </div>
        </Card>
      )}

      {/* Milestones */}
      {gam && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Milestones</h2>
          <Card>
            <Milestones achieved={gam.milestones || []} totalSessions={gam.total_sessions} />
          </Card>
        </div>
      )}

      {/* Pain Chart */}
      {painData.length > 1 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Pain Level Over Time</h2>
          <Card>
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-gray-500">
                <span>10</span><span>5</span><span>0</span>
              </div>
              <div className="ml-10 h-full flex items-end gap-1">
                {painData.map((s, i) => {
                  const log = s.session_logs[0]
                  const beforeH = (log.pain_level_before / maxPain) * 100
                  const afterH = (log.pain_level_after / maxPain) * 100
                  return (
                    <div key={i} className="flex-1 flex gap-0.5 items-end" title={formatDateLong(s.date)}>
                      <div className="flex-1 bg-red-500/60 rounded-t" style={{ height: `${beforeH}%` }} />
                      <div className="flex-1 bg-green-500/60 rounded-t" style={{ height: `${afterH}%` }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-4 mt-2 justify-center text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/60" /> Before</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/60" /> After</span>
            </div>
          </Card>
        </div>
      )}

      {/* Session History */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Session History</h2>
        {sessions.length === 0 ? (
          <Card><p className="text-gray-500 text-sm">No sessions yet.</p></Card>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <Card key={s.id} className="!p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{formatDateLong(s.date)}</p>
                    {s.session_logs?.[0] && (
                      <>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.session_logs[0].areas_worked?.map(a => (
                            <span key={a} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                        </div>
                        {s.session_logs[0].therapist_notes && (
                          <p className="text-gray-500 text-xs mt-2 italic">"{s.session_logs[0].therapist_notes}"</p>
                        )}
                      </>
                    )}
                  </div>
                  {s.session_logs?.[0]?.pain_level_before != null && (
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-500">Pain</p>
                      <p className="text-sm font-mono">
                        <span className="text-red-400">{s.session_logs[0].pain_level_before}</span>
                        <span className="text-gray-600 mx-1">→</span>
                        <span className="text-green-400">{s.session_logs[0].pain_level_after}</span>
                      </p>
                      {s.session_logs[0].flexibility_score && (
                        <p className="text-xs text-gray-500 mt-1">Flex: {s.session_logs[0].flexibility_score}/100</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
