import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://dadrmkmbshxqqjcbdhis.supabase.co';
const DEFAULT_KEY = 'sb_publishable_Jp_OATD6Xkg_E33iSC7Ueg_QBobwQ2W';

const getStored = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const SUPABASE_URL = getStored('sb_url') || DEFAULT_URL;
const SUPABASE_ANON_KEY = getStored('sb_key') || DEFAULT_KEY;

const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http');
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
  return SUPABASE_URL && 
         SUPABASE_ANON_KEY && 
         SUPABASE_URL.includes('supabase.co');
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (!url || !key) return;
  try {
    localStorage.setItem('sb_url', url.trim());
    localStorage.setItem('sb_key', key.trim());
    window.location.reload();
  } catch (e) {
    alert("Impossible de sauvegarder la config (localStorage bloqué)");
  }
};