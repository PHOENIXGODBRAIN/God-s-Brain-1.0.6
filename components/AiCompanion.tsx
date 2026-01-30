
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { UserPath, ChatMessage, UserProfile } from '../types';
import { Bot, Zap, Lock, Ear, Terminal, Activity, Eye, Shield, Cpu, ChevronRight, Dna, Sparkles, Volume2, X, Maximize2, Minimize2, MessageSquare } from 'lucide-react';
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
  visualState: 'FULL' | 'HUD' | 'MINIMIZED';
  onStateChange: (state: 'FULL' | 'HUD' | 'MINIMIZED') => void;
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 5));
      currentIndex += 5;
      if (currentIndex >= text.length) {
          setDisplayedText(text);
          clearInterval(intervalId);
      }
    }, 15);
    return () => clearInterval(intervalId);
  }, [text]);
  return <div className="leading-relaxed whitespace-pre-wrap">{displayedText}</div>;
};

export const AiCompanion: React.FC<AiCompanionProps> = ({ path, isPremium, user, visualState, onStateChange, onQuery, onUpgrade, isAuthor }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<'MALE' | 'FEMALE'>('MALE');
  const [autoTransmit, setAutoTransmit] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // CHATTY NUDGE LOGIC
  useEffect(() => {
    const nudgeTimer = setTimeout(() => {
      if (messages.length < 5) {
        setMessages(prev => [...prev, { role: 'ai', content: "Node status: Quiescent. Sensors detect potential resource clusters nearby. Shall we initiate a deep scan?" }]);
      }
    }, 15000); // Nudge after 15s of low activity
    return () => clearTimeout(nudgeTimer);
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const welcome = `Link Established. Welcome, ${user?.name?.split(' ')[0] || 'Node'}. Your signal is clear. Directives are ready for deployment.`;
    setMessages([{ role: 'ai', content: welcome }]);
  }, [user?.name]);

  const handleSend = async (overrideText?: string, label?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    playDataOpen();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: label ? `[COMMAND: ${label}]` : textToSend }]);
    setIsLoading(true);
    onQuery();

    try {
        const response = await gemini.chat(textToSend, path, language, [], isAuthor, isPremium, user?.name);
        setMessages(prev => [...prev, { role: 'ai', content: response || "Signal static..." }]);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  if (visualState === 'MINIMIZED') {
      return (
          <button 
            onClick={() => onStateChange('HUD')}
            className="w-16 h-16 bg-cyan-900/40 border border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.2)] animate-pulse hover:scale-110 transition-transform"
          >
              <MessageSquare className="text-cyan-400 w-8 h-8" />
          </button>
      );
  }

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${visualState === 'HUD' ? 'bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl h-[500px]' : 'bg-transparent'}`}>
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]"></div>
          <span className="text-[10px] font-tech text-white uppercase tracking-widest">Co-Pilot // Architect</span>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onStateChange(visualState === 'FULL' ? 'HUD' : 'FULL')} className="p-2 text-gray-500 hover:text-white transition-all">
                {visualState === 'FULL' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={() => onStateChange('MINIMIZED')} className="p-2 text-gray-500 hover:text-red-400 transition-all"><X size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={`flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 ${visualState === 'HUD' ? 'mask-fade-top' : ''}`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-xs ${m.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/30 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none border-l-2 border-l-cyan-500 shadow-xl'}`}>
                {m.role === 'ai' ? <TypewriterText text={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[9px] text-cyan-400 animate-pulse font-mono">TRANSMITTING...</div>}
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-white/5 bg-black/40 space-y-4">
        <div className="flex flex-col gap-2">
            <QuickCommand label="SCAN SECTOR" sub="Diagnostic" icon={<Eye size={14} />} onClick={() => handleSend("Run a high-fidelity scan of the current sector.", "SCAN SECTOR")} />
            <QuickCommand label="REPORT STATUS" sub="Internal" icon={<Activity size={14} />} onClick={() => handleSend("Provide a complete breakdown of current system integrity and resource levels.", "REPORT STATUS")} />
        </div>

        <div className="relative">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-cyan-500/50 transition-all shadow-inner">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Manual override..." 
                  className="flex-1 bg-transparent px-2 py-1 text-xs outline-none text-white" 
                />
                <button onClick={() => handleSend()} className="p-2 bg-white text-black rounded-xl hover:bg-cyan-400 transition-colors"><ChevronRight size={16} /></button>
            </div>
            {!isPremium && <button onClick={onUpgrade} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center text-[9px] font-bold text-cyan-400 uppercase tracking-widest gap-2"><Lock size={12}/> Root Access Required</button>}
        </div>
      </div>
    </div>
  );
};

const QuickCommand = ({ label, sub, icon, onClick }: any) => (
    <button onClick={onClick} className="w-full text-left p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/10 hover:border-cyan-500/30 transition-all">
        <div>
            <div className="text-[10px] font-tech text-gray-200 group-hover:text-cyan-400 transition-colors">{label}</div>
            <div className="text-[8px] text-gray-600 font-mono uppercase mt-0.5">{sub}</div>
        </div>
        <div className="text-gray-500 group-hover:text-cyan-400">{icon}</div>
    </button>
);
