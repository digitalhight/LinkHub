import React, { useState } from 'react';
import { saveSupabaseConfig } from '../utils/supabaseClient';

interface ConfigModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [showSql, setShowSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseConfig(url, key);
    }
  };

  const sqlSetup = `-- 1. Table Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Storage
-- Créez un bucket PUBLIC nommé 'avatars'`;

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
          <p className="text-sm text-gray-500 font-medium">Paramétrez votre base de données et votre stockage.</p>
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
             <button 
               type="button"
               onClick={() => setShowSql(!showSql)}
               className="flex items-center justify-between w-full text-[10px] font-black text-purple-900 uppercase tracking-tight"
             >
                <span>Script SQL Requis</span>
                <span>{showSql ? 'Fermer' : 'Voir'}</span>
             </button>
             
             {showSql && (
               <div className="relative">
                 <pre className="text-[9px] bg-black text-green-400 p-3 rounded-lg overflow-x-auto font-mono leading-relaxed">
                   {sqlSetup}
                 </pre>
                 <p className="text-[9px] text-purple-700 mt-2 font-bold italic">Copiez ce code dans le SQL Editor de Supabase.</p>
               </div>
             )}

             {!showSql && (
                <p className="text-[10px] text-purple-800 leading-relaxed">
                  Assurez-vous d'avoir ajouté les colonnes <strong>is_active</strong> et <strong>is_admin</strong> à votre table profiles via SQL.
                </p>
             )}
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