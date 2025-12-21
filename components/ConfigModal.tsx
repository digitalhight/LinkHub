import React, { useState } from 'react';
import { saveSupabaseConfig } from '../utils/supabaseClient';

interface ConfigModalProps {
  isOpen: boolean;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseConfig(url, key);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configuration</h2>
          <p className="text-sm text-gray-500 font-medium">Connectez votre propre base de données Supabase.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">URL de votre Projet</label>
              <input 
                type="url" 
                placeholder="https://xyz.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Clé API Anon</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#3D5AFE] rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 17-5 5-5-5"/><path d="m17 7-5-5-5-5"/></svg>
              </div>
              <p className="text-xs font-black text-blue-900 uppercase tracking-tight">
                Fixer l'erreur 404 Nginx
              </p>
            </div>
            <p className="text-[11px] text-blue-700 leading-relaxed mb-4">
              Pour que <code>/votre-nom</code> fonctionne après un F5, ajoutez cette règle dans votre fichier de configuration Nginx (bloc <code>server</code>) :
            </p>
            <pre className="bg-gray-900 text-blue-300 p-4 rounded-2xl text-[10px] font-mono overflow-x-auto shadow-inner">
{`location / {
  try_files $uri $uri/ /index.html;
}`}
            </pre>
            <p className="text-[10px] text-blue-500 mt-4 italic">
              Sans cela, le site affichera 404 car il cherchera un fichier réel au lieu de laisser React gérer la route.
            </p>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-[#3D5AFE] hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            Enregistrer & Actualiser
          </button>
        </form>
      </div>
    </div>
  );
};