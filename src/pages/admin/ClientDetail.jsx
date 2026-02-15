import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_CLIENTS, DEMO_BOOKINGS, DEMO_PACKAGES_LIST } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import LevelBadge from '../../components/gamification/LevelBadge'
import ProgressBar from '../../components/gamification/ProgressBar'
import StreakCounter from '../../components/gamification/StreakCounter'

export default function ClientDetail() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showActivate, setShowActivate] = useState(false)
  const [packages, setPackages] = useState([])
  const [selectedPkg, setSelectedPkg] = useState('')
  const [activating, setActivating] = useState(false)

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    if (!isSupabaseConfigured()) {
      const c = DEMO_CLIENTS.find(c => c.id === id) || DEMO_CLIENTS[0]
      setClient(c)
      setBookings(DEMO_BOOKINGS)
      setPackages(DEMO_PACKAGES_LIST)
      setLoading(false)
      return
    }
    const [profileRes, bookingsRes, pkgRes] = await Promise.all([
      supabase.from('profiles').select('*, client_packages(*, packages(*)), gamification(*)').eq('id', id).single(),
      supabase.from('bookings').select('*, session_logs(*)').eq('client_id', id).order('date', { ascending: false }),
      supabase.from('packages').select('*').eq('is_active', true),
    ])
    setClient(profileRes.data)
    setBookings(bookingsRes.data || [])
    setPackages(pkgRes.data || [])
    setLoading(false)
  }

  const handleActivate = async () => {
    if (!selectedPkg) return
    setActivating(true)
    const pkg = packages.find(p => p.id === selectedPkg)
    if (!isSupabaseConfigured()) {
      await new Promise(r => setTimeout(r, 500))
      setShowActivate(false)
      setActivating(false)
      return
    }
    const expiresAt = new Date(Date.now() + pkg.validity_days * 86400000).toISOString()
    await supabase.from('client_packages').insert({
      client_id: id, package_id: pkg.id, sessions_total: pkg.sessions_total,
      sessions_remaining: pkg.sessions_total, status: 'active',
      activated_at: new Date().toISOString(), expires_at: expiresAt,
    })
    setShowActivate(false)
    setActivating(false)
    loadData()
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!client) return <p className="text-gray-500">Client not found</p>

  const activePkg = client.client_packages?.find(p => p.status === 'active')
  const gam = client.gamification?.[0]
  const completed = bookings.filter(b => b.status === 'completed')
  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/clients" className="text-gray-500 hover:text-white">←</Link>
        <h1 className="text-2xl font-bold text-white">{client.full_name}</h1>
      </div>

      {/* Info */}
      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-500 text-xs">Email</p><p className="text-white">{client.email}</p></div>
          <div><p className="text-gray-500 text-xs">Phone</p><p className="text-white">{client.phone || '—'}</p></div>
        </div>
      </Card>

      {/* Package */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Package</h2>
        <Button variant="secondary" onClick={() => setShowActivate(true)}>+ Activate Package</Button>
      </div>
      {activePkg ? (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{activePkg.packages?.name || 'Active Package'}</p>
              <p className="text-gray-500 text-sm">{activePkg.sessions_remaining}/{activePkg.sessions_total} sessions remaining</p>
            </div>
            <Badge variant={activePkg.sessions_remaining <= 2 ? 'warning' : 'success'}>{activePkg.status}</Badge>
          </div>
          <div className="mt-3 w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${(activePkg.sessions_used / activePkg.sessions_total) * 100}%` }} />
          </div>
        </Card>
      ) : (
        <Card><p className="text-gray-500 text-sm">No active package</p></Card>
      )}

      {/* Gamification */}
      {gam && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <LevelBadge totalSessions={gam.total_sessions} />
            <StreakCounter current={gam.current_streak} best={gam.best_streak} />
          </div>
          <ProgressBar totalSessions={gam.total_sessions} />
        </Card>
      )}

      {/* Session History */}
      <h2 className="text-lg font-bold text-white">Sessions ({completed.length})</h2>
      <div className="space-y-2">
        {completed.slice(0, 10).map(b => (
          <Card key={b.id} className="!p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-sm font-semibold">{formatDate(b.date)}</p>
                {b.session_logs?.[0] && (
                  <>
                    <p className="text-gray-400 text-xs mt-1">{b.session_logs[0].areas_worked?.join(', ')}</p>
                    {b.session_logs[0].therapist_notes && (
                      <p className="text-gray-500 text-xs mt-1 italic">"{b.session_logs[0].therapist_notes}"</p>
                    )}
                  </>
                )}
              </div>
              {b.session_logs?.[0]?.pain_level_before != null && (
                <span className="text-xs">
                  <span className="text-red-400">{b.session_logs[0].pain_level_before}</span>
                  →
                  <span className="text-green-400">{b.session_logs[0].pain_level_after}</span>
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Activate Package Modal */}
      <Modal open={showActivate} onClose={() => setShowActivate(false)} title="Activate Package">
        <div className="space-y-3">
          {packages.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPkg(p.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${selectedPkg === p.id ? 'bg-red-600/20 border border-red-600' : 'bg-white/5 border border-transparent hover:border-white/20'}`}
            >
              <p className="text-white font-semibold text-sm">{p.name}</p>
              <p className="text-gray-400 text-xs">{p.sessions_total} sessions · RM {p.price} · {p.validity_days} days</p>
            </button>
          ))}
          <Button onClick={handleActivate} disabled={!selectedPkg || activating} className="w-full mt-4">
            {activating ? 'Activating...' : 'Activate'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
