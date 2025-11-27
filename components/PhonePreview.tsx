import React from 'react';
import { UserProfile } from '../types';

interface PhonePreviewProps {
  profile: UserProfile;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ profile }) => {
  const { theme, links, name, bio, avatarUrl } = profile;

  return (
    <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-900/50">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-20 flex justify-center">
        <div className="w-32 h-4 bg-gray-800 rounded-b-xl"></div>
      </div>

      {/* Screen Content */}
      <div 
        className="w-full h-full overflow-y-auto overflow-x-hidden pt-12 pb-8 px-6 scrollbar-hide"
        style={{
          background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})`,
          color: theme.textColor,
          fontFamily: theme.fontFamily
        }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 mb-4 shadow-md" style={{ borderColor: theme.buttonBg }}>
            <img 
              src={avatarUrl || 'https://via.placeholder.com/150'} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg font-bold mb-1 leading-tight">{name}</h1>
          <p className="text-sm opacity-90 leading-relaxed max-w-[90%] whitespace-pre-wrap">{bio}</p>
        </div>

        {/* Links */}
        <div className="space-y-3 w-full">
          {links.filter(l => l.isActive).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 text-center text-sm font-medium rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm break-words"
              style={{
                backgroundColor: theme.buttonBg,
                color: theme.buttonText,
              }}
            >
              {link.title}
            </a>
          ))}
          
          {links.filter(l => l.isActive).length === 0 && (
            <div className="text-center text-xs opacity-60 mt-8">
              No active links to display.
            </div>
          )}
        </div>

        {/* Branding Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-semibold opacity-50 uppercase tracking-widest">LinkHub AI</p>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
