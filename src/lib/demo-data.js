// Demo data when Supabase isn't connected
const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d }
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d }

export const DEMO_PACKAGE = {
  id: 'demo-pkg-1',
  client_id: 'demo-client-id',
  package_id: 'pkg-standard',
  sessions_total: 10,
  sessions_remaining: 7,
  sessions_used: 3,
  status: 'active',
  activated_at: daysAgo(30).toISOString(),
  expires_at: daysFromNow(60).toISOString(),
  packages: { name: 'Standard Pack', sessions_total: 10, price: 800, validity_days: 90 },
}

export const DEMO_GAMIFICATION = {
  total_sessions: 8,
  current_level: 2,
  level_name: 'Regular',
  current_streak: 3,
  best_streak: 5,
  last_session_date: fmt(daysAgo(5)),
  milestones: [
    { name: 'First Session! 🎉', achieved_at: fmt(daysAgo(60)) },
    { name: 'Getting Started 🌟', achieved_at: fmt(daysAgo(30)) },
  ],
}

export const DEMO_BOOKINGS = [
  { id: 'b1', client_id: 'demo-client-id', date: fmt(daysAgo(3)), start_time: '10:00', end_time: '11:00', status: 'completed', client_notes: null,
    session_logs: [{ therapist_notes: 'Great improvement in hip ROM, +8°', areas_worked: ['Hamstrings', 'Hip Flexors'], pain_level_before: 5, pain_level_after: 2, flexibility_score: 68 }],
    profiles: { full_name: 'Demo Client' } },
  { id: 'b2', client_id: 'demo-client-id', date: fmt(daysAgo(10)), start_time: '14:00', end_time: '15:00', status: 'completed', client_notes: null,
    session_logs: [{ therapist_notes: 'Shoulders still tight, focus next session', areas_worked: ['Full Body'], pain_level_before: 6, pain_level_after: 3, flexibility_score: 62 }],
    profiles: { full_name: 'Demo Client' } },
  { id: 'b3', client_id: 'demo-client-id', date: fmt(daysAgo(17)), start_time: '09:00', end_time: '10:00', status: 'completed', client_notes: null,
    session_logs: [{ therapist_notes: 'Pain reduced from 6→3. Good progress', areas_worked: ['Lower Back', 'Hamstrings'], pain_level_before: 6, pain_level_after: 3, flexibility_score: 55 }],
    profiles: { full_name: 'Demo Client' } },
  { id: 'b4', client_id: 'demo-client-id', date: fmt(daysFromNow(3)), start_time: '10:00', end_time: '11:00', status: 'confirmed', client_notes: 'Focus on hip flexors please',
    session_logs: [],
    profiles: { full_name: 'Demo Client' } },
]

export const DEMO_SLOTS = [
  { day_of_week: 1, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 1, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 1, start_time: '11:00', end_time: '12:00', is_available: true },
  { day_of_week: 1, start_time: '14:00', end_time: '15:00', is_available: true },
  { day_of_week: 1, start_time: '15:00', end_time: '16:00', is_available: true },
  { day_of_week: 1, start_time: '16:00', end_time: '17:00', is_available: true },
  { day_of_week: 2, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 2, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 2, start_time: '11:00', end_time: '12:00', is_available: true },
  { day_of_week: 2, start_time: '14:00', end_time: '15:00', is_available: true },
  { day_of_week: 2, start_time: '15:00', end_time: '16:00', is_available: true },
  { day_of_week: 2, start_time: '16:00', end_time: '17:00', is_available: true },
  { day_of_week: 3, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 3, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 3, start_time: '11:00', end_time: '12:00', is_available: true },
  { day_of_week: 3, start_time: '14:00', end_time: '15:00', is_available: true },
  { day_of_week: 3, start_time: '15:00', end_time: '16:00', is_available: true },
  { day_of_week: 3, start_time: '16:00', end_time: '17:00', is_available: true },
  { day_of_week: 4, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 4, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 4, start_time: '11:00', end_time: '12:00', is_available: true },
  { day_of_week: 4, start_time: '14:00', end_time: '15:00', is_available: true },
  { day_of_week: 4, start_time: '15:00', end_time: '16:00', is_available: true },
  { day_of_week: 4, start_time: '16:00', end_time: '17:00', is_available: true },
  { day_of_week: 5, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 5, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 5, start_time: '11:00', end_time: '12:00', is_available: true },
  { day_of_week: 5, start_time: '14:00', end_time: '15:00', is_available: true },
  { day_of_week: 5, start_time: '15:00', end_time: '16:00', is_available: true },
  { day_of_week: 5, start_time: '16:00', end_time: '17:00', is_available: true },
  { day_of_week: 6, start_time: '09:00', end_time: '10:00', is_available: true },
  { day_of_week: 6, start_time: '10:00', end_time: '11:00', is_available: true },
  { day_of_week: 6, start_time: '11:00', end_time: '12:00', is_available: true },
]

