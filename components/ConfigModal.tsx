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
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">Configuration Supabase</h2>
          <p className="text-sm text-gray-500 font-medium">Paramétrez votre base de données et votre stockage de photos.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">URL du Projet</label>
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
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Clé API Anon</label>
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

          <div className="bg-purple-50 border border-purple-100 p-6 rounded-3xl space-y-4">
             <div className="flex items-start gap-3">
               <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5 font-bold text-xs">!</div>
               <div className="w-full">
                  <p className="text-xs font-black text-purple-900 uppercase tracking-tight mb-2">Configuration du Stockage</p>
                  <p className="text-[10px] text-purple-800 leading-relaxed">
                    Pour l'upload de photos, créez un bucket <strong>'avatars'</strong> dans Supabase Storage :
                  </p>
                  <ul className="mt-3 space-y-2 text-[10px] text-purple-700 font-bold list-disc pl-4">
                    <li>Rendre le bucket <strong>Public</strong>.</li>
                    <li>Ajouter une Policy <strong>INSERT</strong> pour autoriser l'upload.</li>
                    <li>Ajouter une Policy <strong>SELECT</strong> pour la lecture.</li>
                  </ul>
               </div>
             </div>
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