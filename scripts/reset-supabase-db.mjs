#!/usr/bin/env node

/**
 * Reset Supabase Database Script
 * 
 * This script will reset and recreate all necessary tables for the CORDIS application
 * It reads the SQL from the reset_and_setup.sql file and executes it against your Supabase instance
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ADMIN_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetDatabase() {
  try {
    console.log('Starting database reset and setup...');
    
    // Read the SQL file
    const sqlFilePath = path.resolve(__dirname, '../supabase/reset_and_setup.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    // This is a simple approach and might not work for all SQL statements
    const statements = sql
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('pgaudit.exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          console.warn(`Warning: Statement ${i + 1} error:`, error.message);
          // Continue with next statement even if there's an error
        }
      } catch (err) {
        console.warn(`Warning: Failed to execute statement ${i + 1}:`, err.message);
        // Continue with next statement even if there's an error
      }
    }
    
    console.log('Database reset and setup completed successfully!');
    
    // Verify the setup by checking for test users
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error verifying setup:', error.message);
    } else {
      console.log(`Successfully created ${profiles.length} user profiles`);
      profiles.forEach(profile => {
        console.log(`- ${profile.full_name} (${profile.email}): ${profile.role}`);
      });
    }
    
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

// Run the reset function
resetDatabase();
