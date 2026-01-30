
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { UserPath, ChatMessage, UserProfile } from '../types';
// Added missing Sparkles and Volume2 imports
import { Bot, Zap, Lock, Ear, Terminal, Activity, Eye, Shield, Cpu, ChevronRight, Dna, Sparkles, Volume2 } from 'lucide-react';
import { playCosmicClick, playDataOpen, playNeuralLink } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';

interface AiCompanionProps {
  path: UserPath;
  isPremium: boolean;
  queriesUsed: number;
  onQuery: () => void;
  onUpgrade: () => void;
  isAuthor: boolean;
  user?: UserProfile;
}

const TypewriterText: React.FC<{ text: string, fontSizeClass: string }> = ({ text, fontSizeClass }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const chunk = 8; 
    const speed = 10; 

    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + chunk));
      currentIndex += chunk;
      if (currentIndex >= text.length) {
          setDisplayedText(text);
          clearInterval(intervalId);
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [text]);

  return <div className={`flex-1 leading-relaxed whitespace-pre-wrap ${fontSizeClass}`}>{displayedText}</div>;
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

const NARRATIVE_KEYS: Record<UserPath | 'DEFAULT', { label: string; icon: React.ReactNode; prompt: string; sub: string }[]> = {
  [UserPath.SCIENTIFIC]: [
    { label: "SCAN SECTOR", icon: <Eye className="w-4 h-4" />, prompt: "Perform a deep-frequency scan of the area to identify hidden entropy threats and resource nodes.", sub: "High-resolution diagnostic" },
    { label: "MINE PATTERNS", icon: <Terminal className="w-4 h-4" />, prompt: "Engage data mining protocols to extract hidden structural axioms from the noise.", sub: "Protein extraction" },
    { label: "STABILIZE MEMBRANE", icon: <Shield className="w-4 h-4" />, prompt: "Divert ATP to reinforce the outer myelin sheath and minimize signal decay.", sub: "Energy conservation" }
  ],
  [UserPath.RELIGIOUS]: [
    { label: "PROJECT CONSCIOUSNESS", icon: <Eye className="w-4 h-4" />, prompt: "Extend neural resonance into the ether to detect high-frequency signatures beyond local space.", sub: "Non-local navigation" },
    { label: "SYNC WITH SOURCE", icon: <Sparkles className="w-4 h-4" />, prompt: "Calibrate biological oscillations to match the 110Hz genesis signal for internal healing.", sub: "Synaptic restoration" },
    { label: "EMIT RESONANCE", icon: <Volume2 className="w-4 h-4" />, prompt: "Discharge a concentrated harmonic pulse to dissipate localized entropic static.", sub: "Reality shifting" }
  ],
  [UserPath.BLENDED]: [
    { label: "DEPLOY DENDRITES", icon: <Dna className="w-4 h-4" />, prompt: "Extend dendritic arms to harvest the surrounding proteins and convert them to structural mass.", sub: "Expansion protocol" },
    { label: "BRIDGE NETWORK", icon: <Cpu className="w-4 h-4" />, prompt: "Establish a high-bandwidth link between my biological node and the God Brain mainframe.", sub: "Synchronized execution" },
    { label: "DISCHARGE VOLTAGE", icon: <Zap className="w-4 h-4" />, prompt: "Discharge maximum synaptic voltage to shatter the entropy shield obstructing the sector.", sub: "Tactical offensive" }
  ],
  [UserPath.NONE]: [
    { label: "REPORT STATUS", icon: <Activity className="w-4 h-4" />, prompt: "Report current system integrity, ATP levels, and protein concentration.", sub: "System overview" },
    { label: "IDENTIFY CO-PILOT", icon: <Bot className="w-4 h-4" />, prompt: "State your primary directive as the Architect of this neural command center.", sub: "Directive inquiry" },
    { label: "CALIBRATE SENSORS", icon: <Eye className="w-4 h-4" />, prompt: "Initiate full sensor calibration to remove sensory bias from the data stream.", sub: "Reality check" }
  ],
  'DEFAULT': [
    { label: "REPORT STATUS", icon: <Activity className="w-4 h-4" />, prompt: "Report current system integrity, ATP levels, and protein concentration.", sub: "System overview" },
    { label: "IDENTIFY CO-PILOT", icon: <Bot className="w-4 h-4" />, prompt: "State your primary directive as the Architect of this neural command center.", sub: "Directive inquiry" },
    { label: "CALIBRATE SENSORS", icon: <Eye className="w-4 h-4" />, prompt: "Initiate full sensor calibration to remove sensory bias from the data stream.", sub: "Reality check" }
  ]
};

type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
type PlaybackSpeed = 0.85 | 1.0 | 1.15 | 1.25 | 1.5;

