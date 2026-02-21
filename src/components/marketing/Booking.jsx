import { useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/6598778027'

const TIME_SLOTS = [
  '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
  '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
  '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00',
]

const ISSUE_AREAS = [
  'Neck & Shoulders', 'Upper Back', 'Lower Back', 'Hips & Glutes',
  'Hamstrings', 'Full Body', 'Sports Recovery', 'Posture Correction', 'Other',
]

const TODAY = new Date().toISOString().split('T')[0]

export default function Booking() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', telegram: '', instagram: '',
    description: '', preferred_date: '', preferred_time: '', issue_area: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { supabase } = await import('../../lib/supabase.js')
      if (!supabase) throw new Error('Booking system offline. Please contact Fab via WhatsApp.')
      const bookingData = {
        name: form.name, email: form.email || null, phone: form.phone || null,
        telegram: form.telegram || null, instagram: form.instagram || null,
        description: form.description, preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null, issue_area: form.issue_area || null,
      }
      const { data: insertData, error: insertError } = await supabase.from('fab_bookings').insert(bookingData).select('id').single()
      if (insertError) throw insertError
      const rowId = insertData?.id || ''
      setBookingId(rowId)

      const apiHeaders = { 'Content-Type': 'application/json' }
      fetch('/api/notify', { method: 'POST', headers: apiHeaders, body: JSON.stringify({ record: { ...bookingData, status: 'pending' } }) }).catch(() => {})
      if (bookingData.email) fetch('/api/send-confirmation', { method: 'POST', headers: apiHeaders, body: JSON.stringify({ ...bookingData, id: rowId }) }).catch(() => {})
      setSubmitted(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally { setSubmitting(false) }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 outline-none focus-visible:ring-2 focus-visible:ring-red-600/50 transition-colors [color-scheme:dark]"
  const labelClass = "text-neutral-400 text-xs uppercase tracking-widest font-semibold mb-2 block"

  const generateICS = () => {
    const date = (form.preferred_date || '').replace(/-/g, '')
    const time = form.preferred_time || ''
    const startMatch = time.match(/^(\d{2}):(\d{2})/)
    const endMatch = time.match(/(\d{2}):(\d{2})$/)
    let dtStart = date + 'T090000'
    let dtEnd = date + 'T100000'
    if (startMatch) dtStart = date + `T${startMatch[1]}${startMatch[2]}00`
    if (endMatch) dtEnd = date + `T${endMatch[1]}${endMatch[2]}00`
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FabTheStretchLad//Booking//EN',
      'BEGIN:VEVENT', `UID:${bookingId}@fabthestretchlad.com`,
      `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
      'SUMMARY:Stretch Session with Fab', 'LOCATION:Singapore',
      `DESCRIPTION:Issue: ${form.issue_area || 'General'}\\n${(form.description || '').replace(/\n/g, '\\n')}`,
      'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'fab-stretch-booking.ics'; a.click()
    URL.revokeObjectURL(url)
  }

  if (submitted) {
    const refId = bookingId.substring(0, 8).toUpperCase()
    const dateFormatted = form.preferred_date
      ? new Date(form.preferred_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : 'To be confirmed'

    return (
      <section id="book" className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.1)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-6 max-w-2xl relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-red-600 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-2xl" aria-hidden="true">✓</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Booking Submitted!</h2>
          <p className="text-neutral-400 text-sm mb-2">Fab will review and confirm your session within 24 hours.</p>
          {refId && <p className="text-red-600 font-mono text-sm tracking-wider mb-6">Reference: #{refId}</p>}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-500 text-sm">Date</span>
              <span className="text-white text-sm font-semibold">{dateFormatted}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-500 text-sm">Time</span>
              <span className="text-white text-sm font-semibold">{form.preferred_time || 'To be confirmed'}</span>
            </div>
            {form.issue_area && <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-neutral-500 text-sm">Issue Area</span><span className="text-white text-sm font-semibold">{form.issue_area}</span></div>}
            <div className="flex justify-between">
              <span className="text-neutral-500 text-sm">Details</span>
              <span className="text-white text-sm font-semibold max-w-[200px] text-right">{form.description.substring(0, 60)}{form.description.length > 60 ? '...' : ''}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {form.preferred_date && <button onClick={generateICS} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all text-sm focus-visible:ring-2 focus-visible:ring-red-400">Add to Calendar</button>}
            <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi Fab! I just booked a session online. My name is ${form.name}.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all text-sm focus-visible:ring-2 focus-visible:ring-green-400">Message Fab on WhatsApp</a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="book" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.1)_0%,_transparent_60%)]" />
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Move Better?</h2>
            <p className="text-neutral-400 text-base leading-relaxed mb-8">Book your first session today. Your body will thank you.</p>
            <div className="space-y-4">
              <a href="https://www.instagram.com/fab.thestretchlad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center"><span className="text-base" aria-hidden="true">📸</span></div>
                <span className="text-neutral-300 group-hover:text-red-500 text-sm transition-colors">@fab.thestretchlad</span>
              </a>
              <a href="https://www.tiktok.com/@fab.thestretchlad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center"><span className="text-base" aria-hidden="true">🎵</span></div>
                <span className="text-neutral-300 group-hover:text-red-500 text-sm transition-colors">@fab.thestretchlad</span>
              </a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 space-y-4">
            <div>
              <label htmlFor="booking-name" className={labelClass}>Your Name *</label>
              <input id="booking-name" type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-phone" className={labelClass}>Phone</label>
                <input id="booking-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+65 9xxx xxxx" className={inputClass} />
              </div>
              <div>
                <label htmlFor="booking-email" className={labelClass}>Email</label>
                <input id="booking-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-telegram" className={labelClass}>Telegram</label>
                <input id="booking-telegram" type="text" name="telegram" value={form.telegram} onChange={handleChange} placeholder="@handle" className={inputClass} />
              </div>
              <div>
                <label htmlFor="booking-instagram" className={labelClass}>Instagram</label>
                <input id="booking-instagram" type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@handle" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-date" className={labelClass}>Preferred Date</label>
                <input id="booking-date" type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange} min={TODAY} className={inputClass} />
              </div>
              <div>
                <label htmlFor="booking-time" className={labelClass}>Preferred Time</label>
                <select id="booking-time" name="preferred_time" value={form.preferred_time} onChange={handleChange} className={inputClass}>
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="booking-issue" className={labelClass}>Issue Area</label>
              <select id="booking-issue" name="issue_area" value={form.issue_area} onChange={handleChange} className={inputClass}>
                <option value="">What needs work?</option>
                {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="booking-desc" className={labelClass}>Tell Fab about your issue *</label>
              <textarea id="booking-desc" name="description" required value={form.description} onChange={handleChange} placeholder="E.g. I sit at a desk 8 hours/day and my lower back is killing me..." rows={3} className={`${inputClass} resize-none`} />
            </div>
            {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 focus-visible:ring-2 focus-visible:ring-red-400">
              {submitting ? 'Submitting...' : 'Book Your Session'}
            </button>
          </form>
        </div>
        <div className="pt-12 mt-12 border-t border-white/10 text-center">
          <p className="text-neutral-600 text-xs">&copy; 2026 Fab The Stretch Lad. All rights reserved.</p>
          <p className="text-neutral-500 text-xs mt-2">Developed by <a href="https://isaacyap.ai" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">isaacyap.ai</a></p>
        </div>
      </div>
    </section>
  )
}
