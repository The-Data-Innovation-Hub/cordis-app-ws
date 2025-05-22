-- Fix Supabase Auth Configuration
-- This script addresses common authentication issues with local Supabase instances

-- First, ensure the auth schema exists and is properly configured
CREATE SCHEMA IF NOT EXISTS auth;

-- Make sure auth.users table exists with proper structure
CREATE TABLE IF NOT EXISTS auth.users (
  instance_id UUID,
  id UUID PRIMARY KEY,
  aud VARCHAR(255),
  role VARCHAR(255),
  email VARCHAR(255),
  encrypted_password VARCHAR(255),
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE,
  confirmation_token VARCHAR(255),
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  recovery_token VARCHAR(255),
  recovery_sent_at TIMESTAMP WITH TIME ZONE,
  email_change_token_new VARCHAR(255),
  email_change VARCHAR(255),
  email_change_sent_at TIMESTAMP WITH TIME ZONE,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  phone VARCHAR(255) DEFAULT NULL::character varying,
  phone_confirmed_at TIMESTAMP WITH TIME ZONE,
  phone_change VARCHAR(255) DEFAULT ''::character varying,
  phone_change_token VARCHAR(255) DEFAULT ''::character varying,
  phone_change_sent_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  email_change_token_current VARCHAR(255) DEFAULT ''::character varying,
  email_change_confirm_status SMALLINT DEFAULT 0,
  banned_until TIMESTAMP WITH TIME ZONE,
  reauthentication_token VARCHAR(255) DEFAULT ''::character varying,
  reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
  is_sso_user BOOLEAN DEFAULT false
);

-- Create auth.config if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.config (
  id SMALLINT PRIMARY KEY,
  site_url VARCHAR(255),
  additional_redirect_urls TEXT,
  jwt_expiry INT,
  external_email_enabled BOOLEAN,
  external_phone_enabled BOOLEAN,
  external_google_enabled BOOLEAN,
  external_github_enabled BOOLEAN,
  external_facebook_enabled BOOLEAN,
  external_twitter_enabled BOOLEAN,
  external_apple_enabled BOOLEAN,
  external_microsoft_enabled BOOLEAN,
  external_linkedin_enabled BOOLEAN,
  external_discord_enabled BOOLEAN,
  external_twitch_enabled BOOLEAN,
  external_bitbucket_enabled BOOLEAN,
  external_gitlab_enabled BOOLEAN,
  external_spotify_enabled BOOLEAN,
  external_slack_enabled BOOLEAN,
  external_notion_enabled BOOLEAN,
  enable_signup BOOLEAN,
  enable_signup_email_otp BOOLEAN,
  enable_signup_phone_otp BOOLEAN,
  enable_signup_captcha BOOLEAN,
  enable_signup_password BOOLEAN,
  enable_login_email_otp BOOLEAN,
  enable_login_phone_otp BOOLEAN,
  enable_login_captcha BOOLEAN,
  enable_login_password BOOLEAN,
  enable_sso BOOLEAN,
  confirm_email_through_signup BOOLEAN,
  double_confirm_changes BOOLEAN,
  enable_confirmations BOOLEAN,
  mailer_autoconfirm BOOLEAN,
  mailer_secure_email_change_enabled BOOLEAN,
  mailer_secure_password_change_enabled BOOLEAN,
  mailer_secure_phone_change_enabled BOOLEAN,
  mailer_otp_exp SMALLINT,
  sms_provider VARCHAR(255),
  sms_template VARCHAR(255),
  sms_otp_exp SMALLINT,
  sms_otp_length SMALLINT,
  sms_test_otp VARCHAR(255),
  mailer_template_account_confirmation VARCHAR(255),
  mailer_template_account_recovery VARCHAR(255),
  mailer_template_invite VARCHAR(255),
  mailer_template_email_change VARCHAR(255),
  mailer_template_password_change VARCHAR(255),
  mailer_template_sms_otp VARCHAR(255),
  mailer_template_email_otp VARCHAR(255),
  rate_limit_email_sent SMALLINT,
  rate_limit_sms_sent SMALLINT,
  rate_limit_auth_attempt SMALLINT,
  rate_limit_auth_attempt_window_duration SMALLINT,
  rate_limit_auth_attempt_window_unit VARCHAR(255),
  rate_limit_email_sent_window_duration SMALLINT,
  rate_limit_email_sent_window_unit VARCHAR(255),
  rate_limit_sms_sent_window_duration SMALLINT,
  rate_limit_sms_sent_window_unit VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Insert default config if not exists
INSERT INTO auth.config (id, enable_signup, enable_signup_password, enable_login_password, confirm_email_through_signup, created_at, updated_at)
VALUES (1, true, true, true, false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  confirm_email_through_signup = false,
  updated_at = NOW();

-- Create auth.refresh_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
  instance_id UUID,
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255),
  user_id VARCHAR(255),
  revoked BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  parent VARCHAR(255),
  session_id VARCHAR(255)
);

