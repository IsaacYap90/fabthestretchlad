import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function Nav() {
  const { user, profile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-white font-black text-lg tracking-tight uppercase">FAB <span className="text-red-600">THE STRETCH LAD</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="/#benefits" className="text-gray-400 hover:text-red-600 transition-colors">Benefits</a>
          <a href="/#about" className="text-gray-400 hover:text-red-600 transition-colors">About</a>
          <a href="/#book" className="text-gray-400 hover:text-red-600 transition-colors">Book</a>
          {user ? (
            <Link
              to={profile?.role === 'admin' ? '/admin' : '/portal'}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all text-xs uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              My Portal
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all text-xs uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              Login
            </Link>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden text-gray-400 hover:text-white p-2 focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md px-6 py-4 space-y-3">
          <a href="/#benefits" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-red-600 transition-colors text-sm">Benefits</a>
          <a href="/#about" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-red-600 transition-colors text-sm">About</a>
          <a href="/#book" onClick={() => setMenuOpen(false)} className="block text-gray-400 hover:text-red-600 transition-colors text-sm">Book</a>
          {user ? (
            <Link to={profile?.role === 'admin' ? '/admin' : '/portal'} onClick={() => setMenuOpen(false)} className="block text-red-500 font-semibold text-sm">My Portal</Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-red-500 font-semibold text-sm">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}
