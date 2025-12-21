import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { UserProfile, LinkItem } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProfiles: 0, totalLinks: 0, activeLinks: 0 });
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        name: d.name || 'Utilisatrice Sans Nom',
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

      const totalLinks = mappedProfiles.reduce((acc, p) => acc + (p.links?.length || 0), 0);
      const activeLinks = mappedProfiles.reduce((acc, p) => acc + (p.links?.filter(l => l.isActive).length || 0), 0);
      
      setStats({
        totalProfiles: mappedProfiles.length,
        totalLinks: totalLinks,
        activeLinks: activeLinks
      });
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!window.confirm("❗ ACTION CRITIQUE : Supprimer définitivement cette utilisatrice et tous ses liens ?")) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setProfiles(profiles.filter(p => p.id !== id));
      alert("Profil supprimé avec succès.");
      fetchProfiles();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-['Plus_Jakarta_Sans'] text-gray-900">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-100">W</div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none text-gray-900">Admin Control</h1>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Plateforme WomenCards</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connecté</p>
            <p className="text-xs font-bold text-gray-900">{currentUser.email}</p>
          </div>
          <div className="h-8 w-px bg-gray-100"></div>
          <button onClick={() => window.location.href = '/'} className="text-[11px] font-black text-gray-500 hover:text-[#3D5AFE] uppercase tracking-widest transition-all">Retour Éditeur</button>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">Quitter</button>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto space-y-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profils Actifs</p>
              <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">{stats.totalProfiles}</span>
              <span className="text-xs font-bold text-green-500">utilisatrices</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Liens Créés</p>
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">{stats.totalLinks}</span>
              <span className="text-xs font-bold text-blue-500">total</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Taux de Remplissage</p>
              <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">
                {stats.totalProfiles > 0 ? (stats.totalLinks / stats.totalProfiles).toFixed(1) : 0}
              </span>
              <span className="text-xs font-bold text-purple-500">liens / profil</span>
            </div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
            <div>
              <h2 className="text-xl font-black tracking-tight">Utilisatrices Enregistrées</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">Supervision et gestion des comptes créateurs.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Rechercher par nom, email ou @pseudo..." 
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
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Créatrice</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Liens</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Création</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#3D5AFE] border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Synchronisation DB...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">Aucun profil ne correspond à votre recherche</td>
                  </tr>
                ) : filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}&background=random`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-[11px] font-bold text-[#3D5AFE] tracking-tight mt-0.5">@{p.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-bold text-gray-700">{p.email || '—'}</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">{p.phone || 'Pas de WhatsApp'}</p>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <button 
                        onClick={() => setSelectedProfile(p)}
                        className="inline-flex flex-col items-center px-5 py-3 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        <span className="text-xl font-black text-[#3D5AFE] leading-none">{p.links?.length || 0}</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.1em] mt-1.5 text-gray-400">Gérer Liens</span>
                      </button>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-bold text-gray-900">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </p>
                      <span className="text-[9px] font-black text-gray-300 uppercase">Membre</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`/${p.username}`, '_blank')}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Aperçu Public"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                        <button 
                          onClick={() => deleteProfile(p.id!)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Supprimer Définitivement"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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

      {/* Profil Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedProfile(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[85vh] flex flex-col border border-white">
            
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-lg">
                   <img src={selectedProfile.avatarUrl || `https://ui-avatars.com/api/?name=${selectedProfile.name}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-2xl tracking-tight leading-none text-gray-900">{selectedProfile.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-[#3D5AFE] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">@{selectedProfile.username}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedProfile.links?.length || 0} liens créés</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-100 rounded-2xl text-gray-400 transition-all border border-gray-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto flex-1 bg-white">
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Statistiques du Profil</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">État</p>
                    <p className="text-sm font-black text-green-600 mt-1">Actif</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Thème Utilisé</p>
                    <p className="text-sm font-black text-gray-900 mt-1">{selectedProfile.theme?.name || 'Standard'}</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Liens de la créatrice</p>
              <div className="space-y-4">
                {selectedProfile.links && selectedProfile.links.length > 0 ? selectedProfile.links.map((link) => (
                  <div key={link.id} className="p-6 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all shadow-sm group">
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="font-black text-sm text-gray-900 mb-1 truncate">{link.title || 'Lien sans titre'}</p>
                      <p className="text-[10px] font-bold text-[#3D5AFE] truncate flex items-center gap-1.5 opacity-80">
                        <svg className="flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${link.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-[9px] font-black uppercase tracking-tight">
                          {link.isActive ? 'Actif' : 'Masqué'}
                        </span>
                      </div>
                      <button 
                        onClick={() => window.open(link.url, '_blank')} 
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Aucun lien configuré</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center">
               <button onClick={() => window.open(`/${selectedProfile.username}`, '_blank')} className="px-10 py-4 bg-[#3D5AFE] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">Consulter la Page Public</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;