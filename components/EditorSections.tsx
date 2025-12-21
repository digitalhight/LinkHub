import React, { useState, useRef } from 'react';
import { UserProfile, LinkItem, ThemeConfig } from '../types';
import { DEFAULT_THEMES } from '../constants';
import { supabase } from '../utils/supabaseClient';

const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Image: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Loader: () => <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
};

export const ProfileSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Utilisation d'un timestamp pour garantir l'unicité et forcer le rafraîchissement du cache navigateur
      const fileName = `${profile.id || 'anon'}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatarUrl: publicUrl });
    } catch (error: any) {
      alert("Erreur lors du transfert : " + error.message + "\n\nVérifiez que le bucket 'avatars' est bien créé dans Supabase.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6">
        {/* Zone Upload Avatar */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative w-28 h-28 lg:w-32 lg:h-32 rounded-[2.5rem] overflow-hidden border-2 transition-all shadow-2xl cursor-pointer group flex items-center justify-center bg-[#120526] ${uploading ? 'border-purple-500 opacity-70' : 'border-white/10 hover:border-purple-500/50'}`}
          >
             <img 
               src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff`} 
               alt="Avatar" 
               className={`w-full h-full object-cover transition-all duration-500 ${uploading ? 'blur-sm scale-90' : 'group-hover:scale-110'}`} 
             />
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-2 backdrop-blur-sm">
               {uploading ? <Icons.Loader /> : <Icons.Image />}
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Modifier</span>
             </div>
             {uploading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                 <Icons.Loader />
               </div>
             )}
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
               accept="image/*" 
               className="hidden" 
             />
          </div>
          <div className="text-center lg:text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">Photo de Profil</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Format JPG/PNG recommandé</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Lien de la photo</label>
            <input 
              type="url" 
              value={profile.avatarUrl} 
              onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})} 
              placeholder="https://..."
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-purple-300 outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-800" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nom public</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pseudo unique (@)</label>
            <input 
              type="text" 
              value={profile.username} 
              onChange={(e) => setProfile({...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})} 
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-purple-400 outline-none focus:border-purple-500/50 transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bio Courte</label>
            <textarea 
              rows={3} 
              value={profile.bio} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-gray-300 outline-none focus:border-purple-500/50 transition-all resize-none scrollbar-hide" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
              <input 
                type="tel" 
                value={profile.phone} 
                onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                placeholder="+33..." 
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contact Email</label>
              <input 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})} 
                placeholder="contact@..." 
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LinksSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const addLink = () => {
    const newLink: LinkItem = { id: Date.now().toString(), title: 'Nouveau Lien', url: 'https://', isActive: true };
    setProfile({ ...profile, links: [newLink, ...profile.links] });
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = profile.links.map(l => l.id === id ? { ...l, [field]: value } : l);
    setProfile({ ...profile, links: newLinks });
  };

  const deleteLink = (id: string) => {
    setProfile({ ...profile, links: profile.links.filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={addLink} className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-purple-900/10 active:scale-95">
        <Icons.Plus /> Ajouter un Lien
      </button>

      <div className="space-y-4">
        {profile.links.map((link) => (
          <div key={link.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-4 mb-4">
              <input 
                type="text" 
                value={link.title} 
                onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                className="flex-1 bg-transparent text-sm font-black text-white outline-none border-b border-transparent focus:border-purple-500/30 pb-1"
              />
              <button onClick={() => deleteLink(link.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Icons.Trash /></button>
            </div>
            <div className="relative">
              <input 
                type="url" 
                value={link.url} 
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-purple-400 outline-none focus:border-purple-500/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              </div>
            </div>
          </div>
        ))}
        {profile.links.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem]">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Aucun lien actif</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ThemeSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-500">
      {DEFAULT_THEMES.map(t => (
        <button 
          key={t.id} 
          onClick={() => setProfile({...profile, theme: t})}
          className={`aspect-[4/5] rounded-[2rem] border-2 transition-all overflow-hidden relative group ${profile.theme.id === t.id ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-white/5 hover:border-white/10'}`}
        >
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.backgroundStart}, ${t.backgroundEnd})` }}></div>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-black/40 backdrop-blur-md border-t border-white/5">
            <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{t.name}</p>
          </div>
          {profile.theme.id === t.id && (
            <div className="absolute top-4 right-4 bg-purple-500 text-white p-1 rounded-full shadow-lg scale-110"><Icons.Check /></div>
          )}
        </button>
      ))}
    </div>
  );
};