
import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { playNeuralLink, playDataOpen, playCosmicClick } from '../../utils/sfx';

interface LoginPortalProps {
    onLoginSuccess: (email: string) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  const [viewState, setViewState] = useState<'LANDING' | 'LOGIN_FORM' | 'WARP'>('LANDING');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleFingerprintClick = () => {
      playNeuralLink();
      setViewState('LOGIN_FORM');
  };

  const handleBack = () => {
      playCosmicClick();
      setViewState('LANDING');
  };

  const handleProviderLogin = (provider: 'google' | 'apple' | 'email') => {
    playDataOpen();
    setLoadingProvider(provider);
    
    setTimeout(() => {
        let email = 'node@universe.com';
        if (provider === 'google') email = 'user@gmail.com';
        if (provider === 'apple') email = 'user@icloud.com';
        
        setLoadingProvider(null);
        setViewState('WARP');
        playNeuralLink();
        
        setTimeout(() => {
            onLoginSuccess(email);
        }, 1500);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col overflow-y-auto custom-scrollbar font-mono text-white">
      
      {/* Flash overlay for warp sequence */}
      <div className={`fixed inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-1000 ease-in ${viewState === 'WARP' ? 'opacity-100 delay-1000' : 'opacity-0'}`}></div>

      <div className="relative z-10 w-full min-h-full flex flex-col">
        <div className="w-full pt-16 pb-8 flex flex-col items-center justify-center shrink-0">
            <h1 className="text-5xl md:text-8xl font-tech text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(0,255,255,0.6)] text-center relative z-20 mix-blend-screen">
                GOD'S BRAIN
            </h1>
            
            <div className="w-full overflow-hidden relative opacity-40 space-y-2">
                <div className="whitespace-nowrap animate-scroll-left font-mono text-[10px] md:text-xs text-cyan-400 tracking-[0.5em]">
                    THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE •
                </div>
            </div>
        </div>

        <div className={`flex-1 flex flex-col items-center justify-center py-12 px-6 transition-all duration-700 w-full ${viewState === 'WARP' ? 'scale-150 opacity-0 blur-sm' : 'opacity-100'}`}>
            
            {viewState === 'LANDING' && (
                <div className="text-center animate-scaleIn flex flex-col items-center">
                    <div 
                        className="relative group cursor-pointer mb-8 w-40 h-40 flex items-center justify-center" 
                        onClick={handleFingerprintClick}
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-20"></div>
                        <div className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(0,255,255,0.1)] group-hover:bg-cyan-500/10 group-hover:scale-105 transition-all duration-500">
                            <Fingerprint className="w-16 h-16 text-cyan-400 animate-pulse" />
                        </div>
                    </div>

                    <div className="text-[#00FFFF] text-[10px] uppercase tracking-[0.3em] font-mono mb-4 animate-pulse">
                        UPLINK READY
                    </div>
                </div>
            )}

            {viewState === 'LOGIN_FORM' && (
                <div className="w-full max-w-sm bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-fadeIn relative">
                    <button 
                        onClick={handleBack}
                        className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8 mt-2">
                        <ShieldCheck className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
                        <h2 className="text-xl font-tech text-white uppercase tracking-widest leading-none">Access Node</h2>
                        <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-tighter">Identity Confirmation Required</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => handleProviderLogin('google')}
                            disabled={!!loadingProvider}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98] group relative overflow-hidden"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                            <span className="font-reading text-sm">Sync with Google</span>
                            {loadingProvider === 'google' && <div className="absolute inset-0 bg-white flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4"/></div>}
                        </button>

                        <button 
                            onClick={() => handleProviderLogin('apple')}
                            disabled={!!loadingProvider}
                            className="w-full bg-[#111] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 border border-white/10 hover:bg-[#222] transition-all active:scale-[0.98] relative overflow-hidden"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.67-.9 2.56.28 3.73 1.7 3.73 1.7s-2.09 1.2-2.1 4.16c0 3.14 2.7 4.22 2.7 4.22s-1.87 5.25-4.43 7.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.17 2.37-2.05 4.31-3.74 4.25z"/></svg>
                            <span className="font-reading text-sm">Sync with Apple</span>
                            {loadingProvider === 'apple' && <div className="absolute inset-0 bg-black flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4"/></div>}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll-left { animation: scroll-left 50s linear infinite; }
      `}</style>
    </div>
  );
};
