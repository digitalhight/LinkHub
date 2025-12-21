import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, LinkItem, ThemeConfig } from '../types';
import { DEFAULT_THEMES } from '../constants';
import { generateTheme } from '../utils/ai';
import { supabase } from '../utils/supabaseClient';

const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Grip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Wand: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 2 2 2-2 2-2-2 2-2Z"/><path d="m5 2 2 2-2 2-2-2 2-2Z"/><path d="m15 11 2 2-2 2-2-2 2-2Z"/><path d="M6 18c-1.1 0-2-0.9-2-2v-4.5c0-0.3 0.1-0.6 0.2-0.8L8.3 6.6c0.5-0.8 1.4-1.3 2.3-1.3h2.8c0.9 0 1.8 0.5 2.3 1.3l4.1 4.1c0.1 0.2 0.2 0.5 0.2 0.8V16c0 1.1-0.9 2-2 2H6Z"/></svg>,
  ArrowUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

// Section PROFIL
export const ProfileSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsername = useCallback(async (username: string) => {
    if (!username || username.length < 3) { setIsAvailable(null); return; }
    setIsChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('profiles').select('id').eq('username', username.toLowerCase().trim()).maybeSingle();
      setIsAvailable(!data || data.id === user?.id);
    } catch (err) {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => checkUsername(profile.username), 500);
    return () => clearTimeout(t);
  }, [profile.username, checkUsername]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-[#3D5AFE] transition-all">
             <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/><path d="M10 10V5"/><path d="M14 10V5"/><path d="M18 10V5"/></svg>
          </div>
        </div>
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Avatar (URL)</label>
            <input type="text" value={profile.avatarUrl} onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nom Complet</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pseudo Unique (@)</label>
          <div className="relative">
            <input 
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-black outline-none transition-all ${isAvailable === true ? 'border-green-200 bg-green-50/30' : isAvailable === false ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isChecking ? <div className="w-4 h-4 border-2 border-[#3D5AFE] border-t-transparent animate-spin rounded-full"></div> : 
               isAvailable === true ? <span className="text-green-500"><Icons.Check /></span> :
               isAvailable === false ? <span className="text-red-500"><Icons.Alert /></span> : null}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Bio (max 150 car.)</label>
          <textarea 
            rows={3} 
            value={profile.bio} 
            onChange={(e) => setProfile({...profile, bio: e.target.value})} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">WhatsApp / Tel</label>
            <input type="tel" value={profile.phone || ''} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+33..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE]" />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Email Public</label>
            <input type="email" value={profile.email || ''} onChange={(e) => setProfile({...profile, email: e.target.value})} placeholder="hello@..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE]" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Section LIENS
export const LinksSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const addLink = () => {
    const newLink: LinkItem = { id: Date.now().toString(), title: 'Mon nouveau lien', url: 'https://', isActive: true };
    setProfile({ ...profile, links: [newLink, ...profile.links] });
  };

  const removeLink = (id: string) => setProfile({ ...profile, links: profile.links.filter(l => l.id !== id) });
  
  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...profile.links];
    if (direction === 'up' && index > 0) [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    else if (direction === 'down' && index < newLinks.length - 1) [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    setProfile({ ...profile, links: newLinks });
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = profile.links.map(l => l.id === id ? { ...l, [field]: value } : l);
    setProfile({ ...profile, links: newLinks });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <button onClick={addLink} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-100 active:scale-95">
        <Icons.Plus /> Nouveau Lien
      </button>

      <div className="space-y-4">
        {profile.links.map((link, idx) => (
          <div key={link.id} className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-gray-300"><Icons.Grip /></div>
              <input 
                type="text" 
                value={link.title} 
                onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                placeholder="Titre du lien"
                className="flex-1 text-sm font-black text-gray-800 outline-none bg-transparent"
              />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveLink(idx, 'up')} disabled={idx === 0} className="p-1.5 text-gray-300 hover:text-gray-900 disabled:opacity-20"><Icons.ArrowUp /></button>
                <button onClick={() => moveLink(idx, 'down')} disabled={idx === profile.links.length - 1} className="p-1.5 text-gray-300 hover:text-gray-900 disabled:opacity-20"><Icons.ArrowDown /></button>
                <button onClick={() => removeLink(link.id)} className="p-1.5 text-gray-300 hover:text-red-500"><Icons.Trash /></button>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-2">
                <input type="checkbox" checked={link.isActive} onChange={(e) => updateLink(link.id, 'isActive', e.target.checked)} className="sr-only peer" />
                <div className="w-8 h-4 bg-gray-100 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
            </div>
            <input 
              type="url" 
              value={link.url} 
              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-50 rounded-xl text-[11px] font-bold text-blue-600 outline-none focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>
        ))}
        {profile.links.length === 0 && <p className="text-center py-10 text-xs font-bold text-gray-300 uppercase tracking-widest">Aucun lien actif</p>}
      </div>
    </div>
  );
};

// Section THEME
export const ThemeSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagic = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const colors = await generateTheme(prompt);
      setProfile({ ...profile, theme: { ...profile.theme, ...colors, name: 'Thème IA', id: `ai-${Date.now()}` } });
    } catch (e) {
      alert("IA occupée, réessayez !");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-gradient-to-br from-[#3D5AFE] to-blue-700 rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/20 rounded-xl"><Icons.Wand /></div>
            <h3 className="text-xs font-black uppercase tracking-widest">Générateur IA</h3>
          </div>
          <p className="text-[10px] text-blue-100 font-bold mb-4 leading-relaxed">Décrivez l'ambiance souhaitée (ex: "Pastel et doux", "Neon Cyberpunk") :</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Vibe..." 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs font-bold placeholder:text-blue-200 outline-none focus:bg-white/20"
              onKeyDown={(e) => e.key === 'Enter' && handleMagic()}
            />
            <button onClick={handleMagic} disabled={isGenerating || !prompt} className="bg-white text-[#3D5AFE] px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all disabled:opacity-50">
              {isGenerating ? '...' : 'OK'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Préréglages</label>
        <div className="grid grid-cols-2 gap-3">
          {DEFAULT_THEMES.map(t => (
            <button 
              key={t.id} 
              onClick={() => setProfile({...profile, theme: t})}
              className={`aspect-[3/4] rounded-[1.5rem] border-4 transition-all overflow-hidden relative group ${profile.theme.id === t.id ? 'border-[#3D5AFE] shadow-xl' : 'border-transparent hover:border-gray-200 shadow-sm'}`}
            >
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.backgroundStart}, ${t.backgroundEnd})` }}></div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm">
                <p className="text-[9px] font-black text-gray-800 text-center uppercase tracking-tighter truncate">{t.name}</p>
              </div>
              {profile.theme.id === t.id && (
                <div className="absolute top-2 right-2 bg-[#3D5AFE] text-white p-1 rounded-full"><Icons.Check /></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};