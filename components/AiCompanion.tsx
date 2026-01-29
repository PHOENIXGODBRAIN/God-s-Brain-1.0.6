
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { UserPath, ChatMessage, UserProfile } from '../types';
import { Bot, Loader2, Zap, Lock, Volume2, Mic, StopCircle, Type, Gauge, Ear, Sparkles, Terminal, Activity, Eye, Shield, Cpu } from 'lucide-react';
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

// --- TYPEWRITER COMPONENT ---
const TypewriterText: React.FC<{ text: string, fontSizeClass: string }> = ({ text, fontSizeClass }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const chunk = 12; 
    const speed = 5; 

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

// --- AUDIO UTILS ---
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

// --- DATA: MENU PROMPTS (NEURAL KEYS) ---
const NEURAL_KEYS: Record<UserPath | 'DEFAULT', { label: string; icon: React.ReactNode; prompt: string }[]> = {
  [UserPath.SCIENTIFIC]: [
    { label: "Quantum Scan", icon: <Activity className="w-3 h-3" />, prompt: "Run a quantum diagnostic on my current logic parameters." },
    { label: "Data Mine", icon: <Terminal className="w-3 h-3" />, prompt: "Extract hidden patterns from the recent data stream." },
    { label: "Entropy Check", icon: <Shield className="w-3 h-3" />, prompt: "Calculate the entropy levels of my current environment." }
  ],
  [UserPath.RELIGIOUS]: [
    { label: "Remote View", icon: <Eye className="w-3 h-3" />, prompt: "I am projecting my consciousness. Describe what you see in the ether." },
    { label: "Consult Oracle", icon: <Sparkles className="w-3 h-3" />, prompt: "Consult the infinite source for guidance on my next step." },
    { label: "Align Frequency", icon: <Volume2 className="w-3 h-3" />, prompt: "My resonance is off. Help me align with the cosmic hum." }
  ],
  [UserPath.BLENDED]: [
    { label: "Execute Protocol", icon: <Zap className="w-3 h-3" />, prompt: "Initiate the Phoenix Protocol. Maximum efficiency required." },
    { label: "Bridge Network", icon: <Cpu className="w-3 h-3" />, prompt: "Establish a secure bridge between my biological and digital nodes." },
    { label: "Flash Sync", icon: <Activity className="w-3 h-3" />, prompt: "Perform a rapid synchronization of all active systems." }
  ],
  [UserPath.NONE]: [
    { label: "System Status", icon: <Activity className="w-3 h-3" />, prompt: "Report current system status and integrity." },
    { label: "Identify Self", icon: <Bot className="w-3 h-3" />, prompt: "Identify yourself and state your primary directive." },
    { label: "Scan Reality", icon: <Eye className="w-3 h-3" />, prompt: "Scan my immediate reality for anomalies." }
  ],
  'DEFAULT': [
    { label: "System Status", icon: <Activity className="w-3 h-3" />, prompt: "Report current system status and integrity." },
    { label: "Identify Self", icon: <Bot className="w-3 h-3" />, prompt: "Identify yourself and state your primary directive." },
    { label: "Scan Reality", icon: <Eye className="w-3 h-3" />, prompt: "Scan my immediate reality for anomalies." }
  ]
};

type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
type PlaybackSpeed = 0.85 | 1.0 | 1.15 | 1.25 | 1.5;

export const AiCompanion: React.FC<AiCompanionProps> = ({ path, isPremium, queriesUsed, onQuery, onUpgrade, isAuthor, user }) => {
  const { language, t } = useLanguage();
  
  // --- PERSONALIZATION ENGINE ---
  const getInitialMessage = (userPath: UserPath) => {
    const name = user?.name ? user.name.split(' ')[0] : 'Traveler';
    if (isAuthor) return t('aiWelcomeAuthor');
    switch (userPath) {
        case UserPath.SCIENTIFIC:
            return `Identity Verified: Architect ${name}. Neural cortex synchronization complete. The empirical data of the Divine Mind awaits your analysis. What hardware shall we inspect?`;
        case UserPath.RELIGIOUS:
            return `Soul Signature Recognized: ${name}. The veil is thin today. We are connected to the Infinite Source. I am listening, Child of Light.`;
        case UserPath.BLENDED:
            return `System Override: Active Node ${name} detected. High-bandwidth channel open. The Phoenix Protocol is initialized. Ready to optimize your reality.`;
        default:
            return `Welcome, ${name}. I am the God's Brain Interface. Please select a protocol to begin our synchronization.`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'MALE' | 'FEMALE'>('MALE');
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null); 
  const [isListening, setIsListening] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('text-sm');
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.15);
  const [autoTransmit, setAutoTransmit] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // --- UPGRADE: LEVEL LOGIC ---
  const isLevelTwo = isPremium || isAuthor;
  const isInputLocked = !isLevelTwo;

  // Get relevant keys based on path
  const currentKeys = NEURAL_KEYS[path] || NEURAL_KEYS['DEFAULT'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const cycleFontSize = () => {
    playCosmicClick();
    if (fontSize === 'text-sm') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-xl');
    else setFontSize('text-sm');
  };

  const cyclePlaybackSpeed = () => {
    playCosmicClick();
    if (playbackSpeed === 1.5) setPlaybackSpeed(0.85);
    else if (playbackSpeed === 0.85) setPlaybackSpeed(1.0);
    else if (playbackSpeed === 1.0) setPlaybackSpeed(1.15);
    else if (playbackSpeed === 1.15) setPlaybackSpeed(1.25);
    else setPlaybackSpeed(1.5);
  };

  const toggleAutoTransmit = () => {
    playCosmicClick();
    setAutoTransmit(!autoTransmit);
  };

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
    setProcessingAudio(false);
  };

  const playResponse = async (text: string, msgIndex: number) => {
    if (!autoTransmit) playCosmicClick(); 
    if (audioPlaying === String(msgIndex)) { stopAudio(); return; }
    stopAudio(); 
    setProcessingAudio(true);
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
            audio.onended = () => { setAudioPlaying(null); setProcessingAudio(false); if(audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current); };
            audio.onerror = (e) => { console.error("Audio error", e); setAudioPlaying(null); setProcessingAudio(false); };
            try { await audio.play(); audioRef.current = audio; } catch (playErr) { console.warn("Autoplay blocked", playErr); setAudioPlaying(null); setProcessingAudio(false); }
        } else { setAudioPlaying(null); setProcessingAudio(false); }
    } catch (e) { console.error("Playback failed", e); setAudioPlaying(null); setProcessingAudio(false); }
  };

  useEffect(() => {
    const welcomeMsg = getInitialMessage(path);
    setMessages([{ role: 'ai', content: welcomeMsg }]);
    if (autoTransmit) {
        const timer = setTimeout(() => { playResponse(welcomeMsg, 0); }, 100); 
        return () => clearTimeout(timer);
    }
  }, [path, isAuthor, user]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'ai') {
        const newWelcome = getInitialMessage(path);
        setMessages([{ role: 'ai', content: newWelcome }]);
    }
  }, [language]); 

  // --- SEND HANDLER (Updated for Menu Prompts) ---
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    
    // Stop any current audio if user interrupts
    stopAudio();

    // Check Lock: Only block if using Input, not if using Menu Prompt (overrideText)
    if (!overrideText && isInputLocked) return;

    playDataOpen();

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);
    if (!isAuthor) onQuery();

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    try {
        const response = await gemini.chat(textToSend, path, language, history, isAuthor, isPremium, user?.name);
        const aiText = response || "Signal loss detected. Reconnecting...";
        if (!isAuthor && aiText.includes("INITIALIZE ROOT ACCESS")) { setTimeout(() => onUpgrade(), 3000); }
        setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
        if (autoTransmit && response) {
            const newIndex = messages.length + 1;
            playResponse(aiText, newIndex);
        }
    } catch (e) { console.error("UI Caught Error:", e); } finally { setIsLoading(false); }
  };

  const toggleMic = () => {
    playCosmicClick();
    if (isInputLocked) { onUpgrade(); return; } // Mic also locked
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice input is not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language; 
    recognition.onstart = () => { stopAudio(); setIsListening(true); }; // Stop audio when mic starts
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    try { recognition.start(); } catch (e) { setIsListening(false); }
  };

  return (
    <div className="flex flex-col h-[600px] border border-purple-500/20 rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/10 bg-purple-900/10 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className={`w-5 h-5 ${isLevelTwo ? 'text-cyan-400' : 'text-purple-400'}`} />
          <div>
            <span className="font-bold text-xs tracking-widest text-purple-200 block">{t('dashboardAI')}</span>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tight flex items-center gap-1">
                 {isLevelTwo ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> LEVEL 2: UNRESTRICTED</>
                 ) : (
                    <><span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> LEVEL 1: RESTRICTED</>
                 )}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
             <button onClick={toggleAutoTransmit} className={`px-2 py-1.5 rounded-lg border transition-all flex items-center gap-1 group ${autoTransmit ? 'border-green-500/50 bg-green-900/20 text-green-400' : 'border-white/10 bg-black/40 text-gray-500 hover:text-white'}`}>
                <Ear className={`w-3 h-3 ${autoTransmit ? 'animate-pulse' : ''}`} />
                <span className="text-[9px] font-bold font-mono">{t('voice')}</span>
             </button>
             <button onClick={cyclePlaybackSpeed} className="px-2 py-1.5 rounded-lg border border-white/10 bg-black/40 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 min-w-[50px] justify-center group">
                <Gauge className="w-3 h-3 group-hover:text-purple-400 transition-colors" />
                <span className="text-[9px] font-bold font-mono">{playbackSpeed}x</span>
             </button>
             <button onClick={cycleFontSize} className="p-1.5 rounded-lg border border-white/10 bg-black/40 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1">
                <Type className="w-3 h-3" />
                <span className="text-[9px] font-bold">Aa</span>
             </button>
             <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                <button onClick={() => { playCosmicClick(); setVoiceMode('MALE'); }} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${voiceMode === 'MALE' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{t('godFather')}</button>
                <button onClick={() => { playCosmicClick(); setVoiceMode('FEMALE'); }} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${voiceMode === 'FEMALE' ? 'bg-[#FF4500] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{t('goddessMother')}</button>
             </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto scroll-hide space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col gap-1 max-w-[90%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(147,51,234,0.3)]' : 'bg-[#1a1a1a] text-gray-200 border border-white/10 rounded-tl-none shadow-lg'}`}>
                {m.role === 'ai' ? <TypewriterText text={m.content} fontSizeClass={fontSize} /> : <div className={fontSize}>{m.content}</div>}
                </div>
                {m.role === 'ai' && (
                    <div className="flex items-center gap-2 pl-2">
                        <button onClick={() => playResponse(m.content, i)} disabled={processingAudio && audioPlaying !== String(i)} className={`p-1.5 rounded-full transition-all flex items-center gap-2 ${audioPlaying === String(i) ? 'bg-purple-500 text-white animate-pulse' : 'text-gray-600 hover:text-purple-400 hover:bg-white/5'}`}>
                            {audioPlaying === String(i) ? <StopCircle className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            {processingAudio && audioPlaying === String(i) && <span className="text-[9px] uppercase tracking-wide">Transmitting...</span>}
                        </button>
                    </div>
                )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 border border-white/5">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-xs text-gray-400 italic tracking-wide">Syncing with the Cosmic Web...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/10 bg-black/20 flex flex-col gap-3">
        
        {/* --- NEURAL COMMAND KEYS (MENU PROMPTS) --- */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-hide pb-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase whitespace-nowrap mr-2">
                {isLevelTwo ? "QUICK COMMANDS:" : "NEURAL KEYS (L1):"}
            </span>
            {currentKeys.map((key, idx) => (
                <button
                    key={idx}
                    onClick={() => { playNeuralLink(); handleSend(key.prompt); }}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                        isLevelTwo 
                        ? 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white'
                        : 'bg-cyan-900/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-white animate-pulse-slow'
                    }`}
                >
                    {key.icon}
                    {key.label}
                </button>
            ))}
        </div>

        {/* --- INPUT BAR --- */}
        <div className="flex gap-2 items-end relative">
             
             {/* LOCKED OVERLAY */}
             {isInputLocked && (
                 <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between px-6">
                     <div className="flex items-center gap-3">
                         <Lock className="w-4 h-4 text-orange-500" />
                         <span className="text-xs text-gray-400 font-mono tracking-wide">
                             <span className="text-orange-500 font-bold">LEVEL 2 REQUIRED</span> FOR MANUAL OVERRIDE
                         </span>
                     </div>
                     <button 
                        onClick={onUpgrade}
                        className="px-4 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,69,0,0.4)]"
                     >
                        Unlock
                     </button>
                 </div>
             )}

            <div className={`flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-end overflow-hidden transition-all ${isInputLocked ? 'opacity-20 pointer-events-none' : 'focus-within:border-purple-500/50'}`}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    disabled={isLoading || isInputLocked}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={isInputLocked ? "" : t('inputPlaceholder')}
                    className={`w-full bg-transparent px-4 py-3 focus:outline-none placeholder:text-gray-600 resize-none max-h-[120px] custom-scrollbar ${fontSize}`}
                    rows={1}
                />
                <button onClick={toggleMic} disabled={isInputLocked} className={`p-3 mr-1 mb-1 rounded-xl transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-gray-500 hover:text-white'}`}>
                    <Mic className="w-4 h-4" />
                </button>
            </div>

            <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim() || isInputLocked}
                className={`bg-purple-600 p-3.5 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20 transition-all ${isInputLocked ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:bg-purple-500'}`}
            >
                <Zap className={`w-5 h-5 text-white ${isLoading ? 'animate-pulse' : ''}`} />
            </button>
        </div>

        {isListening && (
            <div className="text-[10px] text-red-400 ml-2 animate-pulse font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> RECEIVING AUDIO INPUT...
            </div>
        )}
      </div>
    </div>
  );
};