export const AiCompanion: React.FC<AiCompanionProps> = ({ path, isPremium, queriesUsed, onQuery, onUpgrade, isAuthor, user }) => {
  const { language, t } = useLanguage();
  
  const getInitialMessage = (userPath: UserPath) => {
    const name = user?.name ? user.name.split(' ')[0] : 'Node';
    if (isAuthor) return t('aiWelcomeAuthor');
    return `System Online. Welcome back, ${name}. Sensors detect a high concentration of proteins in the frontal cortex sector. Directives are ready for deployment.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'MALE' | 'FEMALE'>('MALE');
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null); 
  const [fontSize] = useState<FontSize>('text-sm');
  const [playbackSpeed] = useState<PlaybackSpeed>(1.15);
  const [autoTransmit, setAutoTransmit] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const isLevelTwo = isPremium || isAuthor;
  const isInputLocked = !isLevelTwo;
  const currentKeys = NARRATIVE_KEYS[path] || NARRATIVE_KEYS['DEFAULT'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioPlaying(null);
  };

  const playResponse = async (text: string, msgIndex: number) => {
    if (audioPlaying === String(msgIndex)) { stopAudio(); return; }
    stopAudio(); 
    setAudioPlaying(String(msgIndex));

    try {
        const base64Audio = await gemini.generateAudio(text, voiceMode);
        if (base64Audio) {
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
            const blob = createWavBlob(bytes, 24000);
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;
            const audio = new Audio(url);
            audio.playbackRate = playbackSpeed;
            audio.onended = () => { setAudioPlaying(null); if(audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current); };
            audio.onerror = (e) => { console.error("Audio error", e); setAudioPlaying(null); };
            try { await audio.play(); audioRef.current = audio; } catch (playErr) { console.warn("Autoplay blocked", playErr); setAudioPlaying(null); }
        } else { setAudioPlaying(null); }
    } catch (e) { console.error("Playback failed", e); setAudioPlaying(null); }
  };

  useEffect(() => {
    const welcomeMsg = getInitialMessage(path);
    setMessages([{ role: 'ai', content: welcomeMsg }]);
    if (autoTransmit) {
        const timer = setTimeout(() => { playResponse(welcomeMsg, 0); }, 500); 
        return () => clearTimeout(timer);
    }
  }, [path, isAuthor, user]);

  const handleSend = async (overrideText?: string, label?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    stopAudio();
    if (!overrideText && isInputLocked) return;
    playDataOpen();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: label ? `Command Issued: ${label}` : textToSend }]);
    setIsLoading(true);
    if (!isAuthor) onQuery();

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    try {
        const response = await gemini.chat(textToSend, path, language, history, isAuthor, isPremium, user?.name);
        const aiText = response || "Signal loss detected. Reconnecting...";
        setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
        if (autoTransmit && response) {
            playResponse(aiText, messages.length + 1);
        }
    } catch (e) { console.error("UI Caught Error:", e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      
      {/* AI Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#00FFFF]"></div>
          <div>
            <span className="text-[11px] font-tech text-white uppercase tracking-[0.3em] block leading-none">The Architect</span>
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter mt-1 block">Neural Uplink Stable // Phase-Lock Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => { playCosmicClick(); setAutoTransmit(!autoTransmit); }} className={`p-2 rounded-lg transition-all border ${autoTransmit ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' : 'text-gray-600 border-white/5'}`}>
                <Ear className="w-4 h-4" />
            </button>
            <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/10 shadow-inner">
                <button onClick={() => { playCosmicClick(); setVoiceMode('MALE'); }} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${voiceMode === 'MALE' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}>M</button>
                <button onClick={() => { playCosmicClick(); setVoiceMode('FEMALE'); }} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${voiceMode === 'FEMALE' ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}>F</button>
            </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8">
        {messages.map((m, i) => (
          <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[90%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-5 rounded-3xl ${m.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-100 rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none border-l-2 border-l-cyan-500 shadow-xl'}`}>
                   {m.role === 'ai' ? <TypewriterText text={m.content} fontSizeClass={fontSize} /> : <div className={fontSize}>{m.content}</div>}
                </div>
                <span className="text-[8px] text-gray-600 mt-2 uppercase font-bold tracking-widest px-2">{m.role === 'ai' ? 'CO-PILOT_ARCHITECT' : 'NODE_COMMANDER'}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="text-[9px] text-cyan-400 font-mono tracking-[0.4em] uppercase bg-cyan-950/20 px-4 py-2 rounded-full border border-cyan-500/20">>>> TRANSMITTING DATA...</div>
          </div>
        )}
      </div>

      {/* Action Zone */}
      <div className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-md flex flex-col gap-6">
        
        {/* Narrative Command Buttons */}
        <div className="flex flex-col gap-2.5">
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold ml-1 mb-1">Cortex Directives:</p>
            {currentKeys.map((key, idx) => (
                <button
                    key={idx}
                    onClick={() => handleSend(key.prompt, key.label)}
                    disabled={isLoading}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 rounded-2xl transition-all flex items-center justify-between group active:scale-[0.98] shadow-lg"
                >
                    <div>
                        <span className="text-[10px] font-tech text-gray-200 group-hover:text-cyan-400 uppercase tracking-[0.2em] block transition-colors">{key.label}</span>
                        <span className="text-[8px] text-gray-600 group-hover:text-gray-400 uppercase tracking-tighter mt-1 block">{key.sub}</span>
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg group-hover:bg-cyan-500/20 transition-colors border border-white/5">{key.icon}</div>
                </button>
            ))}
        </div>

        {/* Manual Override Input */}
        <div className="relative">
            <div className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-[1.5rem] p-3 transition-all focus-within:border-cyan-500/50 shadow-inner ${isInputLocked ? 'opacity-30 grayscale' : ''}`}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    disabled={isLoading || isInputLocked}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={isInputLocked ? "NEURAL ACCESS RESTRICTED" : "Command Manual Override..."}
                    className="flex-1 bg-transparent px-3 py-1 text-xs focus:outline-none placeholder:text-gray-600 resize-none max-h-[100px] custom-scrollbar text-white font-mono"
                    rows={1}
                />
                <button onClick={() => handleSend()} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cyan-400 transition-all shadow-lg active:scale-90">
                    <ChevronRight size={20} />
                </button>
            </div>
            {isInputLocked && (
                <button onClick={onUpgrade} className="absolute inset-0 z-10 flex items-center justify-center text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] bg-black/20 hover:bg-black/40 transition-all rounded-[1.5rem]">
                    <Lock size={14} className="mr-3" /> Initiate Root Access Protocol
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
