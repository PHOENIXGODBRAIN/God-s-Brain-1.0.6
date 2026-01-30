
import React, { useEffect, useRef } from 'react';
import { playNeuralLink } from '../utils/sfx';

interface WarpScreenProps {
  color: string;
  onComplete: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
}

export const WarpScreen: React.FC<WarpScreenProps> = ({ color, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getColor = (c: string) => {
    const map: Record<string, string> = {
      cyan: '#00FFFF',
      purple: '#A855F7',
      orange: '#FF4500',
      amber: '#FFD700',
      blue: '#3B82F6',
      green: '#10B981',
      rose: '#F43F5E',
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

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const stars: Star[] = [];
    const numStars = 1200; // Increased density
    let speed = 0.5;
    const acceleration = 1.08;
    const maxSpeed = 300;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize stars in a 3D field
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: Math.random() * 3000,
        prevZ: 0
      });
    }

    const animate = () => {
      // Very slight motion blur persistence
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      speed = Math.min(maxSpeed, speed * acceleration);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.prevZ = star.z;
        star.z -= speed;

        // Reset star if it passes the viewer
        if (star.z <= 0) {
          star.z = 3000;
          star.prevZ = star.z;
          star.x = (Math.random() - 0.5) * 3000;
          star.y = (Math.random() - 0.5) * 3000;
        }

        // Project 3D coordinates to 2D
        const x1 = (star.x / star.z) * cx + cx;
        const y1 = (star.y / star.z) * cy + cy;

        const x2 = (star.x / star.prevZ) * cx + cx;
        const y2 = (star.y / star.prevZ) * cy + cy;

        // Draw the streak
        const zRatio = (1 - star.z / 3000);
        const opacity = Math.min(1, zRatio * 3);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        // Color variation: Blend archetype color with pure white for luminosity
        ctx.strokeStyle = i % 5 === 0 ? warpColor : '#FFFFFF';
        ctx.globalAlpha = opacity;
        ctx.lineWidth = zRatio * 4 + 0.2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Central Singularity Glow
      const portalGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.4);
      portalGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      portalGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
      portalGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = portalGlow;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(animate);
    };

    playNeuralLink();
    animate();

    const timer = setTimeout(() => {
      onComplete();
    }, 3000); 

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [warpColor]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Cinematic Pulse / Flash at end of sequence */}
      <div className="absolute inset-0 bg-white opacity-0 animate-warp-finish pointer-events-none"></div>

      <style>{`
        @keyframes warp-finish {
          0% { opacity: 0; }
          75% { opacity: 0; }
          90% { opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-warp-finish {
          animation: warp-finish 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};
