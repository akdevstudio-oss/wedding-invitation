import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: 'petal' | 'dust';
}

interface PetalsCanvasProps {
  density?: number;
  interactive?: boolean;
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({ density = 24 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return () => window.removeEventListener('resize', handleResize);
    }

    const petalColors = [
      'rgba(248, 245, 238, 0.75)', // Warm Ivory
      'rgba(238, 225, 218, 0.65)', // Pale Blush
      'rgba(216, 199, 170, 0.6)',  // Champagne Beige
      'rgba(182, 154, 104, 0.45)', // Muted Gold
      'rgba(253, 251, 247, 0.8)',  // Off White
    ];

    const petals: Petal[] = [];
    const count = Math.min(density, 36);

    for (let i = 0; i < count; i++) {
      const isDust = i % 3 === 0;
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isDust ? Math.random() * 2 + 1 : Math.random() * 8 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        speedX: (Math.random() - 0.5) * 0.4 + 0.3,
        speedY: Math.random() * 0.5 + 0.4,
        opacity: Math.random() * 0.5 + 0.3,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        type: isDust ? 'dust' : 'petal',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Wrap around screen boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'dust') {
          // Floating golden shimmer dust particle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(216, 199, 170, 0.8)';
          ctx.fill();
        } else {
          // Delicate organic flower petal shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.5, p.size * 0.8, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.7, -p.size * 0.5, 0, -p.size);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(216, 199, 170, 0.3)';
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      aria-hidden="true"
    />
  );
};
