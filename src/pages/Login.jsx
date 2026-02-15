import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import Button from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await signIn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    // Navigate after profile loads
    setTimeout(() => navigate('/portal'), 100)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-black text-red-600 text-4xl tracking-tight">FAB</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-[0.15em] block">The Stretch Lad</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#171717] border border-[#262626] rounded-2xl p-6 space-y-4">
          {!isSupabaseConfigured() && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-400 text-xs">
              <p className="font-semibold mb-1">Demo Mode</p>
              <p>Supabase not connected. Use:</p>
              <p className="font-mono mt-1">demo@client.com / demo123</p>
              <p className="font-mono">demo@admin.com / demo123</p>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1.5 block">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-[#262626] focus:border-red-600/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account? <Link to="/signup" className="text-red-500 hover:text-red-400">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
