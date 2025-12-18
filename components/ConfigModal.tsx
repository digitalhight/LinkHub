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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Configuration Supabase</h2>
          <p className="text-sm text-gray-500">Connectez votre propre base de données.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <input 
            type="url" 
            placeholder="URL de votre projet Supabase"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input 
            type="password" 
            placeholder="Clé API Anon/Public"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <p className="text-[11px] font-bold text-red-700 uppercase mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Action requise dans Supabase
            </p>
            <p className="text-[10px] text-red-600 mb-2">Copiez ce code dans le <b>SQL Editor</b> de votre projet pour corriger l'erreur de sauvegarde :</p>
            <pre className="bg-white p-2 rounded border border-red-200 font-mono text-[9px] overflow-x-auto select-all">
{`ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read" 
ON profiles FOR SELECT USING (true);`}
            </pre>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Mettre à jour la connexion
          </button>
        </form>
      </div>
    </div>
  );
};