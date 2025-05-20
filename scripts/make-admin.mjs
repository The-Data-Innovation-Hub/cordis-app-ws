import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

async function makeAdmin(email) {
  try {
    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Update user role to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Successfully made ${email} an admin!`);
  } catch (error) {
    console.error('Error making user admin:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: node scripts/make-admin.mjs <email>');
  process.exit(1);
}

makeAdmin(email);
