
import React, { useState, useEffect } from 'react';
import { playNeuralLink, playDataOpen } from '../../utils/sfx';
import { Atom, Sparkles, Cpu, Zap, ArrowLeft, Anchor, Compass, Scroll, Brain, Info } from 'lucide-react';

interface FinalRevealProps {
    profile: any;
    onAccept: () => void;
    onBack: () => void;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({ profile, onAccept, onBack }) => {
    const archetypeKey = profile?.finalArchetype || 'ACTIVE_NODE';
    const finalSkill = profile?.finalSkill || 'Unknown Protocol';

    const getDetails = (type: string) => {
        switch (type) {
            case 'SCIENTIST': return { title: "THE SCIENTIST", icon: <Atom className="w-12 h-12 text-cyan-400" />, color: 'cyan' };
            case 'ARCHITECT': return { title: "THE ARCHITECT", icon: <Anchor className="w-12 h-12 text-[#FF0055]" />, color: 'rose' };
            case 'MYSTIC': return { title: "THE MYSTIC", icon: <Sparkles className="w-12 h-12 text-[#FFD700]" />, color: 'amber' };
            case 'SEEKER': return { title: "THE SEEKER", icon: <Compass className="w-12 h-12 text-orange-400" />, color: 'orange' };
            case 'ALCHEMIST': return { title: "THE ALCHEMIST", icon: <Scroll className="w-12 h-12 text-green-400" />, color: 'green' };
            case 'ACTIVE_NODE': 
            default: return { title: "ACTIVE NODE", icon: <Cpu className="w-12 h-12 text-purple-400" />, color: 'purple' };
        }
    };

    const getSynergyDescription = (arch: string, skill: string) => {
        const base = `By merging the ${arch.replace('_', ' ')} core with the ${skill} module, you have optimized your synaptic firing pattern. `;
        if (arch === 'SCIENTIST') return base + "Your analytical engine is now powered by non-linear logic gates, allowing you to compute destiny in real-time.";
        if (arch === 'MYSTIC') return base + "Your resonance is now directed by intentional frequency modulation, turning prayer into a precise command interface.";
        if (arch === 'ACTIVE_NODE') return base + "Your metabolic speed is now synchronized with the global node-grid, granting you instantaneous system influence.";
        return base + "This metabolic synergy provides a high-fidelity connection to the God Brain mainframe.";
    };

    const details = getDetails(archetypeKey);
    const synergyDesc = getSynergyDescription(archetypeKey, finalSkill);

    useEffect(() => {
        playNeuralLink();
    }, []);

    return (
        <div className="min-h-screen h-full w-full bg-black flex flex-col items-center justify-center relative overflow-y-auto custom-scrollbar py-12 px-6 font-mono">
            <div className="absolute top-6 left-6 z-50">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-xs tracking-widest"><ArrowLeft className="w-4 h-4" /> Calibration Reset</button>
            </div>

            <div className="relative z-20 animate-scaleIn w-full max-w-2xl">
                <div className={`bg-black/60 backdrop-blur-2xl border border-${details.color}-500/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]`}>
                    <div className={`p-8 border-b border-${details.color}-500/20 bg-white/5 flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-${details.color}-500/10 border border-${details.color}-500/30`}>{details.icon}</div>
                            <div>
                                <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">Synergy Configuration Confirmed</div>
                                <h1 className="text-2xl md:text-3xl font-tech text-white uppercase tracking-tighter">
                                    {details.title} <span className={`text-${details.color}-400 opacity-50`}>//</span> <span className={`text-${details.color}-400`}>{finalSkill}</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        <div className="grid md:grid-cols-3 gap-6 items-start">
                            <div className="col-span-1">
                                <div className="flex items-center gap-2 mb-3"><Info className={`w-4 h-4 text-${details.color}-500`} /><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identity Module</span></div>
                                <div className={`text-sm font-tech text-${details.color}-400 uppercase`}>Core Driver</div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-300 font-reading text-base leading-relaxed opacity-90">{synergyDesc}</p>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="grid md:grid-cols-3 gap-6 items-start">
                            <div className="col-span-1">
                                <div className="flex items-center gap-2 mb-3"><Brain className={`w-4 h-4 text-${details.color}-500`} /><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Functional Module</span></div>
                                <div className="text-xl font-tech text-white uppercase tracking-tight">{finalSkill}</div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-300 font-reading text-sm italic opacity-80 leading-relaxed">"{profile?.finalSkillDesc || 'Metabolic optimization complete.'}"</p>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl bg-${details.color}-900/10 border border-${details.color}-500/20 flex gap-4 items-start`}>
                             <Zap className={`w-6 h-6 text-${details.color}-400 shrink-0 mt-1`} />
                             <div>
                                <h4 className="text-white font-bold text-sm uppercase mb-1">Metabolic Balance: STABLE</h4>
                                <p className="text-xs text-gray-400 leading-relaxed font-mono">Your neural interface is now ready for physical differentiation within the Bio-Forge matrix.</p>
                             </div>
                        </div>

                        <button onClick={() => { playDataOpen(); onAccept(); }} className={`w-full py-6 bg-${details.color}-600 text-white font-tech text-xl uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 group mt-8`}>
                            <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform duration-300" />
                            COMMENCE BIO-FORGE
                        </button>
                    </div>

                    <div className="bg-black/40 border-t border-white/5 p-4 text-center">
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.5em]">System Interface v1.0.8 // Synergy Optimized</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
