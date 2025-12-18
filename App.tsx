import React, { useState, useEffect } from 'react';
import { UserProfile, EditorTab } from './types';
import { INITIAL_PROFILE } from './constants';
import PhonePreview from './components/PhonePreview';
import EditorPanel from './components/EditorPanel';
import PublicProfile from './components/PublicProfile';
import { AuthModal } from './components/AuthModal';
import { ConfigModal } from './components/ConfigModal';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';

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

  // Déterminer la route au chargement
  useEffect(() => {
    const path = window.location.pathname.split('/').filter(Boolean);
    
    if (path.length > 0) {
      const segment = path[0].toLowerCase();
      // On exclut les fichiers statiques et les routes réservées
      const isFile = segment.includes('.');
      const isReserved = ['index.html', 'auth', 'login', 'api', 'admin', 'https:', 'http:'].includes(segment);
      const isLikelyUsername = /^[a-zA-Z0-9_]{3,20}$/.test(segment);

      if (!isFile && !isReserved && isLikelyUsername) {
        setIsPublicView(true);
        setPublicUsername(segment);
        return;
      }
    }
    
    setIsPublicView(false);
    setPublicUsername(null);
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
        console.warn("Session check failed");
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
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    
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
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

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
    } catch (err) {
      console.warn('Profile fetch ignored');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
       setIsAuthModalOpen(true);
       return;
    }
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        id: userId,
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

      const { error } = await supabase.from('profiles').upsert(payload);
      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Erreur : ${err.message || 'Sauvegarde échouée'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl animate-bounce">W</div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chargement</p>
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
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(id) => { setUserId(id); fetchProfile(id); }} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-white border-r border-gray-200 shadow-xl">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Women<span className="text-indigo-600">Cards</span></h1>
          </div>
          <div className="ml-auto flex gap-3 items-center">
             {!userId && <button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm">Connexion</button>}
             {userId && <button onClick={() => { supabase.auth.signOut(); setUserId(''); setProfile(INITIAL_PROFILE); }} className="text-xs font-medium text-gray-400 hover:text-red-600 px-2 transition-colors">Sortir</button>}
             <button onClick={handleSave} disabled={saving} className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all min-w-[120px] shadow-sm ${saveSuccess ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}>
              {saving ? '...' : saveSuccess ? 'Enregistré' : 'Enregistrer'}
            </button>
            <button className="p-2 text-gray-300 hover:text-indigo-500 transition-colors" onClick={() => setIsConfigModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative bg-gray-50/50">
          <EditorPanel profile={profile} setProfile={setProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="relative z-10 scale-[0.85] xl:scale-100 transition-transform duration-500">
           <PhonePreview profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default App;