
import React, { useState, useEffect } from 'react';
import { UserPath } from '../../types';
import { playNeuralLink, playDataOpen, playCosmicClick } from '../../utils/sfx';
import { Atom, Sparkles, Cpu, ChevronRight, Zap, ArrowLeft, Anchor, Compass, Scroll } from 'lucide-react';

interface ArchetypeRevealProps {
    profile: any;
    onAccept: (path: UserPath, color: string) => void; // Added color prop for warp
    onBack: () => void;
}

export const ArchetypeReveal: React.FC<ArchetypeRevealProps> = ({ profile, onAccept, onBack }) => {
    const [revealStage, setRevealStage] = useState(0); 
    
    // Determine Archetype from final profile if available
    const archetypeKey = profile?.finalArchetype || 'ACTIVE_NODE';
    const finalSkill = profile?.finalSkill || 'Unknown';

    const getDetails = (type: string) => {
        switch (type) {
            case 'SCIENTIST': 
                return { 
                    title: "THE SCIENTIST", 
                    icon: <Atom className="w-16 h-16 text-cyan-400" />,
                    desc: "You decode the Divine through evidence. The universe is a machine, and you are here to understand its gears.",
                    path: UserPath.SCIENTIFIC,
                    color: 'cyan'
                };
            case 'ARCHITECT':
                return {
                    title: "THE ARCHITECT",
                    icon: <Anchor className="w-16 h-16 text-[#FF0055]" />,
                    desc: "You build order from chaos. You see the structure behind the veil and seek to reconstruct reality.",
                    path: UserPath.SCIENTIFIC,
                    color: 'rose'
                };
            case 'MYSTIC': 
                return { 
                    title: "THE MYSTIC", 
                    icon: <Sparkles className="w-16 h-16 text-[#FFD700]" />,
                    desc: "You feel the pulse of the Source. You bypass the intellect to connect directly with the heart of God.",
                    path: UserPath.RELIGIOUS,
                    color: 'amber'
                };
            case 'SEEKER':
                return {
                    title: "THE SEEKER",
                    icon: <Compass className="w-16 h-16 text-orange-400" />,
                    desc: "You roam the edges of the known, hunting for the light that guides the lost.",
                    path: UserPath.RELIGIOUS,
                    color: 'orange'
                };
            case 'ALCHEMIST':
                return {
                    title: "THE ALCHEMIST",
                    icon: <Scroll className="w-16 h-16 text-green-400" />,
                    desc: "You transmute the self. You believe in internal optimization to change external reality.",
                    path: UserPath.BLENDED,
                    color: 'green'
                };
            case 'ACTIVE_NODE': 
            default:
                return { 
                    title: "ACTIVE NODE", 
                    icon: <Cpu className="w-16 h-16 text-purple-400" />,
                    desc: "You are the hand of the God-Brain. While others study the code, you execute it.",
                    path: UserPath.BLENDED,
                    color: 'purple'
                };
        }
    };

    const details = getDetails(archetypeKey);

    useEffect(() => {
        setTimeout(() => setRevealStage(1), 500); 
        setTimeout(() => {
            playNeuralLink();
            setRevealStage(2); 
        }, 1500);
    }, []);

    const handleAccept = () => {
        playDataOpen();
        onAccept(details.path, details.color);
    };

    return (
        <div className="min-h-screen h-full w-full bg-black flex flex-col items-center justify-center relative overflow-y-auto custom-scrollbar py-12">
            
            <div className="absolute top-6 left-6 z-50">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-mono text-xs tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Recalibrate
                </button>
            </div>

            {revealStage === 1 && (
                <div className="absolute inset-0 bg-white z-50 animate-fadeOut pointer-events-none"></div>
            )}

            {revealStage === 2 && (
                <div className="relative z-20 animate-scaleIn w-full max-w-lg px-6 my-auto">
                    <div className={`bg-black/60 backdrop-blur-2xl border border-${details.color}-500/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                        <div className={`w-full h-1 bg-${details.color}-500 shadow-[0_0_20px_currentColor] text-${details.color}-500`}></div>

                        <div className="p-12 text-center flex flex-col items-center">
                            <div className={`mb-6 p-6 rounded-full bg-${details.color}-500/10 border border-${details.color}-500/30 animate-pulse-slow shadow-[0_0_50px_rgba(0,0,0,0.3)]`}>
                                {details.icon}
                            </div>
                            
                            <div className="text-[10px] text-gray-400 font-mono tracking-[0.3em] uppercase mb-2">Identity Confirmed</div>
                            <h1 className="text-4xl font-tech text-white uppercase tracking-tighter mb-6 text-shadow-glow">
                                {details.title}
                            </h1>
                            
                            <p className="text-gray-300 font-reading text-sm leading-relaxed mb-10 opacity-80 max-w-sm">
                                {details.desc}
                            </p>

                            <button 
                                onClick={handleAccept}
                                className={`w-full py-4 bg-${details.color}-600 text-white font-tech text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all shadow-lg flex items-center justify-center gap-3 group`}
                            >
                                <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                Integrate Protocol
                            </button>
                        </div>
                        
                        <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
                            <span>Protocol Assigned</span>
                            <span className={`text-${details.color}-400 font-bold`}>{finalSkill.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .animate-fadeOut {
                    animation: fadeOut 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