// Admin demo data
export const DEMO_CLIENTS = [
  { id: 'demo-client-id', full_name: 'Demo Client', email: 'demo@client.com', phone: '+60123456789', role: 'client',
    client_packages: [DEMO_PACKAGE], gamification: [DEMO_GAMIFICATION] },
  { id: 'client-2', full_name: 'Sarah Lee', email: 'sarah@email.com', phone: '+60198765432', role: 'client',
    client_packages: [{ ...DEMO_PACKAGE, id: 'pkg-2', client_id: 'client-2', sessions_remaining: 1, sessions_used: 9 }],
    gamification: [{ ...DEMO_GAMIFICATION, total_sessions: 22, current_level: 3, level_name: 'Committed', current_streak: 6 }] },
  { id: 'client-3', full_name: 'Mike Tan', email: 'mike@email.com', phone: '+60112223333', role: 'client',
    client_packages: [{ ...DEMO_PACKAGE, id: 'pkg-3', client_id: 'client-3', sessions_remaining: 2, sessions_used: 8 }],
    gamification: [{ ...DEMO_GAMIFICATION, total_sessions: 15, current_level: 2, level_name: 'Regular', current_streak: 2 }] },
  { id: 'client-4', full_name: 'David Ng', email: 'david@email.com', phone: '+60134445555', role: 'client',
    client_packages: [{ ...DEMO_PACKAGE, id: 'pkg-4', client_id: 'client-4', sessions_remaining: 5, sessions_used: 5 }],
    gamification: [{ ...DEMO_GAMIFICATION, total_sessions: 5, current_level: 1, level_name: 'Beginner', current_streak: 1 }] },
]

export const DEMO_ADMIN_BOOKINGS = [
  { id: 'ab1', client_id: 'demo-client-id', date: fmt(today), start_time: '09:00', end_time: '10:00', status: 'confirmed',
    profiles: { full_name: 'Demo Client' }, client_notes: 'Hamstrings focus' },
  { id: 'ab2', client_id: 'client-2', date: fmt(today), start_time: '10:00', end_time: '11:00', status: 'confirmed',
    profiles: { full_name: 'Sarah Lee' }, client_notes: 'Full Body' },
  { id: 'ab3', client_id: 'client-3', date: fmt(today), start_time: '14:00', end_time: '15:00', status: 'confirmed',
    profiles: { full_name: 'Mike Tan' }, client_notes: 'Lower Back' },
]

export const DEMO_PACKAGES_LIST = [
  { id: 'pkg-starter', name: 'Starter Pack', sessions_total: 5, price: 450, validity_days: 60, description: '5 sessions — great for trying it out' },
  { id: 'pkg-standard', name: 'Standard Pack', sessions_total: 10, price: 800, validity_days: 90, description: '10 sessions — most popular' },
  { id: 'pkg-premium', name: 'Premium Pack', sessions_total: 20, price: 1400, validity_days: 180, description: '20 sessions — best value' },
]
