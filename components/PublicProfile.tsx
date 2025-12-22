import React from 'react';
import { UserProfile } from '../types';

interface PublicProfileProps {
  profile: UserProfile;
  notFound?: boolean;
  deactivated?: boolean;
}

const Icons = {
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.4 8.38 8.38 0 0 1 3.8.9L21 4.5ZM17 13c-.22 0-.44-.08-.61-.24l-1.5-1.5a.86.86 0 0 1 0-1.21l1.5-1.5c.34-.33.88-.33 1.22 0 .33.34.33.89 0 1.22l-1.5 1.5 1.5 1.5c.33.34.33.88 0 1.22-.17.17-.39.24-.61.25Z"/><path d="M12.5 12.5h.01"/><path d="M9 16c-.22 0-.44-.08-.61-.24l-1.5-1.5a.86.86 0 0 1 0-1.21l1.5-1.5c.34-.33.88-.33 1.22 0 .33.34.33.89 0 1.22l-1.5 1.5 1.5 1.5c.33.34.33.88 0 1.22-.17.17-.39.24-.61.25Z"/></svg>
};

const PublicProfile: React.FC<PublicProfileProps> = ({ profile, notFound, deactivated }) => {
  const { theme, links, name, bio, avatarUrl, phone, email } = profile;

  if (notFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0A0118] text-white font-['Plus_Jakarta_Sans']">
        <div className="w-20 h-20 bg-purple-500/10 text-purple-500 rounded-3xl flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 className="text-2xl font-black mb-2 uppercase tracking-tighter">Profil Introuvable</h1>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-xs font-medium">Ce lien ne correspond à aucun compte WomenCards actif.</p>
        <a href="/" className="px-8 py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 text-sm uppercase tracking-widest">Créer mon profil</a>
      </div>
    );
  }

  if (deactivated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0A0118] text-white font-['Plus_Jakarta_Sans']">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
        </div>
        <h1 className="text-2xl font-black mb-2 uppercase tracking-tighter text-red-500">Compte Suspendu</h1>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-xs font-medium">Ce profil a été temporairement désactivé par l'administration.</p>
        <a href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 hover:text-white transition-colors">Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-16 px-6"
      style={{
        background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})`,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Header Section */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 mb-6 shadow-2xl" style={{ borderColor: theme.buttonBg }}>
          <img 
            src={avatarUrl || `https://ui-avatars.com/api/?name=${name}&background=random`} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-2xl font-black mb-2 text-center tracking-tight leading-tight">{name}</h1>
        <p className="text-sm opacity-90 leading-relaxed text-center mb-8 whitespace-pre-wrap max-w-sm font-medium">{bio}</p>

        {/* Quick Contact Icons */}
        {(phone || email) && (
          <div className="flex gap-4 mb-10 flex-wrap justify-center">
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-90"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.Phone />
              </a>
            )}
            {phone && (
              <a 
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-90"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.WhatsApp />
              </a>
            )}
            {email && (
              <a 
                href={`mailto:${email}`} 
                className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-90"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.Mail />
              </a>
            )}
          </div>
        )}

        {/* Links List */}
        <div className="w-full space-y-4 mb-20">
          {links.filter(l => l.isActive).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-5 px-8 text-center text-base font-black rounded-[1.5rem] transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl"
              style={{
                backgroundColor: theme.buttonBg,
                color: theme.buttonText,
              }}
            >
              {link.title}
            </a>
          ))}
          
          {links.filter(l => l.isActive).length === 0 && (
            <div className="text-center py-10 opacity-40 italic text-sm">
              Aucun lien disponible pour le moment.
            </div>
          )}
        </div>

        {/* Branding Footer */}
        <div className="mt-auto">
          <a href="/" className="flex flex-col items-center gap-2 group">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity">Créé avec</span>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 opacity-40 group-hover:opacity-100 transition-all">
               <div className="w-5 h-5 bg-[#A855F7] rounded-md flex items-center justify-center text-white font-black text-[10px]">W</div>
               <span className="text-xs font-black tracking-tighter">women.cards</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;