import React, { useState, useEffect } from 'react';
import { UserProfile, EditorTab } from './types';
import { INITIAL_PROFILE } from './constants';
import PhonePreview from './components/PhonePreview';
import EditorPanel from './components/EditorPanel';
import { AuthModal } from './components/AuthModal';
import { ConfigModal } from './components/ConfigModal';
import { supabase, isSupabaseConfigured, clearSupabaseConfig } from './utils/supabaseClient';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<EditorTab>(EditorTab.PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsConfigModalOpen(true);
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserId('');
        setProfile(INITIAL_PROFILE);
      } else if (session && session.user.id !== userId) {
        setUserId(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [userId]);

  const handleLoginSuccess = async (newUserId: string, isNewUser: boolean) => {
    setUserId(newUserId);
    if (isNewUser) {
      await saveChanges(newUserId);
    } else {
      await fetchProfile(newUserId);
    }
  };

  const fetchProfile = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
           console.error("Error fetching profile:", error.message);
        }
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({
          name: data.name || INITIAL_PROFILE.name,
          username: data.username || INITIAL_PROFILE.username,
          bio: data.bio || INITIAL_PROFILE.bio,
          avatarUrl: data.avatar_url || INITIAL_PROFILE.avatarUrl,
          phone: data.phone || INITIAL_PROFILE.phone,
          email: data.email || INITIAL_PROFILE.email,
          links: data.links || [],
          theme: data.theme || INITIAL_PROFILE.theme,
        });
      }
    } catch (err: any) {
      console.warn('Could not fetch profile data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
       setIsAuthModalOpen(true);
       return;
    }
    await saveChanges(userId);
  };

  const saveChanges = async (targetUserId: string) => {
    if (!targetUserId) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        id: targetUserId,
        name: profile.name,
        username: profile.username.toLowerCase().trim(),
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        email: profile.email,
        links: profile.links,
        theme: profile.theme,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(payload);

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Save failed:', err);
      alert(`Erreur lors de la sauvegarde : ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-indigo-600">
        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-slate-900 font-sans">
      <ConfigModal isOpen={isConfigModalOpen} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleLoginSuccess} />
      
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-white border-r border-gray-200">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Women<span className="text-indigo-600">Cards</span></h1>
          </div>
          <div className="ml-auto flex gap-3 items-center">
             {!userId && <button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">Log In / Sign Up</button>}
             {userId && <button onClick={() => { supabase.auth.signOut(); setProfile(INITIAL_PROFILE); }} className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 transition-colors border border-transparent hover:border-gray-200 rounded py-1">Sign Out</button>}
             <button onClick={handleSave} disabled={saving} className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all min-w-[120px] ${saveSuccess ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}>
              {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2" onClick={clearSupabaseConfig}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          <EditorPanel profile={profile} setProfile={setProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="relative z-10 scale-[0.9] xl:scale-100 transition-transform">
           <PhonePreview profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default App;