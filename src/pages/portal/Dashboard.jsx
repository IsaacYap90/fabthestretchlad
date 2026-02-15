import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_PACKAGE, DEMO_GAMIFICATION, DEMO_BOOKINGS } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import LevelBadge from '../../components/gamification/LevelBadge'
import ProgressBar from '../../components/gamification/ProgressBar'
import StreakCounter from '../../components/gamification/StreakCounter'

export default function PortalDashboard() {
  const { user, profile } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [gam, setGam] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!isSupabaseConfigured()) {
      setPkg(DEMO_PACKAGE)
      setGam(DEMO_GAMIFICATION)
      setBookings(DEMO_BOOKINGS)
      setLoading(false)
      return
    }
    try {
      const [pkgRes, gamRes, bookRes] = await Promise.all([
        supabase.from('client_packages').select('*, packages(*)').eq('client_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('gamification').select('*').eq('client_id', user.id).single(),
        supabase.from('bookings').select('*, session_logs(*)').eq('client_id', user.id).order('date', { ascending: false }).limit(10),
      ])
      setPkg(pkgRes.data)
      setGam(gamRes.data)
      setBookings(bookRes.data || [])
    } catch {}
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>

  const nextSession = bookings.find(b => b.status === 'confirmed')
  const completed = bookings.filter(b => b.status === 'completed')
  const name = profile?.full_name?.split(' ')[0] || 'there'

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const formatTime = (t) => { const [h,m] = t.split(':'); const hr = parseInt(h); return `${hr > 12 ? hr-12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}` }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Welcome back, {name}! 👋</h1>

      {/* Low sessions warning */}
      {pkg && pkg.sessions_remaining <= 2 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-amber-400 font-semibold text-sm">Only {pkg.sessions_remaining} session{pkg.sessions_remaining !== 1 ? 's' : ''} left!</p>
            <p className="text-amber-400/70 text-xs">Contact Fab to top up your package</p>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">📦 Package</p>
          {pkg ? (
            <>
              <p className="text-2xl font-bold text-white">{pkg.sessions_remaining}/{pkg.sessions_total}</p>
              <p className="text-gray-400 text-sm">sessions left</p>
              <Badge variant={pkg.sessions_remaining <= 2 ? 'warning' : 'success'} className="mt-2">{pkg.packages?.name || 'Active'}</Badge>
            </>
          ) : (
            <div>
              <p className="text-gray-400 text-sm">No active package</p>
              <p className="text-gray-500 text-xs mt-1">Contact Fab to purchase</p>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">📅 Next Session</p>
          {nextSession ? (
            <>
              <p className="text-lg font-bold text-white">{formatDate(nextSession.date)}</p>
              <p className="text-red-400 text-sm">{formatTime(nextSession.start_time)}</p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No upcoming sessions</p>
          )}
        </Card>

        <Card>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">🏆 Level</p>
          {gam ? (
            <>
              <LevelBadge totalSessions={gam.total_sessions} />
              <p className="text-gray-500 text-xs mt-1">{gam.total_sessions} sessions total</p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Complete sessions to level up!</p>
          )}
        </Card>
      </div>

      {/* Streak & Progress */}
      {gam && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <StreakCounter current={gam.current_streak} best={gam.best_streak} />
          </div>
          <ProgressBar totalSessions={gam.total_sessions} />
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Link to="/portal/book"><Button>Book a Session</Button></Link>
        <Link to="/portal/progress"><Button variant="secondary">View Progress</Button></Link>
      </div>

      {/* Recent sessions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Recent Sessions</h2>
        {completed.length === 0 ? (
          <Card><p className="text-gray-500 text-sm">No sessions yet. Book your first one!</p></Card>
        ) : (
          <div className="space-y-3">
            {completed.slice(0, 5).map(b => (
              <Card key={b.id} className="!p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{formatDate(b.date)}</p>
                    {b.session_logs?.[0] && (
                      <>
                        <p className="text-gray-400 text-xs mt-1">
                          {b.session_logs[0].areas_worked?.join(', ')}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 italic">
                          "{b.session_logs[0].therapist_notes}"
                        </p>
                      </>
                    )}
                  </div>
                  {b.session_logs?.[0]?.pain_level_before != null && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Pain</p>
                      <p className="text-sm">
                        <span className="text-red-400">{b.session_logs[0].pain_level_before}</span>
                        <span className="text-gray-600 mx-1">→</span>
                        <span className="text-green-400">{b.session_logs[0].pain_level_after}</span>
                      </p>
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
