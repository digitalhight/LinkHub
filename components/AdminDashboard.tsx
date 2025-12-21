import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { UserProfile } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalProfiles: 0, totalLinks: 0, activeLinks: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase.from('profiles').select('*');
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

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0118] font(['Plus_Jakarta_Sans']) text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-[#0A0118]/80 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20 font-['Bricolage_Grotesque']">W</div>
          <div>
            <h1 className="font-black text-lg tracking-tighter leading-none">Admin <span className="text-amber-500">Center</span></h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Plateforme de Contrôle</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={fetchProfiles} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg className={loading ? "animate-spin" : ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          <button onClick={() => window.location.href = '/'} className="text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-widest border border-white/10 px-6 py-2 rounded-full transition-all">Retour Éditeur</button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex p-8 gap-8">
        
        {/* SECTION GAUCHE : CHIFFRES CLÉS (Titre 'Performances' supprimé pour équilibrage) */}
        <aside className="w-[350px] space-y-6 overflow-y-auto pr-4 scrollbar-hide">
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Total Profils</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">{stats.totalProfiles}</span>
              <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">Créatrices</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Liens Générés</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">{stats.totalLinks}</span>
              <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">Bio-Links</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
            <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-4">Engagement</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">
                {stats.totalProfiles > 0 ? (stats.totalLinks / stats.totalProfiles).toFixed(1) : 0}
              </span>
              <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">moyenne</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-xs font-black mb-4 uppercase tracking-widest text-white">Alerte Système</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Toutes les connexions sont cryptées. L'accès administrateur est restreint au personnel autorisé uniquement.
            </p>
          </div>
        </aside>

        {/* SECTION DROITE : BASE DE DONNÉES DES CRÉATRICES */}
        <section className="flex-1 bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between gap-6 bg-white/[0.02]">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase tracking-tighter">Base de données</h2>
              <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Supervision des comptes actifs</p>
            </div>
            
            <div className="relative w-80">
              <input 
                type="text" 
                placeholder="RECHERCHER..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-[1.5rem] text-xs font-black outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-700"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0F0520] z-10">
                <tr>
                  <th className="px-10 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Créatrice</th>
                  <th className="px-6 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Contact</th>
                  <th className="px-6 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Liens</th>
                  <th className="px-10 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="px-10 py-24 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest animate-pulse">Chargement de la base...</td></tr>
                ) : filteredProfiles.length === 0 ? (
                  <tr><td colSpan={4} className="px-10 py-24 text-center text-xs text-gray-600 italic">Aucune créatrice trouvée.</td></tr>
                ) : filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                          <img src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}&background=6366f1&color=fff`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-xs text-white leading-tight uppercase tracking-tight">{p.name}</p>
                          <p className="text-[10px] font-black text-purple-400 tracking-tight mt-0.5 uppercase">@{p.username || 'n/a'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-[11px] font-bold text-gray-400 mb-1">{p.email || '—'}</p>
                      {p.phone && <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">{p.phone}</p>}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button onClick={() => setSelectedProfile(p)} className="px-3 py-1 bg-white/5 text-purple-400 text-[10px] font-black rounded-lg border border-white/5 hover:bg-purple-500 hover:text-white transition-all">
                        {p.links?.length || 0}
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => p.username && window.open(`/${p.username}`, '_blank')}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-blue-400 bg-white/5 rounded-xl border border-white/5 hover:border-blue-400/30 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-400 bg-white/5 rounded-xl border border-white/5 hover:border-red-400/30 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL LIENS */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedProfile(null)}></div>
          <div className="bg-[#120526] rounded-[3rem] w-full max-w-lg overflow-hidden relative border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                   <img src={selectedProfile.avatarUrl || `https://ui-avatars.com/api/?name=${selectedProfile.name}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white uppercase tracking-tight">{selectedProfile.name}</h3>
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Liens configurés</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="w-10 h-10 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
              {selectedProfile.links.length > 0 ? selectedProfile.links.map((link: any) => (
                <div key={link.id} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-black text-[11px] text-white uppercase tracking-tight truncate">{link.title}</p>
                    <p className="text-[10px] font-bold text-gray-500 truncate">{link.url}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                </div>
              )) : (
                <p className="text-center py-10 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Aucun lien enregistré</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;