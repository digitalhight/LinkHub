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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-500/30">
            S
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Connect to Supabase</h2>
            <p className="text-xs text-gray-500">Configure your database connection</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">Project URL</label>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm font-mono text-gray-600 bg-gray-50"
              placeholder="https://xyz...supabase.co"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wider">API Key (Anon/Public)</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm font-mono text-gray-600 bg-gray-50"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
            />
          </div>

          <div className="bg-blue-50 text-blue-800 text-xs p-4 rounded-lg border border-blue-100">
            <p className="font-semibold mb-1">How to get these?</p>
            <ol className="list-decimal pl-4 space-y-1 opacity-90">
              <li>Go to your Supabase Dashboard</li>
              <li>Click <strong>Project Settings</strong> (gear icon)</li>
              <li>Select <strong>API</strong></li>
              <li>Copy <strong>URL</strong> and <strong>anon public</strong> key</li>
            </ol>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};