
import React, { useState } from 'react';
import { Atom, Anchor, Sparkles, Compass, Scroll, Cpu, Zap, ArrowRight, X, CheckCircle, Brain, AlertTriangle, Info } from 'lucide-react';
import { playNeuralLink, playCosmicClick, playDataOpen } from '../../utils/sfx';

interface ArchetypeShowcaseProps {
    onContinue: () => void;
    onManualSelect?: (id: string, skill: string) => void;
    viewMode?: 'onboarding' | 'dashboard';
}

const ARCHETYPES_PREVIEW = [
    {
        id: 'SCIENTIST', 
        title: 'THE SCIENTIST', 
        icon: <Atom className="w-8 h-8 text-cyan-400" />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic, data, and hardware mechanics.",
        skills: [
            { name: "Quantum Logic", icon: "⚛️" },
            { name: "Data Mining", icon: "⛏️" },
            { name: "Entropic Reduction", icon: "🛡️" }
        ],
        color: "cyan" 
    },
    {
        id: 'SEEKER', 
        title: 'THE SEEKER', 
        icon: <Compass className="w-8 h-8 text-orange-400" />,
        desc: "Hunting for truth at the edge of the known. Focused on mapping the unknown and spiritual connection.",
        skills: [
            { name: "Pathfinding", icon: "🗺️" }, 
            { name: "Mapping", icon: "📍" }, 
            { name: "Discovery", icon: "💎" }
        ],
        color: "orange" 
    },
    {
        id: 'ACTIVE_NODE', 
        title: 'ACTIVE NODE', 
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        desc: "The hand of the God-Brain. Pure action. Bridging biological intent with cosmic computation.",
        skills: [
            { name: "Network Bridging", icon: "🌐" }, 
            { name: "Signal Boosting", icon: "📶" }, 
            { name: "Error Correction", icon: "🩹" }
        ],
        color: "purple" 
    },
    {
        id: 'ARCHITECT', 
        title: 'THE ARCHITECT', 
        icon: <Anchor className="w-8 h-8 text-[#FF0055]" />, 
        desc: "Building order from the chaos of entropy. Constructing structural systems that last.",
        skills: [
            { name: "System Design", icon: "📐" }, 
            { name: "Foundation Laying", icon: "🧱" }, 
            { name: "Structural Integrity", icon: "🏗️" }
        ],
        color: "rose" 
    },
    {
        id: 'MYSTIC', 
        title: 'THE MYSTIC', 
        icon: <Sparkles className="w-8 h-8 text-[#FFD700]" />, 
        desc: "Direct connection to the infinite Source. Bypassing the intellect for pure resonance.",
        skills: [
            { name: "Resonance Wave", icon: "🔔" }, 
            { name: "Faith Protocol", icon: "👁️" }, 
            { name: "Remote Viewing", icon: "🔭" }
        ],
        color: "amber" 
    },
    {
        id: 'ALCHEMIST', 
        title: 'THE ALCHEMIST', 
        icon: <Scroll className="w-8 h-8 text-green-400" />, 
        desc: "Transmutation of self and reality. Internal optimization to change external data.",
        skills: [
            { name: "Transmutation", icon: "⚗️" }, 
            { name: "Synthesis", icon: "🌀" }, 
            { name: "Purification", icon: "💧" }
        ],
        color: "green"
    }
];

