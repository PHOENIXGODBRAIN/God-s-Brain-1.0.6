
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile } from '../types';
import { CHAPTERS } from '../constants';
import { AiCompanion } from './AiCompanion';
import { ChapterReader } from './ChapterReader';
import { PaymentGateway } from './PaymentGateway';
import { 
  X, BookOpen, Layers, Globe, Shield, 
  Zap, Database, Activity, Cpu, 
  Atom, Anchor, Compass, Scroll, LogOut, Dna, Map, Users, ChevronRight, Sparkles
} from 'lucide-react';
import { playCosmicClick, playNeuralLink, playMenuSelect, playDataOpen } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgression } from '../contexts/ProgressionContext';

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

const ARCHETYPE_THEMES: Record<string, { color: string; bg: string; border: string; glow: string; icon: React.ReactNode }> = {
    'SCIENTIST': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20', icon: <Atom className="w-8 h-8" /> },
    'ARCHITECT': { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', glow: 'shadow-rose-500/20', icon: <Anchor className="w-8 h-8" /> },
    'MYSTIC': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'shadow-amber-500/20', icon: <Sparkles className="w-8 h-8" /> },
    'SEEKER': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-orange-500/20', icon: <Compass className="w-8 h-8" /> },
    'ALCHEMIST': { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', glow: 'shadow-green-500/20', icon: <Scroll className="w-8 h-8" /> },
    'ACTIVE_NODE': { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-purple-500/20', icon: <Cpu className="w-8 h-8" /> },
};

const UPGRADES = [
  { 
    id: 'membrane', 
    name: 'MYELIN SHEATH II', 
    cost: 300, 
    currency: 'proteins',
    icon: <Shield className="text-blue-400" />,
    desc: 'Thickens outer shell. Reduces Entropy damage by 15%.' 
  },
  { 
    id: 'axon', 
    name: 'DENDRITIC REACH', 
    cost: 150, 
    currency: 'proteins',
    icon: <Dna className="text-purple-400" />,
    desc: 'Extends arm length. Allows connection to nodes 2 sectors away.' 
  },
  { 
    id: 'nucleus', 
    name: 'PINEAL CRYSTAL', 
    cost: 10, 
    currency: 'voltage',
    icon: <Cpu className="text-yellow-400" />,
    desc: 'Upgrades core processor. Unlocks "Deep Logic" dialogue options.' 
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
    path, isPremium, onPremiumToggle, onLogout, 
    isAuthor, user, onUpdateProfile, queriesUsed, onQuery, onEditNeuron
}) => {
  const { t } = useLanguage();
  const { level, xp, xpToNextLevel, entropy } = useProgression();
  const [showCodex, setShowCodex] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'NEURON' | 'MAP' | 'CLAN'>('NEURON');
  
  const theme = ARCHETYPE_THEMES[user?.archetype || 'ACTIVE_NODE'] || ARCHETYPE_THEMES.ACTIVE_NODE;

  const handleLogout = () => {
      playCosmicClick();
      onLogout();
  };

  return (
    <div className="h-screen w-screen flex bg-transparent font-mono selection:bg-cyan-500/30">
      
      {showPayment && (
        <PaymentGateway 
            onClose={() => setShowPayment(false)} 
            onSuccess={() => { onPremiumToggle(true); setShowPayment(false); }}
            price="$4.99"
        />
      )}

      {/* 1. LEFT PANE: SYSTEM SIDEBAR */}
      <div className="w-20 lg:w-72 bg-black/60 backdrop-blur-2xl border-r border-white/10 flex flex-col z-40 transition-all duration-300">
        <div className="p-6 border-b border-white/5">
          <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.border} border flex items-center justify-center mb-4 shadow-inner cursor-pointer hover:scale-105 transition-transform`} onClick={onEditNeuron}>
             {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover rounded-xl" alt="Avatar" />
             ) : (
                <div className={theme.color}>{theme.icon}</div>
             )}
          </div>
          <div className="hidden lg:block">
            <h1 className={`text-sm font-tech ${theme.color} uppercase tracking-[0.2em] leading-none mb-1`}>{user?.name || 'NODE'}</h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">{user?.archetype || 'ACTIVE_NODE'}</p>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <SidebarNavButton icon={<Activity size={18} />} label="INTERFACE" active={activeTab === 'NEURON'} onClick={() => { playMenuSelect(); setActiveTab('NEURON'); setShowUpgrades(false); setShowCodex(false); }} />
          <SidebarNavButton icon={<Map size={18} />} label="CORTEX MAP" active={activeTab === 'MAP'} onClick={() => { playMenuSelect(); setActiveTab('MAP'); }} />
          <SidebarNavButton icon={<Users size={18} />} label="CLAN LINK" active={activeTab === 'CLAN'} onClick={() => { playMenuSelect(); setActiveTab('CLAN'); }} />
          <div className="my-4 h-px bg-white/5 mx-2" />
          <SidebarNavButton icon={<BookOpen size={18} />} label="SYSTEM CODEX" active={showCodex} onClick={() => { playDataOpen(); setShowCodex(!showCodex); setShowUpgrades(false); }} />
          <SidebarNavButton icon={<Dna size={18} />} label="EVOLVE" active={showUpgrades} onClick={() => { playDataOpen(); setShowUpgrades(!showUpgrades); setShowCodex(false); }} />
        </nav>

        <div className="p-4 bg-black/40 border-t border-white/5 space-y-4">
          <ResourceBar icon={<Zap size={14} className="text-green-400" />} label="ATP" value={user?.atp || 85} max={100} color="bg-green-500" />
          <ResourceBar icon={<Dna size={14} className="text-purple-400" />} label="PROTEINS" value={user?.proteins || 420} max={1000} color="bg-purple-500" />
          <div className="flex items-center justify-between text-[10px] pt-1">
            <span className="text-yellow-500 flex items-center gap-2 uppercase font-bold tracking-widest"><Cpu size={12}/> VOLTAGE</span>
            <span className="font-mono text-white">{user?.voltage || 15}V</span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-bold uppercase tracking-widest mt-2">
            <LogOut size={16} /> <span className="hidden lg:block">Disconnect</span>
          </button>
        </div>
      </div>

      {/* 2. CENTER PANE: AVATAR STAGE */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Background persist from CosmicBackground */}
        
        {/* The Interactive Avatar */}
        <div className={`relative transition-all duration-700 ${showCodex || showUpgrades ? 'scale-75 opacity-20 blur-sm pointer-events-none' : 'scale-100 opacity-100'}`} onClick={onEditNeuron}>
            <div className={`absolute inset-[-60px] rounded-full border border-white/5 animate-pulse-slow ${theme.glow}`}></div>
            <div className={`absolute inset-[-100px] rounded-full border border-white/5 animate-[spin_30s_linear_infinite] opacity-10`}></div>
            
            {user?.avatar ? (
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-md flex items-center justify-center group/avatar cursor-pointer">
                    <img src={user.avatar} className="w-full h-full object-contain mix-blend-screen opacity-90 group-hover/avatar:scale-110 transition-transform duration-1000" alt="Neuron" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <div className="text-[9px] font-mono text-white/60 tracking-[0.5em] uppercase">BIO-FORGE ACTIVE</div>
                        <Zap className="w-5 h-5 text-white animate-bounce" />
                    </div>
                </div>
            ) : (
                <div className="w-80 h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                    <Activity className="w-16 h-16 text-gray-700" />
                </div>
            )}
        </div>

        {/* Evolve / Mutation Overlay */}
        {showUpgrades && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 p-10 flex flex-col items-center justify-center animate-fadeIn">
            <h2 className="text-3xl font-tech text-white uppercase tracking-[0.3em] mb-12 text-shadow-glow">Biological Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {UPGRADES.map(u => (
                <div key={u.id} className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 transition-all cursor-pointer group shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-cyan-500/10 transition-colors shadow-inner">{u.icon}</div>
                    <div className="text-[10px] font-mono bg-white/10 px-3 py-1 rounded-full text-white uppercase tracking-widest">{u.cost} {u.currency.toUpperCase()}</div>
                  </div>
                  <h3 className="text-xl font-tech text-white mb-3 tracking-wider">{u.name}</h3>
                  <p className="text-xs text-gray-500 font-reading leading-relaxed mb-8">{u.desc}</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 rounded-xl text-xs font-bold transition-all uppercase tracking-[0.2em]">Initiate Mutation</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowUpgrades(false)} className="mt-12 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.5em] transition-colors py-4">Exit Bio-Forge</button>
          </div>
        )}

        {/* System Codex Overlay */}
        {showCodex && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-30 flex flex-col animate-fadeIn">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-tech text-white uppercase tracking-[0.2em] flex items-center gap-4">
                  <BookOpen className="text-cyan-400" /> System Codex
                </h2>
                <button onClick={() => setShowCodex(false)} className="p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
               <ChapterReader chapters={CHAPTERS} isPremium={isPremium} onUpgrade={() => setShowPayment(true)} />
            </div>
          </div>
        )}
      </div>

      {/* 3. RIGHT PANE: DIRECTIVE ENGINE (AI) */}
      <div className="w-80 lg:w-[420px] bg-black/80 backdrop-blur-2xl border-l border-white/10 flex flex-col z-40 transition-all duration-300">
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

      <style>{`
          .text-shadow-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
          .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

const SidebarNavButton = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all relative group overflow-hidden ${
      active 
        ? 'bg-white/10 text-white border border-white/20 shadow-lg' 
        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
    }`}
  >
    <div className={`${active ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}`}>{icon}</div>
    <span className="text-[10px] font-bold tracking-[0.2em] hidden lg:block uppercase">{label}</span>
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-l-full shadow-[0_0_10px_#00FFFF]"></div>}
  </button>
);

const ResourceBar = ({ icon, label, value, max, color }: any) => (
  <div className="group">
    <div className="flex justify-between text-[9px] mb-2 text-gray-500 font-bold tracking-widest uppercase">
      <span className="flex items-center gap-2 group-hover:text-white transition-colors">{icon} {label}</span>
      <span className="group-hover:text-white transition-colors">{value}/{max}</span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
      <div className={`h-full rounded-full transition-all duration-1000 ${color} shadow-[0_0_8px_currentColor] opacity-60`} style={{ width: `${(value/max)*100}%` }} />
    </div>
  </div>
);
