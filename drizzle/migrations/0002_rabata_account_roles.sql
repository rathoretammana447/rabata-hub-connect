CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'student');
CREATE TYPE public.role_status AS ENUM ('pending', 'active', 'rejected');

CREATE TABLE public.app_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 120),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  location TEXT CHECK (location IS NULL OR char_length(location) <= 160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.app_profiles TO authenticated;
GRANT ALL ON public.app_profiles TO service_role;
ALTER TABLE public.app_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  status public.role_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role AND status = 'active')
$$;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

CREATE POLICY "Own profile or admin read" ON public.app_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own profile insert" ON public.app_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own profile or admin update" ON public.app_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own roles or admin read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_app_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.app_profiles (user_id, display_name)
  VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'display_name', ''), 120))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_app_profile AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_app_user();

CREATE OR REPLACE FUNCTION public.request_app_role(p_role public.app_role)
RETURNS public.role_status LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE uid UUID := auth.uid(); result public.role_status;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  IF p_role NOT IN ('mentor','student') THEN RAISE EXCEPTION 'role_request_not_allowed'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, p_role)
  ON CONFLICT (user_id, role) DO UPDATE SET
    status = CASE WHEN user_roles.status = 'active' THEN 'active'::public.role_status ELSE 'pending'::public.role_status END,
    requested_at = CASE WHEN user_roles.status = 'active' THEN user_roles.requested_at ELSE now() END
  RETURNING status INTO result;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.request_app_role(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_app_role(public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.bootstrap_initial_admin()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE uid UUID := auth.uid(); em TEXT; confirmed TIMESTAMPTZ;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  SELECT lower(email), email_confirmed_at INTO em, confirmed FROM auth.users WHERE id = uid;
  IF em IS DISTINCT FROM 'rabataofficial111@gmail.com' OR confirmed IS NULL THEN RAISE EXCEPTION 'verified_rabata_email_required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('rabata-initial-admin', 0));
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin' AND status = 'active') THEN RAISE EXCEPTION 'initial_admin_already_claimed'; END IF;
  INSERT INTO public.user_roles (user_id, role, status, reviewed_at, reviewed_by) VALUES (uid, 'admin', 'active', now(), uid)
  ON CONFLICT (user_id, role) DO UPDATE SET status = 'active', reviewed_at = now(), reviewed_by = uid;
  RETURN 'created';
END;
$$;
REVOKE ALL ON FUNCTION public.bootstrap_initial_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_initial_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.review_app_role(p_role_id UUID, p_decision public.role_status)
RETURNS public.role_status LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE result public.role_status;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'admin_required'; END IF;
  IF p_decision NOT IN ('active','rejected') THEN RAISE EXCEPTION 'invalid_review_decision'; END IF;
  UPDATE public.user_roles SET status = p_decision, reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = p_role_id AND role IN ('mentor','student') AND status = 'pending'
    RETURNING status INTO result;
  IF result IS NULL THEN RAISE EXCEPTION 'pending_role_request_not_found'; END IF;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.review_app_role(UUID, public.role_status) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_app_role(UUID, public.role_status) TO authenticated;