// scripts/promoteUser.js
require('dotenv').config();               // ← loads variables from ../.env
const { createClient } = require('@supabase/supabase-js');

// Pull in the URL & Service Role key from .env
const SUPABASE_URL       = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// Only this admin client uses the Service Role
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function run() {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node scripts/promoteUser.js <a8655243-1880-48fa-8cc1-4037d5a2ecdc>');
    process.exit(1);
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { role: 'admin' }
  });

  if (error) {
    console.error('❌ Promotion failed:', error);
    process.exit(1);
  }

  console.log('✅ User promoted to admin:', data);
  process.exit(0);
}

run();
