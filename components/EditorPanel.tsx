import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, EditorTab, LinkItem, ThemeConfig } from '../types';
import { DEFAULT_THEMES } from '../constants';
import { generateTheme } from '../utils/ai';
import { supabase } from '../utils/supabaseClient';

const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Grip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Wand: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 2 2 2-2 2-2-2 2-2Z"/><path d="m5 2 2 2-2 2-2-2 2-2Z"/><path d="m15 11 2 2-2 2-2-2 2-2Z"/><path d="M6 18c-1.1 0-2-0.9-2-2v-4.5c0-0.3 0.1-0.6 0.2-0.8L8.3 6.6c0.5-0.8 1.4-1.3 2.3-1.3h2.8c0.9 0 1.8 0.5 2.3 1.3l4.1 4.1c0.1 0.2 0.2 0.5 0.2 0.8V16c0 1.1-0.9 2-2 2H6Z"/></svg>,
  ArrowUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

interface EditorPanelProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ profile, setProfile, activeTab, setActiveTab }) => {
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [themePrompt, setThemePrompt] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }
    
    setIsCheckingUsername(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase().trim())
        .maybeSingle();

      if (error) throw error;
      setIsUsernameAvailable(!data || data.id === currentUserId);
    } catch (err) {
      console.error("Availability check error:", err);
      setIsUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUsernameAvailability(profile.username);
    }, 500);
    return () => clearTimeout(timer);
  }, [profile.username, checkUsernameAvailability]);

  const handleLinkChange = (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = profile.links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setProfile({ ...profile, links: newLinks });
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'Nouveau lien',
      url: 'https://',
      isActive: true,
    };
    setProfile({ ...profile, links: [newLink, ...profile.links] });
  };

  const removeLink = (id: string) => {
    setProfile({ ...profile, links: profile.links.filter(l => l.id !== id) });
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...profile.links];
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    setProfile({ ...profile, links: newLinks });
  };

  const handleMagicTheme = async () => {
    if (!themePrompt) return;
    setIsGeneratingTheme(true);
    try {
      const newThemeColors = await generateTheme(themePrompt);
      const newTheme: ThemeConfig = {
        ...profile.theme,
        ...newThemeColors,
        id: `custom-${Date.now()}`,
        name: 'Thème IA',
      };
      setProfile({ ...profile, theme: newTheme });
    } catch (e) {
      alert("Erreur de génération du thème.");
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  const renderLinksEditor = () => (
    <div className="space-y-4">
      <button 
        onClick={addLink}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Icons.Plus /> Ajouter un lien
      </button>

      <div className="space-y-3 mt-6">
        {profile.links.length === 0 && <p className="text-gray-400 text-center py-8">Aucun lien. Ajoutez-en un !</p>}
        {profile.links.map((link, index) => (
          <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                <Icons.Grip />
              </div>
              <div className="flex-1 font-semibold text-gray-700 text-sm">
                {link.title || 'Lien sans titre'}
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><Icons.ArrowUp /></button>
                 <button onClick={() => moveLink(index, 'down')} disabled={index === profile.links.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><Icons.ArrowDown /></button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={link.isActive} onChange={(e) => handleLinkChange(link.id, 'isActive', e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                <button onClick={() => removeLink(link.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-1"><Icons.Trash /></button>
              </div>
            </div>
            <div className="space-y-3 pl-8">
              <input type="text" value={link.title} onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)} placeholder="Titre du lien" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              <input type="url" value={link.url} onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)} placeholder="https://" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileEditor = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Informations du Profil</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center sm:flex-row gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
               <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">URL de l'avatar</label>
              <input 
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom d'utilisateur (pseudo unique)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">
                @
              </div>
              <input 
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                placeholder="pseudo"
                className={`w-full pl-7 pr-10 py-2 border rounded-lg text-sm font-semibold outline-none transition-all ${
                  isUsernameAvailable === true ? 'border-green-300 bg-green-50' : 
                  isUsernameAvailable === false ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isCheckingUsername ? (
                  <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : isUsernameAvailable === true ? (
                  <span className="text-green-600"><Icons.Check /></span>
                ) : isUsernameAvailable === false ? (
                  <span className="text-red-500"><Icons.Alert /></span>
                ) : null}
              </div>
            </div>
            {profile.username && (
               <div className="mt-1.5 flex flex-col gap-1">
                 <p className={`text-[10px] font-medium ${isUsernameAvailable === false ? 'text-red-500' : 'text-gray-400'}`}>
                   {isUsernameAvailable === false ? 'Ce nom est déjà pris' : 
                    isUsernameAvailable === true ? 'Ce nom est disponible !' : 'Minimum 3 caractères'}
                 </p>
                 <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight mb-1">Votre lien direct (sans #) :</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-indigo-700 font-extrabold break-all">
                        {window.location.origin}/{profile.username || '...'}
                      </code>
                      <button 
                        onClick={() => {
                          const url = `${window.location.origin}/${profile.username}`;
                          navigator.clipboard.writeText(url);
                          alert("Lien copié !");
                        }}
                        className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                        title="Copier le lien"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      </button>
                    </div>
                 </div>
               </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom complet</label>
            <input 
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
              <input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+33..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email public</label>
              <input type="email" value={profile.email || ''} onChange={(e) => setProfile({...profile, email: e.target.value})} placeholder="contact@..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} maxLength={150} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeEditor = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-sm">
          <Icons.Wand /> <span>Générateur de Thème AI</span>
        </div>
        <div className="flex gap-2">
          <input type="text" value={themePrompt} onChange={(e) => setThemePrompt(e.target.value)} placeholder="Ex: Luxueux, Pastel, Nature..." className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg text-sm outline-none bg-white" onKeyDown={(e) => e.key === 'Enter' && handleMagicTheme()} />
          <button onClick={handleMagicTheme} disabled={isGeneratingTheme || !themePrompt} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {isGeneratingTheme ? '...' : 'Créer'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Thèmes Prédéfinis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DEFAULT_THEMES.map(theme => (
            <button key={theme.id} onClick={() => setProfile({...profile, theme})} className={`group relative aspect-[4/5] rounded-xl border-2 transition-all overflow-hidden ${profile.theme.id === theme.id ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2' : 'border-transparent hover:border-gray-300'}`}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})` }}></div>
              <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 backdrop-blur-sm"><p className="text-[10px] font-bold text-gray-800 text-center">{theme.name}</p></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {(['PROFILE', 'LINKS', 'THEME'] as EditorTab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {tab === 'PROFILE' ? 'PROFIL' : tab === 'LINKS' ? 'LIENS' : 'THÈME'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto">
          {activeTab === EditorTab.PROFILE && renderProfileEditor()}
          {activeTab === EditorTab.LINKS && renderLinksEditor()}
          {activeTab === EditorTab.THEME && renderThemeEditor()}
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;