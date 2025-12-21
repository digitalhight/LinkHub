import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0A0118] text-white selection:bg-purple-500/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      {/* Background VFX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[180px]"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-px h-[1000px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent rotate-45"></div>
      </div>

      {/* Navigation - Minimal Version */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0118]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-transform hover:rotate-12 cursor-pointer">W</div>
            <span className="font-black text-2xl tracking-tighter">WomenCards<span className="text-purple-500">.</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onGetStarted}
              className="bg-white text-[#0A0118] px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 border border-white"
            >
              Démarrer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md animate-in fade-in slide-in-from-top-6 duration-1000">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#A855F7]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-200">Intelligence Artificielle Native</span>
          </div>
          
          <h1 className="text-5xl lg:text-[7rem] font-extrabold leading-[0.85] tracking-tighter mb-12 uppercase animate-in fade-in slide-in-from-bottom-10 duration-700">
            Un Clic. Une Femme. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Une Légende.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
            Pour les femmes professionnelles actives sur plusieurs plateformes et qui veulent unifier leur présence en un seul lien.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-14 py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl font-black text-lg hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all active:scale-95 group flex items-center justify-center gap-3"
            >
              Commencer maintenant
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="w-full sm:w-auto px-14 py-6 bg-white/5 border border-white/10 rounded-3xl font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
              Voir Démo
            </button>
          </div>

          {/* Futuristic Preview */}
          <div className="relative max-w-4xl mx-auto animate-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-transparent to-transparent z-10"></div>
            <div className="bg-[#120526]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="h-14 border-b border-white/5 flex items-center px-8 justify-between bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                </div>
                <div className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black text-gray-500 tracking-widest uppercase">womencards.ai/amina</div>
              </div>
              <div className="p-12 text-left">
                <div className="grid lg:grid-cols-4 gap-12">
                  <div className="space-y-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl border border-white/10 flex items-center justify-center text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full"></div>
                    <div className="h-4 w-4/5 bg-white/5 rounded-full"></div>
                    <div className="h-4 w-3/5 bg-white/5 rounded-full"></div>
                  </div>
                  <div className="lg:col-span-3">
                    <div className="h-72 w-full bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#A855F7_0%,transparent_70%)] opacity-10"></div>
                       <div className="text-center z-10">
                         <div className="text-5xl font-black text-white mb-2 tracking-tighter">98.5%</div>
                         <div className="text-[11px] font-black text-purple-400 uppercase tracking-[0.3em]">Indice de Confiance AI</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-24 border-t border-white/5 text-center bg-[#0A0118]">
        <div className="flex items-center justify-center gap-3 mb-8">
           <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-purple-900/40">W</div>
           <span className="font-black text-xl tracking-tighter">womencards.</span>
        </div>
        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">© 2026 www.women.cards</p>
      </footer>
    </div>
  );
};

export default LandingPage;