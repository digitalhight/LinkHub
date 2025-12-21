import React, { useState, useEffect } from 'react';
import { UserProfile, EditorTab } from './types';
import { INITIAL_PROFILE } from './constants';
import PhonePreview from './components/PhonePreview';
import { ProfileSection, LinksSection, ThemeSection } from './components/EditorSections';
import PublicProfile from './components/PublicProfile';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userAuthEmail, setUserAuthEmail] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'profile' | 'links'>('profile');
  
  const [isPublicView, setIsPublicView] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [publicUsername, setPublicUsername] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const checkRouting = () => {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      let firstSegment = pathSegments.length > 0 ? pathSegments[0] : null;
      
      if (firstSegment === 'admin') {
        setIsAdminView(true);
        setIsPublicView(false);
        return;
      }

      if (firstSegment) {
        const segment = firstSegment.toLowerCase();
        const isReserved = ['index.html', 'auth', 'login', 'api', 'admin', 'assets', 'static'].includes(segment);
        if (!isReserved && !segment.includes('.') && segment.length >= 3) {
          setIsPublicView(true);
          setIsAdminView(false);
          setPublicUsername(segment);
          return;
        }
      }

      setIsAdminView(false);
      setIsPublicView(false);
    };

    checkRouting();
    window.addEventListener('popstate', checkRouting);
    return () => window.removeEventListener('popstate', checkRouting);
  }, []);

  useEffect(() => {
    if (isPublicView && publicUsername) {
      fetchPublicProfile(publicUsername);
      return;
    }

    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          setUserAuthEmail(session.user.email || '');
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn("Session check error");
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
          id: data.id,
          name: data.name || INITIAL_PROFILE.name,
          username: data.username || INITIAL_PROFILE.username,
          bio: data.bio || INITIAL_PROFILE.bio,
          avatarUrl: data.avatar_url || INITIAL_PROFILE.avatarUrl,
          phone: data.phone || INITIAL_PROFILE.phone,
          email: data.email || INITIAL_PROFILE.email,
          links: data.links || [],
          theme: data.theme || INITIAL_PROFILE.theme,
          is_admin: data.is_admin || false,
        });
      }
    } catch (err) {}
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
        email: profile.email || userAuthEmail,
        links: profile.links,
        theme: profile.theme,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('profiles').upsert(payload);
      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0A0118] z-[9999]">
        <div className="flex flex-col items-center gap-6 text-white">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.4)]">W</div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Initialisation Système...</p>
        </div>
      </div>
    );
  }

  if (isPublicView) {
    return <PublicProfile profile={profile} notFound={notFound} />;
  }

  if (isAdminView) {
    const isAdmin = profile.is_admin || userAuthEmail === 'digitalhight2025@gmail.com';
    if (!userId) { window.location.href = '/'; return null; }
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0118] p-10 text-white">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Accès Restreint</h2>
          <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Retour</button>
        </div>
      );
    }
    return <AdminDashboard currentUser={profile} />;
  }

  if (!userId) {
    return (
      <>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
        <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />
      </>
    );
  }

  // URL DE PROFIL FORCÉE SUR LE DOMAINE FINAL
  const fullProfileUrl = `https://www.women.cards/${profile.username}`;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0118] font-['Plus_Jakarta_Sans'] text-white">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
      
      <header className="h-16 border-b border-white/5 bg-[#0A0118]/80 backdrop-blur-3xl flex items-center px-8 justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">W</div>
          <h1 className="font-black text-lg tracking-tighter">WomenCards<span className="text-purple-500">.</span></h1>
        </div>
        
        <div className="flex gap-6 items-center">
          <button onClick={() => { supabase.auth.signOut().then(() => { setUserId(''); window.location.href = '/'; }); }} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Déconnexion</button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className={`text-[11px] font-black px-10 py-2.5 rounded-full transition-all shadow-xl ${saveSuccess ? 'bg-green-500 text-white' : 'bg-white text-[#0A0118] hover:scale-105 active:scale-95 disabled:opacity-50 border border-white'}`}
          >
            {saving ? 'SYNC...' : saveSuccess ? 'PUBLIÉ' : 'PUBLIER'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[420px] bg-[#120526]/40 border-r border-white/5 flex flex-col flex-shrink-0 overflow-hidden backdrop-blur-3xl">
          <div className="px-10 pt-8 pb-4 border-b border-white/5 flex gap-12">
            <button 
              onClick={() => setActiveEditorTab('profile')}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeEditorTab === 'profile' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              PROFIL
              {activeEditorTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]"></div>}
            </button>
            <button 
              onClick={() => setActiveEditorTab('links')}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeEditorTab === 'links' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              LIENS
              {activeEditorTab === 'links' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeEditorTab === 'profile' ? (
                <ProfileSection profile={profile} setProfile={setProfile} />
              ) : (
                <LinksSection profile={profile} setProfile={setProfile} />
              )}
            </div>
          </div>
        </div>

        {/* Preview Container - LIEN DÉPLACÉ EN DESSOUS DU GSM */}
        <div className="hidden lg:flex flex-1 bg-[#05010D] items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px]"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-8 animate-in zoom-in duration-1000">
             
             {/* SIMULATEUR GSM */}
             <div className="scale-[0.8] xl:scale-[0.85] drop-shadow-[0_60px_100px_rgba(0,0,0,0.8)] border-[14px] border-[#120526] rounded-[5rem] bg-black overflow-hidden shadow-2xl ring-1 ring-white/10">
                <PhonePreview profile={profile} />
             </div>

             {/* LE LIEN AU DESSOUS DU GSM */}
             <div className="w-full max-w-[320px]">
               <button 
                onClick={() => window.open(fullProfileUrl, '_blank')}
                className="w-full bg-white/5 backdrop-blur-3xl px-6 py-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all active:scale-95 shadow-2xl flex items-center justify-between"
               >
                  <div className="flex flex-col items-start gap-1 overflow-hidden">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Lien de profil :</span>
                    <p className="text-[11px] font-bold text-white truncate max-w-full">
                      www.women.cards/{profile.username}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg>
                  </div>
               </button>
             </div>
          </div>
        </div>

        {/* Theme Sidebar */}
        <div className="hidden xl:flex w-[380px] bg-[#0F0421]/40 border-l border-white/5 flex-col flex-shrink-0 overflow-y-auto backdrop-blur-3xl">
          <div className="p-10">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">Moteur de Thèmes</h2>
            <ThemeSection profile={profile} setProfile={setProfile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;