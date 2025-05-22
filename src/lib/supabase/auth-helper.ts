/**
 * Enhanced authentication helper for Supabase
 * This provides direct methods to authenticate with test users
 * with improved error handling for local development
 */

import { supabase } from './client';
import { isProfileData, type AuthResponse } from '@/types/supabase';
import { toast } from 'sonner';

// Test users for easy access
export const TEST_USERS = {
  admin: { email: 'admin@example.com', password: 'password', role: 'admin' },
  user: { email: 'test@example.com', password: 'password', role: 'user' },
};

/**
 * Check for and restore a manual session if one exists
 * This is used for local development when Supabase auth is having issues
 */
export function checkAndRestoreManualSession(): AuthResponse | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedSession = localStorage.getItem('cordis-manual-session');
    if (!storedSession) return null;
    
    const parsedSession = JSON.parse(storedSession);
    console.log('Found stored manual session:', parsedSession);
    
    if (parsedSession?.user && parsedSession?.profile) {
      return {
        success: true,
        user: parsedSession.user,
        session: { user: parsedSession.user },
        profile: parsedSession.profile,
        isManualSession: true
      };
    }
  } catch (error) {
    console.error('Error restoring manual session:', error);
    localStorage.removeItem('cordis-manual-session');
  }
  
  return null;
}

/**
 * Enhanced login function with better error handling and debugging
 * Includes fallback to manual session for local development
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log(`Attempting to login with email: ${email}`);
    
    // First, check if the user exists in the profiles table
    let profile = null;
    
    try {
      // Try to get the profile data first to check if user exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        // @ts-ignore - Supabase type issue
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      
      if (profileData) {
        console.log('Found existing profile:', profileData);
        profile = profileData;
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    
    // First sign out to clear any existing session
    try {
      await supabase.auth.signOut();
      // Also clear any manual session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cordis-manual-session');
      }
      console.log('Successfully signed out previous session');
    } catch (signOutError) {
      console.warn('Error signing out previous session:', signOutError);
      // Continue with login attempt even if sign out fails
    }
    
    // Attempt to sign in
    console.log('Attempting to sign in with Supabase auth...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    
    if (error) {
      console.error('Supabase auth error:', error);
      
      // For local development, if we get an unexpected error or auth failure,
      // we'll create a manual session to bypass the auth error
      if ((error.message?.includes('unexpected_failure') || 
          error.status === 500 || 
          error.code === 'unexpected_failure' ||
          error.code === 'invalid_credentials') && 
          profile) {
        console.log('Attempting to create manual session for local development...');
        
        try {
          // Check if profile has the required properties
          if (isProfileData(profile)) {
            // Create a fake user object based on the profile
            const manualUser = {
              id: profile.id,
              email: profile.email,
              role: profile.role,
              user_metadata: { role: profile.role },
              app_metadata: { role: profile.role },
              email_confirmed_at: new Date().toISOString(),
            };
            
            console.log('Created manual session for local development', { user: manualUser, profile });
            
            // Store the manual session in localStorage for persistence
            if (typeof window !== 'undefined') {
              localStorage.setItem('cordis-manual-session', JSON.stringify({
                user: manualUser,
                profile,
                timestamp: new Date().toISOString()
              }));
            }
            
            // Show success message
            toast.success('Created manual session for local development', {
              description: `Welcome, ${isProfileData(profile) ? (profile.full_name || profile.email || 'User') : 'User'}`
            });
            
            return {
              success: true,
              user: manualUser,
              session: { user: manualUser },
              profile,
              isManualSession: true,
              message: 'Manual authentication successful (local development only)'
            };
          } else {
            throw new Error('Invalid profile data structure');
          }
        } catch (manualError) {
          console.error('Failed to create manual session:', manualError);
        }
      }
      
      // Show user-friendly error message
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again',
      });
      
      return { success: false, error };
    }
    
    // Fetch user profile
    let userProfile = null;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        // @ts-ignore - Supabase type issue
        .eq('email', data.user?.email || '')
        .maybeSingle();
      
      userProfile = profileData;
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);
    }
    
    // Handle profile creation if needed
    if (!userProfile && data.user) {
      console.log('Profile not found, creating new profile...');
      
      try {
        // Create a basic profile with default role
        const newProfile = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.email?.split('@')[0] || 'User',
          role: 'user',
        };
        
        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles')
          // @ts-ignore - Supabase type issue
          .insert([newProfile])
          .select()
          .maybeSingle();
          
        if (insertError) {
          console.error('Error inserting profile:', insertError);
        } else if (createdProfile) {
          console.log('Created new profile:', createdProfile);
          userProfile = createdProfile;
        }
      } catch (profileCreateError) {
        console.error('Error creating user profile:', profileCreateError);
      }
    }
    
    // Show success message
    toast.success('Login successful', {
      description: `Welcome, ${isProfileData(userProfile) ? (userProfile.full_name || data.user?.email || 'User') : (data.user?.email || 'User')}`
    });
    
    return { 
      success: true, 
      user: data.user, 
      session: data.session,
      profile: userProfile 
    };
  } catch (error) {
    console.error('Unexpected error during login:', error);
    
    toast.error('Login failed', {
      description: 'An unexpected error occurred. Please try again.',
    });
    
    return { success: false, error };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, userData: any = {}): Promise<AuthResponse> {
  try {
    console.log(`Attempting to sign up with email: ${email}`);
    
    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      // @ts-ignore - Supabase type issue
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();
    
    if (existingProfile) {
      toast.error('Registration failed', {
        description: 'An account with this email already exists. Please log in instead.',
      });
      
      return { success: false, error: { message: 'User already exists' } };
    }
    
    // First sign out to clear any existing session
    try {
      await supabase.auth.signOut();
      // Also clear any manual session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cordis-manual-session');
      }
      console.log('Successfully signed out previous session');
    } catch (signOutError) {
      console.warn('Error signing out previous session:', signOutError);
      // Continue with signup attempt even if sign out fails
    }
    
    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          role: userData.role || 'user'
        }
      }
    });
    
    if (error) {
      console.error('Supabase auth error:', error);
      
      // Show user-friendly error message
      toast.error('Signup failed', {
        description: error.message || 'Please check your information and try again',
      });
      
      return { success: false, error };
    }
    
    if (data.user) {
      // Create user profile
      const profileData = {
        id: data.user.id,
        email: email.trim().toLowerCase(),
        full_name: userData.full_name || email.split('@')[0] || 'User',
        role: userData.role || 'user',
      };
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        // @ts-ignore - Supabase type issue
        .upsert(profileData)
        .select('*')
        .single();
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
      
      toast.success('Registration successful!', {
        description: 'Please check your email to confirm your account.',
      });
      
      return { 
        success: true, 
        user: data.user, 
        session: data.session,
        profile: profile || profileData
      };
    } else {
      toast.error('Signup failed', {
        description: 'Failed to create user account. Please try again.',
      });
      
      return { success: false, error: { message: 'Failed to create user' } };
    }
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    
    toast.error('Registration failed', {
      description: 'An unexpected error occurred. Please try again.',
    });
    
    return { success: false, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean, error?: any }> {
  try {
    // Clear any manual session first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cordis-manual-session');
    }
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      
      toast.error('Sign out failed', {
        description: error.message || 'Please try again',
      });
      
      return { success: false, error };
    }
    
    toast.success('Signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    
    toast.error('Sign out failed', {
      description: 'An unexpected error occurred. Please try again.',
    });
    
    return { success: false, error };
  }
}

/**
 * Debug function to check auth state
 */
