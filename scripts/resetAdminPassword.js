// scripts/resetAdminPassword.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const userId = '1b251b24-dce5-4f8e-a7cb-aaf089c9e931';
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: 'Films@123'
  });
  if (error) console.error('Reset failed:', error.message);
  else console.log('Password reset for', data.user.email);
}

run();

