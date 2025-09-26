'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface StarBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarBackground({ 
  intensity = 'medium',
  className = '' 
}: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);

  // Color palette for stars
  const starColors = useMemo(() => [
    '#ffffff', // White
    '#60a5fa', // Blue
    '#34d399', // Green
    '#fbbf24', // Yellow
    '#f472b6', // Pink
    '#a78bfa', // Purple
    '#fb7185', // Rose
    '#22d3ee', // Cyan
    '#f59e0b', // Amber
    '#ec4899', // Fuchsia
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas is properly sized
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars based on intensity
    const starCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 200;
    
    const createStars = () => {
      const stars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Slow drift
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 0.5, // Small stars
          opacity: Math.random() * 0.8 + 0.2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
      return stars;
    };

    starsRef.current = createStars();

    const animate = () => {
      // Draw black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Update twinkle phase
        star.twinklePhase += star.twinkleSpeed;

        // Calculate twinkling opacity
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Create gradient for star glow
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, star.color + Math.floor(currentOpacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, star.color + Math.floor(currentOpacity * 128).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, star.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add subtle glow effect
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, starColors]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className={`fixed inset-0 -z-20 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: '#000000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </motion.div>
  );
}
