CREATE OR REPLACE FUNCTION public.submit_enquiry(p_kind text, p_name text, p_email text, p_details jsonb, p_consent boolean) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result uuid;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(lower(p_email), 0));
 IF (SELECT count(*) FROM public.enquiries WHERE email = lower(p_email) AND created_at > now() - interval '15 minutes') >= 3 THEN RAISE EXCEPTION 'rate_limit'; END IF;
 INSERT INTO public.enquiries(kind,name,email,details,consent) VALUES(p_kind,p_name,lower(p_email),p_details,p_consent) RETURNING id INTO result;
 RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_enquiry(text,text,text,jsonb,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(text,text,text,jsonb,boolean) TO service_role;
CREATE INDEX enquiries_email_created_idx ON public.enquiries(email,created_at);