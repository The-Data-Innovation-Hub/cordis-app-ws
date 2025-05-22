/**
 * Test authentication script for Supabase
 * 
 * This script can be used to test authentication with the test users
 * Run it in the browser console to verify login functionality
 */

import { supabase } from './client';

// Test credentials
const TEST_USERS = [
  { email: 'admin@example.com', password: 'Password123', role: 'admin' },
  { email: 'manager@example.com', password: 'Password123', role: 'manager' },
  { email: 'user@example.com', password: 'Password123', role: 'user' },
];

// Test login function
export async function testLogin(email: string, password: string) {
  console.log(`Attempting to log in with: ${email}`);
  
  try {
    // Clear any existing session first
    await supabase.auth.signOut();
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });
    
    if (error) {
      console.error('Login failed:', error);
      return { success: false, error };
    }
    
    if (!data?.user) {
      console.error('No user returned from login');
      return { success: false, error: new Error('No user returned') };
    }
    
    console.log('Login successful!', {
      user: data.user,
      session: data.session,
    });
    
    // Fetch the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('User profile:', profile);
    }
    
    return { success: true, user: data.user, session: data.session, profile };
  } catch (err) {
    console.error('Unexpected error during login:', err);
    return { success: false, error: err };
  }
}

// Function to test all users
export async function testAllUsers() {
  const results = [];
  
  for (const user of TEST_USERS) {
    console.log(`Testing user with role: ${user.role}`);
    const result = await testLogin(user.email, user.password);
    results.push({ ...user, result });
    
    // Sign out between tests
    await supabase.auth.signOut();
  }
  
  console.log('All test results:', results);
  return results;
}

// Make functions available in global scope for browser testing
if (typeof window !== 'undefined') {
  (window as any).testLogin = testLogin;
  (window as any).testAllUsers = testAllUsers;
  (window as any).TEST_USERS = TEST_USERS;
  
  console.log('Auth testing functions available:');
  console.log('- testLogin(email, password)');
  console.log('- testAllUsers()');
  console.log('- TEST_USERS');
}
