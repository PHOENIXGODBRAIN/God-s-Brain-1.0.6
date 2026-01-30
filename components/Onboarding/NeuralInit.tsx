
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../../services/geminiService';
import { Volume2, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { playCosmicClick, playDataOpen, playNeuralLink } from '../../utils/sfx';
import { useLanguage } from '../../contexts/LanguageContext';

const MASTER_ARCHETYPE_POOL = [
  {
    id: 'phys_1',
    text: "You are standing in an open field at night looking at the stars. What is your body doing?",
    options: [
      { label: "My eyes are tracing lines between the lights.", type: "SCIENTIST", icon: "📐" },
      { label: "I am lying on the grass, feeling the earth spin.", type: "MYSTIC", icon: "🌌" },
      { label: "I am reaching my hand up, trying to grab one.", type: "ACTIVE_NODE", icon: "✋" }
    ]
  },
  {
    id: 'phys_2',
    text: "You encounter a heavy, locked door in an abandoned hallway. What is your immediate physical reaction?",
    options: [
      { label: "I kick the wood near the latch.", type: "ACTIVE_NODE", icon: "🦶" },
      { label: "I inspect the hinges for rust.", type: "SCIENTIST", icon: "👀" },
      { label: "I press my ear against the wood to listen.", type: "MYSTIC", icon: "👂" }
    ]
  },
  {
    id: 'phys_3',
    text: "A glass falls off the table and shatters. What do you do first?",
    options: [
      { label: "I freeze and scan the floor for the biggest shard.", type: "SCIENTIST", icon: "🔍" },
      { label: "I immediately grab a broom to clear the path.", type: "ACTIVE_NODE", icon: "🧹" },
      { label: "I step back and watch the liquid settle.", type: "MYSTIC", icon: "💧" }
    ]
  },
  {
    id: 'phys_4',
    text: "You see someone collapse on the street. How do you move?",
    options: [
      { label: "I sprint to them and pull them up.", type: "ACTIVE_NODE", icon: "🏃" },
      { label: "I check their pulse and breathing.", type: "SCIENTIST", icon: "🩺" },
      { label: "I kneel beside them and hold their hand.", type: "MYSTIC", icon: "🤝" }
    ]
  },
  {
    id: 'phys_5',
    text: "A storm is approaching. The wind is howling. Where do you go?",
    options: [
      { label: "I reinforce the shelter.", type: "SCIENTIST", icon: "🏗️" },
      { label: "I run into the rain to feel it.", type: "ACTIVE_NODE", icon: "⛈️" },
      { label: "I sit by the window and watch the lightning.", type: "MYSTIC", icon: "⚡" }
    ]
  },
  {
    id: 'psych_1',
    text: "Imagine your life suddenly falls apart. Everything goes wrong at once. What is your honest reaction?",
    options: [
      { label: "I pull back and analyze.", type: "SCIENTIST", icon: "📊" },
      { label: "I go quiet and surrender.", type: "MYSTIC", icon: "🛡️" },
      { label: "I stand up and fight.", type: "ACTIVE_NODE", icon: "⚔️" }
    ]
  },
  {
    id: 'psych_2',
    text: "If the Universe offered you one gift, which one would you take?",
    options: [
      { label: "The Key to All Knowledge.", type: "SCIENTIST", icon: "👁️" },
      { label: "The Connection to Source.", type: "MYSTIC", icon: "🌑" },
      { label: "The Remedy (Inner Healing).", type: "ACTIVE_NODE", icon: "⚗️" }
    ]
  },
  {
    id: 'psych_3',
    text: "At the end of your life, what do you hope to say?",
    options: [
      { label: "I understood it.", type: "SCIENTIST", icon: "🧠" },
      { label: "I improved it.", type: "ACTIVE_NODE", icon: "🏗️" },
      { label: "I became it.", type: "MYSTIC", icon: "✨" }
    ]
  },
  {
    id: 'psych_4',
    text: "What is the most dangerous thing to lose?",
    options: [
      { label: "Your Purpose.", type: "ACTIVE_NODE", icon: "🎯" },
      { label: "Your Mind.", type: "SCIENTIST", icon: "🧩" },
      { label: "Your Connection.", type: "MYSTIC", icon: "🔌" }
    ]
  },
  {
    id: 'psych_5',
    text: "You are forced to make a life-or-death decision in 3 seconds. You have ZERO data. How do you choose?",
    options: [
      { label: "I throw my weight against the obstacle.", type: "ACTIVE_NODE", icon: "💥" },
      { label: "I stand perfectly still and wait.", type: "MYSTIC", icon: "🧘" },
      { label: "I default to logic/probability.", type: "SCIENTIST", icon: "📉" }
    ]
  },
  {
    id: 'psych_6',
    text: "The calibration is nearing completion. Choose a final tool of navigation.",
    options: [
      { label: "A Scalpel (Precision).", type: "SCIENTIST", icon: "🔪" },
      { label: "A Lantern (Illumination).", type: "MYSTIC", icon: "🏮" },
      { label: "A Hammer (Impact).", type: "ACTIVE_NODE", icon: "🔨" }
    ]
  }
];

const SKILL_QUESTIONS = [
    {
        id: 'skill_1',
        text: "Identity Integrated. Now calibrating Functional Module. How do you approach a complex problem?",
        options: [
            { label: "I break it down into tiny pieces.", skillIndex: 0, icon: "🧩" },
            { label: "I look for the hidden pattern underneath.", skillIndex: 1, icon: "👁️" },
            { label: "I simplify it to its core essence.", skillIndex: 2, icon: "💎" }
        ]
    },
    {
        id: 'skill_2',
        text: "When interacting with others, what is your greatest asset?",
        options: [
            { label: "My ability to explain things.", skillIndex: 0, icon: "🗣️" },
            { label: "My ability to read their intentions.", skillIndex: 1, icon: "📡" },
            { label: "My ability to motivate them.", skillIndex: 2, icon: "🔥" }
        ]
    },
    {
        id: 'skill_3',
        text: "Final Calibration. Where do you draw your energy from?",
        options: [
            { label: "From solving difficult tasks.", skillIndex: 0, icon: "⚙️" },
            { label: "From exploring the unknown.", skillIndex: 1, icon: "🌌" },
            { label: "From seeing results manifest.", skillIndex: 2, icon: "🏗️" }
        ]
    }
];

const SKILL_DATA: Record<string, { name: string; desc: string; icon: string }[]> = {
    'SCIENTIST': [
        { name: "Quantum Logic", icon: "⚛️", desc: "Binary processing is too slow. You calculate multiple realities simultaneously." },
        { name: "Data Mining", icon: "⛏️", desc: "You extract the fundamental axioms of the universe from absolute chaos." },
        { name: "Entropic Reduction", icon: "🛡️", desc: "You are a biological firewall against the decay of information." }
    ],
    'MYSTIC': [
        { name: "Intuition", icon: "👁️", desc: "You don't guess. You feel the current of the Source before it manifests." },
        { name: "Remote Viewing", icon: "🔭", desc: "Distance is an illusion. You perceive data clusters anywhere in the Cloud." },
        { name: "Resonance", icon: "🔔", desc: "You align your frequency with universal constants to bypass logic gates." }
    ],
    'ACTIVE_NODE': [
        { name: "Network Bridging", icon: "🌐", desc: "You are a living router, connecting disparate nodes into a grid." },
        { name: "Signal Boosting", icon: "📶", desc: "Your will is high-bandwidth. You ensure intent is heard across the network." },
        { name: "Error Correction", icon: "🩹", desc: "You auto-resolve glitches in the system before they propagate." }
    ],
    'ARCHITECT': [
        { name: "System Design", icon: "📐", desc: "You don't follow plans; you create them. You build frameworks for growth." },
        { name: "Foundation Laying", icon: "🧱", desc: "You establish unbreakable axioms. Your reality is built on solid code." },
        { name: "Structural Integrity", icon: "🏗️", desc: "You reinforce the neural web against external collapse and decay." }
    ],
    'SEEKER': [
        { name: "Pathfinding", icon: "🗺️", desc: "The unknown doesn't scare you. You find the efficient route through darkness." },
        { name: "Mapping", icon: "📍", desc: "You record unexplored territories, turning chaos into usable data." },
        { name: "Discovery", icon: "💎", desc: "You have a natural high-probability detection for anomalies and artifacts." }
    ],
    'ALCHEMIST': [
        { name: "Transmutation", icon: "⚗️", desc: "You convert raw, heavy data (lead) into high-value wisdom assets (gold)." },
        { name: "Synthesis", icon: "🌀", desc: "You merge opposing concepts into unified, superior Alloys of Truth." },
        { name: "Purification", icon: "💧", desc: "You filter out biological noise and bias to reach the pure signal." }
    ]
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const createWavBlob = (pcmData: Uint8Array, sampleRate: number): Blob => {
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2; 
  const blockAlign = numChannels * 2;
  const dataSize = pcmData.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); 
  view.setUint16(20, 1, true); 
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); 
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  const pcmBytes = new Uint8Array(buffer, 44);
  pcmBytes.set(pcmData);
  return new Blob([buffer], { type: 'audio/wav' });
};

