
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { playNeuralLink, playCosmicClick, playError, playMenuSelect, playDataOpen } from '../../utils/sfx';
import { ArrowLeft, Dna, Lock, Zap, Activity, Sun, Network, RotateCw, ZoomIn, ZoomOut, Layers, Eye, Maximize2, Minimize2, Triangle, Waves, Grip, CircleDashed, Wind, Dice5, RefreshCw, Compass } from 'lucide-react';
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
          MYSTIC: { color: '#A855F7', label: 'THE MYSTIC' },
          ACTIVE_NODE: { color: '#FF4500', label: 'ACTIVE NODE' },
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

  // --- STATE: IDENTITY ---
  const [neuronName, setNeuronName] = useState("Proto-Node");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // --- STATE: MORPHOLOGY (Calibrated Defaults) ---
  const [somaSize, setSomaSize] = useState(25); 
  const [aspectRatio, setAspectRatio] = useState(50); 
  const [bodyDistortion, setBodyDistortion] = useState(15); 
  const [nucleusSize, setNucleusSize] = useState(15); 
  const [armLength, setArmLength] = useState(15); // Default shorter
  const [armThickness, setArmThickness] = useState(35); // Default thicker
  
  const [somaLum, setSomaLum] = useState(20); 
  const [textureDensity, setTextureDensity] = useState(30); 
  const [textureStyle, setTextureStyle] = useState<TextureStyle>('POROUS');
  const [somaColor, setSomaColor] = useState<string>(theme.color); 
  const [nucleusColor, setNucleusColor] = useState<string>(theme.color); 

  const [waviness, setWaviness] = useState(15); // Always moves
  const [spikeFactor, setSpikeFactor] = useState(0); 
  const [spikeAngle, setSpikeAngle] = useState(50); 
  const [spineStyle, setSpineStyle] = useState<SpineStyle>('THORNS');
  
  const [spookySpeed, setSpookySpeed] = useState(8); 
  const [pulseIntensity, setPulseIntensity] = useState(10); 
  const [trailLevel, setTrailLevel] = useState(5); 
  
  const rotationRef = useRef(0); 
  const [zoom, setZoom] = useState(1.2); 
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const touchDistRef = useRef<number | null>(null);
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
        setWaviness(Math.max(10, rand(100))); // Randomize but never zero
    }
  };

  const handleResetToClass = () => {
    playMenuSelect();
    setSomaSize(25); setAspectRatio(50); setBodyDistortion(15); setNucleusSize(15);
    setSomaLum(20); setTextureDensity(30); setTextureStyle('POROUS'); 
    setSomaColor(theme.color); setNucleusColor(theme.color); setArmLength(15);
    setArmThickness(35); setWaviness(15); setSpikeFactor(0); setSpikeAngle(50);
    setSpookySpeed(8); setPulseIntensity(10); setTrailLevel(5);
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

  // --- INPUT HANDLERS ---
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

      const handleTouchStart = (e: TouchEvent) => { 
          if (e.touches.length === 1) {
              isDraggingRef.current = true; lastMouseXRef.current = e.touches[0].clientX;
          } else if (e.touches.length === 2) {
              touchDistRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          }
      };
      const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length === 1 && isDraggingRef.current) {
              const delta = e.touches[0].clientX - lastMouseXRef.current;
              rotationRef.current += delta * 0.5; lastMouseXRef.current = e.touches[0].clientX;
          } else if (e.touches.length === 2 && touchDistRef.current !== null) {
              e.preventDefault();
              const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
              setZoom(prev => Math.min(2.5, Math.max(0.5, prev + (d - touchDistRef.current!) * 0.005)));
              touchDistRef.current = d;
          }
      };
      const handleTouchEnd = () => { isDraggingRef.current = false; touchDistRef.current = null; };

      el.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      el.addEventListener('touchstart', handleTouchStart, { passive: false });
      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      el.addEventListener('touchend', handleTouchEnd);
      return () => {
          el.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          el.removeEventListener('touchstart', handleTouchStart);
          el.removeEventListener('touchmove', handleTouchMove);
          el.removeEventListener('touchend', handleTouchEnd);
      };
  }, []);

  // --- RENDER ENGINE ---
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

        if (trailLimit > 0) {
            ctx.fillStyle = `rgba(5, 5, 5, ${trailAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

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

        // --- 1. ARMS ---
        const reachFac = isUnlocked ? (armLength / 100) : (Math.min(armLength, 25) / 100);
        const armReach = 40 + (reachFac * 260); 
        const sSizeVal = 40 + (somaSize / 100 * 40);
        const startRad = sSizeVal * 0.85;
        
        const thickFac = isUnlocked ? (armThickness / 100) : (Math.min(armThickness, 50) / 100);
        const lineWidth = (thickFac * 20) + 2; 

        // Flow State: Never Zero Logic + Halved Max
        const flowIntensity = ((waviness / 100) * 0.025) + 0.005;

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
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = lineWidth * 0.3; ctx.stroke();

            // Synaptic Spines
            if (spikeFactor > 0) {
                 ctx.beginPath();
                 for(let j=2; j<pts.length-1; j+=3) {
                     const p = pts[j];
                     const dx = pts[j+1].x - p.x; const dy = pts[j+1].y - p.y;
                     const armTangent = Math.atan2(dy, dx);
                     const ang = armTangent + ((spikeAngle / 100 * 180) * Math.PI / 180);
                     const lenMult = spineStyle === 'THREADS' ? 1.7 : 1.0;
                     const len = ((spikeFactor / 100 * 20) + 4) * lenMult;
                     const ex = p.x + Math.cos(ang)*len;
                     const ey = p.y + Math.sin(ang)*len;
                     
                     ctx.moveTo(p.x, p.y);
                     if (spineStyle === 'THREADS') {
                         ctx.quadraticCurveTo(p.x + Math.cos(ang+0.25)*len*0.6, p.y + Math.sin(ang+0.25)*len*0.6, ex, ey);
                     } else {
                         ctx.lineTo(ex, ey);
                     }

                     if (spineStyle === 'BULBS') {
                         ctx.save();
                         ctx.fillStyle = somaColor;
                         ctx.shadowColor = somaColor; ctx.shadowBlur = 10;
                         ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI*2); ctx.fill();
                         ctx.fillStyle = 'rgba(255,255,255,0.6)';
                         ctx.beginPath(); ctx.arc(ex-1.5, ey-1.5, 1.2, 0, Math.PI*2); ctx.fill();
                         ctx.restore();
                     }
                 }
                 ctx.lineWidth = spineStyle === 'THREADS' ? 0.9 : 1.4;
                 ctx.strokeStyle = somaColor; ctx.stroke();
            }
            
            // Bio-Glow Tips
            const tip = pts[pts.length-1];
            ctx.save();
            ctx.beginPath(); ctx.arc(tip.x, tip.y, lineWidth * 0.75, 0, Math.PI * 2);
            const tg = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, lineWidth * 1.5);
            tg.addColorStop(0, '#ffffff'); tg.addColorStop(0.3, somaColor); tg.addColorStop(1, 'transparent');
            ctx.fillStyle = tg; ctx.shadowColor = somaColor; ctx.shadowBlur = 20;
            ctx.fill();
            ctx.restore();
        }

        // --- 2. SOMA (Body Shape) ---
        ctx.save();
        ctx.rotate(currentRot);
        const bodyRatio = 0.85 + (aspectRatio / 100) * 0.30;
        ctx.scale(bodyRatio, 1); 

        const sRad = sSizeVal;
        const dFac = bodyDistortion / 100;
        
        ctx.beginPath();
        for(let a=0; a<Math.PI*2; a+=0.1) {
            const noise = Math.sin(a * 4 + time) * (dFac * 7);
            const r = sRad + noise;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const g = ctx.createRadialGradient(-sRad*0.3, -sRad*0.3, sRad*0.05, 0, 0, sRad);
        g.addColorStop(0, '#ffffff99'); 
        g.addColorStop(0.3, somaColor); 
        g.addColorStop(0.85, '#000000aa'); 
        g.addColorStop(1, 'transparent'); 

        ctx.fillStyle = g;
        ctx.shadowColor = theme.color;
        ctx.shadowBlur = (somaLum/100) * 50;
        ctx.fill();
        ctx.shadowBlur = 0;

        // --- Membrane Coverage Enhancement ---
        if (textureDensity > 0) {
            ctx.clip();
            // Scaling count based on density (Max 0.40 requested)
            const countFactor = (textureDensity / 100) * 1.5; 
            if (textureStyle === 'POROUS') {
                for(let j=0; j<textureDensity * 1.2; j++) {
                    const r = (j * 137.5) * (Math.PI/180); 
                    const d = Math.sqrt(j / (textureDensity * 1.2)) * (sRad * 0.9);
                    const ox = Math.cos(r) * d; const oy = Math.sin(r) * d;
                    const sz = (Math.sin(j) + 2) * 2.8;
                    ctx.beginPath(); ctx.arc(ox, oy, sz, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fill();
                    ctx.beginPath(); ctx.arc(ox - 1.2, oy - 1.2, sz*0.4, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
                }
            } else if (textureStyle === 'BIO_SYNAPSE') {
                ctx.beginPath();
                for(let j=0; j<textureDensity; j++) {
                    const a = (j/textureDensity)*Math.PI*8 + time*0.1; 
                    const d = (Math.sin(j) * 0.5 + 0.5) * sRad * 0.8;
                    ctx.moveTo(0,0); ctx.quadraticCurveTo(Math.cos(a)*d*0.5, Math.sin(a)*d*0.5, Math.cos(a)*d, Math.sin(a)*d);
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 2.8; ctx.stroke();
            } else if (textureStyle === 'CRYSTALLINE') {
                ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.2;
                for(let i=-sRad; i<sRad; i+=10) { ctx.beginPath(); ctx.moveTo(i,-sRad); ctx.lineTo(i,sRad); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-sRad,i); ctx.lineTo(sRad,i); ctx.stroke(); }
            }
        }
        ctx.restore();

        // --- 3. NUCLEUS ---
        ctx.save();
        ctx.rotate(currentRot);
        const nSize = Math.max(3.5, (nucleusSize / 100 * 24) + heart);
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

  // --- ACTIONS ---
  const handleFinish = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setGenerationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const avatarUrl = canvas.toDataURL('image/png');
            onComplete(avatarUrl);
          }
        }, 500);
      }
    }, 30);
  };

  const Slide = ({ label, icon, val, setter, maxCap = 100, displayMin = 0.00, displayMax = 1.00, locked = false }: any) => {
      const p = (val / 100);
      const displayVal = (displayMin + p * (displayMax - displayMin)).toFixed(2);
      const activeCap = isUnlocked ? 100 : maxCap;
      
      return (
        <div className={`space-y-2 relative group ${locked && !isUnlocked ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400">
                <span className="flex items-center gap-2">{icon} {label}</span>
                <span className="flex items-center gap-2 font-mono">
                    {(!isUnlocked && val >= maxCap) && <Lock className="w-3 h-3 text-red-500" />}
                    {displayVal}
                </span>
            </div>
            <div className="relative w-full h-4 flex items-center">
                <div className="absolute left-0 w-full h-2 bg-black/60 border border-white/5 rounded-full overflow-hidden pointer-events-none">
                    {!isUnlocked && maxCap < 100 && (
                        <div className="absolute top-0 right-0 h-full bg-red-900/30 border-l border-red-500/40" style={{ width: `${100 - maxCap}%` }} />
                    )}
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-900 to-cyan-500" style={{ width: `${val}%` }} />
                </div>
                {/* Zero-Jitter Native Input */}
                <input 
                    type="range" min="0" max="100" value={val} 
                    onChange={(e) => handleSliderChange(parseInt(e.target.value), setter, activeCap, locked)} 
                    onMouseDown={() => playMenuSelect()}
                    className="w-full h-full opacity-0 cursor-ew-resize z-20"
                />
                {/* Handle without transition-all to prevent jitter */}
                <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-black shadow-[0_0_15px_white] pointer-events-none z-10"
                    style={{ left: `calc(${val}% - 8px)` }}
                />
            </div>
        </div>
      );
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] flex flex-col landscape:flex-row text-[#e0f2fe] font-mono overflow-hidden select-none">
      
      {/* PREVIEW */}
      <div ref={containerRef} className="h-[45%] landscape:h-full landscape:w-[55%] relative flex flex-col items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black p-4 border-r border-white/5 cursor-move group/preview">
          <div className="w-full flex items-center justify-between z-20">
              <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button>
              <div className="flex gap-2">
                 <button onClick={() => setZoom(z => Math.min(2.5, z+0.1))} className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"><ZoomIn className="w-3 h-3"/></button>
                 <button onClick={() => setZoom(z => Math.max(0.5, z-0.1))} className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10"><ZoomOut className="w-3 h-3"/></button>
              </div>
          </div>

          <div className="mt-2 flex flex-col items-center z-20 w-full max-w-sm">
              <input type="text" value={neuronName} onChange={e => setNeuronName(e.target.value)} className="w-full bg-transparent border-b border-white/10 py-1 text-center font-tech text-2xl uppercase tracking-widest text-white outline-none focus:border-white/30" />
              <div className="mt-1 text-[10px] font-bold tracking-[0.5em] uppercase text-shadow-glow" style={{ color: theme.color }}>{theme.label}</div>
          </div>

          <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />
          <div className="absolute bottom-16 right-4 text-[8px] text-gray-600 uppercase font-mono tracking-widest animate-pulse pointer-events-none opacity-0 group-hover/preview:opacity-100 transition-opacity">DRAG TO ROTATE</div>
          
          <div className="absolute bottom-4 left-4 z-20 flex gap-2">
              <button onClick={handleRandomName} title="Randomize Name" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all"><Dna className="w-4 h-4" /></button>
              <button onClick={handleRandomizeAll} title="Mutate All" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all"><Dice5 className="w-4 h-4" /></button>
              <button onClick={handleResetToClass} title="Reset to Class" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all"><RefreshCw className="w-4 h-4" /></button>
          </div>
      </div>

      {/* CUSTOMIZATION */}
      <div className="flex-1 landscape:w-[45%] flex flex-col bg-black/40 backdrop-blur-md border-t landscape:border-t-0 border-white/5 overflow-hidden">
          <div className="flex border-b border-white/10 shrink-0">
              {['STRUCTURE', 'SURFACE', 'MOTION', 'MUTATION'].map(t => (
                  <button key={t} onClick={() => { playMenuSelect(); setActiveTab(t as any); }} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'text-white bg-white/5 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
              ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
              {activeTab === 'STRUCTURE' && (
                  <div className="space-y-8 animate-fadeIn">
                      <Slide label="Soma Mass" icon={<CircleDashed className="w-3 h-3"/>} val={somaSize} setter={setSomaSize} displayMin={0.50} displayMax={1.00} maxCap={25} />
                      <Slide label="Body Shape" icon={<Minimize2 className="w-3 h-3"/>} val={aspectRatio} setter={setAspectRatio} displayMin={0.85} displayMax={1.15} />
                      <Slide label="Body Distortion" icon={<Waves className="w-3 h-3"/>} val={bodyDistortion} setter={setBodyDistortion} displayMin={0.00} displayMax={0.50} maxCap={25} />
                      <Slide label="Nucleus Core" icon={<Eye className="w-3 h-3"/>} val={nucleusSize} setter={setNucleusSize} displayMin={0.00} displayMax={1.00} maxCap={25} />
                      <Slide label="Dendrite Reach" icon={<Network className="w-3 h-3"/>} val={armLength} setter={setArmLength} displayMin={0.10} displayMax={0.75} maxCap={25} />
                      <Slide label="Arm Thickness" icon={<Grip className="w-3 h-3"/>} val={armThickness} setter={setArmThickness} displayMin={0.00} displayMax={0.40} maxCap={25} />
                  </div>
              )}

              {activeTab === 'SURFACE' && (
                  <div className="space-y-8 animate-fadeIn">
                      <Slide label="Bio-Luminescence" icon={<Sun className="w-3 h-3"/>} val={somaLum} setter={setSomaLum} maxCap={25} />
                      <Slide label="Texture Density" icon={<Layers className="w-3 h-3"/>} val={textureDensity} setter={setTextureDensity} displayMin={0.00} displayMax={0.40} maxCap={25} />
                      <div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Membrane Topology</div>
                          <div className="grid grid-cols-3 gap-2">
                              {['POROUS', 'BIO_SYNAPSE', 'CRYSTALLINE'].map(s => (
                                  <button key={s} onClick={() => { if(isUnlocked || s === 'POROUS') { playCosmicClick(); setTextureStyle(s as any); } else playError(); }} className={`p-3 border rounded text-[9px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all ${textureStyle === s ? 'bg-white text-black border-white shadow-[0_0_15px_white]' : 'border-white/10 text-gray-500 hover:border-white/30'} ${!isUnlocked && s !== 'POROUS' && 'opacity-30'}`}>{!isUnlocked && s !== 'POROUS' && <Lock className="w-2.5 h-2.5"/>} {s.replace('_',' ')}</button>
                              ))}
                          </div>
                      </div>
                      <div className="space-y-6">
                          {[{ label: "Soma Pigment", type: 'SOMA', val: somaColor }, { label: "Nucleus Glow", type: 'NUCLEUS', val: nucleusColor }].map((cp, idx) => (
                              <div key={idx}>
                                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">{cp.label}</div>
                                  <div className="grid grid-cols-6 gap-2">{PALETTE.map((c, i) => (
                                      <button key={i} onClick={() => handleColorSelect(c.hex, cp.type as any, c.locked)} className={`h-8 rounded-lg border transition-all ${cp.val === c.hex ? 'border-white ring-2 ring-white/50 scale-110' : 'border-transparent hover:scale-105'} relative ${c.locked && !isUnlocked ? 'opacity-20 cursor-not-allowed' : ''}`} style={{ backgroundColor: c.hex }}>{c.locked && !isUnlocked && <Lock className="w-3 h-3 text-black absolute inset-0 m-auto"/>}</button>
                                  ))}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {activeTab === 'MOTION' && (
                  <div className="space-y-8 animate-fadeIn">
                       {!isUnlocked && <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-3"><Lock className="w-4 h-4" /> Evolutionary Unlock Required</div>}
                       <Slide label="Spooky Motion" icon={<RotateCw className="w-3 h-3"/>} val={spookySpeed} setter={setSpookySpeed} displayMin={0.00} displayMax={0.25} locked={true} />
                       <Slide label="Quantum Trails" icon={<Wind className="w-3 h-3"/>} val={trailLevel} setter={setTrailLevel} displayMin={0.00} displayMax={0.60} locked={true} />
                       <Slide label="Nucleus Pulse" icon={<Activity className="w-3 h-3"/>} val={pulseIntensity} setter={setPulseIntensity} displayMin={0.00} displayMax={1.00} locked={true} />
                  </div>
              )}

              {activeTab === 'MUTATION' && (
                  <div className="space-y-8 animate-fadeIn">
                      <Slide label="Flow State" icon={<Waves className="w-3 h-3"/>} val={waviness} setter={setWaviness} displayMin={0.01} displayMax={0.02} maxCap={5} />
                      <Slide label="Spiny Protrusions" icon={<Triangle className="w-3 h-3"/>} val={spikeFactor} setter={setSpikeFactor} displayMin={0.00} displayMax={1.00} locked={true} />
                      <Slide label="Protrusion Angle" icon={<Compass className="w-3 h-3"/>} val={spikeAngle} setter={setSpikeAngle} displayMin={0} displayMax={180} locked={true} />
                      <div>
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest">Spine Morphology</div>
                          <div className="grid grid-cols-3 gap-2">
                              {['THORNS', 'BULBS', 'THREADS'].map(s => (
                                  <button key={s} onClick={() => { if(isUnlocked) { playCosmicClick(); setSpineStyle(s as any); } else playError(); }} className={`p-3 border rounded text-[9px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all ${spineStyle === s ? 'bg-white text-black border-white shadow-[0_0_15px_white]' : 'border-white/10 text-gray-500 hover:border-white/30'} ${!isUnlocked && 'opacity-30'}`}>{!isUnlocked && 'opacity-30' && <Lock className="w-2.5 h-2.5"/>} {s}</button>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      <div className="absolute bottom-0 right-0 w-full landscape:w-[45%] p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none">
          <div className="pointer-events-auto">
            {!isGenerating ? (
                <button onClick={() => { playNeuralLink(); setIsGenerating(true); handleFinish(); }} className="w-full py-6 rounded-2xl font-tech text-xl uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group border border-white/20" style={{ backgroundColor: theme.color }}>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-3 font-bold text-shadow-glow"><Zap className="w-6 h-6 fill-current" /> Finish Differentiation</span>
                </button>
            ) : (
                <div className="w-full bg-gray-900 h-20 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                    <div className="absolute left-0 top-0 h-full opacity-50 transition-all duration-75" style={{ width: `${generationProgress}%`, backgroundColor: theme.color }}></div>
                    <span className="relative z-10 font-mono text-xs animate-pulse tracking-[0.5em] text-white">WEAVING CELLULAR MATRIX... {generationProgress}%</span>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};
