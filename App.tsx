import React, { useState, useEffect } from 'react';
import { UserProfile, EditorTab } from './types';
import { INITIAL_PROFILE } from './constants';
import PhonePreview from './components/PhonePreview';
import EditorPanel from './components/EditorPanel';
import PublicProfile from './components/PublicProfile';
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
  
  const [isPublicView, setIsPublicView] = useState(false);
  const [publicUsername, setPublicUsername] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    
    // Logic to determine if we are in public view mode
    // We ignore common system paths and files with extensions (assets)
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0].toLowerCase();
      const hasExtension = firstSegment.includes('.');
      const isSystemPath = ['index.html', 'auth', 'login', 'admin', 'api', 'https:', 'http:'].includes(firstSegment);
      const isValidUsernameFormat = /^[a-zA-Z0-9_]+$/.test(firstSegment);

      if (!hasExtension && !isSystemPath && isValidUsernameFormat) {
        setIsPublicView(true);
        setPublicUsername(firstSegment);
      } else {
        setIsPublicView(false);
        setPublicUsername(null);
      }
    } else {
      setIsPublicView(false);
      setPublicUsername(null);
    }
  }, []);

  useEffect(() => {
    if (isPublicView && publicUsername) {
      fetchPublicProfile(publicUsername);
      return;
    }

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
  }, [userId, isPublicView, publicUsername]);

  const fetchPublicProfile = async (username: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase().trim())
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        console.warn("Profile not found:", username);
      } else {
        setProfile({
          name: data.name || username,
          username: data.username,
          bio: data.bio || '',
          avatarUrl: data.avatar_url || '',
          phone: data.phone || '',
          email: data.email || '',
          links: data.links || [],
          theme: data.theme || INITIAL_PROFILE.theme,
        });
      }
    } catch (err) {
      console.error("Fetch public profile error", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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
      const payload: any = {
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

      if (error) {
        if (error.code === '42703') {
          throw new Error("La colonne 'username' est manquante dans votre table Supabase.");
        }
        throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Save failed:', err);
      alert(`Erreur : ${err.message || 'La sauvegarde a échoué'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl animate-pulse">W</div>
          <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isPublicView) {
    return <PublicProfile profile={profile} notFound={notFound} />;
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
             {!userId && <button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">Connexion</button>}
             {userId && <button onClick={() => { supabase.auth.signOut(); setUserId(''); setProfile(INITIAL_PROFILE); }} className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 transition-colors">Déconnexion</button>}
             <button onClick={handleSave} disabled={saving} className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all min-w-[120px] ${saveSuccess ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}>
              {saving ? 'Sauvegarde...' : saveSuccess ? 'Enregistré !' : 'Enregistrer'}
            </button>
            <button className="text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors px-2" onClick={() => setIsConfigModalOpen(true)} title="Configuration"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
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