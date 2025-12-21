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
  const [activeEditorTab, setActiveEditorTab] = useState<'profile' | 'links' | 'theme'>('profile');
  
  const [isPublicView, setIsPublicView] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); 
  const [publicUsername, setPublicUsername] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

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
    const initApp = async () => {
      if (isPublicView && publicUsername) {
        await fetchPublicProfile(publicUsername);
        return;
      }

      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUserId(session.user.id);
          setUserAuthEmail(session.user.email || '');
          await fetchProfile(session.user.id);
        }
      } catch (err: any) {
        setDbError("La base de données est actuellement indisponible.");
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [isPublicView, publicUsername]);

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
      alert("Erreur: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    const url = `https://www.women.cards/${profile.username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // LOGIQUE DE SECURITE : Amina (digitalhight2025@gmail.com) est TOUJOURS admin
  const isAdmin = profile.is_admin || userAuthEmail === 'digitalhight2025@gmail.com';

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0118] z-[9999]">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl animate-pulse font-['Bricolage_Grotesque']">W</div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (isPublicView) {
    return <PublicProfile profile={profile} notFound={notFound} />;
  }

  if (isAdminView) {
    if (!userId || !isAdmin) { window.location.href = '/'; return null; }
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

  const fullProfileUrl = `https://www.women.cards/${profile.username}`;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0118] font-['Plus_Jakarta_Sans'] text-white">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
      
      {/* Header avec bouton Super Admin protégé */}
      <header className="h-16 lg:h-20 border-b border-white/5 bg-[#0A0118]/80 backdrop-blur-3xl flex items-center px-4 lg:px-8 justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg font-['Bricolage_Grotesque']">W</div>
          <h1 className="font-black text-sm lg:text-lg tracking-tighter hidden xs:block">WomenCards<span className="text-purple-500">.</span></h1>
        </div>
        
        <div className="flex gap-2 lg:gap-6 items-center">
          {/* LE BOUTON SUPER ADMIN - PROTECTION MAXIMALE */}
          {isAdmin && (
            <button 
              onClick={() => {
                setIsAdminView(true);
                window.history.pushState({}, '', '/admin');
              }}
              className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-all group mr-2"
            >
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] lg:text-[10px] font-black text-amber-500 uppercase tracking-widest">Super Admin</span>
            </button>
          )}

          <button onClick={() => { supabase.auth.signOut().then(() => { setUserId(''); window.location.href = '/'; }); }} className="text-[9px] lg:text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest hidden sm:block">Déconnexion</button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className={`text-[9px] lg:text-[11px] font-black px-4 lg:px-10 py-2 lg:py-2.5 rounded-full transition-all shadow-xl ${saveSuccess ? 'bg-green-500 text-white' : 'bg-white text-[#0A0118] hover:scale-105 active:scale-95 disabled:opacity-50 border border-white'}`}
          >
            {saving ? 'SYNC...' : saveSuccess ? 'PUBLIÉ' : 'PUBLIER'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Editor */}
        <div className="w-full lg:w-[450px] bg-[#120526]/40 border-r border-white/5 flex flex-col flex-shrink-0 overflow-hidden backdrop-blur-3xl">
          <div className="px-6 lg:px-10 pt-6 lg:pt-8 pb-4 border-b border-white/5 flex gap-8 lg:gap-12 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveEditorTab('profile')} className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeEditorTab === 'profile' ? 'text-white' : 'text-gray-500'}`}>
              PROFIL
              {activeEditorTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
            <button onClick={() => setActiveEditorTab('links')} className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeEditorTab === 'links' ? 'text-white' : 'text-gray-500'}`}>
              LIENS
              {activeEditorTab === 'links' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
            <button onClick={() => setActiveEditorTab('theme')} className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeEditorTab === 'theme' ? 'text-white' : 'text-gray-500'}`}>
              THÈME
              {activeEditorTab === 'theme' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
            {activeEditorTab === 'profile' ? (
              <ProfileSection profile={profile} setProfile={setProfile} />
            ) : activeEditorTab === 'links' ? (
              <LinksSection profile={profile} setProfile={setProfile} />
            ) : (
              <ThemeSection profile={profile} setProfile={setProfile} />
            )}
          </div>
        </div>

        {/* Preview Container avec Panneau de Lien en Parallèle */}
        <div className="hidden lg:flex flex-1 bg-[#05010D] items-center justify-center relative overflow-hidden px-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px]"></div>
          
          <div className="relative z-10 flex items-center gap-12 xl:gap-20 animate-in zoom-in duration-1000">
             {/* GSM Preview */}
             <div className="scale-[0.8] xl:scale-[0.85] drop-shadow-[0_60px_100px_rgba(0,0,0,0.8)] border-[14px] border-[#120526] rounded-[5rem] bg-black overflow-hidden shadow-2xl ring-1 ring-white/10">
                <PhonePreview profile={profile} />
             </div>

             {/* Link Panel - En parallèle du GSM */}
             <div className="w-[320px] space-y-6">
               <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="mb-6">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em] block mb-2">Lien de profil</span>
                    <h3 className="text-lg font-black tracking-tighter text-white truncate">women.cards/{profile.username}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={copyToClipboard}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 ${copyFeedback ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        {copyFeedback ? '✓' : '❐'}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{copyFeedback ? 'COPIÉ' : 'COPIER'}</span>
                    </button>

                    <button 
                      onClick={() => window.open(fullProfileUrl, '_blank')}
                      className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">↗</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60">OUVRIR</span>
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Page en ligne</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                      Votre page est accessible publiquement. Partagez ce lien sur vos réseaux sociaux.
                    </p>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;