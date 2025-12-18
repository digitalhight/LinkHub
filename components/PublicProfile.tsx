import React from 'react';
import { UserProfile } from '../types';

interface PublicProfileProps {
  profile: UserProfile;
  notFound?: boolean;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ profile, notFound }) => {
  const { theme, links, name, bio, avatarUrl, phone, email } = profile;

  if (notFound) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
        <h1 className="text-2xl font-bold mb-2">Profil Introuvable</h1>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Ce lien ne correspond à aucun compte WomenCards.</p>
        <a href="/" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">Créer mon profil</a>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-12 px-6"
      style={{
        background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})`,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 mb-4 shadow-xl" style={{ borderColor: theme.buttonBg }}>
          <img 
            src={avatarUrl || 'https://via.placeholder.com/150'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-xl font-bold mb-2 text-center">{name}</h1>
        <p className="text-sm opacity-90 leading-relaxed text-center mb-8 whitespace-pre-wrap max-w-sm">{bio}</p>

        <div className="w-full space-y-4 mb-12">
          {links.filter(l => l.isActive).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 text-center text-md font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
              style={{
                backgroundColor: theme.buttonBg,
                color: theme.buttonText,
              }}
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="flex gap-6 mt-auto opacity-60">
           {phone && <a href={`tel:${phone}`} className="hover:opacity-100 transition-opacity">Téléphone</a>}
           {email && <a href={`mailto:${email}`} className="hover:opacity-100 transition-opacity">Email</a>}
        </div>

        <div className="mt-20">
          <a href="/" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            Créé avec WomenCards
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;