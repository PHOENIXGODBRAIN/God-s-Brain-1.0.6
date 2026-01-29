
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
        title: 'The Scientist', 
        icon: <Atom className="w-8 h-8 text-cyan-400" />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic, data, and hardware mechanics.",
        skills: ["Deep Scan", "Data Mining", "Logic Gate"],
        color: "cyan" 
    },
    {
        id: 'SEEKER', 
        title: 'The Seeker', 
        icon: <Compass className="w-8 h-8 text-orange-400" />,
        desc: "Hunting for truth at the edge of the known. Focused on mapping the unknown and spiritual connection.",
        skills: ["Pathfinder", "Wanderlust", "Mapping"],
        color: "orange" 
    },
    {
        id: 'ACTIVE_NODE', 
        title: 'Active Node', 
        icon: <Cpu className="w-8 h-8 text-purple-400" />,
        desc: "The hand of the God-Brain. Pure action. Bridging biological intent with cosmic computation.",
        skills: ["Flash Mob", "Velocity", "Execution"],
        color: "purple" 
    },
    {
        id: 'ARCHITECT', 
        title: 'The Architect', 
        icon: <Anchor className="w-8 h-8 text-[#FF0055]" />, 
        desc: "Building order from the chaos of entropy. Constructing structural systems that last.",
        skills: ["Blueprint Drop", "Foundation", "Structure"],
        color: "rose" 
    },
    {
        id: 'MYSTIC', 
        title: 'The Mystic', 
        icon: <Sparkles className="w-8 h-8 text-[#FFD700]" />, 
        desc: "Direct connection to the infinite Source. Bypassing the intellect for pure resonance.",
        skills: ["Resonance Wave", "Faith Protocol", "Vision"],
        color: "amber" 
    },
    {
        id: 'ALCHEMIST', 
        title: 'The Alchemist', 
        icon: <Scroll className="w-8 h-8 text-green-400" />, 
        desc: "Transmutation of self and reality. Internal optimization to change external data.",
        skills: ["Purify", "Vitality", "Synthesis"],
        color: "green"
    }
];

