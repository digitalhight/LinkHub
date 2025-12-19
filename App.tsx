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

  // Détection du profil via le Hash (#/username) ou le Pathname (/username)
  useEffect(() => {
    const checkRouting = () => {
      // 1. On vérifie d'abord le Pathname (URL propre)
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      let candidate = pathSegments.length > 0 ? pathSegments[0] : null;

      // 2. Si rien dans le path, on regarde le Hash (fallback)
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
      
      if (!candidate && hash) {
        candidate = hash;
        // On "nettoie" l'URL dans la barre d'adresse pour supprimer le # si possible
        try {
          window.history.replaceState(null, '', `/${hash}`);
        } catch (e) {
          console.warn("Could not rewrite URL");
        }
      }

      if (candidate) {
        const segment = candidate.toLowerCase();
        // Liste d'exclusions pour éviter de prendre des fichiers ou routes système pour des pseudos
        const isReserved = ['index.html', 'auth', 'login', 'api', 'admin', 'assets', 'static'].includes(segment);
        const isFile = segment.includes('.');

        if (!isReserved && !isFile && segment.length >= 3) {
          setIsPublicView(true);
          setPublicUsername(segment);
          return;
        }
      }
      setIsPublicView(false);
    };

    checkRouting();
    window.addEventListener('popstate', checkRouting);
    window.addEventListener('hashchange', checkRouting);
    return () => {
      window.removeEventListener('popstate', checkRouting);
      window.removeEventListener('hashchange', checkRouting);
    };
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
  }, [isPublicView, publicUsername]);

  const fetchPublicProfile = async (username: string) => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
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
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
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
      console.warn("Profile load failed");
    }
  };

  const handleSave = async () => {
    if (!userId) { setIsAuthModalOpen(true); return; }
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
      
      if (error) {
        if (error.message.includes('email')) {
          throw new Error("La colonne 'email' est manquante. Cliquez sur l'icône crayon pour le script SQL.");
        }
        throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl animate-bounce">W</div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Initialisation</p>
        </div>
      </div>
    );
  }

  if (isPublicView) {
    return <PublicProfile profile={profile} notFound={notFound} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-slate-900">
      <ConfigModal isOpen={isConfigModalOpen} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(id) => { setUserId(id); fetchProfile(id); }} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-200">
        <header className="h-16 border-b border-gray-100 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
            <h1 className="font-bold text-lg hidden sm:block">WomenCards</h1>
          </div>
          <div className="flex gap-2 items-center">
             {!userId && <button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg">Connexion</button>}
             {userId && <button onClick={() => { supabase.auth.signOut(); setUserId(''); setProfile(INITIAL_PROFILE); }} className="text-xs font-medium text-gray-400 hover:text-red-600 px-2 transition-colors">Sortir</button>}
             <button onClick={handleSave} disabled={saving} className={`text-xs font-bold px-4 py-2 rounded-lg transition-all min-w-[100px] ${saveSuccess ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white disabled:opacity-50'}`}>
              {saving ? '...' : saveSuccess ? 'OK !' : 'Enregistrer'}
            </button>
            <button className="p-2 text-gray-300 hover:text-indigo-600" onClick={() => setIsConfigModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </div>
        </header>
        <EditorPanel profile={profile} setProfile={setProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
        <div className="scale-90 xl:scale-100"><PhonePreview profile={profile} /></div>
      </div>
    </div>
  );
};

export default App;