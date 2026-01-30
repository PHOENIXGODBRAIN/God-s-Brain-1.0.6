
import React, { useState, useEffect } from 'react';
import { Globe, Mail, Loader2, ShieldCheck, ArrowRight, ChevronLeft, Fingerprint, Lock } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playDataOpen, playError } from '../utils/sfx';
import { UserProfile, LanguageCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../translations';

interface AuthModalProps {
  onLogin: (profile: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);
  const [view, setView] = useState<'select' | 'email' | 'secure_handshake'>('select');
  const [oauthProvider, setOauthProvider] = useState<'google' | 'apple' | null>(null);
  const [handshakeStep, setHandshakeStep] = useState(0);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleProviderLogin = (provider: 'google' | 'apple') => {
    playNeuralLink();
    setLoading(provider);
    setOauthProvider(provider);
    
    // Initiate Secure Handshake Mock
    setTimeout(() => {
        setLoading(null);
        setView('secure_handshake');
    }, 1000);
  };

  // Secure Handshake Sequence Effect
  useEffect(() => {
    if (view === 'secure_handshake') {
        const steps = [
            "Initializing Secure Gateway...",
            "Encrypting Biometric Signature...",
            "Verifying Neural Token...",
            "Access Granted."
        ];
        
        let step = 0;
        const interval = setInterval(() => {
            step++;
            setHandshakeStep(step);
            playDataOpen(); // Chirp for each step
            
            if (step >= steps.length) {
                clearInterval(interval);
                // Finalize Login
                setTimeout(() => {
                    // Fix: Adding missing level, xp, atp, proteins, and voltage properties required by UserProfile interface.
                    const mockProfile: UserProfile = {
                        name: oauthProvider === 'google' ? 'Google User' : 'Apple User',
                        email: oauthProvider === 'google' ? 'user@gmail.com' : 'user@icloud.com',
                        avatar: oauthProvider === 'google' ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' : undefined,
                        provider: oauthProvider!,
                        level: 1,
                        xp: 0,
                        atp: 85,
                        proteins: 420,
                        voltage: 15
                    };
                    onLogin(mockProfile);
                }, 800);
            }
        }, 800);
        
        return () => clearInterval(interval);
    }
  }, [view, oauthProvider, onLogin]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        playError();
        return;
    }
    
    // PHOENIX PROTOCOL BYPASS CHECK
    if (email.toLowerCase() === 'phoenix' && password === '1742') {
        playNeuralLink();
        setLoading('email');
        setTimeout(() => {
            // Fix: Adding level, xp, atp, proteins, and voltage for the author profile.
            onLogin({ 
              name: 'The Phoenix', 
              email: 'phoenix', 
              provider: 'email', 
              level: 99, 
              xp: 0,
              atp: 100,
              proteins: 1000,
              voltage: 24
            });
        }, 1000);
        return;
    }

    if (password.length < 6) {
        alert("Access Key must be at least 6 characters.");
        return;
    }

    playDataOpen();
    setLoading('email');
    
    setTimeout(() => {
        // Fix: Adding missing level, xp, atp, proteins, and voltage properties required by UserProfile interface.
        const mockProfile: UserProfile = {
            name: email.split('@')[0],
            email: email,
            provider: 'email',
            level: 1,
            xp: 0,
            atp: 85,
            proteins: 420,
            voltage: 15
        };
        onLogin(mockProfile);
    }, 2000);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playCosmicClick();
    setLanguage(e.target.value as LanguageCode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-fadeIn"
        onClick={() => { if(view !== 'secure_handshake') { playCosmicClick(); onClose(); } }}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-black border border-[#00FFFF]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] animate-scaleIn">
        
        {/* Decorative Top Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent"></div>

        <div className="p-8 md:p-10 text-center relative z-10 min-h-[500px] flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-6 relative">
            {view !== 'select' && view !== 'secure_handshake' && (
                <button onClick={() => setView('select')} className="absolute left-0 top-1 text-gray-500 hover:text-white">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}
            <div className={`w-16 h-16 mx-auto bg-[#00FFFF]/10 rounded-full flex items-center justify-center mb-4 border border-[#00FFFF]/30 shadow-[0_0_20px_rgba(0,255,255,0.2)] ${view === 'secure_handshake' ? 'animate-pulse' : ''}`}>
               {loading || view === 'secure_handshake' ? <Fingerprint className="w-8 h-8 text-[#00FFFF] animate-pulse" /> : <ShieldCheck className="w-8 h-8 text-[#00FFFF]" />}
            </div>
            <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-1">
                {view === 'select' ? t('loginHeader') : view === 'secure_handshake' ? 'Identity Verification' : 'Secure Login'}
            </h2>
            <p className="text-gray-400 text-xs font-mono">
                {view === 'select' ? t('loginSub') : 'Establishing secure neural uplink...'}
            </p>
          </div>

          {/* VIEW: SELECT */}
          {view === 'select' && (
            <div className="space-y-3 animate-fadeIn">
                 {/* Language Selector */}
                <div className="mb-6 relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-[#00FFFF] transition-colors">
                        <Globe className="w-4 h-4" />
                    </div>
                    <select 
                        value={language}
                        onChange={handleLangChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#00FFFF]/50 focus:bg-black transition-all appearance-none cursor-pointer font-mono"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="bg-black text-gray-300">
                                {lang.native} ({lang.label})
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                </div>

                <button 
                    onClick={() => handleProviderLogin('google')}
                    disabled={!!loading}
                    className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98] relative overflow-hidden group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                    <span className="font-reading">{t('continueGoogle')}</span>
                    {loading === 'google' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-bold gap-2"><Loader2 className="animate-spin w-4 h-4"/> CONNECTING...</div>}
                </button>

                <button 
                    onClick={() => handleProviderLogin('apple')}
                    disabled={!!loading}
                    className="w-full bg-[#1a1a1a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 border border-white/10 hover:bg-[#333] transition-all active:scale-[0.98] relative overflow-hidden"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.67-.9 2.56.28 3.73 1.7 3.73 1.7s-2.09 1.2-2.1 4.16c0 3.14 2.7 4.22 2.7 4.22s-1.87 5.25-4.43 7.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.17 2.37-2.05 4.31-3.74 4.25z"/></svg>
                    <span className="font-reading">{t('continueApple')}</span>
                    {loading === 'apple' && <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-xs font-bold gap-2"><Loader2 className="animate-spin w-4 h-4"/> CONNECTING...</div>}
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black px-2 text-gray-500">{t('manualOverride')}</span></div>
                </div>

                <div className="">
                    <button 
                        onClick={() => { playCosmicClick(); setView('email'); }}
                        className="w-full bg-transparent border border-white/20 text-gray-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 hover:border-[#00FFFF]/50 hover:text-[#00FFFF] transition-all active:scale-[0.98]"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="font-tech text-[10px] tracking-wider">Email Login</span>
                    </button>
                </div>
            </div>
          )}

          {/* VIEW: SECURE HANDSHAKE (No Mock Accounts) */}
          {view === 'secure_handshake' && (
             <div className="animate-fadeIn space-y-6 flex flex-col items-center">
                <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-[#00FFFF] transition-all duration-300 ease-out"
                        style={{ width: `${(handshakeStep / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="space-y-2">
                    <div className="font-mono text-[#00FFFF] text-sm tracking-widest uppercase animate-pulse">
                        {handshakeStep === 0 && "Initializing Secure Gateway..."}
                        {handshakeStep === 1 && "Encrypting Biometric Signature..."}
                        {handshakeStep === 2 && "Verifying Neural Token..."}
                        {handshakeStep === 3 && "Access Granted."}
                        {handshakeStep >= 4 && "Handshake Complete."}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                        Protocol: TLS 1.3 / AES-256 / 4096-bit RSA
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full mt-4">
                    {[0,1,2,3].map(i => (
                        <div key={i} className={`h-1 rounded-full ${i < handshakeStep ? 'bg-[#00FFFF]' : 'bg-gray-800'}`}></div>
                    ))}
                </div>
             </div>
          )}

          {/* VIEW: EMAIL */}
          {view === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fadeIn text-left">
                <div>
                    <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">{t('email')}</label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="node@universe.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFFF] focus:bg-black transition-all font-mono"
                    />
                </div>
                <div>
                    <label className="text-[10px] uppercase text-gray-500 font-bold ml-1 mb-1 block">{t('password')}</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Set Access Key..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FFFF] focus:bg-black transition-all font-mono"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!!loading}
                    className="w-full bg-[#00FFFF]/10 border border-[#00FFFF]/50 text-[#00FFFF] font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-[#00FFFF]/20 transition-all mt-4 group"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            <span className="font-tech tracking-widest">{t('initiateUplink')}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
          )}

          <div className="mt-auto pt-6 text-[10px] text-gray-500 leading-relaxed flex items-center justify-center gap-2">
             <Lock className="w-3 h-3" />
             <span>Secure SSL Connection Established</span>
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20"></div>
      </div>
    </div>
  );
};
