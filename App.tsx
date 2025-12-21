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
        console.warn("Erreur d'initialisation:", err.message);
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
      alert("Erreur de sauvegarde: " + (err.message || "Serveur indisponible"));
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

  const isAdmin = profile.is_admin || userAuthEmail === 'digitalhight2025@gmail.com';

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0118] z-[9999]">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.4)] font-['Bricolage_Grotesque']">W</div>
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
        {dbError && !isSupabaseConfigured() && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-4 z-50">
             <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Connexion serveur indisponible</span>
          </div>
        )}
      </>
    );
  }

  const fullProfileUrl = `https://www.women.cards/${profile.username}`;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0118] font-['Plus_Jakarta_Sans'] text-white">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
      
      {/* Header Responsif */}
      <header className="h-16 lg:h-20 border-b border-white/5 bg-[#0A0118]/80 backdrop-blur-3xl flex items-center px-4 lg:px-8 justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg font-['Bricolage_Grotesque']">W</div>
          <h1 className="font-black text-sm lg:text-lg tracking-tighter hidden xs:block">WomenCards<span className="text-purple-500">.</span></h1>
        </div>
        
        <div className="flex gap-2 lg:gap-6 items-center">
          {isAdmin && (
            <button 
              onClick={() => {
                setIsAdminView(true);
                window.history.pushState({}, '', '/admin');
              }}
              className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-amber-500/10 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-all group mr-2"
            >
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] lg:text-[10px] font-black text-amber-500 uppercase tracking-widest group-hover:text-amber-400">Super Admin</span>
            </button>
          )}

          <button onClick={() => { supabase.auth.signOut().then(() => { setUserId(''); window.location.href = '/'; }); }} className="text-[9px] lg:text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors hidden sm:block">Déconnexion</button>
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
            <button 
              onClick={() => setActiveEditorTab('profile')}
              className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap ${activeEditorTab === 'profile' ? 'text-white' : 'text-gray-500'}`}
            >
              PROFIL
              {activeEditorTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveEditorTab('links')}
              className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap ${activeEditorTab === 'links' ? 'text-white' : 'text-gray-500'}`}
            >
              LIENS
              {activeEditorTab === 'links' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveEditorTab('theme')}
              className={`pb-4 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap ${activeEditorTab === 'theme' ? 'text-white' : 'text-gray-500'}`}
            >
              THÈME
              {activeEditorTab === 'theme' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
              {activeEditorTab === 'profile' ? (
                <ProfileSection profile={profile} setProfile={setProfile} />
              ) : activeEditorTab === 'links' ? (
                <LinksSection profile={profile} setProfile={setProfile} />
              ) : (
                <div className="space-y-6">
                  <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Design du Profil</h2>
                  <ThemeSection profile={profile} setProfile={setProfile} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Container avec Panneau de Lien en Parallèle */}
        <div className="hidden lg:flex flex-1 bg-[#05010D] items-center justify-center relative overflow-hidden px-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px]"></div>
          
          <div className="relative z-10 flex items-center gap-12 xl:gap-20 animate-in zoom-in duration-1000">
             {/* GSM Preview */}
             <div className="scale-[0.8] xl:scale-[0.85] drop-shadow-[0_60px_100px_rgba(0,0,0,0.8)] border-[14px] border-[#120526] rounded-[5rem] bg-black overflow-hidden shadow-2xl ring-1 ring-white/10 transition-transform hover:scale-[0.87]">
                <PhonePreview profile={profile} />
             </div>

             {/* Link Panel - En parallèle du GSM */}
             <div className="w-[320px] space-y-6 animate-in slide-in-from-right-10 duration-700 delay-300">
               <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <div className="mb-6">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em] block mb-2">Lien de profil</span>
                    <h3 className="text-lg font-black tracking-tighter text-white truncate">women.cards/{profile.username}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={copyToClipboard}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group ${copyFeedback ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${copyFeedback ? 'bg-green-500 text-white' : 'bg-white/10 text-white group-hover:bg-purple-500'}`}>
                        {copyFeedback ? (
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ) : (
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{copyFeedback ? 'COPIÉ' : 'COPIER'}</span>
                    </button>

                    <button 
                      onClick={() => window.open(fullProfileUrl, '_blank')}
                      className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60">OUVRIR</span>
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Page en ligne</span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                      Votre page est accessible publiquement. Partagez ce lien sur vos réseaux sociaux (Instagram, TikTok, Bio) pour maximiser votre visibilité.
                    </p>
                  </div>
               </div>

               {/* Tips Card */}
               <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white flex-shrink-0 font-bold text-xs shadow-lg">?</div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Conseil d'Experte</h4>
                      <p className="text-[10px] text-purple-200/60 leading-relaxed">
                        Ajoutez des liens clairs et directs. Moins il y a de clics entre vous et votre cliente, plus vous convertissez.
                      </p>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* MOBILE PREVIEW BUTTON */}
      <button 
        onClick={() => setIsPreviewModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 border-2 border-white/20 active:scale-90 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black lg:hidden animate-in fade-in duration-300">
           <div className="absolute top-6 right-6 z-[110]">
              <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
           </div>
           <div className="w-full h-full flex items-center justify-center p-4">
              <div className="w-full h-full max-w-[380px] max-h-[780px] relative rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 border-4 border-[#120526]">
                <PhonePreview profile={profile} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;