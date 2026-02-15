import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_ADMIN_BOOKINGS } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const AREAS = ['Hamstrings', 'Hip Flexors', 'Shoulders', 'Lower Back', 'Upper Back', 'Neck', 'Full Body', 'Calves', 'Quads', 'Glutes']

export default function AdminSessions() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(null) // booking being completed
  const [form, setForm] = useState({ notes: '', areas: [], painBefore: '', painAfter: '', flexScore: '', improvement: '' })
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('confirmed')

  useEffect(() => { loadBookings() }, [])

  const loadBookings = async () => {
    if (!isSupabaseConfigured()) {
      setBookings(DEMO_ADMIN_BOOKINGS)
      setLoading(false)
      return
    }
    const { data } = await supabase.from('bookings').select('*, profiles(full_name), session_logs(*)').order('date', { ascending: false }).limit(50)
    setBookings(data || [])
    setLoading(false)
  }

  const handleComplete = async () => {
    setSubmitting(true)
    if (!isSupabaseConfigured()) {
      await new Promise(r => setTimeout(r, 500))
      setBookings(prev => prev.map(b => b.id === completing.id ? { ...b, status: 'completed' } : b))
      setCompleting(null)
      resetForm()
      setSubmitting(false)
      return
    }

    await supabase.rpc('complete_session', {
      p_booking_id: completing.id,
      p_therapist_notes: form.notes || null,
      p_areas_worked: form.areas.length ? form.areas : null,
      p_improvement_notes: form.improvement || null,
      p_pain_before: form.painBefore ? parseInt(form.painBefore) : null,
      p_pain_after: form.painAfter ? parseInt(form.painAfter) : null,
      p_flexibility_score: form.flexScore ? parseInt(form.flexScore) : null,
    })

    setCompleting(null)
    resetForm()
    setSubmitting(false)
    loadBookings()
  }

  const resetForm = () => setForm({ notes: '', areas: [], painBefore: '', painAfter: '', flexScore: '', improvement: '' })
  const toggleArea = (a) => setForm(f => ({ ...f, areas: f.areas.includes(a) ? f.areas.filter(x => x !== a) : [...f.areas, a] }))

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)
  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const formatTime = (t) => { const [h,m] = t.split(':'); const hr = parseInt(h); return `${hr > 12 ? hr-12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}` }
  const inputClass = "w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none"

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Sessions</h1>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['confirmed', 'completed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-2">
        {filtered.map(b => (
          <Card key={b.id} className="!p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">{b.profiles?.full_name}</p>
                <p className="text-gray-500 text-xs">{formatDate(b.date)} · {formatTime(b.start_time)}</p>
                {b.client_notes && <p className="text-gray-500 text-xs mt-1">Client: "{b.client_notes}"</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={b.status === 'completed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'info'}>
                  {b.status}
                </Badge>
                {b.status === 'confirmed' && (
                  <Button variant="primary" className="!px-3 !py-1.5 !text-xs" onClick={() => { setCompleting(b); resetForm() }}>
                    Complete ✓
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No sessions found</p>}
      </div>

      {/* Complete Session Modal */}
      <Modal open={!!completing} onClose={() => setCompleting(null)} title="Complete Session">
        {completing && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-white font-semibold text-sm">{completing.profiles?.full_name}</p>
              <p className="text-gray-500 text-xs">{formatDate(completing.date)} · {formatTime(completing.start_time)}</p>
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2 block">Areas Worked</label>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(a => (
                  <button
                    key={a}
                    onClick={() => toggleArea(a)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.areas.includes(a) ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Therapist Notes</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                className={`${inputClass} resize-none`} rows={3} placeholder="Session notes..." />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Improvement Notes</label>
              <input value={form.improvement} onChange={e => setForm({...form, improvement: e.target.value})}
                className={inputClass} placeholder="E.g. Hamstring ROM improved 10°" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Pain Before</label>
                <input type="number" min="0" max="10" value={form.painBefore} onChange={e => setForm({...form, painBefore: e.target.value})}
                  className={inputClass} placeholder="0-10" />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Pain After</label>
                <input type="number" min="0" max="10" value={form.painAfter} onChange={e => setForm({...form, painAfter: e.target.value})}
                  className={inputClass} placeholder="0-10" />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Flex Score</label>
                <input type="number" min="0" max="100" value={form.flexScore} onChange={e => setForm({...form, flexScore: e.target.value})}
                  className={inputClass} placeholder="/100" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setCompleting(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleComplete} disabled={submitting} className="flex-1">
                {submitting ? 'Saving...' : 'Complete ✓'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
