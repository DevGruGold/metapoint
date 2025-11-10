-- Fix the text-based has_role function to have proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = _user_id
    AND (
      (raw_user_meta_data->> 'role' = _role)
      OR (raw_app_meta_data->> 'role' = _role)
    )
  );
END;
$$;