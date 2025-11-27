import { createClient } from '@supabase/supabase-js';

// User provided credentials
const DEFAULT_URL = 'https://dadrmkmbshxqqjcbdhis.supabase.co';
const DEFAULT_KEY = 'sb_publishable_Jp_OATD6Xkg_E33iSC7Ueg_QBobwQ2W';

const STORED_URL = localStorage.getItem('sb_url');
const STORED_KEY = localStorage.getItem('sb_key');

// Use stored credentials if available, otherwise use defaults
const SUPABASE_URL = STORED_URL || DEFAULT_URL;
const SUPABASE_ANON_KEY = STORED_KEY || DEFAULT_KEY;

// Ensure we have a valid URL format to prevent createClient from throwing
const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http');
  } catch {
    return false;
  }
};

const urlToUse = isValidUrl(SUPABASE_URL) ? SUPABASE_URL : 'https://placeholder.supabase.co';
const keyToUse = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(urlToUse, keyToUse, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

export const isSupabaseConfigured = () => {
  return SUPABASE_URL.length > 0 && 
         SUPABASE_ANON_KEY.length > 0 && 
         SUPABASE_URL.includes('supabase.co');
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (!url || !key) return;
  localStorage.setItem('sb_url', url.trim());
  localStorage.setItem('sb_key', key.trim());
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('sb_url');
  localStorage.removeItem('sb_key');
  window.location.reload();
};