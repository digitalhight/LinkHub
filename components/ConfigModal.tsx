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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            W
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Base de données</h2>
            <p className="text-xs text-gray-500">Configuration de Supabase</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">URL du Projet</label>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-mono text-gray-600 bg-gray-50"
              placeholder="https://xyz...supabase.co"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Clé API (Anon/Public)</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-mono text-gray-600 bg-gray-50"
              placeholder="eyJhbGciOiJIUzI1Ni..."
              required
            />
          </div>

          <div className="bg-indigo-50 text-indigo-800 text-[10px] p-4 rounded-lg border border-indigo-100">
            <p className="font-bold mb-2 uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Configuration SQL Recommandée
            </p>
            <p className="mb-2">Exécutez ceci dans le <b>SQL Editor</b> pour créer la table et autoriser la lecture publique :</p>
            <pre className="bg-white/50 p-2 rounded border border-indigo-200 font-mono select-all text-[9px] overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  links JSONB,
  theme JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique pour tout le monde
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

-- Autoriser les utilisateurs à modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON profiles FOR ALL USING (auth.uid() = id);`}
            </pre>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all"
          >
            Enregistrer et Connecter
          </button>
        </form>
      </div>
    </div>
  );
};