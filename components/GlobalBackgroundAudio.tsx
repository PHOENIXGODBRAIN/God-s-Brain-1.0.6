
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Volume2, Radio, Zap } from 'lucide-react';
import { AMBIENT_TRACKS } from '../constants';
import { playCosmicClick } from '../utils/sfx';

interface GlobalBackgroundAudioProps {
  autoPlay?: boolean;
}

// --- LINK NORMALIZER ENGINE ---
const normalizeAudioUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('dropbox.com')) return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/uc?id=${idMatch[1]}&export=media`;
  }
  return url;
};

export const GlobalBackgroundAudio: React.FC<GlobalBackgroundAudioProps> = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const currentTrack = AMBIENT_TRACKS[currentTrackIndex];

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    if (autoPlay && !isPlaying) {
        setIsPlaying(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    stopAll();
    if (currentTrack.type === 'audio') {
        const directUrl = normalizeAudioUrl(currentTrack.url || '');
        setCurrentUrl(directUrl);
    } else if (currentTrack.type === 'oscillator' && isPlaying) {
        startOscillator(currentTrack.frequency || 432);
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentTrack.type === 'audio') {
        if (isPlaying) {
             const playPromise = audioRef.current.play();
             if (playPromise !== undefined) {
                 playPromise.catch(() => {
                     // Silently handle autoplay block - waiting for interaction
                     setPlaybackBlocked(true);
                 });
             }
        } else {
            audioRef.current.pause();
            setPlaybackBlocked(false);
        }
    }
  }, [isPlaying, currentUrl, currentTrack.type]);

  // --- SILENT INTERACTION HANDLER ---
  useEffect(() => {
    const handleInteraction = () => {
      if (playbackBlocked && audioRef.current && isPlaying) {
        audioRef.current.play()
            .then(() => setPlaybackBlocked(false))
            .catch(() => {});
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
      }
    };

    if (playbackBlocked || isPlaying) {
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [playbackBlocked, isPlaying]);

  useEffect(() => {
    if (currentTrack.type === 'oscillator') {
        if (isPlaying) {
            startOscillator(currentTrack.frequency || 432);
        } else {
            stopOscillator();
        }
    }
  }, [isPlaying, currentTrack.type]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (gainRef.current) gainRef.current.gain.setTargetAtTime(volume * 0.3, audioCtxRef.current?.currentTime || 0, 0.1);
  }, [volume]);

  const startOscillator = (freq: number) => {
    initAudioCtx();
    if (!audioCtxRef.current) return;
    if (oscRef.current) try { oscRef.current.stop(); oscRef.current.disconnect(); } catch (e) {}

    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, audioCtxRef.current.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    
    oscRef.current = osc;
    gainRef.current = gain;
  };

  const stopOscillator = () => {
    if (oscRef.current && gainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
        gainRef.current.gain.linearRampToValueAtTime(0, now + 0.1);
        oscRef.current.stop(now + 0.1);
        setTimeout(() => { if (!isPlaying) oscRef.current = null; }, 150);
    }
  };

  const stopAll = () => {
    if (audioRef.current) audioRef.current.pause();
    stopOscillator();
  };

  const togglePlay = () => {
    playCosmicClick();
    setIsPlaying(!isPlaying);
  };
  
  const handleTrackChange = (idx: number) => {
    playCosmicClick();
    setCurrentTrackIndex(idx);
    if (!isPlaying) setIsPlaying(true);
  };

  const toggleExpand = () => {
    playCosmicClick();
    setIsExpanded(!isExpanded);
  };

  const isOsc = currentTrack.type === 'oscillator';

  return (
    <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-500 ease-out flex flex-col items-end gap-2`}>
      <audio
        ref={audioRef}
        src={currentUrl}
        loop
        playsInline
        preload="auto"
        onEnded={() => { if (!isOsc) setIsPlaying(false); }}
        onError={() => { if (!isOsc) console.warn("Audio Stream Signal Interrupted"); }}
      />

      <div className={`bg-black/90 border border-[#00FFFF]/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 origin-bottom-right ${isExpanded ? 'w-64 opacity-100 mb-2 scale-100' : 'w-0 opacity-0 h-0 scale-90'}`}>
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-tech text-xs text-[#00FFFF] uppercase tracking-widest">Audio Uplink</span>
                <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    <span className="text-[9px] font-mono text-gray-400">{isOsc ? 'OSCILLATOR' : 'STREAM'}</span>
                </div>
            </div>

            <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Frequency</div>
                <div className="font-bold text-white text-sm truncate">{currentTrack.label}</div>
            </div>

            <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF] flex items-center justify-center text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <Volume2 className="w-3 h-3 text-gray-400" />
                        <span className="text-[9px] font-mono text-gray-400">{Math.round(volume * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00FFFF]" />
                </div>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar border-t border-white/10 pt-2">
                {AMBIENT_TRACKS.map((track, idx) => (
                    <button
                        key={track.id}
                        onClick={() => handleTrackChange(idx)}
                        className={`w-full text-left px-2 py-2 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-between group ${currentTrackIndex === idx ? 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="truncate pr-2">{track.label}</span>
                        <div className="flex items-center gap-2">
                             {track.type === 'oscillator' && <Zap className="w-3 h-3 opacity-50 group-hover:text-yellow-400" />}
                             {currentTrackIndex === idx && <Radio className="w-3 h-3 animate-pulse" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      <button onClick={toggleExpand} className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-2xl transition-all relative group ${isPlaying ? 'bg-black/80 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.4)]' : 'bg-black/60 border-gray-600 text-gray-400 hover:border-white hover:text-white'}`}>
         <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-[#00FFFF]/50 border-r-[#00FFFF]/30 transition-transform duration-[3s] linear ${isPlaying ? 'animate-spin' : ''}`}></div>
         <Disc className={`w-6 h-6 ${isPlaying ? 'animate-pulse-slow' : ''}`} />
         {!isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
         )}
      </button>
    </div>
  );
};
