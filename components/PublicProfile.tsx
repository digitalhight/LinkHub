import React from 'react';
import { UserProfile } from '../types';

interface PublicProfileProps {
  profile: UserProfile;
  notFound?: boolean;
}

const Icons = {
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
};

const PublicProfile: React.FC<PublicProfileProps> = ({ profile, notFound }) => {
  const { theme, links, name, bio, avatarUrl, phone, email } = profile;

  if (notFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
        <div className="text-indigo-600 mb-6 opacity-20"><Icons.Search /></div>
        <h1 className="text-2xl font-bold mb-2">Profil Introuvable</h1>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Le lien que vous avez suivi semble incorrect ou le profil n'existe plus.</p>
        <a href="/" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">Créer ma VCard</a>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-12 px-6 sm:px-8"
      style={{
        background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})`,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Profile Header */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 mb-6 shadow-xl" style={{ borderColor: theme.buttonBg }}>
          <img 
            src={avatarUrl || 'https://via.placeholder.com/150'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center">{name}</h1>
        <p className="text-base opacity-90 leading-relaxed text-center mb-8 whitespace-pre-wrap max-w-sm">{bio}</p>

        {/* Contact Actions */}
        {(phone || email) && (
          <div className="flex gap-6 mb-10">
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.Phone />
              </a>
            )}
            {email && (
              <a 
                href={`mailto:${email}`} 
                className="p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.Mail />
              </a>
            )}
          </div>
        )}

        {/* Links List */}
        <div className="w-full space-y-4">
          {links.filter(l => l.isActive).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 text-center text-lg font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md border-2 border-transparent hover:border-white/20"
              style={{
                backgroundColor: theme.buttonBg,
                color: theme.buttonText,
              }}
            >
              {link.title}
            </a>
          ))}
          
          {links.filter(l => l.isActive).length === 0 && (
            <div className="text-center text-sm opacity-50 mt-12 py-10 bg-white/5 rounded-2xl border border-white/10">
              Aucun lien public disponible pour le moment.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center opacity-40 hover:opacity-100 transition-opacity">
          <a href="/" className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            Créé avec <span className="bg-indigo-600 text-white px-2 py-0.5 rounded">WomenCards</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;