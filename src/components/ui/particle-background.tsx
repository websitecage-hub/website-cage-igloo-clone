"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

const PARTICLE_DENSITY = 0.0001; 
const BG_PARTICLE_DENSITY = 0.00003;
const MOUSE_RADIUS = 150;
const RETURN_SPEED = 0.05;
const DAMPING = 0.92;
const REPULSION_STRENGTH = 1.0;

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const backgroundParticlesRef = useRef<BackgroundParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });
  const frameIdRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    // Interactive Particles
    const particleCount = Math.floor(width * height * PARTICLE_DENSITY);
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      newParticles.push({
        x, y, originX: x, originY: y,
        vx: 0, vy: 0,
        size: randomRange(0.5, 1.5),
        color: Math.random() > 0.8 ? '#93c5fd' : '#ffffff', 
      });
    }
    particlesRef.current = newParticles;

    // Ambient Particles
    const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY);
    const newBgParticles: BackgroundParticle[] = [];
    for (let i = 0; i < bgCount; i++) {
      newBgParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: randomRange(0.2, 1.0),
        alpha: randomRange(0.05, 0.2),
        phase: Math.random() * Math.PI * 2
      });
    }
    backgroundParticlesRef.current = newBgParticles;
  }, []);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Particles
    const bgParticles = backgroundParticlesRef.current;
    for (let i = 0; i < bgParticles.length; i++) {
      const p = bgParticles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      const twinkle = Math.sin(time * 0.001 + p.phase) * 0.5 + 0.5;
      ctx.globalAlpha = p.alpha * twinkle;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Interactive Particles Physics
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (mouse.isActive && distance < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
        const repulsion = force * REPULSION_STRENGTH;
        p.vx -= (dx / distance) * repulsion * 3;
        p.vy -= (dy / distance) * repulsion * 3;
      }

      p.vx += (p.originX - p.x) * RETURN_SPEED;
      p.vy += (p.originY - p.y) * RETURN_SPEED;
    }

    // Phase 2: Resolve Collisions
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx * dx + dy * dy;
        const minDist = p1.size + p2.size;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.01) {
            const nx = dx / dist; const ny = dy / dist;
            const overlap = minDist - dist;
            const pushX = nx * overlap * 0.5;
            const pushY = ny * overlap * 0.5;
            p1.x -= pushX; p1.y -= pushY;
            p2.x += pushX; p2.y += pushY;

            const dvx = p1.vx - p2.vx;
            const dvy = p1.vy - p2.vy;
            const velocityAlongNormal = dvx * nx + dvy * ny;

            if (velocityAlongNormal > 0) {
              const m1 = p1.size; const m2 = p2.size;
              const impulseMagnitude = (-(1 + 0.85) * velocityAlongNormal) / (1/m1 + 1/m2);
              const ix = impulseMagnitude * nx;
              const iy = impulseMagnitude * ny;
              p1.vx += ix / m1; p1.vy += iy / m1;
              p2.vx -= ix / m2; p2.vy -= iy / m2;
            }
          }
        }
      }
    }

    // Phase 3: Update & Draw
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.vx *= DAMPING; p.vy *= DAMPING;
      p.x += p.vx; p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.15 + (Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 0.2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    frameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isActive: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    handleResize();
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [initParticles, animate]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[5] pointer-events-none opacity-40 mix-blend-screen"
    />
  );
};
