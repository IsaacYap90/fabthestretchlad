import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { DEMO_SLOTS, DEMO_PACKAGE } from '../../lib/demo-data'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Calendar from '../../components/booking/Calendar'
import TimeSlots from '../../components/booking/TimeSlots'

export default function BookSession() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [slots, setSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [pkg, setPkg] = useState(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPackage()
    loadSlots()
  }, [])

  useEffect(() => {
    if (selectedDate) loadBookedSlots(selectedDate)
  }, [selectedDate])

  const loadPackage = async () => {
    if (!isSupabaseConfigured()) { setPkg(DEMO_PACKAGE); return }
    const { data } = await supabase.from('client_packages').select('*, packages(*)').eq('client_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single()
    setPkg(data)
  }

  const loadSlots = async () => {
    if (!isSupabaseConfigured()) { setSlots(DEMO_SLOTS); return }
    const { data } = await supabase.from('available_slots').select('*').eq('is_available', true)
    setSlots(data || [])
  }

  const loadBookedSlots = async (date) => {
    if (!isSupabaseConfigured()) { setBookedSlots([]); return }
    const { data } = await supabase.from('bookings').select('start_time, end_time').eq('date', date).in('status', ['confirmed'])
    setBookedSlots(data || [])
  }

  const getSlotsForDate = () => {
    if (!selectedDate) return []
    const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay()
    return slots.filter(s => s.day_of_week === dayOfWeek).sort((a,b) => a.start_time.localeCompare(b.start_time))
  }

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) return
    setSubmitting(true)
    setError('')

    if (!isSupabaseConfigured()) {
      await new Promise(r => setTimeout(r, 800))
      setSuccess(true)
      setSubmitting(false)
      return
    }

    try {
      const { error: err } = await supabase.from('bookings').insert({
        client_id: user.id,
        client_package_id: pkg?.id,
        date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        client_notes: notes || null,
      })
      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formatTime = (t) => { const [h,m] = t.split(':'); const hr = parseInt(h); return `${hr > 12 ? hr-12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}` }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 border-2 border-green-500 rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Session Booked!</h2>
        <p className="text-gray-400 mb-2">{formatDate(selectedDate)}</p>
        <p className="text-red-400 font-semibold">{formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}</p>
        <div className="flex gap-3 justify-center mt-8">
          <Button onClick={() => navigate('/portal')}>Back to Dashboard</Button>
          <Button variant="secondary" onClick={() => { setSuccess(false); setSelectedDate(null); setSelectedSlot(null); setNotes('') }}>Book Another</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Book a Session</h1>
        {pkg && <p className="text-gray-400 text-sm">{pkg.sessions_remaining}/{pkg.sessions_total} sessions remaining</p>}
      </div>

      {!pkg && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-400 text-sm">No active package. Contact Fab to purchase one before booking.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-white font-semibold mb-4">Select Date</h3>
          <Calendar selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null) }} />
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-4">
            {selectedDate ? `Available Times — ${formatDate(selectedDate)}` : 'Select a date first'}
          </h3>
          {selectedDate ? (
            <TimeSlots slots={getSlotsForDate()} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} bookedSlots={bookedSlots} />
          ) : (
            <p className="text-gray-500 text-sm">Pick a date on the calendar to see available time slots</p>
          )}
        </Card>
      </div>

      {selectedSlot && (
        <Card>
          <h3 className="text-white font-semibold mb-3">Confirm Booking</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="text-white text-sm font-semibold">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Time</p>
              <p className="text-white text-sm font-semibold">{formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
              rows={2} placeholder="E.g. Focus on hip flexors today"
            />
          </div>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button onClick={handleBook} disabled={submitting} className="w-full">
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </Card>
      )}
    </div>
  )
}
