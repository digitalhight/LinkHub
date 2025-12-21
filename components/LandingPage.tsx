import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenConfig?: () => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenConfig }) => {
  const faqs = [
    {
      question: "Qu’est-ce qu’une vCard et pourquoi est-elle essentielle aujourd’hui ?",
      answer: "Une vCard est une carte de visite numérique interactive qui centralise toutes vos informations professionnelles : photo, description, liens, réseaux sociaux, boutique, portfolio, QR code, etc. Contrairement à une carte papier, elle ne se perd jamais et s’actualise en un clic. Pour une femme entrepreneure, c’est un outil puissant de crédibilité, de réseau et de conversion client."
    },
    {
      question: "En quoi une vCard est-elle meilleure qu’un simple profil LinkedIn ?",
      answer: "LinkedIn vous appartient… jusqu’à ce que l’algorithme change. Une vCard, elle, vous appartient à 100 % : vous contrôlez l’apparence, les données, et l’expérience de vos visiteurs. Elle devient votre carte de marque personnelle, que vous pouvez partager partout — sur vos réseaux, dans vos emails, ou même via un QR code sur vos produits."
    },
    {
      question: "Puis-je utiliser une vCard même si je débute dans mon activité ?",
      answer: "Absolument. Une vCard ne sert pas uniquement aux marques établies. C’est un levier de professionnalisation immédiat : elle permet de présenter votre activité avec élégance, même à ses débuts, et de prouver votre sérieux face à vos premiers partenaires ou clients. Elle évolue avec vous, comme un mini-site toujours à jour."
    },
    {
      question: "Est-ce difficile à créer ou à personnaliser ?",
      answer: "Non, c’est conçu pour être simple, intuitif et sans compétences techniques. En quelques minutes, vous choisissez un modèle, ajoutez vos informations, vos liens, vos couleurs et votre photo. Votre vCard est ensuite accessible partout, même depuis un smartphone. Vous pouvez la modifier à tout moment pour suivre votre évolution."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0118] text-white selection:bg-purple-500/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      {/* Background VFX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[180px]"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-px h-[1000px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent rotate-45"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0118]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-transform hover:rotate-12 cursor-pointer">W</div>
            <span className="font-black text-2xl tracking-tighter">WomenCards<span className="text-purple-500">.</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenConfig}
              className="text-white/20 hover:text-white transition-colors"
              title="Paramètres de connexion"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-[#0A0118] px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 border border-white"
            >
              Démarrer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 lg:px-20 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <div className="text-left z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <h1 className="text-5xl lg:text-[6.5rem] font-extrabold leading-[0.9] tracking-tighter mb-10 uppercase">
              Un Clic. <br />
              Une Femme. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Une Légende.</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-400 mb-14 leading-relaxed max-w-xl font-medium">
              Pour les femmes professionnelles actives sur plusieurs plateformes et qui veulent unifier leur présence en un seul lien sur <span className="text-white font-bold">women.cards</span>.
            </p>
            
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-14 py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl font-black text-lg hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all active:scale-95 group flex items-center justify-center gap-3"
            >
              Commencer maintenant
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Right Visual Content */}
          <div className="relative perspective-[2000px] hidden lg:block animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Engagement Metrics */}
            <div className="absolute -top-10 left-0 z-20 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
                </div>
                <div>
                  <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Analytics</div>
                  <div className="text-xl font-black text-white">+248%</div>
                </div>
              </div>
            </div>

            {/* Tilted VCard Model */}
            <div 
              className="relative w-[380px] h-[520px] mx-auto bg-gradient-to-br from-[#1E0B3B] to-[#0A0118] border border-white/10 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden transform rotate-y-[-25deg] rotate-x-[15deg] rotate-z-[-5deg] hover:rotate-y-[-10deg] transition-transform duration-700"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute top-0 left-0 w-full h-full p-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white/10 mb-8 overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded-full mb-3"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded-full mb-12"></div>
                
                <div className="w-full space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 w-full bg-white/5 rounded-2xl border border-white/5 flex items-center px-6">
                      <div className={`w-2 h-2 rounded-full mr-4 ${i === 1 ? 'bg-purple-500' : i === 2 ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                      <div className={`h-3 rounded-full bg-white/10 ${i === 1 ? 'w-2/3' : i === 2 ? 'w-1/2' : 'w-3/4'}`}></div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto opacity-30">
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white">women.cards/amina</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative pb-32 px-6 lg:px-20 z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-purple-400 transition-colors">Créez votre vCard digitale</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              Chaque femme a une histoire à raconter, une expertise à partager, un projet à valoriser.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors">Pourquoi?</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              Remplacez votre carte papier par une <span className="text-white font-bold">vCard digitale interactive</span> : plus moderne, plus durable, plus efficace.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-white group-hover:text-pink-400 transition-colors">Quelle cible</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              Idéale pour les événements, réseaux sociaux, signatures d’email ou pitch rapide.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative pb-40 px-6 lg:px-20 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6">FAQ</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 text-center bg-[#0A0118]">
        <div className="flex items-center justify-center gap-3 mb-8">
           <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-purple-900/40">W</div>
           <span className="font-black text-xl tracking-tighter">womencards.</span>
        </div>
        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">© 2026 WWW.WOMEN.CARDS</p>
      </footer>
    </div>
  );
};

export default LandingPage;