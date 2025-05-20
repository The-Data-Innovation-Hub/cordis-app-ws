'use client';

import { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Session, User, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Types
type UserRole = 'admin' | 'user';

interface Profile {
  id: string;
  email: string;
  username: string | null;
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
  error: AuthError | null;
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
const getAuthError = (error: AuthError | Error): { message: string; status?: number } => {
  const message = error.message;
  const friendlyMessage = AUTH_ERRORS[message as AuthErrorKey] || 'An unexpected error occurred. Please try again.';
  
  return {
    message: friendlyMessage,
    status: 'status' in error ? error.status : 500,
  };
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
  
  const { session, user, profile, isLoading, error, isAuthenticated, isEmailVerified } = authState;
  const router = useRouter();
  const pathname = usePathname();
  
  // Update auth state helper
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({
      ...prev,
      ...updates,
      // Update derived state
      isAuthenticated: updates.session?.user !== undefined ? true : 
                      updates.session === null ? false : 
                      prev.isAuthenticated,
      isEmailVerified: updates.user?.email_confirmed_at ? true : 
                      updates.user === null ? false : 
                      prev.isEmailVerified,
    }));
  }, []);
  
  // Reset error state
  const resetError = useCallback(() => {
    updateAuthState({ error: null });
  }, [updateAuthState]);
  
  // Refresh session
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      updateAuthState({
        session: data.session,
        user: data.session?.user ?? null,
        isAuthenticated: !!data.session,
        isEmailVerified: !!data.session?.user?.email_confirmed_at,
      });
      
      if (data.session?.user) {
        await fetchProfile(data.session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  }, [updateAuthState]);
  
  // Resend verification email
  const resendVerificationEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Failed to send verification email. Please try again.');
      throw error;
    }
  }, []);
  
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
        // Don't log 404 errors as they're expected when a profile doesn't exist yet
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          updateAuthState({ 
            error: getAuthError(error),
            isLoading: false 
          });
        }
        return null;
      }

      if (profile) {
        const typedProfile: Profile = {
          ...profile,
          username: profile.username || null,
          full_name: profile.full_name || null,
          role: (profile.role as UserRole) || 'user',
          email: profile.email || '',
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString(),
        };
        
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

  // Handle auth state changes
  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const handleAuthChange = async (currentSession: Session | null, event?: AuthChangeEvent) => {
      if (!mounted) return;

      try {
        if (currentSession?.user) {
          // Update session and user
          updateAuthState({
            session: currentSession,
            user: currentSession.user,
            isAuthenticated: true,
            isEmailVerified: !!currentSession.user.email_confirmed_at,
            isLoading: true,
            error: null,
          });

          // Fetch user profile
          const profile = await fetchProfile(currentSession.user.id);
          
          if (!mounted) return;

          // Update state with profile
          updateAuthState({
            profile,
            isLoading: false,
          });

          // Handle redirects after sign in
          if (event === 'SIGNED_IN') {
            const isOnAuthPage = pathname.startsWith('/auth');
            const isOnCallbackPage = pathname === '/auth/callback';
            const redirectTo = new URLSearchParams(window.location.search).get('redirectTo');
            
            if (!isOnCallbackPage && !isOnAuthPage) {
              const redirectPath = redirectTo || (profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
              router.push(redirectPath);
            } else if (redirectTo && !isOnCallbackPage) {
              router.push(redirectTo);
            }
          }
        } else {
          // Handle sign out
          updateAuthState({
            session: null,
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
            isLoading: false,
            error: null,
          });

          // Redirect to login if not on a public route
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

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await handleAuthChange(session);
        }
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

    subscription = data;

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router, pathname, fetchProfile, updateAuthState]);

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      // Basic validation
      if (!email || !password) {
        const error = new Error('Email and password are required');
        throw error;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        const authError = getAuthError(error);
        updateAuthState({ error: authError });
        throw new Error(authError.message);
      }
      
      if (!data?.user) {
        const error = new Error('No user data returned');
        updateAuthState({ error: getAuthError(error) });
        throw error;
      }
      
      // Fetch profile
      const userProfile = await fetchProfile(data.user.id);
      
      if (!userProfile) {
        console.warn('User profile not found after sign in');
      }
      
      toast.success('Signed in successfully');
      return data;
      
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = getAuthError(error as Error);
      toast.error(authError.message);
      throw error;
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: Partial<Profile>): Promise<SignUpResponse> => {
    try {
      updateAuthState({ isLoading: true, error: null });
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Default user data
      const defaultUserData = {
        full_name: email.split('@')[0],
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
        ...userData
      };

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: defaultUserData
        }
      });

      if (error) {
        const authError = getAuthError(error);
        updateAuthState({ error: authError });
        throw new Error(authError.message);
      }

      if (!data?.user) {
        throw new Error('No user data returned from signup');
      }
      
      // Show success message
      toast.success('Account created! Please check your email to verify your account.');
      
      // Return the user data (without waiting for profile creation)
      return { 
        user: data.user, 
        profile: data.user ? await fetchProfile(data.user.id) : null 
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      const authError = getAuthError(error as Error);
      toast.error(authError.message);
      throw error;
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  // Sign out the current user
  const signOut = async (): Promise<void> => {
    try {
      updateAuthState({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
      router.push('/auth/login');
      
    } catch (error) {
      console.error('Sign out error:', error);
      const authError = getAuthError(error as Error);
      toast.error(authError.message);
      throw error;
    } finally {
      updateAuthState({ 
        isLoading: false,
        session: null,
        user: null,
        profile: null,
        isAuthenticated: false,
        isEmailVerified: false,
      });
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<Profile>): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      updateAuthState({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh the profile
      const updatedProfile = await fetchProfile(user.id);
      
      if (updatedProfile) {
        toast.success('Profile updated successfully');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const authError = getAuthError(error as Error);
      updateAuthState({ error: authError });
      toast.error(authError.message);
      throw error;
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  // Context value
  const value = useMemo(() => ({
    session,
    user,
    profile,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetError,
    refreshSession,
    resendVerificationEmail,
  }), [
    session,
    user,
    profile,
    isLoading,
    isAuthenticated,
    isEmailVerified,
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
      {!isLoading ? children : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
