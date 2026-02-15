-- ============================================
-- FAB CLIENT PORTAL — DATABASE SCHEMA
-- Supabase (PostgreSQL)
-- ============================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PACKAGES
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sessions_total INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MYR',
  validity_days INT NOT NULL DEFAULT 90,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.packages (name, sessions_total, price, validity_days, description) VALUES
  ('Starter Pack', 5, 450.00, 60, '5 sessions — great for trying it out'),
  ('Standard Pack', 10, 800.00, 90, '10 sessions — most popular'),
  ('Premium Pack', 20, 1400.00, 180, '20 sessions — best value');

-- 3. CLIENT_PACKAGES
CREATE TABLE public.client_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id),
  sessions_total INT NOT NULL,
  sessions_remaining INT NOT NULL,
  sessions_used INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'expired', 'exhausted')),
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX idx_client_packages_client ON public.client_packages(client_id);
CREATE INDEX idx_client_packages_status ON public.client_packages(status);

-- 4. AVAILABLE_SLOTS
CREATE TABLE public.available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_bookings INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.available_slots (day_of_week, start_time, end_time) VALUES
  (1, '09:00', '10:00'), (1, '10:00', '11:00'), (1, '11:00', '12:00'),
  (1, '14:00', '15:00'), (1, '15:00', '16:00'), (1, '16:00', '17:00'),
  (2, '09:00', '10:00'), (2, '10:00', '11:00'), (2, '11:00', '12:00'),
  (2, '14:00', '15:00'), (2, '15:00', '16:00'), (2, '16:00', '17:00'),
  (3, '09:00', '10:00'), (3, '10:00', '11:00'), (3, '11:00', '12:00'),
  (3, '14:00', '15:00'), (3, '15:00', '16:00'), (3, '16:00', '17:00'),
  (4, '09:00', '10:00'), (4, '10:00', '11:00'), (4, '11:00', '12:00'),
  (4, '14:00', '15:00'), (4, '15:00', '16:00'), (4, '16:00', '17:00'),
  (5, '09:00', '10:00'), (5, '10:00', '11:00'), (5, '11:00', '12:00'),
  (5, '14:00', '15:00'), (5, '15:00', '16:00'), (5, '16:00', '17:00'),
  (6, '09:00', '10:00'), (6, '10:00', '11:00'), (6, '11:00', '12:00');

-- 5. SLOT_OVERRIDES
CREATE TABLE public.slot_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_slot_overrides_date ON public.slot_overrides(date);