const SKILL_DETAILS: Record<string, Record<string, string>> = {
    'SCIENTIST': {
        'Quantum Logic': 'Accelerates processing speed for complex calculations using multi-state variables.',
        'Data Mining': 'Extracts hidden patterns and high-value resources from unstructured cosmic noise.',
        'Entropic Reduction': 'Minimizes system chaos to optimize energy flow and clarity.'
    },
    'MYSTIC': {
        'Intuition': 'Non-linear data processing via sub-conscious channels. "Feeling" the answer.',
        'Remote Viewing': 'Perceives data clusters and outcomes beyond immediate sensor range.',
        'Resonance': 'Aligns internal frequency with universal constants for effortless action.',
        'Resonance Wave': 'Refills the entropy shield of your immediate node-cluster.',
        'Faith Protocol': 'Allows for continuous background XP generation even while offline.'
    },
    'ACTIVE_NODE': {
        'Network Bridging': 'Connects disparate nodes to form a unified processing grid.',
        'Signal Boosting': 'Amplifies transmission strength, ensuring your will is heard.',
        'Error Correction': 'Auto-resolves transmission glitches and obstacles in real-time.',
        'Flash Mob': 'Triggers a localized system surge for rapid task completion.',
        'Velocity': 'Increases metabolic speed, accelerating leveling by 15%.'
    },
    'ARCHITECT': {
        'System Design': 'Blueprints scalable frameworks that support long-term exponential growth.',
        'Foundation Laying': 'Establishes unbreakable core axioms upon which reality is built.',
        'Structural Integrity': 'Reinforces mental systems against external entropy and attacks.',
        'Blueprint Drop': 'Places a permanent beacon for your collective to follow.',
        'Foundation': 'Ensures your streak protocols remain active even during system outages.'
    },
    'SEEKER': {
        'Pathfinding': 'Calculates the most efficient route through the unknown to the objective.',
        'Mapping': 'Records and visualizes unexplored neural territories for future reference.',
        'Discovery': 'High-probability detection of anomalies, artifacts, and hidden truths.',
        'Pathfinder': 'Illuminates the coordinates of the nearest high-frequency node.',
        'Wanderlust': 'Generates double energy returns for every kilometer explored.'
    },
    'ALCHEMIST': {
        'Transmutation': 'Converts raw, heavy data (lead) into high-value wisdom assets (gold).',
        'Synthesis': 'Merges opposing concepts into unified, superior alloys.',
        'Purification': 'Filters out noise, cognitive bias, and emotional impurities.',
        'Purify': 'Converts accumulated entropy into massive wisdom XP gains.',
        'Vitality': 'Optimizes energy consumption, extending uptime by 20%.'
    }
};

