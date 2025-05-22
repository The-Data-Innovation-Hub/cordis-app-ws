#!/usr/bin/env node

/**
 * Check environment variables and update them if needed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('Creating new .env.local file...');
  
  // Create a new .env.local file with the correct values from the Supabase local instance
  const envContent = `# Supabase local development configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('.env.local file created successfully!');
} else {
  console.log('Updating existing .env.local file...');
  
  // Read the existing .env.local file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check and update NEXT_PUBLIC_SUPABASE_URL
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_URL=.*/,
      'NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321'
    );
    if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
      envContent += '\nNEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321';
    }
  }
  
  // Check and update NEXT_PUBLIC_SUPABASE_ANON_KEY
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  if (!envContent.includes(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
    );
    if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      envContent += `\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`;
    }
  }
  
  // Check and update SUPABASE_SERVICE_ROLE_KEY
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
  if (!envContent.includes(`SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`)) {
    envContent = envContent.replace(
      /SUPABASE_SERVICE_ROLE_KEY=.*/,
      `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
    );
    if (!envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
      envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`;
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(envPath, envContent);
  console.log('.env.local file updated successfully!');
}

console.log('Environment variables are now configured for local Supabase development.');