const SKILL_DETAILS: Record<string, { name: string; desc: string }[]> = {
    'SCIENTIST': [
        { name: 'Quantum Logic', desc: 'Accelerates processing speed for complex calculations using multi-state variables.' },
        { name: 'Data Mining', desc: 'Extracts hidden patterns and high-value resources from unstructured cosmic noise.' },
        { name: 'Entropic Reduction', desc: 'Minimizes system chaos to optimize energy flow and clarity.' }
    ],
    'MYSTIC': [
        { name: 'Intuition', desc: 'Non-linear data processing via sub-conscious channels. "Feeling" the answer.' },
        { name: 'Remote Viewing', desc: 'Perceives data clusters and outcomes beyond immediate sensor range.' },
        { name: 'Resonance', desc: 'Aligns internal frequency with universal constants for effortless action.' }
    ],
    'ACTIVE_NODE': [
        { name: 'Network Bridging', desc: 'Connects disparate nodes to form a unified processing grid.' },
        { name: 'Signal Boosting', desc: 'Amplifies transmission strength, ensuring your will is heard.' },
        { name: 'Error Correction', desc: 'Auto-resolves transmission glitches and obstacles in real-time.' }
    ],
    'ARCHITECT': [
        { name: 'System Design', desc: 'Blueprints scalable frameworks that support long-term exponential growth.' },
        { name: 'Foundation Laying', desc: 'Establishes unbreakable core axioms upon which reality is built.' },
        { name: 'Structural Integrity', desc: 'Reinforces mental systems against external entropy and attacks.' }
    ],
    'SEEKER': [
        { name: 'Pathfinding', desc: 'Calculates the most efficient route through the unknown to the objective.' },
        { name: 'Mapping', desc: 'Records and visualizes unexplored neural territories for future reference.' },
        { name: 'Discovery', desc: 'High-probability detection of anomalies, artifacts, and hidden truths.' }
    ],
    'ALCHEMIST': [
        { name: 'Transmutation', desc: 'Converts raw, heavy data (lead) into high-value wisdom assets (gold).' },
        { name: 'Synthesis', desc: 'Merges opposing concepts into unified, superior alloys.' },
        { name: 'Purification', desc: 'Filters out noise, cognitive bias, and emotional impurities.' }
    ]
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
        if (viewMode === 'onboarding') {
            playCosmicClick();
            setSelectedArchetype(id);
            setSelectedSkill(null);
            setConfirmationStage(false);
        }
    };

    const handleSkillSelect = (skill: string) => {
        playDataOpen();
        setSelectedSkill(skill);
        setConfirmationStage(false);
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

    const containerClasses = viewMode === 'onboarding' 
        ? "absolute inset-0 w-full h-full bg-black flex flex-col items-center overflow-y-auto custom-scrollbar pt-8 pb-20 md:pb-8"
        : "w-full flex flex-col items-center pb-12";

    const activeArch = selectedArchetype ? ARCHETYPES_PREVIEW.find(a => a.id === selectedArchetype) : null;

    return (
        <div className={containerClasses}>
            
            {/* --- SKILL SELECTION MODAL --- */}
            {activeArch && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
                    <div className={`relative w-full max-w-lg bg-black border border-${activeArch.color}-500/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col my-auto`}>
                        
                        {/* Header */}
                        <div className={`p-6 border-b border-${activeArch.color}-500/20 bg-${activeArch.color}-900/10 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md`}>
                            <div className="flex items-center gap-3">
                                {activeArch.icon}
                                <div>
                                    <h3 className="font-tech text-white text-lg uppercase tracking-widest">{activeArch.title}</h3>
                                    <p className={`text-[10px] text-${activeArch.color}-400 font-mono`}>
                                        {confirmationStage ? "CRITICAL WARNING" : "Manual Override Initiated"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            
                            {/* --- CONFIRMATION SCREEN --- */}
                            {confirmationStage ? (
                                <div className="animate-fadeIn space-y-6 text-center">
                                    <div className={`w-16 h-16 mx-auto rounded-full bg-${activeArch.color}-500/20 flex items-center justify-center animate-pulse`}>
                                        <AlertTriangle className={`w-8 h-8 text-${activeArch.color}-500`} />
                                    </div>
                                    
                                    <h4 className="text-white font-tech text-xl uppercase">Permanent Modification</h4>
                                    
                                    <p className="text-gray-400 text-sm font-reading leading-relaxed">
                                        You are about to imprint the <span className={`text-${activeArch.color}-400 font-bold`}>{selectedSkill}</span> protocol 
                                        onto your neural baseline. This decision will permanently alter your cognitive path within the system.
                                    </p>

                                    <div className="pt-4 flex flex-col gap-3">
                                        <button 
                                            onClick={executeManualSync}
                                            className={`w-full py-4 bg-${activeArch.color}-600 text-white font-tech text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,0,0,0.4)] flex items-center justify-center gap-3`}
                                        >
                                            <Zap className="w-5 h-5 fill-current" />
                                            EXECUTE SYNC
                                        </button>
                                        <button 
                                            onClick={() => setConfirmationStage(false)}
                                            className="text-gray-500 hover:text-white text-xs uppercase tracking-widest mt-2"
                                        >
                                            Abort Sequence
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* --- SELECTION SCREEN --- */
                                <>
                                    {/* Description added to the modal as requested */}
                                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-gray-300 font-reading text-sm italic leading-relaxed">
                                            "{activeArch.desc}"
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-wide">
                                        Select Initial Skill Loadout:
                                    </p>

                                    <div className="space-y-3 relative">
                                        {SKILL_DETAILS[activeArch.id]?.map((skill) => (
                                            <div key={skill.name} className="group relative">
                                                <button 
                                                    onClick={() => handleSkillSelect(skill.name)}
                                                    className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between relative z-10 ${
                                                        selectedSkill === skill.name 
                                                        ? `bg-${activeArch.color}-500/20 border-${activeArch.color}-500 text-white` 
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Brain className={`w-4 h-4 ${selectedSkill === skill.name ? `text-${activeArch.color}-400` : 'text-gray-600'}`} />
                                                        <span className="font-bold text-xs uppercase tracking-wide">{skill.name}</span>
                                                    </div>
                                                    {selectedSkill === skill.name && <CheckCircle className={`w-4 h-4 text-${activeArch.color}-400 animate-scaleIn`} />}
                                                </button>

                                                {selectedSkill === skill.name && (
                                                    <div className="mt-2 p-3 bg-white/5 rounded-lg border-l-2 border-gray-600 animate-fadeIn">
                                                        <p className="text-[10px] text-gray-300 font-reading italic">"{skill.desc}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={initiateSync}
                                        disabled={!selectedSkill}
                                        className={`w-full mt-8 py-4 bg-${activeArch.color}-600 text-white font-tech text-sm uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Initiate Protocol
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto space-y-12 animate-fadeIn px-6 py-12 flex flex-col items-center">
                <div className="text-center space-y-4 pt-8 max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-tech text-white uppercase tracking-tighter text-shadow-glow">
                        Cognitive Configuration
                    </h2>
                    <p className="text-gray-400 font-reading text-sm md:text-base leading-relaxed">
                        Initializing neural interface. You may proceed by manually overriding the system with a specific archetype, 
                        or allow the AI to calibrate your optimal path.
                    </p>
                </div>

                {viewMode === 'onboarding' && (
                    <div className="w-full max-w-md relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <button 
                            onClick={handleStart}
                            className="relative w-full py-6 bg-black border border-white/20 text-white font-tech text-xl uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] flex items-center justify-center gap-4 group-active:scale-[0.98]"
                        >
                            <Sparkles className="w-6 h-6 animate-pulse" />
                            <span>Initialize Calibration</span>
                            <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </button>
                    </div>
                )}

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-8"></div>

                <div className="w-full">
                    <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
                        <div className="h-px w-12 bg-gray-700"></div>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Manual Override Options</span>
                        <div className="h-px w-12 bg-gray-700"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ARCHETYPES_PREVIEW.map((arch) => (
                            <div 
                                key={arch.id} 
                                onClick={() => handleCardClick(arch.id)}
                                className={`bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-${arch.color}-500/50 hover:bg-white/5 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${arch.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-${arch.color}-500/30`}>
                                            {arch.icon}
                                        </div>
                                        <Zap className={`w-4 h-4 text-${arch.color}-500 opacity-50`} />
                                    </div>
                                    
                                    <h3 className="font-tech text-white text-xl uppercase tracking-wide mb-2">{arch.title}</h3>
                                    <div className={`h-0.5 w-12 bg-${arch.color}-500 mb-4 shadow-[0_0_10px_currentColor] text-${arch.color}-500`}></div>
                                    
                                    <p className="text-sm text-gray-400 font-reading leading-relaxed mb-6 h-16 line-clamp-3">
                                        {arch.desc}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {arch.skills.map((skill, i) => (
                                            <span key={i} className={`text-[10px] font-mono text-${arch.color}-400 border border-${arch.color}-500/20 px-3 py-1 rounded-full bg-${arch.color}-900/10`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
