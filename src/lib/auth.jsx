import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({})

// Demo data when Supabase isn't connected
const DEMO_USERS = {
  'demo@client.com': {
    id: 'demo-client-id',
    email: 'demo@client.com',
    user_metadata: { full_name: 'Demo Client' },
  },
  'demo@admin.com': {
    id: 'demo-admin-id',
    email: 'demo@admin.com',
    user_metadata: { full_name: 'Fab (Admin)' },
  },
}

const DEMO_PROFILES = {
  'demo-client-id': { id: 'demo-client-id', full_name: 'Demo Client', email: 'demo@client.com', phone: '+60123456789', role: 'client' },
  'demo-admin-id': { id: 'demo-admin-id', full_name: 'Fab (Admin)', email: 'demo@admin.com', phone: '+6598778027', role: 'admin' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    if (!isSupabaseConfigured()) {
      setProfile(DEMO_PROFILES[userId] || null)
      return DEMO_PROFILES[userId] || null
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    return data
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      const demoUser = DEMO_USERS[email]
      if (demoUser && password === 'demo123') {
        setUser(demoUser)
        await fetchProfile(demoUser.id)
        return { data: { user: demoUser }, error: null }
      }
      return { data: null, error: { message: 'Invalid credentials. Try demo@client.com / demo123' } }
    }
    const result = await supabase.auth.signInWithPassword({ email, password })
    return result
  }

  const signUp = async (email, password, fullName, phone) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase not configured. Use demo accounts.' } }
    }
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    })
    return result
  }

  const signOut = async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
