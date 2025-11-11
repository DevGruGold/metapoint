-- Update all RLS policies to use the correct has_role function with app_role type
-- Then drop the incorrect has_role(uuid, text) function

-- user_roles table policies
DROP POLICY IF EXISTS "Superadmins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Superadmins can update all roles" ON user_roles;
DROP POLICY IF EXISTS "Superadmins can delete roles except own superadmin" ON user_roles;

CREATE POLICY "Superadmins can view all roles" 
ON user_roles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can update all roles" 
ON user_roles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can delete roles except own superadmin" 
ON user_roles 
FOR DELETE 
TO authenticated
USING (
  has_role(auth.uid(), 'superadmin'::app_role) 
  AND NOT (user_id = auth.uid() AND role = 'superadmin'::app_role)
);

-- profiles table policies
DROP POLICY IF EXISTS "Superadmins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmins can delete profiles" ON profiles;

CREATE POLICY "Superadmins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can update all profiles" 
ON profiles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can delete profiles" 
ON profiles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- newsletters table policies
DROP POLICY IF EXISTS "Superadmins can do everything with newsletters" ON newsletters;

CREATE POLICY "Superadmins can do everything with newsletters" 
ON newsletters 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

-- organizations table policies
DROP POLICY IF EXISTS "Superadmins can manage organizations" ON organizations;

CREATE POLICY "Superadmins can manage organizations" 
ON organizations 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

-- user_organizations table policies
DROP POLICY IF EXISTS "Superadmins can view all organization memberships" ON user_organizations;
DROP POLICY IF EXISTS "Superadmins can manage organization memberships" ON user_organizations;

CREATE POLICY "Superadmins can view all organization memberships" 
ON user_organizations 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can manage organization memberships" 
ON user_organizations 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'superadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

-- Now drop the incorrect has_role function
DROP FUNCTION IF EXISTS public.has_role(uuid, text) CASCADE;