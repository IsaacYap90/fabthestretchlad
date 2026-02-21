import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import ProtectedRoute from './components/ProtectedRoute'
import PortalLayout from './components/PortalLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Marketing components (loaded eagerly — landing page)
import Nav from './components/marketing/Nav'
import Hero from './components/marketing/Hero'
import Benefits from './components/marketing/Benefits'
import HowItWorks from './components/marketing/HowItWorks'
import ConsultationCTA from './components/marketing/ConsultationCTA'
import AboutFab from './components/marketing/AboutFab'
import SocialFeeds from './components/marketing/SocialFeeds'
import Booking from './components/marketing/Booking'

// Lazy-loaded portal/admin pages (code splitting)
const PortalDashboard = lazy(() => import('./pages/portal/Dashboard'))
const BookSession = lazy(() => import('./pages/portal/Book'))
const Progress = lazy(() => import('./pages/portal/Progress'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminClients = lazy(() => import('./pages/admin/Clients'))
const ClientDetail = lazy(() => import('./pages/admin/ClientDetail'))
const AdminSessions = lazy(() => import('./pages/admin/Sessions'))
const ChatWidget = lazy(() => import('./components/ChatWidget'))

const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
)

/* ─── MARKETING HOME ─── */
function HomePage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-red-600/20">
      <a href="#benefits" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[60] focus:bg-red-600 focus:text-white focus:px-4 focus:py-2">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <ConsultationCTA />
        <AboutFab />
        <SocialFeeds />
        <Booking />
      </main>
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  )
}

/* ─── TITLE UPDATER ─── */
const PAGE_TITLES = {
  '/': 'Fab The Stretch Lad | #1 Stretch Therapy Singapore',
  '/login': 'Login | Fab The Stretch Lad',
  '/signup': 'Sign Up | Fab The Stretch Lad',
  '/portal': 'Dashboard | Fab The Stretch Lad',
  '/portal/book': 'Book a Session | Fab The Stretch Lad',
  '/portal/progress': 'My Progress | Fab The Stretch Lad',
  '/admin': 'Admin Dashboard | Fab The Stretch Lad',
  '/admin/clients': 'Clients | Fab The Stretch Lad',
  '/admin/sessions': 'Sessions | Fab The Stretch Lad',
}

function TitleUpdater() {
  const location = useLocation()
  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] || 'Fab The Stretch Lad'
  }, [location.pathname])
  return null
}

/* ─── APP ─── */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TitleUpdater />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Marketing site */}
            <Route path="/" element={<HomePage />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Client Portal */}
            <Route path="/portal" element={<ProtectedRoute requiredRole="client"><PortalLayout><PortalDashboard /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/book" element={<ProtectedRoute requiredRole="client"><PortalLayout><BookSession /></PortalLayout></ProtectedRoute>} />
            <Route path="/portal/progress" element={<ProtectedRoute requiredRole="client"><PortalLayout><Progress /></PortalLayout></ProtectedRoute>} />

            {/* Admin Portal */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminDashboard /></PortalLayout></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminClients /></PortalLayout></ProtectedRoute>} />
            <Route path="/admin/clients/:id" element={<ProtectedRoute requiredRole="admin"><PortalLayout><ClientDetail /></PortalLayout></ProtectedRoute>} />
            <Route path="/admin/sessions" element={<ProtectedRoute requiredRole="admin"><PortalLayout><AdminSessions /></PortalLayout></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
