-- Create test users for different roles
-- This script creates three test users with different roles for testing

-- Create test admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '182fe9d5-5b18-4f31-8080-2c0bf2d4c0a9',
  'authenticated',
  'authenticated',
  'admin@example.com',
  '$2a$10$Ql8eFi5kCBkHW1JZB3vYVOGS9h3JZm.xpQDIU1jl8BgBIKdRQNqBe', -- Password: Password123
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "full_name": "Admin User"}',
  NOW(),
  NOW()
);

-- Create test manager user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '40685884-a19c-4ef7-83ec-03f73e4a7b1c',
  'authenticated',
  'authenticated',
  'manager@example.com',
  '$2a$10$Ql8eFi5kCBkHW1JZB3vYVOGS9h3JZm.xpQDIU1jl8BgBIKdRQNqBe', -- Password: Password123
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "manager", "full_name": "Manager User"}',
  NOW(),
  NOW()
);

-- Create test regular user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '944599e8-c214-4471-b69f-092ac5b1c2d3',
  'authenticated',
  'authenticated',
  'user@example.com',
  '$2a$10$Ql8eFi5kCBkHW1JZB3vYVOGS9h3JZm.xpQDIU1jl8BgBIKdRQNqBe', -- Password: Password123
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "full_name": "Regular User"}',
  NOW(),
  NOW()
);

-- Trigger the profile creation for these users
DO $$
BEGIN
  -- Create profiles for the test users if they don't exist
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES 
    ('182fe9d5-5b18-4f31-8080-2c0bf2d4c0a9', 'admin@example.com', 'Admin User', 'admin', NOW(), NOW()),
    ('40685884-a19c-4ef7-83ec-03f73e4a7b1c', 'manager@example.com', 'Manager User', 'manager', NOW(), NOW()),
    ('944599e8-c214-4471-b69f-092ac5b1c2d3', 'user@example.com', 'Regular User', 'user', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END
$$;
