import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, LinkItem, ThemeConfig } from '../types';
import { DEFAULT_THEMES } from '../constants';
import { supabase } from '../utils/supabaseClient';

const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
};

export const ProfileSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6">
        <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-white/10 group bg-white/5">
           <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
             <span className="text-[10px] font-black uppercase tracking-tighter">Change</span>
           </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white outline-none focus:border-purple-500/50 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Username (@)</label>
            <input type="text" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-purple-400 outline-none focus:border-purple-500/50 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Biography</label>
            <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-gray-300 outline-none focus:border-purple-500/50 transition-all resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LinksSection: React.FC<{ profile: UserProfile, setProfile: (p: UserProfile) => void }> = ({ profile, setProfile }) => {
  const addLink = () => {
    const newLink: LinkItem = { id: Date.now().toString(), title: 'New Asset', url: 'https://', isActive: true };
    setProfile({ ...profile, links: [newLink, ...profile.links] });
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = profile.links.map(l => l.id === id ? { ...l, [field]: value } : l);
    setProfile({ ...profile, links: newLinks });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={addLink} className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-purple-900/10 active:scale-95">
        <Icons.Plus /> Add New Asset
      </button>

      <div className="space-y-4">
        {profile.links.map((link) => (
          <div key={link.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 group hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-4 mb-4">
              <input 
                type="text" 
                value={link.title} 
                onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                className="flex-1 bg-transparent text-sm font-black text-white outline-none"
              />
              <button onClick={() => setProfile({...profile, links: profile.links.filter(l => l.id !== link.id)})} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Icons.Trash /></button>
            </div>
            <input 
              type="url" 
              value={link.url} 
              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-[11px] font-bold text-purple-400 outline-none"
            />
          </div>
        ))}
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
          className={`aspect-[4/5] rounded-[1.5rem] border-2 transition-all overflow-hidden relative group ${profile.theme.id === t.id ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-white/5 hover:border-white/10'}`}
        >
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.backgroundStart}, ${t.backgroundEnd})` }}></div>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-black/40 backdrop-blur-md">
            <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{t.name}</p>
          </div>
          {profile.theme.id === t.id && (
            <div className="absolute top-3 right-3 bg-purple-500 text-white p-1 rounded-full"><Icons.Check /></div>
          )}
        </button>
      ))}
    </div>
  );
};