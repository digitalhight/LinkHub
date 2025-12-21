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
  const [deleteConfirmProfile, setDeleteConfirmProfile] = useState<UserProfile | null>(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select('*');

      if (sbError) throw sbError;
      
      const mappedProfiles: UserProfile[] = data.map(d => ({
        id: d.id,
        name: d.name || 'Sans Nom',
        username: d.username || '',
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmProfile) return;
    
    if (confirmInput.trim().toLowerCase() !== deleteConfirmProfile.name.trim().toLowerCase()) {
      alert("Le nom saisi ne correspond pas. Suppression annulée.");
      return;
    }

    try {
      const { error: delError } = await supabase.from('profiles').delete().eq('id', deleteConfirmProfile.id);
      if (delError) throw delError;
      
      setProfiles(profiles.filter(p => p.id !== deleteConfirmProfile.id));
      setDeleteConfirmProfile(null);
      setConfirmInput('');
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
          <button onClick={() => fetchProfiles()} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <svg className={loading ? "animate-spin" : ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          <div className="h-8 w-px bg-gray-100 mx-2"></div>
          <button onClick={() => window.location.href = '/'} className="text-[11px] font-black text-gray-500 hover:text-[#3D5AFE] uppercase tracking-widest transition-all">Retour Éditeur</button>
        </div>
      </header>

      <main className="p-10 max-w-[1400px] mx-auto space-y-10">
        
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
              <p className="text-xs font-bold text-gray-400 mt-1">Supervision globale des comptes enregistrés.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Rechercher (Nom, Email, @...)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white border-b border-gray-50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisatrice</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Liens</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#3D5AFE] border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronisation...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Aucun profil trouvé.</p>
                    </td>
                  </tr>
                ) : filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                          <img src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-xs text-gray-900 leading-tight">{p.name}</p>
                          <p className="text-[9px] font-bold text-[#3D5AFE] tracking-tight mt-0.5 uppercase">@{p.username || 'n/a'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-[11px] font-bold text-gray-500">{p.email || '—'}</p>
                    </td>
                    <td className="px-6 py-6">
                      {p.phone ? (
                        <a 
                          href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          className="flex items-center gap-2 text-[11px] font-bold text-green-600 hover:text-green-700 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {p.phone}
                        </a>
                      ) : (
                        <p className="text-[11px] font-bold text-gray-400">—</p>
                      )}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button onClick={() => setSelectedProfile(p)} className="px-3 py-1.5 bg-gray-50 text-[#3D5AFE] text-[10px] font-black rounded-lg hover:bg-blue-50 transition-colors">
                        {p.links?.length || 0}
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            if (p.username) window.open(`/${p.username}`, '_blank');
                            else alert("L'utilisateur n'a pas encore de pseudo.");
                          }}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Voir le profil"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteConfirmProfile(p);
                            setConfirmInput('');
                          }}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Supprimer"
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

      {/* Modal Détails Liens */}
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
                  <p className="text-[10px] font-black text-[#3D5AFE] uppercase tracking-widest">Liens enregistrés</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 space-y-3">
              {selectedProfile.links.length > 0 ? selectedProfile.links.map((link: any) => (
                <div key={link.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-black text-xs text-gray-900 truncate">{link.title}</p>
                    <p className="text-[10px] font-bold text-blue-500 truncate">{link.url}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              )) : (
                <p className="text-center py-10 text-xs font-bold text-gray-300 uppercase tracking-widest">Aucun lien</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression Sécurisée */}
      {deleteConfirmProfile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm" onClick={() => setDeleteConfirmProfile(null)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300 border border-white">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Suppression Critique</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                Pour supprimer le compte de <span className="font-black text-gray-900">{deleteConfirmProfile.name}</span>, recopiez son nom exactement ci-dessous.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="px-4 py-3 bg-red-50 rounded-xl font-black text-red-600 border border-red-100 select-none">
                  {deleteConfirmProfile.name}
                </div>
                <input 
                  type="text" 
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="Recopiez le nom ici..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-red-100 transition-all text-center"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  disabled={confirmInput.trim().toLowerCase() !== deleteConfirmProfile.name.trim().toLowerCase()}
                  className="w-full py-5 bg-red-500 text-white font-black rounded-2xl shadow-xl shadow-red-100 hover:bg-red-600 disabled:opacity-30 disabled:grayscale transition-all active:scale-95"
                >
                  CONFIRMER LA SUPPRESSION
                </button>
                <button 
                  onClick={() => setDeleteConfirmProfile(null)}
                  className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;