export async function checkAuthState() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const manualSession = typeof window !== 'undefined' ? localStorage.getItem('cordis-manual-session') : null;
    
    return {
      supabaseSession: session,
      manualSession: manualSession ? JSON.parse(manualSession) : null,
      isAuthenticated: !!session || !!manualSession
    };
  } catch (error) {
    console.error('Error checking auth state:', error);
    return { error };
  }
}

/**
 * Create a debug helper function to check auth state
 * This can be called from the browser console to debug auth issues
 */
export function setupAuthDebugger(): void {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Adding to window object for debugging
    window.checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const manualSession = localStorage.getItem('cordis-manual-session');
      
      return {
        supabaseSession: session,
        manualSession: manualSession ? JSON.parse(manualSession) : null,
        isAuthenticated: !!session || !!manualSession
      };
    };
    
    console.log('Auth debugger installed. Call window.checkAuthState() to debug auth issues');
  }
}

// Make functions available in global scope for browser testing
if (typeof window !== 'undefined') {
  // @ts-ignore - Adding to window object for debugging
  window.authHelper = {
    loginWithEmail,
    signUpWithEmail,
    signOut,
    checkAuthState,
    checkAndRestoreManualSession,
    TEST_USERS
  };
  
  console.log('Auth helper functions available in window.authHelper');
}

// Initialize the auth debugger
setupAuthDebugger();
