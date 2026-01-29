
import React, { useEffect, useRef } from 'react';

interface WarpScreenProps {
  color: string; // e.g., 'cyan', 'purple', 'orange'
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
}

export const WarpScreen: React.FC<WarpScreenProps> = ({ color, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Map color names to hex/rgba
  const getColor = (c: string) => {
      const map: Record<string, string> = {
          cyan: '#00FFFF',
          purple: '#A855F7',
          orange: '#FF4500',
          blue: '#3B82F6',
          indigo: '#6366F1',
          green: '#10B981',
          red: '#EF4444',
          white: '#FFFFFF'
      };
      return map[c] || '#FFFFFF';
  };

  const warpColor = getColor(color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 200; 

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            color: Math.random() > 0.3 ? warpColor : '#FFFFFF'
        });
    }

    let speed = 0.1;
    const maxSpeed = 5.0; // Acceleration factor

    const animate = () => {
        // Trails effect
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Accelerate
        if (speed < maxSpeed) speed += 0.05;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Move away from center
            const dx = p.x - cx;
            const dy = p.y - cy;
            
            // Calculate angle and push out
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);
            
            // Warp speed math
            const velocity = (dist / 50) * speed; 
            
            p.x += Math.cos(angle) * velocity;
            p.y += Math.sin(angle) * velocity;
            p.size += 0.05 * speed;

            // Reset if out of bounds
            if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
                 p.x = cx + (Math.random() - 0.5) * 50; // Spawn near center
                 p.y = cy + (Math.random() - 0.5) * 50;
                 p.size = Math.random();
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const timer = setTimeout(() => {
        onComplete();
    }, 3500); // 3.5s warp duration

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
        clearTimeout(timer);
    };
  }, [warpColor]);

  return (
    <div className="absolute inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="relative z-10 text-center animate-pulse">
            <h2 className="text-4xl md:text-6xl font-tech text-white uppercase tracking-[0.2em] mb-4 text-shadow-glow mix-blend-screen">
                INITIATING WARP
            </h2>
            <div className="text-xs font-mono uppercase tracking-widest" style={{ color: warpColor }}>
                Target: Bio-Forge // Protocol Color: {color.toUpperCase()}
            </div>
        </div>
        <div className="absolute inset-0 bg-white/0 animate-flash pointer-events-none"></div>
        <style>{`
            @keyframes flash {
                0% { background-color: rgba(255,255,255,0); }
                90% { background-color: rgba(255,255,255,0); }
                100% { background-color: rgba(255,255,255,1); }
            }
            .animate-flash {
                animation: flash 3.5s ease-in forwards;
            }
        `}</style>
    </div>
  );
};
