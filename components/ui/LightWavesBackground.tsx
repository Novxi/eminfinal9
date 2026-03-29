import React, { useCallback, useEffect, useRef } from "react";
import { useTheme } from "../ThemeContext";

export interface LightWavesBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
  intensity?: number;
}

interface Wave {
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  opacity: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 14, g: 165, b: 233 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export const LightWavesBackground: React.FC<LightWavesBackgroundProps> = ({
  className = "",
  colors = ["#00d2ff", "#7a5fff", "#00f5d4", "#6366f1", "#0ea5e9"],
  speed = 0.8,
  intensity = 0.7,
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesRef = useRef<Wave[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initWaves = useCallback(
    (height: number) => {
      const waves: Wave[] = [];
      const waveCount = 5;

      for (let i = 0; i < waveCount; i++) {
        waves.push({
          y: height * (0.3 + (i / waveCount) * 0.4),
          amplitude: height * (0.12 + Math.random() * 0.1),
          frequency: 0.0015 + Math.random() * 0.0015,
          speed: (0.15 + Math.random() * 0.2) * (i % 2 === 0 ? 1 : -1),
          phase: Math.random() * Math.PI * 2,
          color: colors[i % colors.length],
          opacity: 0.2 + Math.random() * 0.15,
        });
      }
      wavesRef.current = waves;
    },
    [colors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      initWaves(height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    container.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001 * speed;

      ctx.clearRect(0, 0, width, height);
      
      // Draw ambient background
      // Use CSS variable for background color if possible, or fallback
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      ctx.fillStyle = bgColor || (theme === 'dark' ? "#0f172a" : "#f1f5f9");
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = theme === 'dark' ? "lighter" : "source-over";
      ctx.globalAlpha = theme === 'dark' ? 1 : 0.4;

      // Mouse interactive glow
      const { x: mx, y: my } = mouseRef.current;
      if (mx > -500) {
        const mouseGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 400);
        mouseGradient.addColorStop(0, `rgba(14, 165, 233, ${0.12 * intensity})`);
        mouseGradient.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Static Ambient Glows
      const glowSpots = [
        { x: width * 0.2, y: height * 0.4, radius: width * 0.5, color: colors[0] },
        { x: width * 0.8, y: height * 0.7, radius: width * 0.4, color: colors[1] },
      ];

      for (const spot of glowSpots) {
        const rgb = hexToRgb(spot.color);
        const gradient = ctx.createRadialGradient(
          spot.x + Math.sin(time * 0.5) * 100,
          spot.y + Math.cos(time * 0.3) * 50,
          0,
          spot.x + Math.sin(time * 0.5) * 100,
          spot.y + Math.cos(time * 0.3) * 50,
          spot.radius
        );
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.05 * intensity})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw flowing waves with mouse reactivity
      for (const wave of wavesRef.current) {
        const rgb = hexToRgb(wave.color);
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 10) {
          // Calculate distance to mouse for wave perturbation
          const dx = x - mx;
          const dy = wave.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 300);
          
          const y =
            wave.y +
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * (wave.amplitude * (1 + influence * 0.3)) +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.4) * (wave.amplitude * 0.4);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, height);
        waveGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.opacity * intensity})`);
        waveGradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.opacity * 0.1 * intensity})`);
        waveGradient.addColorStop(1, "transparent");

        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", updateSize);
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colors, speed, intensity, initWaves, theme]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </div>
  );
};
