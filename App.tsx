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
  const [activeTab, setActiveTab] = useState<EditorTab>(EditorTab.LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setIsConfigModalOpen(true);
      setLoading(false);
      return;
    }

    // 2. Non-blocking Auth Check
    // We check for a session, but we don't block the UI if no session exists (Guest Mode)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
          // If we have a user, we try to fetch their data
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.warn("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserId('');
        setProfile(INITIAL_PROFILE);
      } else if (session && session.user.id !== userId) {
        setUserId(session.user.id);
        // Note: We don't auto-fetch here to avoid overwriting state during a "Sign Up" event
        // The handleLoginSuccess function manages the specific logic (Load vs Save)
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [userId]);

  const handleLoginSuccess = async (newUserId: string, isNewUser: boolean) => {
    setUserId(newUserId);
    
    if (isNewUser) {
      // SCENARIO 1: Sign Up (New User)
      // The user just created an account. They likely want to SAVE the Vcard they just edited.
      await saveChanges(newUserId);
    } else {
      // SCENARIO 2: Sign In (Existing User)
      // The user logged in. We should LOAD their existing Vcard from the database.
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
        if (error.code !== 'PGRST116') { // PGRST116 = JSON object requested, multiple (or no) rows returned
           console.error("Error fetching profile:", error.message);
        }
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({
          name: data.name || INITIAL_PROFILE.name,
          bio: data.bio || INITIAL_PROFILE.bio,
          avatarUrl: data.avatar_url || INITIAL_PROFILE.avatarUrl,
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
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
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
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    // Only full screen load if we have absolutely no data to show
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-indigo-600">
        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-slate-900 font-sans">
      <ConfigModal isOpen={isConfigModalOpen} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleLoginSuccess} 
      />
      
      {/* Left Side - Editor */}
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-white border-r border-gray-200 shadow-xl lg:shadow-none lg:relative">
         {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">LinkHub<span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="ml-auto flex gap-3 items-center">
             
             {/* Auth Status */}
             {!userId && (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Log In / Sign Up
                </button>
             )}
             
             {userId && (
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => {
                    supabase.auth.signOut();
                    setProfile(INITIAL_PROFILE);
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 transition-colors border border-transparent hover:border-gray-200 rounded py-1"
                  title="Click to Sign Out"
                 >
                   Sign Out ({userId.slice(0, 4)}...)
                 </button>
               </div>
             )}

             <button 
              onClick={handleSave}
              disabled={saving}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 min-w-[120px] justify-center ${
                saveSuccess 
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : saving
                    ? 'bg-indigo-400 text-white cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button 
              className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2"
              onClick={clearSupabaseConfig}
              title="Reset Database Connection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </div>
        </header>

        {/* Editor Main Content */}
        <div className="flex-1 overflow-hidden relative">
          <EditorPanel 
            profile={profile} 
            setProfile={setProfile} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="relative z-10 scale-[0.9] xl:scale-100 transition-transform">
           <PhonePreview profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default App;