import React, { useState } from 'react';
import { saveSupabaseConfig } from '../utils/supabaseClient';

interface ConfigModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh] relative text-gray-900">
        {onClose && (
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configuration Base de Données</h2>
          <p className="text-sm text-gray-500 font-medium">Connectez votre propre compte Supabase pour garantir la disponibilité de vos données.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">URL de votre Projet (API URL)</label>
              <input 
                type="url" 
                placeholder="https://votre-projet.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all text-gray-900"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Clé API Anon (Public Key)</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#3D5AFE] transition-all text-gray-900"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
             <div className="flex items-start gap-3">
               <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 font-bold text-xs">i</div>
               <div className="w-full">
                  <p className="text-xs font-black text-blue-900 uppercase tracking-tight mb-2">Aide Déploiement Nginx</p>
                  <p className="text-[10px] text-blue-800 leading-relaxed mb-4">
                    Pour <strong>women.cards</strong>, votre config Nginx doit ressembler à ceci (incluant le bloc <code>server</code>) :
                  </p>
                  <pre className="bg-gray-900 text-blue-300 p-4 rounded-xl text-[9px] font-mono overflow-x-auto shadow-inner leading-normal">
{`server {
  listen 80;
  server_name women.cards;
  root /votre/chemin;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}`}
                  </pre>
               </div>
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-[#3D5AFE] hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            Enregistrer & Redémarrer
          </button>
        </form>
      </div>
    </div>
  );
};