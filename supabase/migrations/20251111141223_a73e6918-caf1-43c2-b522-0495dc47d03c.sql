-- Reset Maya's password to MayaAdmin123!
-- Using Supabase's built-in password update function

UPDATE auth.users
SET 
  encrypted_password = crypt('MayaAdmin123!', gen_salt('bf')),
  updated_at = now()
WHERE email = 'mmjoelson@gmail.com';