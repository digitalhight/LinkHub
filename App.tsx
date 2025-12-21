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
      <div className="fixed inset-0 flex items-center justify-center bg-[#FDFDFF] z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-[#3D5AFE] rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl animate-pulse shadow-2xl shadow-blue-100">W</div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] animate-bounce">Chargement...</p>
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-500 max-w-xs mb-8 font-medium">Vous n'avez pas les permissions nécessaires.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl">Retour</button>
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

  const fullProfileUrl = `${window.location.origin}/${profile.username}`;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 font-['Plus_Jakarta_Sans']">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
      
      <header className="h-16 border-b border-gray-100 bg-white flex items-center px-6 justify-between flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3D5AFE] rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">W</div>
          <h1 className="font-black text-lg tracking-tighter">WomenCards<span className="text-[#3D5AFE]">.</span></h1>
        </div>
        
        <div className="flex gap-4 items-center">
          {(profile.is_admin || userAuthEmail === 'digitalhight2025@gmail.com') && (
            <button 
              onClick={() => window.location.href = '/admin'} 
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest px-4 py-2 bg-amber-50 rounded-lg transition-colors border border-amber-100 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
              Tableau de Bord Admin
            </button>
          )}
          <div className="h-6 w-px bg-gray-100 mx-2"></div>
          <button onClick={() => { supabase.auth.signOut().then(() => { setUserId(''); window.location.href = '/'; }); }} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">Déconnexion</button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className={`text-[11px] font-black px-8 py-2.5 rounded-full transition-all shadow-xl ${saveSuccess ? 'bg-green-500 text-white shadow-green-100' : 'bg-[#3D5AFE] text-white shadow-blue-100 active:scale-95 disabled:opacity-50'}`}
          >
            {saving ? 'PROCESS...' : saveSuccess ? 'SAUVEGARDÉ !' : 'ENREGISTRER'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar avec Onglets */}
        <div className="w-full lg:w-[420px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 overflow-hidden">
          {/* Tab Navigation */}
          <div className="px-8 pt-6 pb-2 border-b border-gray-50 flex gap-8">
            <button 
              onClick={() => setActiveEditorTab('profile')}
              className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${activeEditorTab === 'profile' ? 'text-[#3D5AFE]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Profil
              {activeEditorTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3D5AFE] rounded-full animate-in fade-in slide-in-from-bottom-1"></div>}
            </button>
            <button 
              onClick={() => setActiveEditorTab('links')}
              className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${activeEditorTab === 'links' ? 'text-[#3D5AFE]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Liens
              {activeEditorTab === 'links' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3D5AFE] rounded-full animate-in fade-in slide-in-from-bottom-1"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activeEditorTab === 'profile' ? (
                <div>
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#3D5AFE] rounded-full"></span>
                    Profil de la créatrice
                  </h2>
                  <ProfileSection profile={profile} setProfile={setProfile} />
                </div>
              ) : (
                <div>
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    Catalogue de liens
                  </h2>
                  <LinksSection profile={profile} setProfile={setProfile} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aperçu Mobile */}
        <div className="hidden lg:flex flex-1 bg-[#FDFDFF] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3d5afe_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.04]"></div>
          <div className="relative z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white shadow-sm mb-2 group cursor-pointer hover:bg-white transition-all active:scale-95" onClick={() => window.open(fullProfileUrl, '_blank')}>
              <p className="text-[11px] font-black text-[#3D5AFE] tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="opacity-40 font-bold uppercase tracking-widest text-[9px] mr-[-4px]">Ma Page :</span>
                <span className="underline decoration-blue-200 underline-offset-4">{fullProfileUrl.replace('https://', '').replace('http://', '')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-100 transition-opacity"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </p>
            </div>
            <div className="scale-90 xl:scale-100 drop-shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
              <PhonePreview profile={profile} />
            </div>
          </div>
        </div>

        {/* Section Thème */}
        <div className="hidden xl:flex w-[380px] bg-white border-l border-gray-100 flex-col flex-shrink-0 overflow-y-auto no-scrollbar">
          <div className="p-8 space-y-12">
            <div>
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Thèmes & Couleurs
              </h2>
              <ThemeSection profile={profile} setProfile={setProfile} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;