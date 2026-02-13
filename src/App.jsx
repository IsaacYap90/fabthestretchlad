import { useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/6598778027'

/* ─── NAV ─── */
const Nav = () => (
  <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <a href="#" className="flex items-center gap-2">
        <span className="text-2xl">💆</span>
        <div className="leading-tight">
          <span className="font-black text-red-600 text-3xl tracking-tight">FAB</span>
          <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.15em] block">The Stretch Lad</span>
        </div>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#benefits" className="text-gray-400 hover:text-red-600 transition-colors">Benefits</a>
        <a href="#about" className="text-gray-400 hover:text-red-600 transition-colors">About</a>
        <a href="#book" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all text-xs uppercase tracking-wider">
          Book Now
        </a>
      </div>
    </div>
  </nav>
)

/* ─── HERO ─── */
const Hero = () => (
  <section className="min-h-screen flex items-center pt-20 bg-[#0a0a0a] relative overflow-hidden">
    {/* Subtle bg shapes */}
    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />

    <div className="container mx-auto px-6 max-w-6xl relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left — Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/10 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            <span className="text-red-600 text-xs font-semibold uppercase tracking-widest">Now Booking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-white mb-6">
            Your Body<br />
            <span className="text-red-600">Deserves to</span><br />
            Move Freely.
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
            Professional stretch & mobility therapy for <span className="text-white font-semibold">everyone</span> — athletes, office workers, weekend warriors, and anyone who wants to feel better in their body.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a href="#book" className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-600/10">
              Book Your Session →
            </a>
            <a href="#consult" className="px-7 py-3.5 border border-white/10 hover:border-red-600 text-white font-semibold rounded-full transition-all">
              Free Consultation
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['🏋️', '🧘', '🏃', '💼'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-red-600/20 border-2 border-[#0a0a0a] flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">30+ active clients</span> trust Fab monthly
            </p>
          </div>
        </div>

        {/* Right — Hero Image */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-3xl border border-white/10 overflow-hidden">
            <img src="/images/fab-hero.jpg" alt="Fab performing assisted stretch therapy" className="w-full h-full object-cover" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 left-0 bg-[#1a1a1a] rounded-2xl shadow-xl p-4 border border-white/10">
            <p className="text-red-600 font-black text-2xl">RMT</p>
            <p className="text-gray-400 text-xs">Registered Massage<br/>Therapist</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

/* ─── WHO IS THIS FOR ─── */
const audiences = [
  { emoji: '💼', title: 'Office Workers', desc: 'Fix that desk posture. Release tension in your neck, back, and shoulders.' },
  { emoji: '💻', title: 'Remote Workers', desc: 'Hours on the couch or bed with a laptop? Your hips and spine are paying for it.' },
  { emoji: '🧘', title: 'Seniors & Parents', desc: 'Stay mobile and independent. Gentle stretching tailored to your body.' },
  { emoji: '🏃', title: 'Weekend Warriors', desc: 'Train hard, recover harder. Don\'t let tightness hold you back.' },
  { emoji: '🎯', title: 'Everyone', desc: 'If you have a body, you need to stretch. It\'s that simple.' },
  { emoji: '🏋️', title: 'Athletes', desc: 'Recover faster, prevent injuries, and improve range of motion for peak performance.' },
]

const Benefits = () => (
  <section id="benefits" className="py-24 bg-[#111111]">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Who Is This For?</h2>
        <div className="w-12 h-1 bg-red-600 rounded-full mx-auto mb-4" />
        <p className="text-gray-400 text-lg max-w-lg mx-auto">Everyone needs to stretch. Here's why people come to Fab.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {audiences.map((a, i) => (
          <div key={i} className={`group bg-[#1a1a1a] border border-white/10 hover:border-red-600/30 rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/5 ${i >= 3 ? 'sm:col-span-1 md:col-span-1' : ''}`}>
            <div className="text-3xl mb-4">{a.emoji}</div>
            <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ─── HOW IT WORKS ─── */
const steps = [
  { num: '01', title: 'Book Online', desc: 'Choose your session length and preferred time slot.' },
  { num: '02', title: 'Assessment', desc: 'Fab evaluates your mobility, posture, and problem areas.' },
  { num: '03', title: 'Stretch & Release', desc: 'Targeted assisted stretching tailored to your body\'s needs.' },
  { num: '04', title: 'Move Better', desc: 'Walk out feeling lighter, looser, and more mobile.' },
]

const HowItWorks = () => (
  <section className="py-24 bg-[#0a0a0a]">
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How It Works</h2>
        <div className="w-12 h-1 bg-red-600 rounded-full mx-auto" />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center">
              <span className="text-red-600 font-black text-lg">{s.num}</span>
            </div>
            <h3 className="font-bold text-white mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ─── CTA — CONSULTATION ─── */
const ConsultationCTA = () => (
  <section id="consult" className="py-24 bg-neutral-950">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Every Body Is Different.</h2>
      <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
        Book a free consultation with Fab to get a personalised stretch therapy plan tailored to your needs.
      </p>
      <a
        href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi Fab! I'd like to book a free consultation.")}`}
        target="_blank"
        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-600/10 text-lg"
      >
        Consult Fab via WhatsApp →
      </a>
    </div>
  </section>
)

/* ─── ABOUT FAB ─── */
const AboutFab = () => (
  <section id="about" className="py-24 bg-[#111111]">
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* About Image */}
        <div className="aspect-square rounded-3xl border border-white/10 overflow-hidden">
          <img src="/images/fab-about.jpg" alt="Fabian — The Stretch Lad" className="w-full h-full object-cover object-top" />
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Meet Fab.</h2>
          <div className="w-12 h-1 bg-red-600 rounded-full mb-6" />
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            <span className="text-white font-semibold">Fabian</span> is a stretch trainer, sports massage therapist and mobility coach with a passion for helping people move and feel better. Known as <span className="text-red-600 font-semibold">"The Stretch Lad"</span>, he works with <span className="text-white font-semibold">office professionals, busy parents, seniors, weekend gym-goers</span> and even ONE Championship athletes.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            With a strong foundation in anatomy and physiology, Fab brings a scientific, evidence-based approach to training. His individualized programs address specific areas of tightness or weakness, incorporating dynamic stretching techniques to <span className="text-white font-semibold">improve range of motion and prevent injuries</span>.
          </p>

          <div className="space-y-3">
            {[
              'Trusted by ONE Championship Athletes',
              'Sports Massage Therapist',
              'Mobility & Stretch Coaching',
              'Evidence-Based, Individualized Programs',
              'Trusted by 30+ Active Clients Monthly',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 text-xs">✓</span>
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

/* ─── CTA / BOOKING ─── */
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

const Booking = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', telegram: '', instagram: '',
    description: '', preferred_date: '', preferred_time: '', issue_area: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { supabase } = await import('./lib/supabase.js')
      const bookingData = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        telegram: form.telegram || null,
        instagram: form.instagram || null,
        description: form.description,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        issue_area: form.issue_area || null,
      }
      const { data: insertData, error: insertError } = await supabase.from('fab_bookings').insert(bookingData).select('id').single()
      if (insertError) throw insertError

      const rowId = insertData?.id || ''
      setBookingId(rowId)

      // Trigger instant Telegram notification
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: { ...bookingData, status: 'pending' } }),
      }).catch(() => {})

      // Send confirmation email
      if (bookingData.email) {
        fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bookingData, id: rowId }),
        }).catch(() => {})
      }

      setSubmitted(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 outline-none transition-colors [color-scheme:dark]"
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
      'SUMMARY:Stretch Session with Fab',
      'LOCATION:Singapore',
      `DESCRIPTION:Issue: ${form.issue_area || 'General'}\\n${(form.description || '').replace(/\n/g, '\\n')}`,
      'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'fab-stretch-booking.ics'; a.click()
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
            <span className="text-red-600 text-2xl">✓</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h2>
          {refId && <p className="text-red-600 font-mono text-sm tracking-wider mb-6">Reference: #{refId}</p>}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-500 text-sm">📅 Date</span>
              <span className="text-white text-sm font-semibold">{dateFormatted}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-500 text-sm">⏰ Time</span>
              <span className="text-white text-sm font-semibold">{form.preferred_time || 'To be confirmed'}</span>
            </div>
            {form.issue_area && (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-500 text-sm">🎯 Issue Area</span>
                <span className="text-white text-sm font-semibold">{form.issue_area}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500 text-sm">✏️ Details</span>
              <span className="text-white text-sm font-semibold max-w-[200px] text-right">{form.description.substring(0, 60)}{form.description.length > 60 ? '...' : ''}</span>
            </div>
          </div>

          <p className="text-neutral-400 mb-6">
            You'll hear from Fab within <strong className="text-white">24 hours</strong> to confirm your session.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {form.preferred_date && (
              <button
                onClick={generateICS}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all text-sm"
              >
                📅 Add to Calendar
              </button>
            )}
            <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hi Fab! I just booked a session online. My name is ${form.name}.`)}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all text-sm"
            >
              💬 Message Fab on WhatsApp
            </a>
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
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Move Better?</h2>
            <p className="text-neutral-400 text-base leading-relaxed mb-8">
              Book your first session today. Your body will thank you.
            </p>
            <div className="space-y-4">
              {/* Location removed per Fab's request */}
              <a href="https://www.instagram.com/fab.thestretchlad" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-base">📸</span>
                </div>
                <span className="text-neutral-300 group-hover:text-red-500 text-sm transition-colors">@fab.thestretchlad</span>
              </a>
              <a href="https://www.tiktok.com/@fab.thestretchlad" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-base">🎵</span>
                </div>
                <span className="text-neutral-300 group-hover:text-red-500 text-sm transition-colors">@fab.thestretchlad</span>
              </a>
            </div>
          </div>

          {/* Right — Form */}
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 space-y-4">
            <div>
              <label className={labelClass}>Your Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+65 9xxx xxxx" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Telegram</label>
                <input type="text" name="telegram" value={form.telegram} onChange={handleChange} placeholder="@handle" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Instagram</label>
                <input type="text" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@handle" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Preferred Date</label>
                <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange} placeholder="Select date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Preferred Time</label>
                <select name="preferred_time" value={form.preferred_time} onChange={handleChange} className={inputClass}>
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Issue Area</label>
              <select name="issue_area" value={form.issue_area} onChange={handleChange} className={inputClass}>
                <option value="">What needs work?</option>
                {ISSUE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tell Fab about your issue *</label>
              <textarea name="description" required value={form.description} onChange={handleChange}
                placeholder="E.g. I sit at a desk 8 hours/day and my lower back is killing me..."
                rows={3} className={`${inputClass} resize-none`} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/10"
            >
              {submitting ? 'Submitting...' : '📋 Book Your Session'}
            </button>
          </form>
        </div>

        <div className="pt-12 mt-12 border-t border-white/10 text-center">
          <p className="text-neutral-600 text-xs">© 2026 Fab The Stretch Lad. All rights reserved.</p>
          <p className="text-neutral-500 text-xs mt-2">Developed by <a href="https://isaacyap.ai" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">isaacyap.ai</a></p>
        </div>
      </div>
    </section>
  )
}

/* ─── APP ─── */
function App() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-red-600/20">
      <Nav />
      <Hero />
      <Benefits />
      <HowItWorks />
      <ConsultationCTA />
      <AboutFab />
      <Booking />
    </div>
  )
}

export default App
