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
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl animate-pulse shadow-2xl shadow-purple-900/40">W</div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing System...</p>
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
          <h2 className="text-2xl font-black mb-2">Access Denied</h2>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest">Back</button>
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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0118] font-['Plus_Jakarta_Sans'] text-white">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={(id) => { setUserId(id); fetchProfile(id); }} />
      
      <header className="h-16 border-b border-white/5 bg-[#0A0118]/80 backdrop-blur-md flex items-center px-8 justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-900/20">W</div>
          <h1 className="font-black text-lg tracking-tighter">WomenCards<span className="text-purple-500">.</span></h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <button onClick={() => { supabase.auth.signOut().then(() => { setUserId(''); window.location.href = '/'; }); }} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Sign Out</button>
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className={`text-[11px] font-black px-8 py-2.5 rounded-full transition-all shadow-xl ${saveSuccess ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-100 active:scale-95 disabled:opacity-50'}`}
          >
            {saving ? 'SYNCING...' : saveSuccess ? 'SAVED' : 'PUBLISH'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[400px] bg-[#0F0421]/50 border-r border-white/5 flex flex-col flex-shrink-0 overflow-hidden backdrop-blur-xl">
          <div className="px-10 pt-8 pb-4 border-b border-white/5 flex gap-10">
            <button 
              onClick={() => setActiveEditorTab('profile')}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeEditorTab === 'profile' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Organization
              {activeEditorTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveEditorTab('links')}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeEditorTab === 'links' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Assets
              {activeEditorTab === 'links' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
            {activeEditorTab === 'profile' ? (
              <ProfileSection profile={profile} setProfile={setProfile} />
            ) : (
              <LinksSection profile={profile} setProfile={setProfile} />
            )}
          </div>
        </div>

        {/* Preview Container */}
        <div className="hidden lg:flex flex-1 bg-[#05010D] items-center justify-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-8 animate-in zoom-in duration-700">
             <div className="bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all active:scale-95" onClick={() => window.open(fullProfileUrl, '_blank')}>
                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-4">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  live.digital/{profile.username}
                  <svg className="opacity-40 group-hover:opacity-100 transition-opacity" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14L21 3"/></svg>
                </p>
             </div>
             <div className="scale-90 xl:scale-100 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-[12px] border-[#120526] rounded-[4rem] bg-black overflow-hidden shadow-2xl">
                <PhonePreview profile={profile} />
             </div>
          </div>
        </div>

        {/* Theme Sidebar */}
        <div className="hidden xl:flex w-[350px] bg-[#0F0421]/30 border-l border-white/5 flex-col flex-shrink-0 overflow-y-auto backdrop-blur-xl">
          <div className="p-10">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Theme Engine</h2>
            <ThemeSection profile={profile} setProfile={setProfile} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;