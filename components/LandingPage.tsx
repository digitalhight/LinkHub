import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
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
        <p className="text-gray-400 leading-relaxed text-base lg:text-lg max-w-4xl">
          {answer}
        </p>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

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

  const faqs = [
    {
      question: "Qu’est-ce qu’une vCard et pourquoi est-elle essentielle aujourd’hui ?",
      answer: "Une vCard est une carte de visite numérique interactive qui centralise toutes vos informations professionnelles : photo, description, liens, réseaux sociaux, boutique, portfolio, QR code, etc. Contrairement à une carte papier, elle ne se perd jamais et s’actualise en un clic."
    },
    {
      question: "En quoi une vCard est-elle meilleure qu’un simple profil LinkedIn ?",
      answer: "LinkedIn vous appartient… jusqu’à ce que l’algorithme change. Une vCard, elle, vous appartient à 100 % : vous contrôlez l’apparence, les données, et l’expérience de vos visiteurs."
    },
    {
      question: "Puis-je utiliser une vCard même si je débute dans mon activité ?",
      answer: "Absolument. Une vCard ne sert pas uniquement aux marques établies. C’est un levier de professionnalisation immédiat."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0118] text-white selection:bg-purple-500/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      {/* Background VFX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[180px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0118]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-transform hover:rotate-12 cursor-pointer font-['Bricolage_Grotesque']">W</div>
            <span className="font-black text-2xl tracking-tighter">WomenCards<span className="text-purple-500">.</span></span>
          </div>
          <button 
            onClick={onGetStarted}
            className="bg-white text-[#0A0118] px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl border border-white"
          >
            Démarrer
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 lg:pt-48 pb-20 px-6 lg:px-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="text-left z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <h1 className="text-4xl lg:text-7xl font-extrabold leading-[1] tracking-tighter mb-8 uppercase font-['Bricolage_Grotesque']">
              Un Clic. <br />
              Une Femme. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Une Légende.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl font-medium">
              Pour les femmes professionnelles qui veulent unifier leur présence en un seul lien sur <span className="text-white font-bold">women.cards</span>.
            </p>

            {/* Subdomain Search Engine */}
            <div className="mb-12 w-full max-w-lg animate-in slide-in-from-bottom-8 duration-700 delay-300">
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
                  
                  {/* Availability Badge */}
                  <div className="mt-4 ml-6 flex items-center gap-3">
                    {availability === 'checking' && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Vérification...</span>
                      </div>
                    )}
                    {availability === 'available' && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Disponible ! Prête à devenir une légende ?</span>
                      </div>
                    )}
                    {availability === 'taken' && (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Ce pseudo est déjà réservé.</span>
                      </div>
                    )}
                    {availability === 'idle' && searchUsername.length > 0 && searchUsername.length < 3 && (
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Minimum 3 caractères.</span>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Créer mon lien
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <div className="relative perspective-[2000px] hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div 
              className="relative w-[360px] h-[500px] mx-auto bg-gradient-to-br from-[#1E0B3B] to-[#0A0118] border border-white/10 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden transform rotate-y-[-25deg] rotate-x-[15deg] rotate-z-[-5deg] transition-transform duration-700 hover:rotate-y-[-10deg]"
            >
              <div className="absolute top-0 left-0 w-full h-full p-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white/10 mb-8 overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded-full mb-3"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded-full mb-12"></div>
                <div className="w-full space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full bg-white/5 rounded-2xl border border-white/5"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative pb-32 px-6 lg:px-20 z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-purple-400">vCard Digitale</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Chaque femme a une histoire à raconter, une expertise à partager.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-blue-400">Pourquoi?</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Remplacez votre carte papier par une vCard digitale interactive.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-pink-400">Impact</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Idéale pour les réseaux sociaux, signatures d’email ou pitch rapide.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative pb-40 px-6 lg:px-20 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6 font-['Bricolage_Grotesque']">FAQ</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center bg-[#0A0118]">
        <div className="flex items-center justify-center gap-3 mb-6">
           <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-black font-['Bricolage_Grotesque']">W</div>
           <span className="font-black text-xl tracking-tighter">womencards.</span>
        </div>
        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">© 2026 WWW.WOMEN.CARDS</p>
      </footer>
    </div>
  );
};

export default LandingPage;