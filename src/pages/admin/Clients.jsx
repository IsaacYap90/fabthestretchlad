import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_CLIENTS } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { getLevel } from '../../lib/gamification'

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadClients = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setClients(DEMO_CLIENTS)
      setLoading(false)
      return
    }
    const { data } = await supabase.from('profiles').select('*, client_packages(*), gamification(*)').eq('role', 'client').order('full_name')
    setClients(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadClients() // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadClients])

  const filtered = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <span className="text-gray-500 text-sm">{clients.length} total</span>
      </div>

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none"
        placeholder="Search clients..."
      />

      <div className="space-y-2">
        {filtered.map(c => {
          const activePkg = c.client_packages?.find(p => p.status === 'active')
          const gam = c.gamification?.[0]
          const level = gam ? getLevel(gam.total_sessions) : null

          return (
            <Link key={c.id} to={`/admin/clients/${c.id}`}>
              <Card className="!p-4 hover:border-red-600/30 transition-colors cursor-pointer flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{c.full_name}</p>
                  <p className="text-gray-500 text-xs">{c.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {level && <span className="text-sm">{level.badge}</span>}
                  {activePkg ? (
                    <Badge variant={activePkg.sessions_remaining <= 2 ? 'warning' : 'success'}>
                      {activePkg.sessions_remaining}/{activePkg.sessions_total}
                    </Badge>
                  ) : (
                    <Badge variant="default">No pkg</Badge>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No clients found</p>}
      </div>
    </div>
  )
}
