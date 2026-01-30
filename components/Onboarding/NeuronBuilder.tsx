
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { playNeuralLink, playCosmicClick, playError, playMenuSelect, playDataOpen } from '../../utils/sfx';
// Added Triangle to the imports from lucide-react
import { ArrowLeft, Dna, Lock, Zap, Activity, Sun, Network, RotateCw, Layers, Eye, Minimize2, Waves, Grip, CircleDashed, Wind, Dice5, RefreshCw, Compass, Minus, Plus, Triangle } from 'lucide-react';
import { UserProfile } from '../../types';

interface NeuronBuilderProps {
  archetype: string; 
  onComplete: (avatarUrl: string) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
  isUnlocked: boolean; 
}

const DNA_NAMES = [
    "Synapse-X1", "Neuro-7", "Cortex-Prime", "Axon-Delta", "Dendrite-V", 
    "Soma-Alpha", "Glial-9", "Myelin-Z", "Vesicle-Core", "Receptor-K", "Node-Zero", "Omni-Cell"
];

type TextureStyle = 'POROUS' | 'BIO_SYNAPSE' | 'CRYSTALLINE';
type SpineStyle = 'THORNS' | 'BULBS' | 'THREADS';

export const NeuronBuilder: React.FC<NeuronBuilderProps> = ({ archetype, onComplete, onUpdateProfile, onBack, isUnlocked }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getTheme = () => {
      const base = {
          SCIENTIST: { color: '#00FFFF', label: 'THE SCIENTIST' },
          MYSTIC: { color: '#FFD700', label: 'THE MYSTIC' },
          ACTIVE_NODE: { color: '#A855F7', label: 'ACTIVE NODE' },
          ARCHITECT: { color: '#F43F5E', label: 'THE ARCHITECT' }, 
          SEEKER: { color: '#F97316', label: 'THE SEEKER' },
          ALCHEMIST: { color: '#10B981', label: 'THE ALCHEMIST' }
      };
      return base[archetype as keyof typeof base] || base.ACTIVE_NODE;
  };
  const theme = getTheme();

  const PALETTE = useMemo(() => {
      const adjust = (hex: string, amt: number) => {
          let usePound = hex[0] === "#";
          hex = usePound ? hex.slice(1) : hex;
          let num = parseInt(hex, 16);
          let r = Math.min(255, Math.max(0, (num >> 16) + amt));
          let b = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
          let g = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
          return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
      };

      return [
          { hex: adjust(theme.color, -60), name: 'Obsidian', locked: false },
          { hex: adjust(theme.color, -30), name: 'Deep Tissue', locked: false },
          { hex: theme.color, name: 'Core Resonance', locked: false },
          { hex: adjust(theme.color, 50), name: 'Luminous', locked: false },
          { hex: '#FFFFFF', name: 'Supernova', locked: true },
          { hex: adjust(theme.color, 120), name: 'Neon Apex', locked: true }, 
      ];
  }, [theme.color]);

  const [neuronName, setNeuronName] = useState("Proto-Node");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [somaSize, setSomaSize] = useState(20); 
  const [aspectRatio, setAspectRatio] = useState(50); 
  const [bodyDistortion, setBodyDistortion] = useState(10); 
  const [nucleusSize, setNucleusSize] = useState(12); 
  const [armLength, setArmLength] = useState(12); 
  const [armThickness, setArmThickness] = useState(30); 
  
  const [somaLum, setSomaLum] = useState(20); 
  const [textureDensity, setTextureDensity] = useState(25); 
  const [textureStyle, setTextureStyle] = useState<TextureStyle>('POROUS');
  const [somaColor, setSomaColor] = useState<string>(theme.color); 
  const [nucleusColor, setNucleusColor] = useState<string>(theme.color); 

  const [waviness, setWaviness] = useState(10);
  const [spikeFactor, setSpikeFactor] = useState(0); 
  const [spikeAngle, setSpikeAngle] = useState(50); 
  const [spineStyle, setSpineStyle] = useState<SpineStyle>('THORNS');
  
  const [spookySpeed, setSpookySpeed] = useState(5); 
  const [pulseIntensity, setPulseIntensity] = useState(5); 
  const [trailLevel, setTrailLevel] = useState(5); 
  
  const rotationRef = useRef(0); 
  const [zoom, setZoom] = useState(1.2); 
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const [activeTab, setActiveTab] = useState<'STRUCTURE' | 'SURFACE' | 'MOTION' | 'MUTATION'>('STRUCTURE');

  useEffect(() => {
      setSomaColor(theme.color);
      setNucleusColor(theme.color);
  }, [archetype, theme.color]);

  const handleRandomName = () => {
      playCosmicClick();
      setNeuronName(`${DNA_NAMES[Math.floor(Math.random() * DNA_NAMES.length)]}-${Math.floor(Math.random() * 999)}`);
  };

  const handleRandomizeAll = () => {
    playDataOpen();
    const rand = (max: number) => Math.floor(Math.random() * max);
    setSomaSize(rand(isUnlocked ? 100 : 25));
    setAspectRatio(rand(100));
    setBodyDistortion(rand(isUnlocked ? 100 : 25));
    setNucleusSize(rand(isUnlocked ? 100 : 25));
    setArmLength(rand(isUnlocked ? 100 : 25));
    setArmThickness(rand(isUnlocked ? 100 : 25));
    setSomaLum(rand(isUnlocked ? 100 : 25));
    setTextureDensity(rand(isUnlocked ? 100 : 25));
    if (isUnlocked) {
        setSpikeFactor(rand(100));
        setSpikeAngle(rand(100));
        setSpookySpeed(rand(100));
        setPulseIntensity(rand(100));
        setTrailLevel(rand(100));
        setWaviness(Math.max(10, rand(100))); 
    }
  };

  const handleResetToClass = () => {
    playMenuSelect();
    setSomaSize(20); setAspectRatio(50); setBodyDistortion(10); setNucleusSize(12);
    setSomaLum(20); setTextureDensity(25); setTextureStyle('POROUS'); 
    setSomaColor(theme.color); setNucleusColor(theme.color); setArmLength(12);
    setArmThickness(30); setWaviness(10); setSpikeFactor(0); setSpikeAngle(50);
    setSpookySpeed(5); setPulseIntensity(5); setTrailLevel(5);
  };

  const handleSliderChange = useCallback((v: number, setter: (v: number) => void, cap: number = 100, isHardLocked: boolean = false) => {
      if (isHardLocked && !isUnlocked && v > 0) {
          playError();
          return;
      }
      const val = !isUnlocked && v > cap ? cap : v;
      setter(val);
  }, [isUnlocked]);

  const handleColorSelect = (hex: string, type: 'SOMA' | 'NUCLEUS', locked: boolean) => {
      if (locked && !isUnlocked) { playError(); return; }
      playCosmicClick();
      if (type === 'SOMA') setSomaColor(hex);
      if (type === 'NUCLEUS') setNucleusColor(hex);
  };

  useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const handleMouseDown = (e: MouseEvent) => { isDraggingRef.current = true; lastMouseXRef.current = e.clientX; };
      const handleMouseMove = (e: MouseEvent) => {
          if (isDraggingRef.current) {
              const delta = e.clientX - lastMouseXRef.current;
              rotationRef.current += delta * 0.5;
              lastMouseXRef.current = e.clientX;
          }
      };
      const handleMouseUp = () => { isDraggingRef.current = false; };
      el.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
          el.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const resize = () => { if(canvas.parentElement) { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; } };
    window.addEventListener('resize', resize);
    resize();
    let frameId: number;
    let time = 0;
    const render = () => {
        time += 0.05;
        const trailLimit = isUnlocked ? (trailLevel / 100 * 0.60) : (Math.min(trailLevel, 25) / 100 * 0.60);
        const trailAlpha = 0.68 - trailLimit; 
        if (trailLimit > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`; ctx.fillRect(0, 0, canvas.width, canvas.height); } 
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const pulse = Math.sin(time) * 0.012 + 1; 
        const heart = Math.sin(time * 3) * (pulseIntensity / 100 * 10); 
        const activeSpooky = isUnlocked ? (spookySpeed / 100 * 0.25) : (Math.min(spookySpeed, 25) / 100 * 0.25);
        rotationRef.current += activeSpooky; 
        ctx.save();
        ctx.translate(cx, cy);
        const scaleFactor = (Math.min(canvas.width, canvas.height) / 450) * zoom; 
        ctx.scale(pulse * scaleFactor, pulse * scaleFactor);
        const currentRot = rotationRef.current * Math.PI / 180;
        const reachFac = isUnlocked ? (armLength / 100) : (Math.min(armLength, 25) / 100);
        const armReach = 35 + (reachFac * 180); 
        const sSizeVal = 40 + (somaSize / 100 * 40);
        const startRad = sSizeVal * 0.85;
        const thickFac = isUnlocked ? (armThickness / 100) : (Math.min(armThickness, 50) / 100);
        const lineWidth = (thickFac * 20) + 2; 
        const flowIntensity = ((waviness / 100) * 0.012) + 0.004;
        for (let i = 0; i < 4; i++) {
            const baseAng = (Math.PI / 2) * i + (Math.PI / 4) + currentRot;
            const pts: {x: number, y: number}[] = [];
            for(let j = 0; j <= 12; j++) {
                const t = j / 12;
                const d = startRad + (armReach * t);
                const w = Math.sin((t * 6) + (time * 1.5)) * (flowIntensity * 100 * t); 
                pts.push({ x: Math.cos(baseAng + w * 0.05) * d, y: Math.sin(baseAng + w * 0.05) * d });
            }
            ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
            for(let p of pts) ctx.lineTo(p.x, p.y);
            ctx.lineCap = 'round'; ctx.lineJoin = 'round'; 
            ctx.strokeStyle = somaColor; ctx.lineWidth = lineWidth; ctx.stroke();
            if (spikeFactor > 0) {
                 ctx.beginPath();
                 for(let j=2; j<pts.length-1; j+=3) {
                     const p = pts[j];
                     const dx = pts[j+1].x - p.x; const dy = pts[j+1].y - p.y;
                     const armTangent = Math.atan2(dy, dx);
                     const ang = armTangent + ((spikeAngle / 100 * 180) * Math.PI / 180);
                     const isThreads = spineStyle === 'THREADS';
                     const lenMult = isThreads ? 2.2 : 1.0;
                     const len = ((spikeFactor / 100 * 20) + 4) * lenMult;
                     const ex = p.x + Math.cos(ang)*len;
                     const ey = p.y + Math.sin(ang)*len;
                     ctx.moveTo(p.x, p.y);
                     if (isThreads) ctx.quadraticCurveTo(p.x + Math.cos(ang+0.4)*len*0.7, p.y + Math.sin(ang+0.4)*len*0.7, ex, ey);
                     else ctx.lineTo(ex, ey);
                     if (spineStyle === 'BULBS') {
                         ctx.save(); ctx.fillStyle = somaColor; ctx.shadowColor = somaColor; ctx.shadowBlur = 12;
                         ctx.beginPath(); ctx.arc(ex, ey, 5.5, 0, Math.PI*2); ctx.fill();
                         ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(ex-1.8, ey-1.8, 1.4, 0, Math.PI*2); ctx.fill();
                         ctx.restore();
                     }
                 }
                 ctx.lineWidth = spineStyle === 'THREADS' ? 0.6 : 1.4; ctx.strokeStyle = somaColor; ctx.stroke();
            }
            const tip = pts[pts.length-1];
            ctx.save(); ctx.beginPath(); ctx.arc(tip.x, tip.y, lineWidth * 0.9, 0, Math.PI * 2);
            const tg = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, lineWidth * 2.0);
            tg.addColorStop(0, '#ffffff'); tg.addColorStop(0.2, somaColor); tg.addColorStop(1, 'transparent');
            ctx.fillStyle = tg; ctx.shadowColor = somaColor; ctx.shadowBlur = 25; ctx.fill(); ctx.restore();
        }
        ctx.save(); ctx.rotate(currentRot); const bodyRatio = 0.85 + (aspectRatio / 100) * 0.30; ctx.scale(bodyRatio, 1); 
        const sRad = sSizeVal; const dFac = bodyDistortion / 100;
        ctx.beginPath();
        for(let a=0; a<Math.PI*2; a+=0.1) {
            const noise = Math.sin(a * 4 + time) * (dFac * 7); const r = sRad + noise;
            const px = Math.cos(a) * r; const py = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        const g = ctx.createRadialGradient(-sRad*0.3, -sRad*0.3, sRad*0.05, 0, 0, sRad);
        g.addColorStop(0, '#ffffff99'); g.addColorStop(0.3, somaColor); g.addColorStop(0.85, '#000000aa'); g.addColorStop(1, 'transparent'); 
        ctx.fillStyle = g; ctx.shadowColor = theme.color; ctx.shadowBlur = (somaLum/100) * 50; ctx.fill(); ctx.shadowBlur = 0;
        if (textureDensity > 0) {
            ctx.clip();
            if (textureStyle === 'POROUS') {
                for(let j=0; j<textureDensity * 1.4; j++) {
                    const r = (j * 137.5) * (Math.PI/180); const d = Math.sqrt(j / (textureDensity * 1.4)) * (sRad * 0.9);
                    const ox = Math.cos(r) * d; const oy = Math.sin(r) * d; const sz = (Math.sin(j) + 2) * 2.8;
                    ctx.beginPath(); ctx.arc(ox, oy, sz, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fill();
                }
            } else if (textureStyle === 'BIO_SYNAPSE') {
                ctx.beginPath();
                for(let j=0; j<textureDensity * 1.2; j++) {
                    const a = (j/textureDensity)*Math.PI*8 + time*0.1; const d = (Math.sin(j) * 0.5 + 0.5) * sRad * 0.8;
                    ctx.moveTo(0,0); ctx.quadraticCurveTo(Math.cos(a)*d*0.5, Math.sin(a)*d*0.5, Math.cos(a)*d, Math.sin(a)*d);
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 2.8; ctx.stroke();
            }
        }
        ctx.restore();
        ctx.save(); ctx.rotate(currentRot); const nSize = Math.max(3.5, (nucleusSize / 100 * 24) + heart);
        ctx.beginPath(); ctx.arc(0, 0, nSize, 0, Math.PI * 2);
        const ng = ctx.createRadialGradient(0,0,1, 0,0, nSize);
        ng.addColorStop(0, '#FFFFFF'); ng.addColorStop(0.3, nucleusColor); ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng; ctx.shadowColor = nucleusColor; ctx.shadowBlur = 40; ctx.fill();
        ctx.restore(); ctx.restore();
        frameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(frameId); };
  }, [somaLum, armLength, armThickness, waviness, spikeFactor, spikeAngle, somaColor, nucleusColor, aspectRatio, bodyDistortion, somaSize, nucleusSize, textureDensity, zoom, spookySpeed, pulseIntensity, trailLevel, textureStyle, theme, isUnlocked, spineStyle]);

  const handleFinish = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2; setGenerationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) { const avatarUrl = canvas.toDataURL('image/png'); onComplete(avatarUrl); }
        }, 500);
      }
    }, 30);
  };

  const Slide = ({ label, icon, val, setter, maxCap = 100, displayMin = 0.00, displayMax = 1.00, locked = false }: any) => {
      const p = (val / 100); const displayVal = (displayMin + p * (displayMax - displayMin)).toFixed(2);
      const activeCap = isUnlocked ? 100 : maxCap;
      return (
        <div className={`space-y-2 relative group ${locked && !isUnlocked ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500">
                <span className="flex items-center gap-2 group-hover:text-white transition-colors">{icon} {label}</span>
                <span className="flex items-center gap-2 font-mono text-[11px]" style={{ color: theme.color }}>{(!isUnlocked && val >= maxCap) && <Lock className="w-3 h-3 text-red-500" />}{displayVal}</span>
            </div>
            <div className="relative w-full h-5 flex items-center">
                <div className="absolute left-0 w-full h-2 bg-black/60 border border-white/10 rounded-full overflow-hidden pointer-events-none">
                    {!isUnlocked && maxCap < 100 && <div className="absolute top-0 right-0 h-full bg-red-900/30 border-l border-red-500/40" style={{ width: `${100 - maxCap}%` }} />}
                    <div className="absolute top-0 left-0 h-full opacity-60" style={{ width: `${val}%`, background: `linear-gradient(to right, transparent, ${theme.color})` }} />
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={val} 
                    onChange={(e) => handleSliderChange(parseInt(e.target.value), setter, activeCap, locked)} 
                    onMouseDown={() => playMenuSelect()} 
                    className="w-full h-full opacity-0 cursor-ew-resize z-20 relative" 
                />
                <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-black pointer-events-none z-10 transition-transform group-active:scale-125" 
                    style={{ 
                        left: `calc(${val}% - 8px)`,
                        boxShadow: `0 0 15px ${theme.color}, 0 0 5px white`
                    }} 
                />
            </div>
        </div>
      );
  };

  const nameInputShadow = `0 4px 25px ${theme.color}cc, 0 8px 50px ${theme.color}88`;

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col landscape:flex-row text-[#e0f2fe] font-mono overflow-hidden select-none">
      
      {/* LEFT: PREVIEW & NAME (NO BACKGROUNDS) */}
      <div ref={containerRef} className="h-[45%] landscape:h-full landscape:w-[55%] relative flex flex-col items-center border-r border-white/5 cursor-move group/preview overflow-hidden bg-transparent">
          
          {/* HEADER NAVIGATION */}
          <div className="absolute top-6 left-6 z-30">
              <button onClick={onBack} className="p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 text-gray-400 hover:text-white transition-colors border border-white/10"><ArrowLeft className="w-5 h-5" /></button>
          </div>
          
          {/* IDENTITY CONTROLS - Enhanced Centering */}
          <div className="absolute top-12 md:top-20 flex flex-col items-center z-20 w-full px-8 pointer-events-none">
              <div className="text-[10px] text-white/40 font-mono tracking-[0.5em] mb-3 uppercase animate-fadeIn">Neural Identity Module</div>
              <div className="flex items-center justify-center gap-6 w-full max-w-xl pointer-events-auto">
                  <button 
                    onClick={handleRandomName} 
                    title="Randomize Name" 
                    className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all shadow-xl group/dna shrink-0"
                    style={{ borderColor: `${theme.color}55` }}
                  >
                    <Dna className="w-8 h-8 group-hover/dna:rotate-180 transition-transform duration-1000" style={{ color: theme.color }} />
                  </button>

                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={neuronName} 
                      onChange={e => setNeuronName(e.target.value)} 
                      className="w-full bg-transparent border-b border-white/20 py-3 text-center font-tech text-3xl md:text-5xl uppercase tracking-[0.05em] text-white outline-none focus:border-white/50 transition-all"
                      style={{ textShadow: nameInputShadow }}
                    />
                  </div>
              </div>
              <div className="mt-4 text-[11px] font-bold tracking-[1.0em] uppercase opacity-90 transition-all" style={{ color: theme.color, textShadow: `0 0 15px ${theme.color}` }}>{theme.label}</div>
          </div>

          {/* ZOOM CONTROLS - Separated flanking the node area */}
          <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-48 md:gap-64 z-30 pointer-events-none">
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z-0.1))} 
                className="p-4 bg-black/30 backdrop-blur-sm rounded-2xl text-white hover:bg-black/60 border border-white/10 pointer-events-auto transition-all hover:scale-110 active:scale-90 shadow-xl"
              >
                  <Minus className="w-5 h-5"/>
              </button>
              <button 
                onClick={() => setZoom(z => Math.min(2.5, z+0.1))} 
                className="p-4 bg-black/30 backdrop-blur-sm rounded-2xl text-white hover:bg-black/60 border border-white/10 pointer-events-auto transition-all hover:scale-110 active:scale-90 shadow-xl"
              >
                  <Plus className="w-5 h-5"/>
              </button>
          </div>

          {/* Centered Canvas Container - Full Transparency for Cosmic Background Interaction */}
          <div className="w-full h-full flex items-center justify-center p-12 pt-48 md:pt-56 relative bg-transparent">
            <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]" />
          </div>
      </div>

      {/* RIGHT: CONTROLS */}
      <div className="flex-1 landscape:w-[45%] flex flex-col bg-black/60 backdrop-blur-xl border-t landscape:border-t-0 border-white/5 overflow-hidden">
          <div className="flex border-b border-white/10 shrink-0 items-center">
              <button 
                onClick={handleResetToClass} 
                title="Reset Calibration" 
                className="p-7 border-r border-white/10 hover:bg-red-500/10 group/reset transition-all"
              >
                  <RefreshCw className="w-7 h-7 text-gray-500 group-hover/reset:text-red-400 group-hover/reset:rotate-[-180deg] transition-all duration-500" />
              </button>

              <div className="flex flex-1">
                {['STRUCTURE', 'SURFACE', 'MOTION', 'MUTATION'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => { playMenuSelect(); setActiveTab(t as any); }} 
                      className={`flex-1 py-7 text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all ${activeTab === t ? 'text-white bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                      style={{ borderBottom: activeTab === t ? `4px solid ${theme.color}` : 'none' }}
                    >{t}</button>
                ))}
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12 pb-48">
              {activeTab === 'STRUCTURE' && (
                  <div className="space-y-12 animate-fadeIn">
                      <Slide label="Soma Mass" icon={<CircleDashed className="w-4 h-4"/>} val={somaSize} setter={setSomaSize} displayMin={0.50} displayMax={1.00} maxCap={25} />
                      <Slide label="Body Shape" icon={<Minimize2 className="w-4 h-4"/>} val={aspectRatio} setter={setAspectRatio} displayMin={0.85} displayMax={1.15} />
                      <Slide label="Body Distortion" icon={<Waves className="w-4 h-4"/>} val={bodyDistortion} setter={setBodyDistortion} displayMin={0.00} displayMax={0.50} maxCap={25} />
                      <Slide label="Nucleus Core" icon={<Eye className="w-4 h-4"/>} val={nucleusSize} setter={setNucleusSize} displayMin={0.00} displayMax={1.00} maxCap={25} />
                      <Slide label="Dendrite Reach" icon={<Network className="w-4 h-4"/>} val={armLength} setter={setArmLength} displayMin={0.10} displayMax={0.75} maxCap={25} />
                      <Slide label="Arm Thickness" icon={<Grip className="w-4 h-4"/>} val={armThickness} setter={setArmThickness} displayMin={0.00} displayMax={0.40} maxCap={25} />
                  </div>
              )}
              {activeTab === 'SURFACE' && (
                  <div className="space-y-12 animate-fadeIn">
                      <Slide label="Bio-Luminescence" icon={<Sun className="w-4 h-4"/>} val={somaLum} setter={setSomaLum} maxCap={25} />
                      <Slide label="Texture Density" icon={<Layers className="w-4 h-4"/>} val={textureDensity} setter={setTextureDensity} displayMin={0.00} displayMax={0.40} maxCap={25} />
                      <div className="space-y-10">
                          {[{ label: "Soma Pigment", type: 'SOMA', val: somaColor }, { label: "Nucleus Glow", type: 'NUCLEUS', val: nucleusColor }].map((cp, idx) => (
                              <div key={idx}>
                                  <div className="text-[10px] text-gray-600 uppercase font-bold mb-5 tracking-widest">{cp.label}</div>
                                  <div className="grid grid-cols-6 gap-4">{PALETTE.map((c, i) => (
                                      <button key={i} onClick={() => handleColorSelect(c.hex, cp.type as any, c.locked)} className={`h-12 rounded-xl border-2 transition-all ${cp.val === c.hex ? 'border-white scale-110 shadow-2xl z-10' : 'border-transparent hover:scale-105'} relative ${c.locked && !isUnlocked ? 'opacity-20 cursor-not-allowed' : ''}`} style={{ backgroundColor: c.hex, boxShadow: cp.val === c.hex ? `0 0 20px ${c.hex}` : 'none' }}>{c.locked && !isUnlocked && <Lock className="w-5 h-5 text-black absolute inset-0 m-auto"/>}</button>
                                  ))}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
              {activeTab === 'MOTION' && (
                  <div className="space-y-12 animate-fadeIn">
                       {!isUnlocked && <div className="p-8 bg-red-900/20 border border-red-500/30 rounded-3xl text-[12px] text-red-400 font-bold uppercase tracking-[0.2em] flex items-center gap-5 shadow-inner"><Lock className="w-6 h-6" /> Evolutionary Unlock Required</div>}
                       <Slide label="Spooky Motion" icon={<RotateCw className="w-4 h-4"/>} val={spookySpeed} setter={setSpookySpeed} displayMin={0.00} displayMax={0.25} locked={true} />
                       <Slide label="Quantum Trails" icon={<Wind className="w-4 h-4"/>} val={trailLevel} setter={setTrailLevel} displayMin={0.00} displayMax={0.60} locked={true} />
                       <Slide label="Nucleus Pulse" icon={<Activity className="w-4 h-4"/>} val={pulseIntensity} setter={setPulseIntensity} displayMin={0.00} displayMax={1.00} locked={true} />
                  </div>
              )}
              {activeTab === 'MUTATION' && (
                  <div className="space-y-12 animate-fadeIn">
                      <Slide label="Flow State" icon={<Waves className="w-4 h-4"/>} val={waviness} setter={setWaviness} displayMin={0.01} displayMax={0.012} maxCap={5} />
                      {/* Triangle icon correctly used here after being added to imports */}
                      <Slide label="Spiny Protrusions" icon={<Triangle className="w-4 h-4"/>} val={spikeFactor} setter={setSpikeFactor} displayMin={0.00} displayMax={1.00} locked={true} />
                      <Slide label="Protrusion Angle" icon={<Compass className="w-4 h-4"/>} val={spikeAngle} setter={setSpikeAngle} displayMin={0} displayMax={180} locked={true} />
                  </div>
              )}
          </div>
      </div>

      {/* FOOTER ACTIONS - Refined smaller button, high-transparency glass look */}
      <div className="absolute bottom-0 right-0 w-full landscape:w-[45%] p-10 bg-gradient-to-t from-black via-black/95 to-transparent z-50 pointer-events-none">
          <div className="pointer-events-auto flex gap-6 items-center">
            {!isGenerating ? (
                <>
                    <button 
                        onClick={() => { playDataOpen(); handleRandomizeAll(); }} 
                        className="p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all flex items-center justify-center group/mutate shadow-xl active:scale-95"
                        style={{ 
                            borderColor: `${theme.color}55`
                        }}
                    >
                        <Dice5 className="w-10 h-10 transition-all duration-700 group-hover/mutate:rotate-[360deg]" style={{ color: theme.color }} />
                    </button>
                    
                    <button 
                        onClick={() => { playNeuralLink(); setIsGenerating(true); handleFinish(); }} 
                        className="flex-1 py-4 rounded-2xl font-tech text-base md:text-lg uppercase tracking-[0.2em] text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group border border-white/20 bg-opacity-40 backdrop-blur-md" 
                        style={{ backgroundColor: `${theme.color}44` }}
                    >
                        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center gap-3 font-bold text-shadow-glow">
                            <Zap className="w-6 h-6 fill-current group-hover:animate-bounce" /> 
                            Finish Differentiation
                        </span>
                    </button>
                </>
            ) : (
                <div className="w-full bg-gray-900 h-20 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                    <div className="absolute left-0 top-0 h-full opacity-70 transition-all duration-75" style={{ width: `${generationProgress}%`, backgroundColor: theme.color, boxShadow: `0 0 40px ${theme.color}44` }}></div>
                    <span className="relative z-10 font-mono text-xs animate-pulse tracking-[0.4em] text-white uppercase font-bold">Bio-Forge Calibration... {generationProgress}%</span>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};
