
import React, { useEffect, useRef } from 'react';
import { UserPath } from '../types';

interface CosmicBackgroundProps {
  path?: UserPath;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ path = UserPath.NONE }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  const getConfig = (p: UserPath) => {
    switch (p) {
      case UserPath.SCIENTIFIC:
        return {
          colors: ['#00FFFF', '#3B82F6', '#ffffff'], 
          lineColor: '0, 255, 255',
          particleCount: 120,
          connectionDist: 150,
          hubFreq: 0.1,
          bg: '#000000'
        };
      case UserPath.RELIGIOUS:
        return {
          colors: ['#FFD700', '#FFA500', '#ffffff'], 
          lineColor: '255, 215, 0',
          particleCount: 110,
          connectionDist: 180,
          hubFreq: 0.15,
          bg: '#000000'
        };
      case UserPath.BLENDED:
        return {
          colors: ['#A855F7', '#E879F9', '#ffffff'], 
          lineColor: '168, 85, 247',
          particleCount: 140,
          connectionDist: 140,
          hubFreq: 0.12,
          bg: '#000000'
        };
      default:
        return {
          colors: ['#00FFFF', '#FFD700', '#A855F7', '#FFFFFF'], 
          lineColor: '255, 255, 255',
          particleCount: 100,
          connectionDist: 140,
          hubFreq: 0.08,
          bg: '#000000'
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    const config = getConfig(path);

    // Dynamic UI styling sync - Hex based
    const root = document.documentElement;
    const mainColor = config.colors[0];
    root.style.setProperty('--path-color', mainColor);
    // Glow is handled in App.tsx using color + '4D' for hex strings

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseSize: number;
      pulse: number;
      pulseSpeed: number;
      isHub: boolean;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.isHub = Math.random() < config.hubFreq;
        this.baseSize = this.isHub ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
      }

      update() {
        if (mouseRef.current.active) {
            const dx = mouseRef.current.x - this.x;
            const dy = mouseRef.current.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceRadius = 300;

            if (distance < forceRadius) {
                const force = (forceRadius - distance) / forceRadius;
                this.x += (dx / distance) * force * 1.2;
                this.y += (dy / distance) * force * 1.2;
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        
        this.pulse += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulse) * (this.isHub ? 1.5 : 0.5);
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        if (this.isHub) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.globalAlpha = 0.9;
        } else {
            ctx.globalAlpha = 0.5;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    }

    let particles: Particle[] = [];
    const init = () => {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = '#000000'; 
      ctx.fillRect(0, 0, width, height);

      for (let a = 0; a < particles.length; a++) {
        const p1 = particles[a];
        
        if (mouseRef.current.active) {
            const dxM = mouseRef.current.x - p1.x;
            const dyM = mouseRef.current.y - p1.y;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);
            if (distM < 250) {
                const opacity = (1 - (distM / 250)) * 0.4;
                ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity})`;
                ctx.lineWidth = opacity * 2.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                ctx.stroke();
            }
        }

        for (let b = a + 1; b < particles.length; b++) {
          const p2 = particles[b];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDist) {
            const opacity = (1 - (distance / config.connectionDist)) * 0.2;
            ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
        mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [path]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
       <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
