'use client';

import { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Session, User, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Types
type UserRole = 'admin' | 'manager' | 'user';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url?: string | null;
  email_confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

type SignInResponse = {
  user: User;
  session: Session;
} | null;

type SignUpResponse = {
  user: User | null;
  profile: Profile | null;
};

interface AuthContextType extends Omit<AuthState, 'error'> {
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string, userData?: Partial<Profile>) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  resetError: () => void;
  refreshSession: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

// Error messages mapping
const AUTH_ERRORS = {
  'Invalid login credentials': 'Incorrect email or password. Please try again.',
  'Email not confirmed': 'Please verify your email before signing in.',
  'User already registered': 'An account with this email already exists.',
  'Email rate limit exceeded': 'Too many attempts. Please try again later.',
  'Weak password': 'Password must be at least 6 characters long.',
  'Network error': 'Unable to connect to the server. Please check your connection.',
} as const;

type AuthErrorKey = keyof typeof AUTH_ERRORS;

// Helper function to get user-friendly error messages
const getAuthError = (error: AuthError | Error | any): Error => {
  // Handle empty error objects
  if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
    return new Error('An authentication error occurred. Please try again.');
  }

  // Check if it's a Supabase AuthError
  if (error && typeof error === 'object') {
    // Check for AuthApiError which indicates a Supabase auth error
    if ('name' in error && error.name === 'AuthApiError') {
      // Handle specific error codes
      if ('code' in error && error.code === 'invalid_credentials') {
        return new Error('Incorrect email or password. Please try again.');
      }
    }
    
    // Handle error objects with code property
    if ('code' in error) {
      if (error.code === 'invalid_credentials') {
        return new Error('Incorrect email or password. Please try again.');
      }
    }
    
    // If we have a message, try to map it to a friendly message
    if ('message' in error && typeof error.message === 'string') {
      const friendlyMessage = AUTH_ERRORS[error.message as AuthErrorKey] || 
        'An authentication error occurred. Please try again.';
      return new Error(friendlyMessage);
    }
  }
  
  // Default case for regular Error objects
  if (error.message) {
    const message = error.message;
    const friendlyMessage = AUTH_ERRORS[message as AuthErrorKey] || 'An unexpected error occurred. Please try again.';
    return new Error(friendlyMessage);
  }
  
  // Fallback for completely unknown error types
  return new Error('An unexpected error occurred. Please try again.');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
    isEmailVerified: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Helper function to update auth state
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset any auth errors
  const resetError = useCallback(() => {
    updateAuthState({ error: null });
  }, [updateAuthState]);

  // Refresh the session
  const refreshSession = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true });
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        updateAuthState({ 
          error: getAuthError(error),
          isLoading: false 
        });
        return;
      }
      
      if (data.session) {
        updateAuthState({
          session: data.session,
          user: data.session.user,
          isAuthenticated: true,
          isEmailVerified: !!data.session.user.email_confirmed_at,
          isLoading: false,
        });
      } else {
        updateAuthState({
          session: null,
          user: null,
          profile: null,
          isAuthenticated: false,
          isEmailVerified: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Unexpected error in refreshSession:', error);
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
    }
  }, [updateAuthState]);

  // Resend verification email
  const resendVerificationEmail = useCallback(async (email: string) => {
    try {
      updateAuthState({ isLoading: true });
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        console.error('Error resending verification email:', error);
        updateAuthState({ 
          error: getAuthError(error),
          isLoading: false 
        });
        toast.error('Failed to resend verification email');
        throw error;
      }
      
      updateAuthState({ isLoading: false });
      toast.success('Verification email sent', {
        description: 'Please check your inbox and follow the link to verify your email.',
      });
    } catch (error) {
      console.error('Unexpected error in resendVerificationEmail:', error);
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
      throw error;
    }
  }, [updateAuthState]);
  
  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!userId) {
      console.warn('No user ID provided to fetchProfile');
      return null;
    }

    try {
      updateAuthState({ isLoading: true });
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.code !== 'PGRST116') { // Don't log 404 errors
          console.error('Error fetching profile:', error);
          updateAuthState({ 
            error: getAuthError(error),
            isLoading: false 
          });
        }
        return null;
      }

      if (profile) {
        // Debug: Log the raw profile from database
        console.log('Raw profile data from DB:', {
          id: profile.id,
          email: profile.email,
          rawRole: profile.role, // This will show the exact role value in the DB
          roleType: typeof profile.role
        });
        
        const typedProfile: Profile = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || null,
          role: profile.role as UserRole,
          avatar_url: profile.avatar_url || null,
          email_confirmed_at: profile.email_confirmed_at || null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };
        
        // Debug: Log the processed profile
        console.log('Processed profile after type casting:', {
          id: typedProfile.id,
          email: typedProfile.email,
          full_name: typedProfile.full_name,
          role: typedProfile.role,
          avatar_url: typedProfile.avatar_url,
          email_confirmed_at: typedProfile.email_confirmed_at,
          created_at: typedProfile.created_at,
          updated_at: typedProfile.updated_at,
        });
        
        updateAuthState({ 
          profile: typedProfile,
          isLoading: false 
        });
        
        return typedProfile;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
      return null;
    }
  }, [updateAuthState]);

  // Check for manual session on startup
  useEffect(() => {
    const checkManualSession = async () => {
      if (typeof window === 'undefined') return;
      
      const manualSessionStr = localStorage.getItem('cordis-manual-session');
      if (!manualSessionStr) return;
      
      try {
        const manualData = JSON.parse(manualSessionStr);
        console.log('Found manual session in localStorage:', manualData);
        
        // Verify the profile still exists
        const { data: profileCheck, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', manualData.user.id)
          .single();
          
        if (profileError || !profileCheck) {
          console.warn('Manual session profile no longer exists, clearing session');
          localStorage.removeItem('cordis-manual-session');
          return;
        }
        
        // Update the auth state with the manual session
        updateAuthState({
          session: manualData.session,
          user: manualData.user,
          profile: profileCheck,
          isAuthenticated: true,
          isEmailVerified: true,
          isLoading: false,
        });
        
        console.log('Restored manual session successfully');
      } catch (error) {
        console.error('Error restoring manual session:', error);
        localStorage.removeItem('cordis-manual-session');
      }
    };
    
    checkManualSession();
  }, [updateAuthState]);

  // Handle auth state changes
  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (currentSession: Session | null, event?: AuthChangeEvent) => {
      if (!mounted) return;

      try {
        if (currentSession?.user) {
          // Auto-confirm email if not already confirmed
          if (!currentSession.user.email_confirmed_at) {
            await supabase.auth.updateUser({
              data: { email_confirmed_at: new Date().toISOString() }
            });
            
            // Refresh the session
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              currentSession = sessionData.session;
            }
          }
          
          updateAuthState({
            session: currentSession,
            user: currentSession.user,
            isAuthenticated: true,
            isEmailVerified: true, // Always treat email as verified
            isLoading: true,
            error: null,
          });

          const profile = await fetchProfile(currentSession.user.id);
          
          if (!mounted) return;

          updateAuthState({
            profile,
            isLoading: false,
          });

          if (event === 'SIGNED_IN') {
            // Check if we're on special pages that should handle redirection differently
            const isOnCallbackPage = pathname === '/auth/callback';
            const redirectTo = typeof window !== 'undefined' ? 
              new URLSearchParams(window.location.search).get('redirectTo') : null;
            
            // Don't redirect if we're on the callback page (handling auth redirect)
            if (!isOnCallbackPage) {
              // Determine where to redirect based on user role and current location
              let targetPath;
              
              if (redirectTo) {
                // If there's a specific redirect path, use that
                targetPath = redirectTo;
              } else if (profile?.role === 'admin') {
                // Admin users go to admin dashboard
                targetPath = '/admin/dashboard';
              } else if (profile?.role === 'manager') {
                // Manager users go to manager dashboard
                targetPath = '/manager/dashboard';
              } else {
                // Regular users go to user dashboard
                targetPath = '/dashboard';
              }
              
              // Only redirect if we're not already on the target path
              if (pathname !== targetPath) {
                console.log(`Auth state change: Redirecting user to ${targetPath}`);
                router.push(targetPath);
              } else {
                console.log(`User already on the correct page: ${targetPath}`);
              }
            } else {
              console.log('On callback page, not redirecting');
            }
          }
        } else {
          updateAuthState({
            session: null,
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
            isLoading: false,
            error: null,
          });

          const isOnAuthPage = pathname.startsWith('/auth');
          const isOnPublicPage = pathname === '/' || pathname.startsWith('/public');
          
          if (event === 'SIGNED_OUT' && !isOnAuthPage && !isOnPublicPage) {
            router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
          }
        }
      } catch (error) {
        console.error('Error in handleAuthChange:', error);
        if (mounted) {
          updateAuthState({
            error: getAuthError(error as Error),
            isLoading: false,
          });
        }
      }
    };

    const initializeAuth = async () => {
      try {
        updateAuthState({ isLoading: true });
        
        // First check for a manual session (for local development)
        const { checkAndRestoreManualSession } = await import('@/lib/supabase/auth-helper');
        const manualSession = checkAndRestoreManualSession();
        
        if (manualSession) {
          console.log('Restoring manual session:', manualSession);
          
          if (mounted) {
            updateAuthState({
              session: manualSession.session,
              user: manualSession.user,
              profile: manualSession.profile,
              isAuthenticated: true,
              isEmailVerified: true,
              isLoading: false,
            });
            
            toast.success('Session restored', {
              description: `Welcome back, ${manualSession.profile?.full_name || manualSession.user?.email}`,
            });
            
            return; // Skip normal auth flow if we have a manual session
          }
        }
        
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        await handleAuthChange(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          updateAuthState({
            error: getAuthError(error as Error),
            isLoading: false,
          });
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        handleAuthChange(session, event);
      }
    });

    // Properly handle subscription cleanup
    return () => {
      mounted = false;
      if (data && typeof data.subscription?.unsubscribe === 'function') {
        data.subscription.unsubscribe();
      }
    };
  }, [router, pathname, fetchProfile, updateAuthState]);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      // Reset any previous errors and set loading state
      updateAuthState({ isLoading: true, error: null });
      
      // Validate inputs
      if (!email || !password) {
        const error = new Error('Email and password are required');
        updateAuthState({ error, isLoading: false });
        toast.error('Email and password are required');
        return null;
      }

      console.log('Attempting to sign in with:', { email });
      
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      // Handle authentication errors
      if (error) {
        console.error('Supabase auth error:', error);
        
        let errorMessage = 'Authentication failed. Please try again.';
        
        // Handle specific error cases
        if (error.code === 'invalid_credentials' || error.message === 'Invalid login credentials') {
          errorMessage = 'Incorrect email or password. Please try again.';
          
          // Check if the user exists but password is wrong
          const { data: userExists } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email.trim().toLowerCase())
            .maybeSingle();
          
          if (userExists) {
            console.log('User exists but password is incorrect');
            errorMessage = 'Incorrect password. Please try again.';
          } else {
            console.log('User does not exist with this email');
            errorMessage = 'No account found with this email. Please check your email or sign up.';
          }
        }
        
        toast.error('Sign in failed', {
          description: errorMessage,
        });
        
        updateAuthState({ 
          error: new Error(errorMessage),
          isLoading: false 
        });
        
        return null;
      }
      
      if (!data?.user || !data?.session) {
        toast.error('Unable to sign in. Please try again.');
        updateAuthState({ isLoading: false });
        return null;
      }
      
      // Fetch user profile
      const userProfile = await fetchProfile(data.user.id);
      
      if (!userProfile) {
        toast.warning('Profile could not be loaded');
      }
      
      // Return the sign-in response
      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      updateAuthState({ isLoading: false });
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    userData?: Partial<Profile>
  ): Promise<SignUpResponse> => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      if (!email || !password) {
        const error = new Error('Email and password are required');
        updateAuthState({ error, isLoading: false });
        toast.error('Email and password are required');
        throw error;
      }
      
      // Check password strength
      if (password.length < 6) {
        const error = new Error('Password must be at least 6 characters long');
        updateAuthState({ error, isLoading: false });
        toast.error('Password too short', {
          description: 'Password must be at least 6 characters long',
        });
        throw error;
      }
      
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      
      if (existingUser) {
        console.log('User already exists with this email:', email.trim().toLowerCase());
        toast.error('An account with this email already exists');
        updateAuthState({ 
          error: new Error('An account with this email already exists'), 
          isLoading: false 
        });
        return { user: null, profile: null };
      }
      
      // Prepare role and normalize it
      const userRole = userData?.role || 'user';
      console.log('Creating new user with role:', userRole);
      
      // Register the user with Supabase Auth and auto-confirm email
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            // Include all user data in the metadata
            email_confirmed_at: new Date().toISOString(),
            full_name: userData?.full_name || '',
            role: userRole,
            // Add any other user data fields here
            avatar_url: userData?.avatar_url || null
          },
        },
      });
      
      console.log('Signup data sent to Supabase:', {
        email: email.trim().toLowerCase(),
        role: userRole,
        full_name: userData?.full_name || '',
      });
      
      // Auto-confirm email in development
      if (process.env.NODE_ENV === 'development' && data.user) {
        try {
          // Update the user's metadata to mark email as confirmed
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              email_confirmed_at: new Date().toISOString(),
              email_verified: true
            }
          });
          
          if (updateError) {
            console.warn('Could not update user metadata:', updateError);
          }
          
          // Also update the auth.users table if we have the right permissions
          try {
            await supabase.rpc('confirm_user_email', { user_id: data.user.id });
          } catch (rpcError) {
            console.warn('Could not confirm user email via RPC:', rpcError);
          }
          
        } catch (error) {
          console.warn('Could not auto-confirm email:', error);
        }
      }
      
      if (error) {
        console.error('Supabase auth error during sign up:', error);
        
        // Special handling for existing user
        if (error.message.includes('already registered')) {
          const errorMessage = 'An account with this email already exists.';
          const authError = new Error(errorMessage);
          updateAuthState({ error: authError, isLoading: false });
          toast.error(errorMessage, {
            description: 'Please try signing in instead.',
            duration: 5000,
          });
          throw authError;
        } else {
          const authError = getAuthError(error);
          updateAuthState({ error: authError, isLoading: false });
          toast.error(authError.message);
          throw authError;
        }
      }
      
      if (!data.user) {
        const error = new Error('No user data returned');
        console.error('Sign up error - no user data:', { data });
        updateAuthState({ error, isLoading: false });
        toast.error('Unable to create account. Please try again.');
        throw error;
      }
      
      // Create a profile for the user
      const newProfile: Profile = {
        id: data.user.id,
        email: email.trim(),
        full_name: userData?.full_name || email.split('@')[0] || null,
        role: userData?.role as UserRole || 'user',
        avatar_url: userData?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // First try to update existing profile if it exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      let profileData;
      let profileError;
      
      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            email: newProfile.email,
            full_name: newProfile.full_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)
          .select()
          .single();
          
        profileData = updatedProfile;
        profileError = updateError;
      } else {
        // Create new profile
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        profileData = createdProfile;
        profileError = createError;
      }
      
      if (profileError) {
        console.error('Error managing user profile:', profileError);
        // Don't block the user if profile update fails
        toast.warning('Account created, but there was an issue with your profile. Some features may be limited.');
      }
      
      // Check if email confirmation is required
      const needsEmailConfirmation = !data.user.email_confirmed_at;
      
      if (needsEmailConfirmation) {
        toast.success('Account created successfully!', {
          description: 'Please check your email to verify your account before signing in.',
          duration: 8000,
        });
        
        // Sign out the user since they need to confirm email first
        await supabase.auth.signOut();
        
        // Redirect to login page with a message
        router.push('/auth/login?message=verification_email_sent');
      } else {
        toast.success('Account created successfully!');
        
        // Fetch the complete profile
        const profile = profileData as Profile || await fetchProfile(data.user.id);
        
        return { user: data.user, profile };
      }
      
      return { 
        user: needsEmailConfirmation ? null : data.user, 
        profile: profileData as Profile || null 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      // Most errors are already handled above, but we need to rethrow
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
      throw error;
    }
  };
  
  // Sign out the user
  const signOut = async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      await supabase.auth.signOut();
      updateAuthState({
        session: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isEmailVerified: false,
        isLoading: false,
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
    }
  };
  
  // Update user profile
  const updateProfile = async (data: Partial<Profile>): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      if (!authState.user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authState.user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        updateAuthState({ 
          error: getAuthError(error),
          isLoading: false 
        });
        toast.error('Failed to update profile');
        throw error;
      }
      
      // Refresh the profile
      await fetchProfile(authState.user.id);
      
      toast.success('Profile updated successfully');
      updateAuthState({ isLoading: false });
    } catch (error) {
      console.error('Unexpected error in updateProfile:', error);
      updateAuthState({ 
        error: getAuthError(error as Error),
        isLoading: false 
      });
      throw error;
    }
  };


  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    session: authState.session,
    user: authState.user,
    profile: authState.profile,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    isEmailVerified: authState.isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetError,
    refreshSession,
    resendVerificationEmail,
  }), [
    authState.session,
    authState.user,
    authState.profile,
    authState.isLoading,
    authState.isAuthenticated,
    authState.isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetError,
    refreshSession,
    resendVerificationEmail,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
