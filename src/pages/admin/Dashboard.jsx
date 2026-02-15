import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_ADMIN_BOOKINGS, DEMO_CLIENTS } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function AdminDashboard() {
  const [todayBookings, setTodayBookings] = useState([])
  const [lowSessionClients, setLowSessionClients] = useState([])
  const [stats, setStats] = useState({ activeClients: 0, thisMonth: 0, thisWeek: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const today = new Date().toISOString().split('T')[0]

    if (!isSupabaseConfigured()) {
      setTodayBookings(DEMO_ADMIN_BOOKINGS)
      setLowSessionClients(DEMO_CLIENTS.filter(c => c.client_packages?.[0]?.sessions_remaining <= 2))
      setStats({ activeClients: DEMO_CLIENTS.length, thisMonth: 28, thisWeek: 8 })
      setLoading(false)
      return
    }

    try {
      const [bookRes, clientsRes] = await Promise.all([
        supabase.from('bookings').select('*, profiles(full_name)').eq('date', today).in('status', ['confirmed', 'completed']).order('start_time'),
        supabase.from('client_packages').select('*, profiles(full_name)').eq('status', 'active').lte('sessions_remaining', 2),
      ])
      setTodayBookings(bookRes.data || [])
      setLowSessionClients((clientsRes.data || []).map(cp => ({ ...cp.profiles, sessions_remaining: cp.sessions_remaining })))

      // Stats
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0]
      const [activeRes, monthRes, weekRes] = await Promise.all([
        supabase.from('client_packages').select('client_id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('bookings').select('id', { count: 'exact' }).gte('date', monthStart).eq('status', 'completed'),
        supabase.from('bookings').select('id', { count: 'exact' }).gte('date', weekStart).eq('status', 'completed'),
      ])
      setStats({
        activeClients: activeRes.count || 0,
        thisMonth: monthRes.count || 0,
        thisWeek: weekRes.count || 0,
      })
    } catch {}
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>

  const formatTime = (t) => { const [h,m] = t.split(':'); const hr = parseInt(h); return `${hr > 12 ? hr-12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}` }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-white">{stats.activeClients}</p>
          <p className="text-gray-500 text-xs mt-1">Active Clients</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-white">{stats.thisMonth}</p>
          <p className="text-gray-500 text-xs mt-1">This Month</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-white">{stats.thisWeek}</p>
          <p className="text-gray-500 text-xs mt-1">This Week</p>
        </Card>
      </div>

      {/* Today's Bookings */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Today's Bookings ({todayBookings.length})</h2>
        {todayBookings.length === 0 ? (
          <Card><p className="text-gray-500 text-sm">No bookings today</p></Card>
        ) : (
          <div className="space-y-2">
            {todayBookings.map(b => (
              <Card key={b.id} className="!p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-red-400 font-mono text-sm w-20">{formatTime(b.start_time)}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{b.profiles?.full_name}</p>
                    {b.client_notes && <p className="text-gray-500 text-xs">{b.client_notes}</p>}
                  </div>
                </div>
                <Badge variant={b.status === 'completed' ? 'success' : 'info'}>{b.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Low Sessions Alert */}
      {lowSessionClients.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">⚠️ Low Sessions</h2>
          <div className="space-y-2">
            {lowSessionClients.map((c, i) => (
              <Card key={i} className="!p-4 flex items-center justify-between">
                <p className="text-white text-sm">{c.full_name || c.profiles?.full_name}</p>
                <Badge variant="warning">{c.sessions_remaining || c.client_packages?.[0]?.sessions_remaining} left</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link to="/admin/clients" className="flex-1">
          <Card className="text-center hover:border-red-600/30 transition-colors cursor-pointer">
            <span className="text-2xl">👥</span>
            <p className="text-white font-semibold text-sm mt-2">Clients</p>
          </Card>
        </Link>
        <Link to="/admin/sessions" className="flex-1">
          <Card className="text-center hover:border-red-600/30 transition-colors cursor-pointer">
            <span className="text-2xl">📋</span>
            <p className="text-white font-semibold text-sm mt-2">Sessions</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
