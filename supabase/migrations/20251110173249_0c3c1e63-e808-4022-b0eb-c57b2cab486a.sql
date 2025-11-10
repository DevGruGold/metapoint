-- Assign superadmin role to mmjoelson@gmail.com (only this user should be superadmin)
INSERT INTO public.user_roles (user_id, role)
VALUES ('1b2a061d-2b15-437f-91c0-eef727b61cb4', 'superadmin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create RLS policies for superadmin (superadmin has full access)
-- Superadmin can view all user roles
CREATE POLICY "Superadmins can view all roles" 
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

-- Superadmin can update all user roles
CREATE POLICY "Superadmins can update all roles" 
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

-- Superadmin can delete user roles (except their own superadmin role)
CREATE POLICY "Superadmins can delete roles except own superadmin" 
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'superadmin') 
  AND NOT (user_id = auth.uid() AND role = 'superadmin')
);

-- Superadmin can view all profiles
CREATE POLICY "Superadmins can view all profiles" 
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

-- Superadmin can update all profiles
CREATE POLICY "Superadmins can update all profiles" 
ON public.profiles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

-- Superadmin can delete profiles
CREATE POLICY "Superadmins can delete profiles" 
ON public.profiles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'superadmin'));

-- Superadmin has full access to newsletters
CREATE POLICY "Superadmins can do everything with newsletters" 
ON public.newsletters
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'superadmin'))
WITH CHECK (has_role(auth.uid(), 'superadmin'));

-- Update password for mmjoelson@gmail.com
-- Note: This uses Supabase's crypt extension to properly hash the password
UPDATE auth.users 
SET 
  encrypted_password = crypt('MayaAdmin123!', gen_salt('bf')),
  updated_at = now()
WHERE email = 'mmjoelson@gmail.com';