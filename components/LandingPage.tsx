import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-lg lg:text-xl font-bold transition-colors ${isOpen ? 'text-purple-400' : 'text-white group-hover:text-purple-200'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-purple-500 border-purple-500' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 leading-relaxed text-base lg:text-lg max-w-4xl font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checkUsername = async (val: string) => {
    const username = val.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    setSearchUsername(username);
    
    if (username.length < 3) {
      setAvailability('idle');
      return;
    }

    setAvailability('checking');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) throw error;
      setAvailability(data ? 'taken' : 'available');
    } catch (err) {
      setAvailability('idle');
    }
  };

  const dummyLinks = [
    { title: '📸 Mon Portfolio 2024', url: '#' },
    { title: '📅 Réserver un Shooting', url: '#' },
    { title: '📱 Instagram (@melanie.photos)', url: '#' },
    { title: '💬 Contact WhatsApp', url: '#' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0118] text-white selection:bg-purple-500/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      {/* Background VFX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[180px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-[#0A0118]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] font-['Bricolage_Grotesque']">W</div>
            <span className="font-black text-2xl tracking-tighter">WomenCards<span className="text-purple-500">.</span></span>
          </div>
          <button onClick={onGetStarted} className="bg-white text-[#0A0118] px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl border border-white">Démarrer</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 lg:pt-48 pb-20 px-6 lg:px-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-left z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tighter mb-6 uppercase font-['Bricolage_Grotesque']">
              Un Clic. <br />
              Une Femme. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Une Légende.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl font-medium">
              Pour les femmes professionnelles qui veulent unifier leur présence en un seul lien sur <span className="text-white font-bold">women.cards</span>.
            </p>

            <div className="mb-12 w-full max-w-lg">
               <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2 focus-within:border-purple-500/50 transition-all shadow-2xl">
                    <div className="hidden sm:flex pl-6 text-gray-500 font-bold text-sm select-none">women.cards/</div>
                    <input 
                      type="text" 
                      placeholder="votre-nom"
                      value={searchUsername}
                      onChange={(e) => checkUsername(e.target.value)}
                      className="flex-1 bg-transparent px-4 sm:px-0 py-4 text-white font-black text-lg outline-none placeholder:text-gray-700"
                    />
                    <button 
                      onClick={onGetStarted}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${availability === 'available' ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                      {availability === 'checking' ? '...' : availability === 'available' ? 'RÉSERVER' : 'VÉRIFIER'}
                    </button>
                  </div>
                  
                  <div className="mt-4 ml-6 flex items-center gap-3">
                    {availability === 'checking' && <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Vérification...</span>}
                    {availability === 'available' && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Disponible ! Réservez votre lien maintenant.</span>
                      </div>
                    )}
                    {availability === 'taken' && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Ce pseudo est déjà pris.</span>
                      </div>
                    )}
                  </div>
               </div>
            </div>
            
            <button onClick={onGetStarted} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all flex items-center gap-3">
              Démarrer gratuitement
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
             <div className="relative w-[360px] h-[580px] mx-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                {/* Mockup decoration */}
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[4.5rem] blur-2xl"></div>
                <div className="relative h-full w-full bg-[#120526] border-[12px] border-[#1C0933] rounded-[4rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                  {/* Mock Profile Content */}
                  <div className="h-full w-full bg-gradient-to-b from-[#0F011E] to-[#2D0B5A] p-8 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 border-2 border-white/20 overflow-hidden shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Mélanie Dubois" />
                    </div>
                    
                    <h4 className="text-white font-black text-xl mb-2 tracking-tight">Mélanie Dubois</h4>
                    <p className="text-purple-200 text-[10px] text-center font-medium leading-relaxed mb-10 opacity-80">
                      Photographe de mode & Créatrice.<br/>Capturer l'essence de l'instant.<br/>📸✨ Paris | Dubai
                    </p>

                    <div className="w-full space-y-4">
                      {dummyLinks.map((link, i) => (
                        <div key={i} className="w-full py-4 bg-purple-500/90 text-white rounded-2xl border border-white/10 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-default">
                          <span className="text-[10px] font-black uppercase tracking-widest">{link.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-8">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">women.cards/melanie</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="py-32 px-6 lg:px-20 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-4">Pourquoi WomenCards ?</h2>
            <h3 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase font-['Bricolage_Grotesque']">L'outil ultime des créatrices</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/[0.08] transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12L2.5 12"/><path d="M12 12l9.17 4.83"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">Intelligence Artificielle</h4>
              <p className="text-gray-400 font-medium leading-relaxed">Générez des bios percutantes et des thèmes visuels uniques en un clic grâce à l'IA intégrée.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/[0.08] transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">Personnalisation Totale</h4>
              <p className="text-gray-400 font-medium leading-relaxed">Des thèmes sophistiqués et des polices premium pour refléter parfaitement votre identité digitale.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] hover:bg-white/[0.08] transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M7 12h.01"/><path d="M7 17h.01"/><path d="M12 7h.01"/><path d="M12 12h.01"/><path d="M12 17h.01"/><path d="M17 7h.01"/><path d="M17 12h.01"/><path d="M17 17h.01"/></svg>
              </div>
              <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">QR Code Dynamique</h4>
              <p className="text-gray-400 font-medium leading-relaxed">Un accès instantané à votre univers via un QR code élégant généré automatiquement pour vos supports physiques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 lg:px-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-4">Questions fréquentes</h2>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase font-['Bricolage_Grotesque']">Tout ce qu'il faut savoir</h3>
          </div>
          
          <div className="space-y-4">
            <FAQItem 
              question="Comment ça marche ?" 
              answer="C'est simple : inscrivez-vous, choisissez votre pseudo unique (ex: women.cards/votre-nom), ajoutez vos liens et personnalisez votre thème. En moins de 2 minutes, votre carte de visite digitale est en ligne." 
            />
            <FAQItem 
              question="C'est vraiment gratuit ?" 
              answer="Oui, la création d'un profil standard avec thèmes de base et liens illimités est totalement gratuite pour toutes les créatrices et professionnelles." 
            />
            <FAQItem 
              question="Puis-je utiliser mon propre domaine ?" 
              answer="Pour l'instant, nous proposons des sous-domaines élégants sur women.cards. L'option pour connecter votre propre nom de domaine est dans notre feuille de route pour les prochains mois." 
            />
            <FAQItem 
              question="Mon compte peut-il être suspendu ?" 
              answer="Nous appliquons une politique de modération stricte. Tout contenu ne respectant pas nos conditions (contenu illégal, haineux, etc.) peut entraîner une suspension immédiate par nos administrateurs." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
           <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-black">W</div>
           <span className="font-black text-xl tracking-tighter">womencards.</span>
        </div>
        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">© 2026 WWW.WOMEN.CARDS — FAIT AVEC AMOUR POUR LES CRÉATRICES</p>
      </footer>
    </div>
  );
};

export default LandingPage;