-- Create auth.instances table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.instances (
  id UUID PRIMARY KEY,
  uuid UUID,
  raw_base_config TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Insert default instance if not exists
INSERT INTO auth.instances (id, uuid, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create auth.sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  factor_id UUID,
  aal VARCHAR(255),
  not_after TIMESTAMP WITH TIME ZONE
);

-- Create auth.schema_migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  inserted_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.audit_log_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.audit_log_entries (
  instance_id UUID,
  id UUID PRIMARY KEY,
  payload JSON,
  created_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(255)
);

-- Create auth.flow_state table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.flow_state (
  id UUID PRIMARY KEY,
  user_id UUID,
  auth_code TEXT,
  code_challenge_method TEXT,
  code_challenge TEXT,
  provider_type TEXT,
  provider_access_token TEXT,
  provider_refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  authentication_method TEXT
);

-- Create auth.mfa_factors table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.mfa_factors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friendly_name TEXT,
  factor_type TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  secret TEXT
);

-- Create auth.mfa_challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.mfa_challenges (
  id UUID PRIMARY KEY,
  factor_id UUID REFERENCES auth.mfa_factors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(255)
);

-- Create auth.mfa_amr_claims table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.mfa_amr_claims (
  session_id UUID REFERENCES auth.sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  authentication_method TEXT,
  id UUID PRIMARY KEY
);

-- Create auth.saml_providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.saml_providers (
  id UUID PRIMARY KEY,
  sso_provider_id UUID,
  entity_id TEXT UNIQUE,
  metadata_xml TEXT,
  metadata_url TEXT,
  attribute_mapping JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.saml_relay_states table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.saml_relay_states (
  id UUID PRIMARY KEY,
  sso_provider_id UUID,
  request_id TEXT,
  for_email TEXT,
  redirect_to TEXT,
  from_ip_address VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.sso_providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.sso_providers (
  id UUID PRIMARY KEY,
  resource_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.sso_domains table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.sso_domains (
  id UUID PRIMARY KEY,
  sso_provider_id UUID,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.key table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.key (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hashed_password VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create auth.identities table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.identities (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_data JSONB,
  provider TEXT,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  email TEXT GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED
);

-- Update the test users with proper auth configuration
-- First, ensure the test users exist in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  email_confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'test@example.com',
  '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16', -- password is 'password'
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "full_name": "Test User"}',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16',
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  email_confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'admin@example.com',
  '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16', -- password is 'password'
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "full_name": "Admin User"}',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = '$2a$10$GR7yzpIYxvKqU8LNo6jvdOm.hk7.xv5Ei.ABgxQTcIQcXSZwEvw16',
  email_confirmed_at = NOW(),
  updated_at = NOW();

-- Create identities for the users
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES (
  'test@example.com',
  '11111111-1111-1111-1111-111111111111',
  '{"sub": "11111111-1111-1111-1111-111111111111", "email": "test@example.com"}',
  'email',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES (
  'admin@example.com',
  '22222222-2222-2222-2222-222222222222',
  '{"sub": "22222222-2222-2222-2222-222222222222", "email": "admin@example.com"}',
  'email',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create a function to auto-confirm emails
CREATE OR REPLACE FUNCTION auth.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to auto-confirm emails on new user creation
DROP TRIGGER IF EXISTS auto_confirm_email_trigger ON auth.users;
CREATE TRIGGER auto_confirm_email_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auth.auto_confirm_email();

-- Ensure the profiles table has the correct data
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'test@example.com', 'Test User', 'user', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'admin@example.com', 'Admin User', 'admin', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();
