import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { UserProfile, LinkItem } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProfiles: 0, totalLinks: 0 });
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedProfiles: UserProfile[] = data.map(d => ({
        id: d.id,
        name: d.name || 'Sans nom',
        username: d.username,
        email: d.email,
        bio: d.bio || '',
        avatarUrl: d.avatar_url || '',
        links: d.links || [],
        theme: d.theme,
        is_admin: d.is_admin,
        created_at: d.created_at,
      }));

      setProfiles(mappedProfiles);

      const linksCount = mappedProfiles.reduce((acc, p) => acc + (p.links?.length || 0), 0);
      setStats({
        totalProfiles: mappedProfiles.length,
        totalLinks: linksCount
      });
    } catch (err) {
      console.error("Erreur chargement profils:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.")) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setProfiles(profiles.filter(p => p.id !== id));
      alert("Profil supprimé avec succès.");
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-['Plus_Jakarta_Sans'] text-gray-900">
      {/* Admin Header */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-100">W</div>
            <h1 className="font-black text-xl tracking-tighter">Admin Panel<span className="text-amber-500">.</span></h1>
          </div>
          <nav className="flex gap-4 ml-6">
            <button onClick={() => window.location.href = '/'} className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-all">Retour Éditeur</button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Connecté</p>
            <p className="text-xs font-bold">{currentUser.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all">Déconnexion</button>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto space-y-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Profils Totaux</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-gray-900">{stats.totalProfiles}</span>
              <span className="text-green-500 font-bold text-xs mb-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                +12%
              </span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Liens Créés</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-gray-900">{stats.totalLinks}</span>
              <span className="text-blue-500 font-bold text-xs mb-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Actifs
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2rem] text-white shadow-xl shadow-amber-100">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2">État du Système</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black">Opérationnel</span>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black tracking-tight">Liste des Utilisateurs</h2>
            <button onClick={fetchProfiles} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Liens</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date de création</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Chargement de la base...</td>
                  </tr>
                ) : profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          <img src={p.avatarUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-sm">{p.name}</p>
                          <p className="text-[11px] font-bold text-[#3D5AFE]">@{p.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{p.email}</td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => setSelectedProfile(p)}
                        className="px-3 py-1 bg-blue-50 text-[#3D5AFE] rounded-full text-[10px] font-black uppercase hover:bg-blue-100 transition-all"
                      >
                        {p.links?.length || 0} Liens
                      </button>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`/${p.username}`, '_blank')}
                          className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                          title="Voir Profil Public"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id!)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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

      {/* Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProfile(null)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[85vh] flex flex-col">
            
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={selectedProfile.avatarUrl} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-black text-xl">{selectedProfile.name}</h3>
                  <p className="text-xs font-bold text-[#3D5AFE]">Détails des liens créés</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto flex-1">
              <div className="space-y-4">
                {selectedProfile.links.length > 0 ? selectedProfile.links.map((link) => (
                  <div key={link.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-black text-sm mb-1 truncate">{link.title}</p>
                      <p className="text-[11px] font-bold text-blue-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${link.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        {link.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <button onClick={() => window.open(link.url, '_blank')} className="text-gray-300 hover:text-gray-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-40 font-black uppercase tracking-widest text-xs">Aucun lien créé</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;