import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import Button from '../components/ui/Button'

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    const { error: err } = await signUp(form.email, form.password, form.fullName, form.phone)
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate('/login')
  }

  const inputClass = "w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none focus-visible:ring-2 focus-visible:ring-red-600/50 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-black text-red-600 text-4xl tracking-tight">FAB</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-[0.15em] block">The Stretch Lad</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Fab's client portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#171717] border border-[#262626] rounded-2xl p-6 space-y-4">
          {!isSupabaseConfigured() && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-400 text-xs">
              Signup requires Supabase. Use demo accounts on the login page.
            </div>
          )}

          <div>
            <label htmlFor="signup-name" className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Full Name *</label>
            <input id="signup-name" type="text" required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
              className={inputClass} placeholder="John Doe" />
          </div>

          <div>
            <label htmlFor="signup-email" className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Email *</label>
            <input id="signup-email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className={inputClass} placeholder="you@email.com" />
          </div>

          <div>
            <label htmlFor="signup-phone" className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Phone</label>
            <input id="signup-phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className={inputClass} placeholder="+60 12 345 6789" />
          </div>

          <div>
            <label htmlFor="signup-password" className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Password *</label>
            <input id="signup-password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className={inputClass} placeholder="Min 6 characters" />
          </div>

          <div>
            <label htmlFor="signup-confirm" className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Confirm Password *</label>
            <input id="signup-confirm" type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
              className={inputClass} placeholder="Repeat password" />
          </div>

          {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}

          <Button type="submit" disabled={loading || !isSupabaseConfigured()} className="w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-red-500 hover:text-red-400">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
