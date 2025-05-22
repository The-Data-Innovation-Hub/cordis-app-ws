// src/types/supabase.ts
import type { Database } from './database.types';

/**
 * Profile data structure returned from Supabase
 */
export interface ProfileData {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Manual session structure for local development
 */
export interface ManualSession {
  user: {
    id: string;
    email: string;
    role: string;
    user_metadata: { role: string };
    app_metadata: { role: string };
    email_confirmed_at: string;
  };
  session: {
    user: {
      id: string;
      email: string;
      role: string;
      user_metadata: { role: string };
      app_metadata: { role: string };
      email_confirmed_at: string;
    }
  };
  profile: ProfileData;
  isManualSession: boolean;
  timestamp: string;
}

/**
 * Type guard to check if an object is a ProfileData
 */
export function isProfileData(obj: any): obj is ProfileData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.role === 'string'
  );
}

/**
 * Type guard to check if an object is a ManualSession
 */
export function isManualSession(obj: any): obj is ManualSession {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.isManualSession === true &&
    typeof obj.timestamp === 'string' &&
    obj.user &&
    typeof obj.user.id === 'string' &&
    typeof obj.user.email === 'string'
  );
}

/**
 * Authentication response structure
 */
export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: any;
  profile?: ProfileData | any;
  error?: any;
  message?: string;
  isManualSession?: boolean;
}

/**
 * Supabase tables types (placeholder - should be generated from Supabase)
 * This is a simplified version for local development
 */
export type Tables = Database['public']['Tables'];
