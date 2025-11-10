-- Add superadmin to the app_role enum (must be in separate transaction)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'superadmin';

COMMENT ON TYPE public.app_role IS 'Application roles: superadmin (full access), admin (content management), moderator (limited management), user (basic access)';