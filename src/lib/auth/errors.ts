import { AuthError } from '@supabase/supabase-js';

export type AuthErrorMessage = {
  title: string;
  description: string;
};

export function getAuthErrorMessage(error: Error | AuthError | null): AuthErrorMessage {
  if (!error) return { title: 'Error', description: 'An unknown error occurred' };

  // Handle Supabase auth errors
  if ('code' in error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
        };
      case 'auth/email-already-in-use':
        return {
          title: 'Email Already Registered',
          description: 'This email is already registered. Please sign in or use a different email.',
        };
      case 'auth/weak-password':
        return {
          title: 'Weak Password',
          description: 'Password should be at least 8 characters and include numbers, letters, and special characters.',
        };
      case 'auth/user-not-found':
        return {
          title: 'User Not Found',
          description: 'No account found with this email. Please check your email or sign up.',
        };
      case 'auth/wrong-password':
        return {
          title: 'Incorrect Password',
          description: 'The password you entered is incorrect. Please try again.',
        };
      case 'auth/too-many-requests':
        return {
          title: 'Too Many Attempts',
          description: 'Too many unsuccessful attempts. Please try again later.',
        };
      case 'auth/popup-closed-by-user':
        return {
          title: 'Authentication Cancelled',
          description: 'The authentication process was cancelled. Please try again.',
        };
      case 'auth/network-request-failed':
        return {
          title: 'Network Error',
          description: 'Please check your internet connection and try again.',
        };
      case 'auth/expired-action-code':
        return {
          title: 'Link Expired',
          description: 'The authentication link has expired. Please request a new one.',
        };
      case 'auth/invalid-action-code':
        return {
          title: 'Invalid Link',
          description: 'The authentication link is invalid. Please request a new one.',
        };
      default:
        return {
          title: 'Authentication Error',
          description: error.message || 'An error occurred during authentication.',
        };
    }
  }

  // Handle other errors
  return {
    title: 'Error',
    description: error.message || 'An unexpected error occurred. Please try again.',
  };
}
