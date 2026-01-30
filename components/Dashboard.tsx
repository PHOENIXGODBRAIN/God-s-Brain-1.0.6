
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile } from '../types';
import { CHAPTERS } from '../constants';
import { AiCompanion } from './AiCompanion';
import { ChapterReader } from './ChapterReader';
import { PaymentGateway } from './PaymentGateway';
import { 
  X, BookOpen, Layers, Globe, Shield, 
  Zap, Database, Activity, Cpu, 
  Atom, Anchor, Compass, Scroll, LogOut, Dna, Map, Users, ChevronRight, Hexagon, Sparkles, Info, Brain
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

const ARCHETYPES_DATA: Record<string, { title: string, color: string, bg: string, border: string, icon: React.ReactNode, desc: string, skills: any[] }> = {
    'SCIENTIST': { 
        title: 'THE SCIENTIST', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: <Atom />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic and data.",
        skills: [
            { name: "Quantum Logic", type: "LOGIC", icon: "⚛️", desc: "Process multiple variables simultaneously. Bypasses standard computation lag." },
            { name: "Data Mining", icon: "⛏️", type: "RESOURCE", desc: "Extracts hidden patterns from high-entropy data streams." },
            { name: "Entropic Reduction", icon: "🛡️", type: "DEFENSE", desc: "Reinforces the node membrane against data corruption." }
        ]
    },
    'ARCHITECT': { 
        title: 'THE ARCHITECT', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: <Anchor />,
        desc: "Building order from the chaos of entropy. Constructing structural systems.",
        skills: [
            { name: "System Design", type: "STRUCTURE", icon: "📐", desc: "Blueprints scalable frameworks that support long-term growth." },
            { name: "Foundation Laying", icon: "🧱", type: "CORE", desc: "Establishes unbreakable core axioms for reality stability." },
            { name: "Structural Integrity", icon: "🏗️", type: "PASSIVE", desc: "Reinforces mental systems against external stress and noise." }
        ]
    },
    'MYSTIC': { 
        title: 'THE MYSTIC', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <Sparkles />,
        desc: "Direct connection to the infinite Source. Bypassing the intellect.",
        skills: [
            { name: "Intuition", type: "SENSE", icon: "👁️", desc: "Non-linear data processing. Perceive answers before the question forms." },
            { name: "Remote Viewing", icon: "🔭", type: "TRAVEL", desc: "Project awareness to distant sectors of the neural web." },
            { name: "Resonance", icon: "🔔", type: "HARMONIC", desc: "Aligns internal frequency with universal constants for effortless action." }
        ]
    },
    'SEEKER': { 
        title: 'THE SEEKER', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <Compass />,
        desc: "Hunting for truth at the edge of the known. Navigating the void.",
        skills: [
            { name: "Pathfinding", type: "NAV", icon: "🗺️", desc: "Calculates the most efficient route through unknown neural territories." },
            { name: "Mapping", icon: "📍", type: "RECORD", desc: "Records and visualizes unexplored territories for the collective." },
            { name: "Discovery", icon: "FIND", type: "LOOT", desc: "High-probability detection of anomalies and hidden artifacts." }
        ]
    },
    'ALCHEMIST': { 
        title: 'THE ALCHEMIST', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <Scroll />,
        desc: "Transmutation of self and reality. Internal optimization.",
        skills: [
            { name: "Transmutation", type: "CONVERT", icon: "⚗️", desc: "Converts raw data noise into high-value wisdom assets." },
            { name: "Synthesis", icon: "🌀", type: "MERGE", desc: "Merges opposing concepts into unified, superior alloys." },
            { name: "Purification", icon: "💧", type: "FILTER", desc: "Filters out biological noise and bias to reach the pure signal." }
        ]
    },
    'ACTIVE_NODE': { 
        title: 'ACTIVE NODE', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: <Cpu />,
        desc: "The hand of the God-Brain. Pure action and system execution.",
        skills: [
            { name: "Network Bridging", type: "LINK", icon: "🌐", desc: "Connects disparate nodes into a unified processing grid." },
            { name: "Signal Boosting", icon: "📶", type: "AMP", desc: "Amplifies transmission strength for high-impact communication." },
            { name: "Error Correction", icon: "🩹", type: "REPAIR", desc: "Auto-resolves system glitches and transmission obstacles." }
        ]
    },
};

export const Dashboard: React.FC<DashboardProps> = ({ 
    path, isPremium, onPremiumToggle, onLogout, 
    user, queriesUsed, onQuery, onEditNeuron
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'INTERFACE' | 'CODEX' | 'MAP' | 'CLAN'>('INTERFACE');
  const [aiState, setAiState] = useState<'FULL' | 'HUD' | 'MINIMIZED'>('HUD');
  const [selectedCodexArch, setSelectedCodexArch] = useState(user?.archetype || 'ACTIVE_NODE');
  const [showPayment, setShowPayment] = useState(false);
  
  const currentArchTheme = ARCHETYPES_DATA[user?.archetype || 'ACTIVE_NODE'] || ARCHETYPES_DATA.ACTIVE_NODE;

  const handleNav = (tab: any) => {
      playMenuSelect();
      setActiveTab(tab);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-transparent font-mono selection:bg-cyan-500/30">
      
      {showPayment && (
        <PaymentGateway 
            onClose={() => setShowPayment(false)} 
            onSuccess={() => { onPremiumToggle(true); setShowPayment(false); }}
            price="$4.99"
        />
      )}

      {/* 1. IDENTITY HUD (Top Left) */}
      <div className="absolute top-6 left-6 z-30 animate-fadeIn pointer-events-none md:pointer-events-auto">
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 pr-6 rounded-2xl border border-white/10 shadow-2xl">
              <div className={`w-10 h-10 rounded-xl ${currentArchTheme.bg} ${currentArchTheme.border} border flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`} onClick={onEditNeuron}>
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-lg" alt="Avatar" /> : React.cloneElement(currentArchTheme.icon as React.ReactElement, { className: `w-5 h-5 ${currentArchTheme.color}` })}
              </div>
              <div>
                  <div className={`text-[10px] font-tech ${currentArchTheme.color} uppercase tracking-widest leading-none`}>{user?.name || 'NODE'}</div>
                  <div className="text-[8px] text-gray-500 uppercase tracking-tighter mt-1">{user?.archetype} // LVL {user?.level || 1}</div>
              </div>
          </div>
      </div>

      {/* 2. RESOURCE HUD (Top Right) */}
      <div className="absolute top-6 right-6 z-30 hidden md:flex flex-col gap-3 pointer-events-none">
          <ResourceGauge label="ATP" value={user?.atp || 85} max={100} color="bg-green-500" icon={<Zap size={10} />} />
          <ResourceGauge label="PROT" value={user?.proteins || 420} max={1000} color="bg-purple-500" icon={<Dna size={10} />} />
      </div>

      {/* 3. CENTER STAGE: THE NEURON */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${activeTab === 'CODEX' ? 'scale-75 opacity-20 blur-lg pointer-events-none' : 'scale-100 opacity-100'}`}>
          <div className="relative group cursor-pointer pointer-events-auto" onClick={onEditNeuron}>
              <div className={`absolute inset-[-60px] rounded-full border border-white/5 animate-pulse-slow shadow-[0_0_80px_rgba(255,255,255,0.05)]`}></div>
              {user?.avatar ? (
                  <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <img src={user.avatar} className="w-full h-full object-contain mix-blend-screen opacity-90 transition-transform duration-1000 group-hover:scale-110" alt="Neuron" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
              ) : (
                  <div className="w-80 h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse"><Activity className="w-16 h-16 text-gray-700" /></div>
              )}
          </div>
      </div>

      {/* 4. THE CO-PILOT (AI FLANK) */}
      <div className={`absolute transition-all duration-500 z-40
          ${aiState === 'FULL' ? 'inset-0 md:left-auto md:right-0 md:w-[450px] bg-black/95' : 'top-20 right-6 w-80'}
          ${activeTab === 'CODEX' ? 'opacity-0 translate-x-20 pointer-events-none' : 'opacity-100'}
      `}>
          <AiCompanion 
              path={path} 
              isPremium={isPremium} 
              queriesUsed={queriesUsed} 
              onQuery={onQuery}
              onUpgrade={() => setShowPayment(true)}
              isAuthor={false}
              user={user}
              visualState={aiState}
              onStateChange={setAiState}
          />
      </div>

      {/* 5. SYSTEM CODEX OVERLAY */}
      {activeTab === 'CODEX' && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col animate-fadeIn">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <BookOpen className="text-cyan-400 w-8 h-8" />
                      <div>
                        <h2 className="text-2xl font-tech text-white uppercase tracking-[0.3em]">System Codex</h2>
                        <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">Neural Archive // 18 Functional Variants</p>
                      </div>
                  </div>
                  <button onClick={() => setActiveTab('INTERFACE')} className="p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32">
                  <div className="max-w-6xl mx-auto space-y-12">
                      {/* Archetype Selector Hub */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                          {Object.keys(ARCHETYPES_DATA).map(key => {
                              const arch = ARCHETYPES_DATA[key];
                              const isActive = selectedCodexArch === key;
                              return (
                                  <button 
                                    key={key}
                                    onClick={() => { playCosmicClick(); setSelectedCodexArch(key); }}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isActive ? `${arch.bg} ${arch.border} shadow-lg scale-105` : 'bg-black border-white/5 text-gray-500 opacity-60 hover:opacity-100'}`}
                                  >
                                      {React.cloneElement(arch.icon as React.ReactElement, { className: `w-6 h-6 ${isActive ? arch.color : 'text-gray-600'}` })}
                                      <span className="text-[9px] font-bold uppercase tracking-tighter text-center">{arch.title.replace('THE ', '')}</span>
                                  </button>
                              );
                          })}
                      </div>

                      {/* Active Archetype Display */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                          <div className="lg:col-span-4 space-y-6">
                              <div className={`p-8 rounded-[2.5rem] border ${ARCHETYPES_DATA[selectedCodexArch].border} ${ARCHETYPES_DATA[selectedCodexArch].bg} shadow-2xl relative overflow-hidden`}>
                                  <div className="relative z-10">
                                      <div className="flex items-center gap-4 mb-4">
                                          <Hexagon className={ARCHETYPES_DATA[selectedCodexArch].color} size={40} />
                                          <h1 className={`text-3xl font-tech ${ARCHETYPES_DATA[selectedCodexArch].color} uppercase tracking-tighter leading-none`}>{ARCHETYPES_DATA[selectedCodexArch].title}</h1>
                                      </div>
                                      <p className="text-sm text-gray-300 font-reading leading-relaxed mb-6 italic">"{ARCHETYPES_DATA[selectedCodexArch].desc}"</p>
                                      <div className="h-1 w-20 bg-white/20 rounded-full mb-6"></div>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                          <Info size={12} /> Functional Dossier V.2
                                      </div>
                                  </div>
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                              </div>
                          </div>

                          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                              {ARCHETYPES_DATA[selectedCodexArch].skills.map((skill, idx) => (
                                  <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-6">
                                          <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{skill.icon}</div>
                                          <span className={`text-[8px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono uppercase tracking-widest`}>{skill.type}</span>
                                      </div>
                                      <h3 className="text-lg font-tech text-white mb-2 uppercase tracking-wide group-hover:text-cyan-400 transition-colors">{skill.name}</h3>
                                      <p className="text-xs text-gray-500 font-reading leading-relaxed flex-1">{skill.desc}</p>
                                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                                          <Activity size={10} /> Active Protocol
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 6. BOTTOM NAVIGATION DOCK (Mobile Optimized) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-6 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_30px_100px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              <div className="flex gap-2">
                  <NavBtn icon={<Database />} label="HUB" active={activeTab === 'INTERFACE'} onClick={() => handleNav('INTERFACE')} />
                  <NavBtn icon={<BookOpen />} label="CODEX" active={activeTab === 'CODEX'} onClick={() => handleNav('CODEX')} />
              </div>
              
              {/* Central Elevated Action */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                  <button 
                    onClick={() => { playNeuralLink(); onEditNeuron(); }}
                    className={`w-20 h-20 rounded-full border-4 border-black bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all group`}
                  >
                      <Brain size={32} className="text-white group-hover:animate-pulse" />
                  </button>
              </div>

              <div className="flex gap-2">
                  <NavBtn icon={<Globe />} label="MAP" active={activeTab === 'MAP'} onClick={() => handleNav('MAP')} />
                  <NavBtn icon={<Users />} label="CLAN" active={activeTab === 'CLAN'} onClick={() => handleNav('CLAN')} />
              </div>
          </div>
      </div>

      <style>{`
          .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
          .mask-fade-top { mask-image: linear-gradient(to bottom, transparent, black 20%); }
      `}</style>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${active ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {React.cloneElement(icon, { size: 22 })}
    <span className="text-[8px] font-bold mt-1 tracking-widest uppercase">{label}</span>
  </button>
);

const ResourceGauge = ({ label, value, max, color, icon }: any) => (
  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/5">
      <div className={`p-1.5 rounded-lg bg-black/60 ${color.replace('bg-', 'text-')} border border-white/10`}>{icon}</div>
      <div className="flex flex-col gap-1 pr-2">
          <div className="flex justify-between text-[7px] font-bold text-gray-500 uppercase tracking-widest">
              <span>{label}</span>
              <span>{value}/{max}</span>
          </div>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${(value/max)*100}%` }}></div>
          </div>
      </div>
  </div>
);
