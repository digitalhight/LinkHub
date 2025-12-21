import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0A0118] text-white selection:bg-purple-500/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      {/* Cinematic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[120px] animate-bounce" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0118]/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">W</div>
              <span className="font-black text-2xl tracking-tighter">WomenCards.</span>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">Product</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Resources</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onGetStarted} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white">Sign In</button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-[#0A0118] px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Beta Access Now Live</span>
          </div>
          
          <h1 className="text-6xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter mb-10 uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
            Next-Gen AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">For Creators</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            Stay ahead of the curve with AI-powered profile insights. Centralize your presence with real-time analytics and global compliance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] transition-all active:scale-95"
            >
              Get started
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
              Book A Demo
            </button>
          </div>

          {/* Featured UI Mockup (Matching the image) */}
          <div className="relative max-w-5xl mx-auto animate-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-transparent to-transparent z-10 h-64 top-auto -bottom-1"></div>
            <div className="bg-[#120526]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-900/20">
              <div className="h-14 border-b border-white/5 flex items-center px-8 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-gray-500">womencards.digital/amina</div>
              </div>
              <div className="p-10 text-left">
                <div className="grid lg:grid-cols-4 gap-10">
                  <div className="space-y-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl"></div>
                    <div className="h-4 w-full bg-white/5 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-white/5 rounded-full"></div>
                    <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                  </div>
                  <div className="lg:col-span-3">
                    <div className="h-64 w-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-[2rem] border border-white/5 flex items-center justify-center">
                       <div className="text-center">
                         <div className="text-4xl font-black text-white mb-2">84.2%</div>
                         <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Growth Factor</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
           <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
           <span className="font-black tracking-tighter opacity-50">womencards.</span>
        </div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">© 2024 Next-Gen AI Collective</p>
      </footer>
    </div>
  );
};

export default LandingPage;