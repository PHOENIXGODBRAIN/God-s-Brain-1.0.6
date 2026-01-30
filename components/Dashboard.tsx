
import React, { useState } from 'react';
import { UserPath, UserProfile } from '../types';
import { GLOSSARY, CHAPTERS } from '../constants';
import { ToneGenerator } from './ToneGenerator';
import { AiCompanion } from './AiCompanion';
import { AudioPlayer } from './AudioPlayer';
import { ChapterReader } from './ChapterReader';
import { CosmicMap } from './CosmicMap';
import { PaymentGateway } from './PaymentGateway';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ArchetypeShowcase } from './Onboarding/ArchetypeShowcase'; 
import { AdminPanel } from './Admin/AdminPanel'; 
import { Flame, X } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playError } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  path: UserPath;
  isPremium: boolean;
  onPremiumToggle: (status: boolean) => void;
  onLogout: () => void;
  isAuthor: boolean;
  onAuthorLogin: () => void;
  user?: UserProfile;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  queriesUsed: number;
  onQuery: () => void;
  onEditNeuron: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    path, isPremium, onPremiumToggle, onLogout, 
    isAuthor, onAuthorLogin, user, onUpdateProfile, queriesUsed, onQuery, onEditNeuron
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'book' | 'map' | 'companion' | 'audio' | 'protocols' | 'admin'>('companion');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handlePinClick = (num: string) => {
    playCosmicClick();
    if (pinInput.length < 4) {
      setPinInput(prev => prev + num);
      setPinError(false);
    }
  };

  const handlePinClear = () => {
    playCosmicClick();
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (pinInput === '1742') {
      playNeuralLink();
      onAuthorLogin(); 
      setShowPinPad(false);
      setPinInput('');
    } else {
      playError(); 
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
      setPinInput('');
    }
  };

  const togglePinPad = () => {
    playCosmicClick();
    setShowPinPad(!showPinPad);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row text-[#e0f2fe] font-sans selection:bg-[#00FFFF] selection:text-black overflow-hidden bg-transparent">
      
      {showPayment && (
        <PaymentGateway 
            onClose={() => setShowPayment(false)} 
            onSuccess={() => { onPremiumToggle(true); setShowPayment(false); }}
            price="$4.99"
        />
      )}

      {showPinPad && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm border border-[#FF4500]/50 bg-black rounded-3xl p-8 shadow-[0_0_50px_rgba(255,69,0,0.2)] relative overflow-hidden">
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>
             
             <div className="relative z-10 text-center">
                <div className="flex justify-between items-center mb-6">
                   <Flame className="w-6 h-6 text-[#FF4500] animate-pulse" />
                   <h3 className="font-tech text-[#FF4500] text-sm tracking-[0.2em] uppercase">{t('phoenixOverride')}</h3>
                   <button onClick={() => setShowPinPad(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                <div className={`mb-8 bg-[#111] border ${pinError ? 'border-red-500 text-red-500' : 'border-[#FF4500]/30 text-[#FF4500]'} h-16 rounded-xl flex items-center justify-center font-mono text-3xl tracking-[0.5em] shadow-inner`}>
                   {pinInput.padEnd(4, '*').replace(/./g, (char, i) => i < pinInput.length ? char : '·')}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button key={num} onClick={() => handlePinClick(String(num))} className="h-14 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FF4500]/20 hover:border-[#FF4500] hover:text-[#FF4500] font-tech text-xl transition-all active:scale-95">{num}</button>
                   ))}
                   <button onClick={handlePinClear} className="h-14 rounded-lg bg-red-900/20 border border-red-500/30 text-red-500 font-bold text-xs hover:bg-red-900/40 uppercase tracking-wider">CLR</button>
                   <button onClick={() => handlePinClick('0')} className="h-14 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FF4500]/20 hover:border-[#FF4500] hover:text-[#FF4500] font-tech text-xl transition-all">0</button>
                   <button onClick={handlePinSubmit} className="h-14 rounded-lg bg-[#FF4500]/20 border border-[#FF4500]/50 text-[#FF4500] font-bold text-xs hover:bg-[#FF4500]/40 uppercase tracking-wider">ENT</button>
                </div>
             </div>
          </div>
        </div>
      )}

      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMenuOpen={isMenuOpen}
        onCloseMenu={() => setIsMenuOpen(false)}
        isPremium={isPremium}
        isAuthor={isAuthor}
        onUpgrade={() => setShowPayment(true)}
        onOverride={togglePinPad}
        onLogout={onLogout}
        onShowPayment={() => setShowPayment(true)}
        onEditNeuron={onEditNeuron}
      />

      <main className="flex-1 overflow-y-auto scroll-smooth relative custom-scrollbar">
        <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-12 relative z-10 min-h-full">
          
          <TopBar 
            activeTab={activeTab}
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            user={user}
            path={path}
            isAuthor={isAuthor}
            onUpdateProfile={onUpdateProfile}
          />

          <div className="pb-24">
            {activeTab === 'companion' && (
              <div className="animate-fadeIn">
                <AiCompanion 
                  path={path} 
                  isPremium={isPremium} 
                  queriesUsed={queriesUsed} 
                  onQuery={onQuery}
                  onUpgrade={() => setShowPayment(true)}
                  isAuthor={isAuthor}
                  user={user}
                />
              </div>
            )}
            
            {activeTab === 'protocols' && (
                <div className="animate-fadeIn">
                    <ArchetypeShowcase onContinue={() => {}} viewMode="dashboard" />
                </div>
            )}
            
            {activeTab === 'admin' && isAuthor && (
                <div className="animate-fadeIn">
                    <AdminPanel />
                </div>
            )}

            {activeTab === 'book' && (
              <ChapterReader chapters={CHAPTERS} isPremium={isPremium} onUpgrade={() => setShowPayment(true)} />
            )}

            {activeTab === 'audio' && (
              <div className="animate-fadeIn">
                <AudioPlayer isPremium={isPremium} onUpgrade={() => setShowPayment(true)} />
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-8 animate-fadeIn">
                <CosmicMap />
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="p-8 border border-white/10 bg-black/60 backdrop-blur-md rounded-3xl shadow-xl path-border-active">
                      <h3 className="font-tech text-[#00FFFF] mb-6 uppercase text-xs tracking-widest">{t('networkData')}</h3>
                      <ul className="space-y-4">
                          {GLOSSARY.slice(0,4).map((g, i) => (
                              <li key={i} className="text-xs text-gray-400 border-l border-white/10 pl-4 py-1 hover:border-[#00FFFF] transition-colors">
                                  <strong className="text-gray-200 block mb-1 font-tech text-[9px] tracking-wide uppercase">{g.term}</strong>
                                  {g.definition}
                              </li>
                          ))}
                      </ul>
                   </div>
                   <ToneGenerator />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
