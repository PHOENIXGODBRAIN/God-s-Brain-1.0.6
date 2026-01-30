
import React, { useState, useEffect } from 'react';
import { UserPath } from '../../types';
import { playNeuralLink, playDataOpen, playCosmicClick } from '../../utils/sfx';
import { Atom, Sparkles, Cpu, Zap, ArrowLeft, Anchor, Compass, Scroll } from 'lucide-react';

interface ArchetypeRevealProps {
    profile: any;
    onAccept: (path: UserPath, color: string) => void;
    onBack: () => void;
}

export const ArchetypeReveal: React.FC<ArchetypeRevealProps> = ({ profile, onAccept, onBack }) => {
    const [revealStage, setRevealStage] = useState(0); 
    const archetypeKey = profile?.finalArchetype || 'ACTIVE_NODE';

    const getDetails = (type: string) => {
        switch (type) {
            case 'SCIENTIST': 
                return { 
                    title: "THE SCIENTIST", 
                    icon: <Atom className="w-16 h-16 text-cyan-400" />,
                    desc: "Identity extraction complete. Your core architecture is defined by empirical analysis and the decoding of the cosmic machine.",
                    path: UserPath.SCIENTIFIC,
                    color: 'cyan'
                };
            case 'ARCHITECT':
                return {
                    title: "THE ARCHITECT",
                    icon: <Anchor className="w-16 h-16 text-[#FF0055]" />,
                    desc: "Identity extraction complete. Your core architecture is defined by structural integrity and the construction of order.",
                    path: UserPath.SCIENTIFIC,
                    color: 'rose'
                };
            case 'MYSTIC': 
                return { 
                    title: "THE MYSTIC", 
                    icon: <Sparkles className="w-16 h-16 text-[#FFD700]" />,
                    desc: "Identity extraction complete. Your core architecture is defined by deep resonance and connection with the infinite Source.",
                    path: UserPath.RELIGIOUS,
                    color: 'amber'
                };
            case 'SEEKER':
                return {
                    title: "THE SEEKER",
                    icon: <Compass className="w-16 h-16 text-orange-400" />,
                    desc: "Identity extraction complete. Your core architecture is defined by exploration and the hunting of truth at the void's edge.",
                    path: UserPath.RELIGIOUS,
                    color: 'orange'
                };
            case 'ALCHEMIST':
                return {
                    title: "THE ALCHEMIST",
                    icon: <Scroll className="w-16 h-16 text-green-400" />,
                    desc: "Identity extraction complete. Your core architecture is defined by self-optimization and the transmutation of reality.",
                    path: UserPath.BLENDED,
                    color: 'green'
                };
            case 'ACTIVE_NODE': 
            default:
                return { 
                    title: "ACTIVE NODE", 
                    icon: <Cpu className="w-16 h-16 text-purple-400" />,
                    desc: "Identity extraction complete. Your core architecture is defined by pure action and high-bandwidth system execution.",
                    path: UserPath.BLENDED,
                    color: 'purple'
                };
        }
    };

    const details = getDetails(archetypeKey);

    // Color utility for dynamic Tailwind classes
    // Format: "border text bg-light bg-solid"
    const colorClasses = {
        cyan: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10 bg-cyan-600",
        rose: "border-rose-500/50 text-rose-400 bg-rose-500/10 bg-rose-600",
        amber: "border-amber-500/50 text-amber-400 bg-amber-500/10 bg-amber-600",
        orange: "border-orange-500/50 text-orange-400 bg-orange-500/10 bg-orange-600",
        green: "border-green-500/50 text-green-400 bg-green-500/10 bg-green-600",
        purple: "border-purple-500/50 text-purple-400 bg-purple-500/10 bg-purple-600"
    }[details.color] || "border-white/20 text-white bg-white/5 bg-white";

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

    const c = colorClasses.split(' ');

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center relative overflow-y-auto custom-scrollbar pt-12 pb-24">
            
            <div className="absolute top-6 left-6 z-50">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-mono text-xs tracking-widest"><ArrowLeft className="w-4 h-4" /> Recalibrate</button>
            </div>

            {revealStage === 1 && <div className="absolute inset-0 bg-white z-50 animate-fadeOut pointer-events-none"></div>}

            {revealStage === 2 && (
                <div className="relative z-20 animate-scaleIn w-full max-w-lg px-6 my-auto">
                    <div className={`bg-black/60 backdrop-blur-2xl border ${c[0]} rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                        {/* Corrected index access from c[4] to c[3] */}
                        <div className={`w-full h-1 ${c[3]} shadow-[0_0_20px_currentColor]`}></div>
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className={`mb-6 p-6 rounded-full ${c[2]} border ${c[0].replace('/50', '/30')} animate-pulse-slow shadow-[0_0_50px_rgba(0,0,0,0.3)]`}>{details.icon}</div>
                            <div className="text-[10px] text-gray-400 font-mono tracking-[0.3em] uppercase mb-2">Core Identity Locked</div>
                            <h1 className="text-4xl font-tech text-white uppercase tracking-tighter mb-6 text-shadow-glow leading-none">{details.title}</h1>
                            <p className="text-gray-300 font-reading text-sm leading-relaxed mb-10 opacity-80 max-w-sm">{details.desc}</p>
                            <button onClick={handleAccept} className={`w-full py-4 ${c[3]} text-white font-tech text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all shadow-lg flex items-center justify-center gap-3 group`}><Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" /> INTEGRATE PROTOCOL</button>
                        </div>
                        <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
                            <span>Status</span>
                            <span className={`${c[1]} font-bold animate-pulse`}>SYNCHRONIZING...</span>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                .animate-fadeOut { animation: fadeOut 1s ease-out forwards; }
            `}</style>
        </div>
    );
};
