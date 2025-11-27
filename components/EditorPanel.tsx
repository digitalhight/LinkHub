import React, { useState } from 'react';
import { UserProfile, EditorTab, LinkItem, ThemeConfig } from '../types';
import { DEFAULT_THEMES } from '../constants';
import { generateBio, generateTheme } from '../utils/ai';

// Icons as basic SVG components to avoid external deps issues if not installed
const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  Grip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Wand: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 2 2 2-2 2-2-2 2-2Z"/><path d="m5 2 2 2-2 2-2-2 2-2Z"/><path d="m15 11 2 2-2 2-2-2 2-2Z"/><path d="M6 18c-1.1 0-2-0.9-2-2v-4.5c0-0.3 0.1-0.6 0.2-0.8L8.3 6.6c0.5-0.8 1.4-1.3 2.3-1.3h2.8c0.9 0 1.8 0.5 2.3 1.3l4.1 4.1c0.1 0.2 0.2 0.5 0.2 0.8V16c0 1.1-0.9 2-2 2H6Z"/></svg>,
  ArrowUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
};

interface EditorPanelProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ profile, setProfile, activeTab, setActiveTab }) => {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  const [themePrompt, setThemePrompt] = useState('');

  // --- Handlers ---

  const handleLinkChange = (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = profile.links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    setProfile({ ...profile, links: newLinks });
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: 'New Link',
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

  const handleMagicBio = async () => {
    setIsGeneratingBio(true);
    try {
      const bio = await generateBio(profile.name, profile.bio);
      setProfile({ ...profile, bio });
    } catch (e) {
      alert("Failed to generate bio. Ensure API Key is set.");
    } finally {
      setIsGeneratingBio(false);
    }
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
        name: 'Custom AI Theme',
      };
      setProfile({ ...profile, theme: newTheme });
    } catch (e) {
      alert("Failed to generate theme.");
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  // --- Render Sections ---

  const renderLinksEditor = () => (
    <div className="space-y-4">
      <button 
        onClick={addLink}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Icons.Plus /> Add New Link
      </button>

      <div className="space-y-3 mt-6">
        {profile.links.length === 0 && <p className="text-gray-400 text-center py-8">No links yet. Add one to get started!</p>}
        {profile.links.map((link, index) => (
          <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                <Icons.Grip />
              </div>
              <div className="flex-1 font-semibold text-gray-700 text-sm">
                {link.title || 'Untitled Link'}
              </div>
              <div className="flex items-center gap-1">
                 <button 
                  onClick={() => moveLink(index, 'up')} 
                  disabled={index === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <Icons.ArrowUp />
                </button>
                <button 
                  onClick={() => moveLink(index, 'down')} 
                  disabled={index === profile.links.length - 1}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  <Icons.ArrowDown />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={link.isActive}
                    onChange={(e) => handleLinkChange(link.id, 'isActive', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <button 
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 pl-8">
              <div>
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                  placeholder="Link Title (e.g. My Portfolio)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                  placeholder="URL (https://...)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileEditor = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Profile Info</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center sm:flex-row gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
               <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">Avatar URL</label>
              <input 
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
            <input 
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-700">Bio</label>
              <button 
                onClick={handleMagicBio}
                disabled={isGeneratingBio}
                className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50"
              >
                <Icons.Wand />
                {isGeneratingBio ? 'Generating...' : 'Magic Bio'}
              </button>
            </div>
            <textarea 
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{profile.bio.length}/150</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeEditor = () => (
    <div className="space-y-8">
      {/* AI Theme Generator */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold text-sm">
          <Icons.Wand />
          <span>AI Theme Generator</span>
        </div>
        <div className="flex gap-2">
          <input 
            type="text"
            value={themePrompt}
            onChange={(e) => setThemePrompt(e.target.value)}
            placeholder="Describe a vibe (e.g. Neon Cyberpunk, Pastel Dream)..."
            className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            onKeyDown={(e) => e.key === 'Enter' && handleMagicTheme()}
          />
          <button 
            onClick={handleMagicTheme}
            disabled={isGeneratingTheme || !themePrompt}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isGeneratingTheme ? '...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Preset Themes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Preset Themes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DEFAULT_THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setProfile({...profile, theme})}
              className={`group relative aspect-[4/5] rounded-xl border-2 transition-all overflow-hidden text-left ${profile.theme.id === theme.id ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2' : 'border-transparent hover:border-gray-300'}`}
            >
              <div 
                className="absolute inset-0 z-0"
                style={{ background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})` }}
              ></div>
              <div className="absolute inset-x-4 top-4 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.buttonBg }}></div>
              <div className="absolute inset-x-4 top-8 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.buttonBg }}></div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm">
                <p className="text-xs font-medium text-gray-800 text-center">{theme.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
         <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Custom Colors</h3>
         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Background Top</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={profile.theme.backgroundStart} onChange={(e) => setProfile({...profile, theme: {...profile.theme, id: 'custom', backgroundStart: e.target.value}})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-gray-600">{profile.theme.backgroundStart}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Background Bottom</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={profile.theme.backgroundEnd} onChange={(e) => setProfile({...profile, theme: {...profile.theme, id: 'custom', backgroundEnd: e.target.value}})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-gray-600">{profile.theme.backgroundEnd}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Button Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={profile.theme.buttonBg} onChange={(e) => setProfile({...profile, theme: {...profile.theme, id: 'custom', buttonBg: e.target.value}})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-gray-600">{profile.theme.buttonBg}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Text Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={profile.theme.textColor} onChange={(e) => setProfile({...profile, theme: {...profile.theme, id: 'custom', textColor: e.target.value}})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs font-mono text-gray-600">{profile.theme.textColor}</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {(['LINKS', 'PROFILE', 'THEME'] as EditorTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto">
          {activeTab === EditorTab.LINKS && renderLinksEditor()}
          {activeTab === EditorTab.PROFILE && renderProfileEditor()}
          {activeTab === EditorTab.THEME && renderThemeEditor()}
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