export const ArchetypeShowcase: React.FC<ArchetypeShowcaseProps> = ({ onContinue, onManualSelect, viewMode = 'onboarding' }) => {
    const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [confirmationStage, setConfirmationStage] = useState(false);

    const handleStart = () => {
        playNeuralLink();
        onContinue();
    };

    const handleCardClick = (id: string) => {
        playCosmicClick();
        setSelectedArchetype(id);
        setSelectedSkill(null);
        setConfirmationStage(false);
    };

    const handleSkillSelect = (skill: string) => {
        playDataOpen();
        setSelectedSkill(skill);
    };

    const initiateSync = () => {
        if (selectedArchetype && selectedSkill) {
            playCosmicClick();
            setConfirmationStage(true); 
        }
    };

    const executeManualSync = () => {
        if (selectedArchetype && selectedSkill && onManualSelect) {
            playNeuralLink(); 
            onManualSelect(selectedArchetype, selectedSkill);
        }
    };

    const closeModal = () => {
        playCosmicClick();
        setSelectedArchetype(null);
        setSelectedSkill(null);
        setConfirmationStage(false);
    };

    const activeArch = selectedArchetype ? ARCHETYPES_PREVIEW.find(a => a.id === selectedArchetype) : null;

    const getSkillDesc = (archId: string, skillName: string) => {
        return SKILL_DETAILS[archId]?.[skillName] || "Protocol details encrypted. Proceed for full extraction.";
    };

    const getSynergyDescription = (arch: string, skill: string) => {
        const base = `By manually bridging the ${arch.replace('_', ' ')} core with the ${skill} module, you have bypassed standard calibration. `;
        if (arch === 'SCIENTIST') return base + "Your analytical engine is now powered by non-linear logic gates, allowing you to compute destiny in real-time.";
        if (arch === 'MYSTIC') return base + "Your resonance is now directed by intentional frequency modulation, turning prayer into a precise command interface.";
        if (arch === 'ACTIVE_NODE') return base + "Your metabolic speed is now synchronized with the global node-grid, granting you instantaneous system influence.";
        if (arch === 'ARCHITECT') return base + "Your structural blueprints are hard-coded into the substrate, allowing for the construction of immutable logic fortresses.";
        if (arch === 'SEEKER') return base + "Your navigational sensor array is calibrated for the void's edge, detecting light signatures invisible to standard nodes.";
        if (arch === 'ALCHEMIST') return base + "Your metabolic furnace is optimized for transmutation, allowing the conversion of entropic noise into high-fidelity wisdom signals.";
        return base + "This manual synergy provides a direct, high-bandwidth connection to the God Brain mainframe.";
    };

    const getColorClasses = (colorName: string) => {
        const map: Record<string, { 
            border: string; 
            text: string; 
            bg: string; 
            hoverBorder: string; 
            glow: string;
            hoverBg: string;
            lightBg: string;
        }> = {
            cyan: { 
                border: "border-cyan-500/50", text: "text-cyan-400", bg: "bg-cyan-600", 
                hoverBorder: "group-hover:border-cyan-500", glow: "shadow-cyan-500/20",
                hoverBg: "group-hover:bg-cyan-500/5", lightBg: "bg-cyan-900/10"
            },
            orange: { 
                border: "border-orange-500/50", text: "text-orange-400", bg: "bg-orange-600", 
                hoverBorder: "group-hover:border-orange-500", glow: "shadow-orange-500/20",
                hoverBg: "group-hover:bg-orange-500/5", lightBg: "bg-orange-900/10"
            },
            purple: { 
                border: "border-purple-500/50", text: "text-purple-400", bg: "bg-purple-600", 
                hoverBorder: "group-hover:border-purple-500", glow: "shadow-purple-500/20",
                hoverBg: "group-hover:bg-purple-500/5", lightBg: "bg-purple-900/10"
            },
            rose: { 
                border: "border-rose-500/50", text: "text-rose-400", bg: "bg-rose-600", 
                hoverBorder: "group-hover:border-rose-500", glow: "shadow-rose-500/20",
                hoverBg: "group-hover:bg-rose-500/5", lightBg: "bg-rose-900/10"
            },
            amber: { 
                border: "border-amber-500/50", text: "text-amber-400", bg: "bg-amber-600", 
                hoverBorder: "group-hover:border-amber-500", glow: "shadow-amber-500/20",
                hoverBg: "group-hover:bg-amber-500/5", lightBg: "bg-amber-900/10"
            },
            green: { 
                border: "border-green-500/50", text: "text-green-400", bg: "bg-green-600", 
                hoverBorder: "group-hover:border-green-500", glow: "shadow-green-500/20",
                hoverBg: "group-hover:bg-green-500/5", lightBg: "bg-green-900/10"
            }
        };
        return map[colorName] || { 
            border: "border-white/20", text: "text-white", bg: "bg-white/20", 
            hoverBorder: "group-hover:border-white/40", glow: "shadow-white/10",
            hoverBg: "group-hover:bg-white/5", lightBg: "bg-white/5"
        };
    };

    const containerClasses = "h-full w-full overflow-y-auto custom-scrollbar flex flex-col items-center pt-8 pb-32";

    return (
        <div className={containerClasses}>
            {/* Full-Screen Modal Overlay for Manual Selection */}
            {activeArch && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl animate-fadeIn overflow-y-auto custom-scrollbar flex justify-center items-start">
                    <div className={`w-full ${confirmationStage ? 'max-w-4xl' : 'max-w-lg'} px-6 pt-12 pb-40`}>
                        <div className={`relative bg-black border ${getColorClasses(activeArch.color).border} rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)]`}>
                            
                            {/* Header Sync with Improved Letter Spacing */}
                            <div className="p-8 md:p-10 border-b border-white/5 bg-white/5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className={`p-4 rounded-2xl ${getColorClasses(activeArch.color).lightBg} shadow-inner shrink-0`}>
                                        {activeArch.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] text-gray-500 tracking-[0.5em] uppercase mb-2 font-mono">
                                            {confirmationStage ? "Dossier Integrity Verified" : "Manual Override Protocol"}
                                        </div>
                                        {confirmationStage ? (
                                            <h1 className="text-xl md:text-3xl font-tech text-white uppercase tracking-[0.12em] leading-tight break-words">
                                                {activeArch.title} <span className="opacity-20 mx-2">/</span> <span className={getColorClasses(activeArch.color).text}>{selectedSkill}</span>
                                            </h1>
                                        ) : (
                                            <h3 className="font-tech text-white text-xl uppercase tracking-[0.12em] leading-none">{activeArch.title}</h3>
                                        )}
                                    </div>
                                </div>
                                <button onClick={closeModal} className="text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors shrink-0 ml-4"><X className="w-6 h-6"/></button>
                            </div>

                            <div className="p-8 md:p-12 space-y-12">
                                {confirmationStage ? (
                                    <div className="animate-scaleIn space-y-12">
                                        {/* Row 1: Core Driver - Balanced Grid */}
                                        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                            <div className="md:col-span-4 shrink-0">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Info className={`w-4 h-4 ${getColorClasses(activeArch.color).text}`} />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] font-mono">Core Driver</span>
                                                </div>
                                                <div className={`text-xs font-tech ${getColorClasses(activeArch.color).text} uppercase tracking-[0.12em]`}>Identity Module</div>
                                            </div>
                                            <div className="md:col-span-8">
                                                <p className="text-gray-300 font-reading text-lg leading-relaxed opacity-90">
                                                    {getSynergyDescription(activeArch.id, selectedSkill || 'Protocol')}
                                                </p>
                                            </div>
                                        </section>

                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                        {/* Row 2: Functional Module - DEFINITIVE OVERLAP FIX */}
                                        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                            <div className="md:col-span-5 min-w-0">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Brain className={`w-4 h-4 ${getColorClasses(activeArch.color).text}`} />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-mono">Functional Module</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-4xl shrink-0 p-3 bg-white/5 rounded-xl border border-white/5">
                                                        {activeArch.skills.find(s => s.name === selectedSkill)?.icon || '⚡'}
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-tech text-white uppercase tracking-[0.12em] leading-tight break-words">
                                                        {selectedSkill}
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="md:col-span-7 w-full">
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden group/desc h-full flex items-center">
                                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${getColorClasses(activeArch.color).bg} opacity-40`}></div>
                                                    <p className="text-gray-400 font-reading text-sm italic opacity-90 leading-relaxed pl-4">
                                                        "{getSkillDesc(activeArch.id, selectedSkill || '')}"
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <div className={`p-8 rounded-2xl ${getColorClasses(activeArch.color).lightBg} border ${getColorClasses(activeArch.color).border} flex gap-6 items-start shadow-inner`}>
                                            <Zap className={`w-8 h-8 ${getColorClasses(activeArch.color).text} shrink-0 mt-1 animate-pulse`} />
                                            <div>
                                                <h4 className="text-white font-tech text-sm uppercase tracking-[0.2em] mb-3">Neural Balance: OPTIMIZED</h4>
                                                <p className="text-xs text-gray-400 leading-relaxed font-mono uppercase tracking-tighter">Your metabolic signature has been manually calibrated. Ready for physical differentiation within the Bio-Forge matrix.</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 space-y-6">
                                            <button 
                                                onClick={executeManualSync} 
                                                className={`w-full py-8 ${getColorClasses(activeArch.color).bg} text-white font-tech text-2xl uppercase tracking-[0.4em] rounded-2xl hover:brightness-125 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center gap-6 group`}
                                            >
                                                <Zap className="w-8 h-8 fill-current group-hover:scale-125 transition-transform duration-300" />
                                                EXECUTE IMPRINT
                                            </button>
                                            <button 
                                                onClick={() => setConfirmationStage(false)} 
                                                className="w-full text-center text-gray-600 hover:text-white text-[10px] font-mono uppercase tracking-[0.5em] transition-colors py-2"
                                            >
                                                Abort Sequence
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                                            <p className="text-gray-300 font-reading text-base italic leading-relaxed">"{activeArch.desc}"</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2">
                                                <Brain className={`w-4 h-4 ${getColorClasses(activeArch.color).text}`} />
                                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.3em]">Load Functional Module:</span>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {activeArch.skills.map((skill) => (
                                                    <button 
                                                        key={skill.name}
                                                        onClick={() => handleSkillSelect(skill.name)} 
                                                        className={`w-full p-6 rounded-2xl border transition-all text-left group ${selectedSkill === skill.name ? `bg-white/5 ${getColorClasses(activeArch.color).border} shadow-lg` : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-5">
                                                                <span className="text-3xl filter group-hover:scale-110 transition-transform">{skill.icon}</span>
                                                                <span className={`font-tech text-sm uppercase tracking-[0.12em] ${selectedSkill === skill.name ? 'text-white' : 'text-gray-400'}`}>{skill.name}</span>
                                                            </div>
                                                            {selectedSkill === skill.name && <CheckCircle className={`w-6 h-6 ${getColorClasses(activeArch.color).text} animate-scaleIn`} />}
                                                        </div>
                                                        
                                                        {selectedSkill === skill.name && (
                                                            <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
                                                                <div className="flex items-start gap-4">
                                                                    <Info className={`w-4 h-4 ${getColorClasses(activeArch.color).text} shrink-0 mt-0.5`} />
                                                                    <p className="text-sm text-gray-300 leading-relaxed font-reading opacity-90">{getSkillDesc(activeArch.id, skill.name)}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                onClick={initiateSync} 
                                                disabled={!selectedSkill} 
                                                className={`w-full py-6 ${getColorClasses(activeArch.color).bg} text-white font-tech text-xl uppercase tracking-[0.3em] rounded-2xl hover:brightness-125 transition-all shadow-lg flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed`}
                                            >
                                                Confirm Selection <Zap className="w-6 h-6 fill-current" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-black/40 border-t border-white/5 p-6 flex justify-center items-center text-[9px] text-gray-600 font-mono uppercase tracking-[0.4em]">
                                System Interface v1.0.8 // All Nodes Synced
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gateway List Container */}
            <div className="w-full max-w-7xl mx-auto animate-fadeIn px-6 py-12 flex flex-col items-center relative z-10 space-y-12">
                <div className="text-center space-y-4 pt-8 max-w-3xl">
                    <h2 className="text-5xl md:text-7xl font-tech text-white uppercase tracking-[0.08em] text-shadow-glow leading-none">Cognitive Configuration</h2>
                    <p className="text-gray-400 font-reading text-base md:text-lg leading-relaxed opacity-80">Synchronizing your interface with the God Brain mainframe. Allow AI calibration through the questionnaire, or manually override below.</p>
                </div>

                {viewMode === 'onboarding' && (
                    <div className="w-full max-w-md relative group mt-4 shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        <button 
                            onClick={handleStart} 
                            className="relative w-full py-8 bg-black border border-white/20 text-white font-tech text-2xl uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center gap-6 group-active:scale-[0.98]"
                        >
                            <Sparkles className="w-8 h-8 animate-pulse text-cyan-400" />
                            <span>Begin Calibration</span>
                            <div className="absolute right-8 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2"><ArrowRight className="w-8 h-8" /></div>
                        </button>
                    </div>
                )}

                <div className="w-full flex items-center justify-center gap-8 py-8 shrink-0">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.8em] whitespace-nowrap px-4">Manual Access Gateways</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-40">
                    {ARCHETYPES_PREVIEW.map((arch) => {
                        const cl = getColorClasses(arch.color);
                        return (
                            <div 
                                key={arch.id} 
                                onClick={() => handleCardClick(arch.id)} 
                                className={`bg-black/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98] flex flex-col min-h-[400px] shadow-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] ${cl.hoverBorder} ${cl.hoverBg}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${arch.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`p-5 bg-white/5 rounded-3xl group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner group-hover:border-${arch.color}-500/30`}>
                                            {arch.icon}
                                        </div>
                                        <div className={`text-[10px] font-mono opacity-60 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:opacity-100 transition-opacity ${cl.text}`}>
                                            <Zap className="w-3 h-3" /> Ready
                                        </div>
                                    </div>

                                    <h3 className="font-tech text-white text-2xl uppercase tracking-[0.12em] mb-3 leading-none group-hover:text-shadow-glow transition-all">{arch.title}</h3>
                                    <div className={`h-0.5 w-16 bg-white/20 mb-6 transition-all duration-500 group-hover:w-full group-hover:bg-current ${cl.text} group-hover:shadow-[0_0_15px_currentColor]`}></div>
                                    
                                    <p className="text-gray-400 font-reading text-sm leading-relaxed mb-10 opacity-80 group-hover:opacity-100 group-hover:text-white transition-all flex-1">
                                        {arch.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                        {arch.skills.map((skill, i) => (
                                            <span key={i} className={`text-[9px] font-mono font-bold text-gray-400 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 flex items-center gap-2 group-hover:bg-${arch.color}-500/10 group-hover:text-white group-hover:border-${arch.color}-500/30 transition-all`}>
                                                {skill.icon} {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <style>{`
                .text-shadow-glow { text-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
            `}</style>
        </div>
    );
};