-- 6. BOOKINGS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_package_id UUID REFERENCES public.client_packages(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  client_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_client ON public.bookings(client_id);
CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- 7. SESSION_LOGS
CREATE TABLE public.session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  therapist_notes TEXT,
  areas_worked TEXT[],
  improvement_notes TEXT,
  pain_level_before INT CHECK (pain_level_before BETWEEN 0 AND 10),
  pain_level_after INT CHECK (pain_level_after BETWEEN 0 AND 10),
  flexibility_score INT CHECK (flexibility_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_logs_client ON public.session_logs(client_id);

-- 8. GAMIFICATION
CREATE TABLE public.gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_sessions INT NOT NULL DEFAULT 0,
  current_level INT NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
  level_name TEXT NOT NULL DEFAULT 'Beginner',
  current_streak INT NOT NULL DEFAULT 0,
  best_streak INT NOT NULL DEFAULT 0,
  last_session_date DATE,
  milestones JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create gamification row for new profiles
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'client' THEN
    INSERT INTO public.gamification (client_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.complete_session(
  p_booking_id UUID,
  p_therapist_notes TEXT DEFAULT NULL,
  p_areas_worked TEXT[] DEFAULT NULL,
  p_improvement_notes TEXT DEFAULT NULL,
  p_pain_before INT DEFAULT NULL,
  p_pain_after INT DEFAULT NULL,
  p_flexibility_score INT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  v_client_id UUID;
  v_client_package_id UUID;
  v_total_sessions INT;
  v_new_level INT;
  v_level_name TEXT;
  v_last_session DATE;
  v_current_streak INT;
  v_best_streak INT;
  v_milestones JSONB;
BEGIN
  SELECT client_id, client_package_id INTO v_client_id, v_client_package_id
  FROM public.bookings WHERE id = p_booking_id;

  UPDATE public.bookings SET status = 'completed', updated_at = now()
  WHERE id = p_booking_id;

  INSERT INTO public.session_logs
    (client_id, booking_id, therapist_notes, areas_worked,
     improvement_notes, pain_level_before, pain_level_after, flexibility_score)
  VALUES
    (v_client_id, p_booking_id, p_therapist_notes, p_areas_worked,
     p_improvement_notes, p_pain_before, p_pain_after, p_flexibility_score);

  IF v_client_package_id IS NOT NULL THEN
    UPDATE public.client_packages
    SET sessions_remaining = sessions_remaining - 1,
        sessions_used = sessions_used + 1,
        status = CASE WHEN sessions_remaining - 1 <= 0 THEN 'exhausted' ELSE status END
    WHERE id = v_client_package_id;
  END IF;

  SELECT total_sessions, last_session_date, current_streak, best_streak, milestones
  INTO v_total_sessions, v_last_session, v_current_streak, v_best_streak, v_milestones
  FROM public.gamification WHERE client_id = v_client_id;

  v_total_sessions := v_total_sessions + 1;

  IF v_last_session IS NOT NULL AND (CURRENT_DATE - v_last_session) <= 10 THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;

  IF v_current_streak > v_best_streak THEN
    v_best_streak := v_current_streak;
  END IF;

  v_new_level := CASE
    WHEN v_total_sessions >= 51 THEN 5
    WHEN v_total_sessions >= 31 THEN 4
    WHEN v_total_sessions >= 16 THEN 3
    WHEN v_total_sessions >= 6  THEN 2
    ELSE 1
  END;

  v_level_name := CASE v_new_level
    WHEN 1 THEN 'Beginner'
    WHEN 2 THEN 'Regular'
    WHEN 3 THEN 'Committed'
    WHEN 4 THEN 'Athlete'
    WHEN 5 THEN 'Legend'
  END;

  IF v_total_sessions = 1 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'First Session! 🎉', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_total_sessions = 5 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'Getting Started 🌟', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_total_sessions = 10 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'Double Digits 💪', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_total_sessions = 25 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'Quarter Century 🔥', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_total_sessions = 50 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'Half Century 🏆', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_total_sessions = 100 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', 'Century Club 💎', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_current_streak = 4 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', '4 Week Streak 🔥', 'achieved_at', CURRENT_DATE));
  END IF;
  IF v_current_streak = 12 THEN
    v_milestones := v_milestones || jsonb_build_array(jsonb_build_object('name', '12 Week Streak 💎', 'achieved_at', CURRENT_DATE));
  END IF;

  UPDATE public.gamification SET
    total_sessions = v_total_sessions,
    current_level = v_new_level,
    level_name = v_level_name,
    current_streak = v_current_streak,
    best_streak = v_best_streak,
    last_session_date = CURRENT_DATE,
    milestones = v_milestones,
    updated_at = now()
  WHERE client_id = v_client_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_overrides ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Packages
CREATE POLICY "Anyone reads packages" ON public.packages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL USING (public.is_admin());

-- Client packages
CREATE POLICY "Clients view own packages" ON public.client_packages FOR SELECT USING (client_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage client packages" ON public.client_packages FOR ALL USING (public.is_admin());

-- Bookings
CREATE POLICY "Clients view own bookings" ON public.bookings FOR SELECT USING (client_id = auth.uid() OR public.is_admin());
CREATE POLICY "Clients create bookings" ON public.bookings FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients cancel own bookings" ON public.bookings FOR UPDATE USING (client_id = auth.uid() AND status = 'confirmed');
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL USING (public.is_admin());

-- Session logs
CREATE POLICY "Clients view own logs" ON public.session_logs FOR SELECT USING (client_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage logs" ON public.session_logs FOR ALL USING (public.is_admin());

-- Gamification
CREATE POLICY "Clients view own gamification" ON public.gamification FOR SELECT USING (client_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins manage gamification" ON public.gamification FOR ALL USING (public.is_admin());

-- Available slots
CREATE POLICY "Anyone reads slots" ON public.available_slots FOR SELECT USING (true);
CREATE POLICY "Admins manage slots" ON public.available_slots FOR ALL USING (public.is_admin());

-- Slot overrides
CREATE POLICY "Anyone reads overrides" ON public.slot_overrides FOR SELECT USING (true);
CREATE POLICY "Admins manage overrides" ON public.slot_overrides FOR ALL USING (public.is_admin());
