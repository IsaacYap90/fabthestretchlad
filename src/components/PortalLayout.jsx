import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Button from './ui/Button'

export default function PortalLayout({ children }) {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const isAdmin = profile?.role === 'admin'
  const prefix = isAdmin ? '/admin' : '/portal'

  const navItems = isAdmin
    ? [
        { path: '/admin', label: '📊 Dashboard' },
        { path: '/admin/clients', label: '👥 Clients' },
        { path: '/admin/sessions', label: '📋 Sessions' },
      ]
    : [
        { path: '/portal', label: '🏠 Dashboard' },
        { path: '/portal/book', label: '📅 Book' },
        { path: '/portal/progress', label: '📈 Progress' },
      ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={prefix} className="flex items-center gap-2">
            <span className="font-black text-red-600 text-2xl tracking-tight">FAB</span>
            {isAdmin && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">ADMIN</span>}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">{profile?.full_name}</span>
            <Button variant="ghost" onClick={signOut} className="!text-xs">Logout</Button>
          </div>
        </div>
      </nav>

      {/* Bottom tab nav (mobile) */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 md:hidden">
        <div className="flex justify-around py-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors ${isActive(item.path) ? 'text-red-500' : 'text-gray-500'}`}
            >
              <span className="text-lg">{item.label.split(' ')[0]}</span>
              <span>{item.label.split(' ').slice(1).join(' ')}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Side nav (desktop) */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 border-r border-white/10 flex-col py-6 px-3">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${isActive(item.path) ? 'bg-red-600/10 text-red-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-auto">
          <Link to="/" className="text-gray-600 text-xs hover:text-gray-400 px-4">← Back to site</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-20 pb-24 md:pb-8 md:ml-56 px-4 md:px-8 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
