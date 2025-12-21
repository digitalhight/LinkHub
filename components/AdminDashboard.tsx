import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { UserProfile, LinkItem } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalProfiles: 0, totalLinks: 0, activeLinks: 0 });
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // On force la récupération de tous les profils
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select('*');

      if (sbError) throw sbError;
      
      if (!data || data.length === 0) {
        // Si data est vide, c'est probablement un problème de RLS dans Supabase
        console.warn("Aucune donnée reçue. Vérifiez vos politiques RLS dans Supabase.");
      }

      const mappedProfiles: UserProfile[] = data.map(d => ({
        id: d.id,
        name: d.name || 'Utilisatrice Sans Nom',
        username: d.username || 'inconnu',
        email: d.email || '',
        phone: d.phone || '',
        bio: d.bio || '',
        avatarUrl: d.avatar_url || '',
        links: Array.isArray(d.links) ? d.links : [],
        theme: d.theme || {},
        is_admin: d.is_admin || false,
        created_at: d.created_at,
      }));

      setProfiles(mappedProfiles);

      const totalLinks = mappedProfiles.reduce((acc, p) => acc + (p.links?.length || 0), 0);
      const activeLinks = mappedProfiles.reduce((acc, p) => acc + (p.links?.filter((l: any) => l.isActive).length || 0), 0);
      
      setStats({
        totalProfiles: mappedProfiles.length,
        totalLinks: totalLinks,
        activeLinks: activeLinks
      });
    } catch (err: any) {
      console.error("Erreur chargement admin:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!window.confirm("❗ ACTION CRITIQUE : Supprimer définitivement cette utilisatrice ?")) return;
    try {
      const { error: delError } = await supabase.from('profiles').delete().eq('id', id);
      if (delError) throw delError;
      setProfiles(profiles.filter(p => p.id !== id));
      fetchProfiles();
    } catch (err: any) {
      alert("Erreur suppression: " + err.message);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-['Plus_Jakarta_Sans'] text-gray-900">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-100">W</div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none text-gray-900">Admin Control</h1>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Gérer WomenCards</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => fetchProfiles()} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Rafraîchir">
            <svg className={loading ? "animate-spin" : ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          <div className="h-8 w-px bg-gray-100"></div>
          <button onClick={() => window.location.href = '/'} className="text-[11px] font-black text-gray-500 hover:text-[#3D5AFE] uppercase tracking-widest transition-all">Retour Éditeur</button>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto space-y-10">
        
        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div className="flex-1">
              <p className="font-black text-sm uppercase tracking-tight">Erreur de synchronisation base de données</p>
              <p className="text-xs opacity-80">{error}. Assurez-vous d'avoir configuré les politiques RLS dans Supabase.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Profils Actifs</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">{stats.totalProfiles}</span>
              <span className="text-xs font-bold text-green-500">utilisatrices</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Liens Créés</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">{stats.totalLinks}</span>
              <span className="text-xs font-bold text-blue-500">total</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Performance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">
                {stats.totalProfiles > 0 ? (stats.totalLinks / stats.totalProfiles).toFixed(1) : 0}
              </span>
              <span className="text-xs font-bold text-purple-500">liens / profil</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
            <div>
              <h2 className="text-xl font-black tracking-tight">Base de données des Créatrices</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">Supervision en temps réel des profils enregistrés.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisatrice</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Liens</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#3D5AFE] border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Chargement des données...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-24 text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                        {searchTerm ? "Aucun résultat trouvé." : "Aucun profil trouvé dans la base de données."}
                      </p>
                      {!searchTerm && (
                        <p className="text-[10px] text-red-400 font-bold mt-2 uppercase">
                          Note: Vérifiez vos politiques RLS dans Supabase SQL Editor.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm flex-shrink-0">
                          <img src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}&background=random`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-[10px] font-bold text-[#3D5AFE] tracking-tight mt-0.5">@{p.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <button 
                        onClick={() => setSelectedProfile(p)}
                        className="inline-flex flex-col items-center px-4 py-2 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        <span className="text-lg font-black text-[#3D5AFE] leading-none">{p.links?.length || 0}</span>
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`/${p.username}`, '_blank')}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id!)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProfile(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden relative shadow-2xl animate-in zoom-in duration-300 max-h-[80vh] flex flex-col border border-white">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                   <img src={selectedProfile.avatarUrl || `https://ui-avatars.com/api/?name=${selectedProfile.name}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900">{selectedProfile.name}</h3>
                  <p className="text-[10px] font-black text-[#3D5AFE] uppercase tracking-widest">@{selectedProfile.username}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 space-y-4">
              {selectedProfile.links.map((link: any) => (
                <div key={link.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-black text-xs text-gray-900 truncate">{link.title}</p>
                    <p className="text-[10px] font-bold text-blue-500 truncate">{link.url}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;