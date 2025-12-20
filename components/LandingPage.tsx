import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A1A] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-gradient-to-br from-[#E0E7FF] to-[#F3F4FF] rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-tr from-[#EEF2FF] to-white rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#3D5AFE] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">W</div>
              <span className="font-black text-2xl tracking-tighter">womencards.</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
              <a href="#" className="hover:text-black transition-colors">Produit</a>
              <a href="#" className="hover:text-black transition-colors">Modèles</a>
              <a href="#" className="hover:text-black transition-colors">Tarifs</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onGetStarted} className="text-sm font-bold text-gray-600 px-4 py-2 hover:text-black">Connexion</button>
            <button 
              onClick={onGetStarted}
              className="bg-[#3D5AFE] text-white px-6 py-3 rounded-full text-sm font-extrabold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              Créer mon lien
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-6xl lg:text-[5rem] font-black leading-[1] tracking-tight mb-8">
              L'outil de profil <span className="text-[#3D5AFE]">intuitif</span> pour les créatrices.
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
              Automatisez votre présence en ligne avec WomenCards. Un seul lien pour centraliser vos réseaux, vos services et vos projets avec élégance.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="relative group">
                <button 
                  onClick={onGetStarted}
                  className="px-10 py-5 bg-[#3D5AFE] text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                >
                  Commencer gratuit
                </button>
                {/* Handwritten arrow & text */}
                <div className="absolute -right-28 top-4 hidden xl:block">
                  <div className="flex items-center gap-2">
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="rotate-[-10deg]">
                      <path d="M1 1C1 1 15 15 38 18M38 18L32 12M38 18L30 19.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="font-serif italic text-sm text-gray-700 whitespace-nowrap">pas de carte requise</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Note 5 étoiles G2</span>
            </div>
          </div>

          {/* Right Column - Floating UI */}
          <div className="relative h-[600px] hidden lg:block animate-in zoom-in-95 duration-1000">
            {/* Main Dashboard Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-white p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statistiques</p>
                  <p className="text-2xl font-black">Performance</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-4 4 4 6-6"/></svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                   <div className="w-10 h-10 rounded-xl bg-[#3D5AFE] flex items-center justify-center text-white">
                     <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                   </div>
                   <div className="flex-1">
                     <p className="text-xs font-bold text-gray-400">Clics Totaux</p>
                     <p className="text-lg font-black">21,973,024</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl border border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Conversion</p>
                     <p className="text-lg font-black">12.5%</p>
                   </div>
                   <div className="p-4 rounded-2xl border border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Nouveaux</p>
                     <p className="text-lg font-black">8,455</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Voir le rapport complet</button>
              </div>
            </div>

            {/* Floating Avatars & Mini-cards */}
            <div className="absolute top-20 right-10 w-24 h-24 rounded-full border-[6px] border-white shadow-2xl overflow-hidden animate-bounce" style={{ animationDuration: '4s' }}>
              <img src="https://i.pravatar.cc/150?u=karima" alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full border-[6px] border-white shadow-2xl overflow-hidden animate-bounce" style={{ animationDuration: '5s' }}>
              <img src="https://i.pravatar.cc/150?u=jane" alt="Profile" className="w-full h-full object-cover" />
            </div>

            {/* Quote Card */}
            <div className="absolute -bottom-12 -right-12 w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-white">
              <div className="flex items-center gap-3 mb-4">
                 <img src="https://i.pravatar.cc/100?u=sarah" alt="Sarah" className="w-10 h-10 rounded-full" />
                 <div>
                   <p className="text-xs font-black">Sarah Martin</p>
                   <p className="text-[10px] text-gray-400">CEO @ CreativFlow</p>
                 </div>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-gray-600">
                "Centraliser mes liens avec WomenCards a littéralement doublé ma conversion sur Instagram."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white/40 py-12 border-y border-white/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale">
          <span className="font-black text-2xl tracking-tighter">stripe</span>
          <span className="font-black text-2xl tracking-tighter">shopify</span>
          <span className="font-black text-2xl tracking-tighter">adobe</span>
          <span className="font-black text-2xl tracking-tighter">slack</span>
          <span className="font-black text-2xl tracking-tighter">framer</span>
        </div>
      </div>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-[#3D5AFE] rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">Prête à sublimer votre présence en ligne ?</h2>
          <button 
            onClick={onGetStarted}
            className="px-12 py-6 bg-white text-[#3D5AFE] rounded-2xl font-black text-xl hover:bg-gray-50 transition-all shadow-xl active:scale-95"
          >
            Commencer maintenant
          </button>
          <p className="mt-8 text-blue-100 font-bold opacity-80 uppercase tracking-widest text-xs">Rejoignez 1,200+ créatrices aujourd'hui</p>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">© 2024 WomenCards • Made with ❤️ for Creators</p>
      </footer>
    </div>
  );
};

export default LandingPage;