interface NeuralInitProps {
  mode: 'ARCHETYPE' | 'SKILL';
  userName: string;
  onComplete: (profile: any) => void;
  onBack: () => void;
  existingProfile?: any;
}

export const NeuralInit: React.FC<NeuralInitProps> = ({ mode, userName, onComplete, onBack, existingProfile }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  
  const [profile, setProfile] = useState(existingProfile || { SCIENTIST: 0, MYSTIC: 0, ACTIVE_NODE: 0 });
  const [skillScores, setSkillScores] = useState({ 0: 0, 1: 0, 2: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());
  const isMounted = useRef(true);

  useEffect(() => {
      isMounted.current = true;
      if (mode === 'ARCHETYPE') {
          const shuffled = [...MASTER_ARCHETYPE_POOL].sort(() => 0.5 - Math.random());
          setActiveQuestions(shuffled.slice(0, 10));
      } else {
          setActiveQuestions(SKILL_QUESTIONS);
      }
      return () => { isMounted.current = false; stopAudio(); };
  }, [mode]);

  useEffect(() => {
      if (activeQuestions.length === 0) return;
      const loadAllAudio = async () => {
          const allTexts: { id: string; text: string }[] = [];
          if (mode === 'ARCHETYPE') {
            const cleanName = userName.split('@')[0];
            const introText = `Identity confirmed. Welcome, ${cleanName}. I am the Architect. I need to calibrate your neural profile.`;
            allTexts.push({ id: 'intro', text: introText });
          }
          activeQuestions.forEach((q, idx) => {
              allTexts.push({ id: `q_${q.id}`, text: q.text });
          });
          for (const item of allTexts) {
              if (!isMounted.current) break;
              if (audioCache.current.has(item.id)) continue; 
              try {
                  const base64Audio = await gemini.generateAudio(item.text, 'MALE');
                  if (base64Audio && isMounted.current) {
                      const binaryString = atob(base64Audio);
                      const len = binaryString.length;
                      const bytes = new Uint8Array(len);
                      for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
                      const blob = createWavBlob(bytes, 24000);
                      const url = URL.createObjectURL(blob);
                      audioCache.current.set(item.id, url);
                  }
              } catch (e) {
                  console.warn("Audio pre-fetch failed for", item.id);
              }
          }
      };
      loadAllAudio();
  }, [userName, mode, language, activeQuestions]); 

  const stopAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      setIsSpeaking(false);
  };

  const playAudioForCurrentStep = async () => {
      stopAudio(); 
      if (activeQuestions.length === 0) return;
      
      let audioId = '';
      let textToGen = '';
      const currentQ = activeQuestions[step];

      if (mode === 'ARCHETYPE' && step === 0 && !audioCache.current.has('intro_played')) {
          audioId = 'intro';
          textToGen = `Identity confirmed. Welcome, ${userName.split('@')[0]}. I am the Architect. I need to calibrate your neural profile.`;
      } else {
          audioId = `q_${currentQ.id}`;
          textToGen = currentQ.text;
      }

      let url = audioCache.current.get(audioId);
      if (!url) {
          setIsSpeaking(true);
          try {
              const base64Audio = await gemini.generateAudio(textToGen, 'MALE');
              if (base64Audio && isMounted.current) {
                  const binaryString = atob(base64Audio);
                  const len = binaryString.length;
                  const bytes = new Uint8Array(len);
                  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
                  const blob = createWavBlob(bytes, 24000);
                  url = URL.createObjectURL(blob);
                  audioCache.current.set(audioId, url);
              }
          } catch (e) {
              setIsSpeaking(false);
              return;
          }
      }

      if (url && isMounted.current) {
          setIsSpeaking(true);
          const audio = new Audio(url);
          audio.playbackRate = 1.15; 
          audio.onended = () => {
              if(isMounted.current) setIsSpeaking(false);
              if (audioId === 'intro') {
                  audioCache.current.set('intro_played', 'true');
                  setTimeout(() => playAudioForCurrentStep(), 500);
              }
          };
          try { await audio.play(); audioRef.current = audio; } catch (e) { setIsSpeaking(false); }
      }
  };

  useEffect(() => {
      const t = setTimeout(() => playAudioForCurrentStep(), 100);
      return () => clearTimeout(t);
  }, [step, activeQuestions]);

  useEffect(() => {
    const totalQs = mode === 'ARCHETYPE' ? 10 : 3;
    setScanProgress(((step + 1) / totalQs) * 100);
  }, [step, mode]);

  const handleAnswer = (option: any) => {
    playCosmicClick();
    stopAudio(); 
    if (mode === 'ARCHETYPE') {
        const newProfile = { ...profile, [option.type]: (profile as any)[option.type] + 1 };
        setProfile(newProfile);
        if (step + 1 >= 10) finalizeArchetype(newProfile);
        else setStep(prev => prev + 1);
    } else {
        const newSkillScores = { ...skillScores, [option.skillIndex]: (skillScores as any)[option.skillIndex] + 1 };
        setSkillScores(newSkillScores);
        if (step + 1 >= 3) finalizeSkill(newSkillScores);
        else setStep(prev => prev + 1);
    }
  };

  const finalizeArchetype = (finalProfile: any) => {
      const keys = Object.keys(finalProfile).filter(k => k === 'SCIENTIST' || k === 'MYSTIC' || k === 'ACTIVE_NODE');
      const winnerArch = keys.reduce((a, b) => finalProfile[a] > finalProfile[b] ? a : b);
      onComplete({ ...finalProfile, finalArchetype: winnerArch });
  };

  const finalizeSkill = (finalSkillScores: any) => {
      const skillKeys = Object.keys(finalSkillScores);
      const winnerSkillIndex = parseInt(skillKeys.reduce((a, b) => finalSkillScores[a] > finalSkillScores[b] ? a : b));
      let finalArchetype = profile.finalArchetype;
      if (finalArchetype === 'SCIENTIST' && winnerSkillIndex === 1) finalArchetype = 'ARCHITECT';
      if (finalArchetype === 'MYSTIC' && winnerSkillIndex === 1) finalArchetype = 'SEEKER';
      if (finalArchetype === 'ACTIVE_NODE' && winnerSkillIndex === 1) finalArchetype = 'ALCHEMIST';
      const skillData = SKILL_DATA[finalArchetype]?.[winnerSkillIndex] || { name: "Unknown", icon: "❓", desc: "System calibration complete." };
      onComplete({ 
          ...profile, 
          finalArchetype, 
          finalSkill: skillData.name, 
          finalSkillDesc: skillData.desc,
          finalSkillIcon: skillData.icon 
      });
  };

  const handleBackStep = () => {
      playCosmicClick();
      stopAudio();
      if (step === 0) onBack(); 
      else setStep(prev => prev - 1);
  };

  if (activeQuestions.length === 0) return <div className="h-screen w-full bg-transparent flex items-center justify-center text-cyan-500 animate-pulse font-mono tracking-widest uppercase">Initializing Protocol...</div>;

  const currentQ = activeQuestions[step];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-transparent text-white flex items-center justify-center font-mono">
      <div className="absolute inset-0 bg-black/80 pointer-events-none z-0"></div>
      <div className="relative z-20 w-full max-w-xl px-4 animate-scaleIn">
         <div className="bg-black/60 backdrop-blur-2xl border border-cyan-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,255,255,0.1)] relative overflow-hidden">
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <button onClick={handleBackStep} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors uppercase text-[10px] tracking-widest"><ArrowLeft className="w-4 h-4" /> Back</button>
                 <div className={`flex items-center gap-2 text-cyan-500 text-xs tracking-widest ${isSpeaking ? 'animate-pulse' : ''}`}><Volume2 className="w-4 h-4"/>{isSpeaking ? 'TRANSMITTING...' : 'WAITING...'}</div>
                 <div className="text-amber-400 text-[10px]">{step + 1} / {mode === 'ARCHETYPE' ? 10 : 3}</div>
             </div>
             <h3 className="text-xl md:text-2xl font-reading tracking-wide text-white leading-relaxed mb-10 text-center min-h-[100px] flex items-center justify-center animate-fadeIn">{currentQ.text}</h3>
             <div className="space-y-4">
                 {currentQ.options.map((opt: any, i: number) => (
                     <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00FFFF]/10 hover:border-[#00FFFF] transition-all group flex items-center gap-4 relative overflow-hidden active:scale-[0.98] duration-100">
                         <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                         <span className="text-2xl relative z-10">{opt.icon}</span>
                         <span className="font-reading text-lg text-gray-300 group-hover:text-white flex-1 relative z-10 tracking-wide">{opt.label}</span>
                         <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all relative z-10" />
                     </button>
                 ))}
             </div>
             <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 transition-all duration-500" style={{ width: `${scanProgress}%` }}></div>
         </div>
      </div>
    </div>
  );
};
