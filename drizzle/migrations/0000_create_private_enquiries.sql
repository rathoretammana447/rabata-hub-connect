CREATE TABLE public.enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 kind text NOT NULL CHECK (kind IN ('contact','student','volunteer')),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) <= 255),
 details jsonb NOT NULL,
 consent boolean NOT NULL CHECK (consent = true)
);
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.enquiries IS 'Private website enquiries. No browser read or write access; validated server-only intake. Managed by project owner through Cloud.';