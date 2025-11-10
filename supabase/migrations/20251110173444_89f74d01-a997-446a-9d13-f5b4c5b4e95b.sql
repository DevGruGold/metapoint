-- Enable RLS on organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_organizations table
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Public can view organizations"
ON public.organizations
FOR SELECT
USING (true);

CREATE POLICY "Superadmins can manage organizations"
ON public.organizations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'superadmin'))
WITH CHECK (has_role(auth.uid(), 'superadmin'));

-- User organizations policies
CREATE POLICY "Users can view their own organization memberships"
ON public.user_organizations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Superadmins can view all organization memberships"
ON public.user_organizations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Superadmins can manage organization memberships"
ON public.user_organizations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'superadmin'))
WITH CHECK (has_role(auth.uid(), 'superadmin'));

-- Fix function search paths (use CREATE OR REPLACE to avoid dropping)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;