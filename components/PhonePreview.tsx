import React from 'react';
import { UserProfile } from '../types';

interface PhonePreviewProps {
  profile: UserProfile;
}

const Icons = {
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  WhatsApp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.4 8.38 8.38 0 0 1 3.8.9L21 4.5ZM17 13c-.22 0-.44-.08-.61-.24l-1.5-1.5a.86.86 0 0 1 0-1.21l1.5-1.5c.34-.33.88-.33 1.22 0 .33.34.33.89 0 1.22l-1.5 1.5 1.5 1.5c.33.34.33.88 0 1.22-.17.17-.39.24-.61.25Z"/><path d="M12.5 12.5h.01"/><path d="M9 16c-.22 0-.44-.08-.61-.24l-1.5-1.5a.86.86 0 0 1 0-1.21l1.5-1.5c.34-.33.88-.33 1.22 0 .33.34.33.89 0 1.22l-1.5 1.5 1.5 1.5c.33.34.33.88 0 1.22-.17.17-.39.24-.61.25Z"/></svg>
};

const PhonePreview: React.FC<PhonePreviewProps> = ({ profile }) => {
  const { theme, links, name, bio, avatarUrl, phone, email } = profile;

  return (
    <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-900/50">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-20 flex justify-center">
        <div className="w-32 h-4 bg-gray-800 rounded-b-xl"></div>
      </div>

      {/* Screen Content */}
      <div 
        className="w-full h-full overflow-y-auto overflow-x-hidden pt-12 pb-8 px-6 scrollbar-hide flex flex-col items-center"
        style={{
          background: `linear-gradient(to bottom right, ${theme.backgroundStart}, ${theme.backgroundEnd})`,
          color: theme.textColor,
          fontFamily: theme.fontFamily
        }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 text-center w-full">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 mb-4 shadow-md" style={{ borderColor: theme.buttonBg }}>
            <img 
              src={avatarUrl || 'https://via.placeholder.com/150'} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg font-bold mb-1 leading-tight">{name}</h1>
          <p className="text-sm opacity-90 leading-relaxed max-w-[90%] whitespace-pre-wrap mb-4">{bio}</p>

          {/* Contact Quick Actions */}
          <div className="flex gap-3 mb-4 flex-wrap justify-center">
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="p-3 rounded-full shadow-sm transition-transform hover:scale-110 active:scale-95"
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
                className="p-3 rounded-full shadow-sm transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.WhatsApp />
              </a>
            )}
            {email && (
              <a 
                href={`mailto:${email}`} 
                className="p-3 rounded-full shadow-sm transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
              >
                <Icons.Mail />
              </a>
            )}
          </div>
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
        <div className="mt-auto pt-12 text-center w-full">
          <p className="text-[10px] font-semibold opacity-50 uppercase tracking-widest">WomenCards</p>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;