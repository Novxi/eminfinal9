import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Magnetic Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics for the magnetic pull
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Liquid Light Position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic Calculation (pulls button towards cursor)
    const pullStrength = 0.35; // How strong the magnet is
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * pullStrength);
    y.set(distanceY * pullStrength);

    // Liquid Light Calculation (relative to button)
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // Reset light to center or fade out logic could go here
  };

  // Dynamic Backgrounds based on Liquid Light
  const liquidLight = useMotionTemplate`radial-gradient(
    150px circle at ${mouseX}px ${mouseY}px,
    rgba(255, 255, 255, 0.4),
    transparent 80%
  )`;

  const baseStyles = "relative px-8 py-4 rounded-full font-semibold tracking-wide overflow-hidden transition-colors duration-300 flex items-center justify-center gap-2 group cursor-pointer active:scale-95";

  // Visual Styles
  const variants = {
    // White/Blue Liquid Glass
    primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
    // Dark Liquid Glass
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
    // Pure Glass
    glass: "bg-background/50 backdrop-blur-md border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props as any}
    >
      {/* Liquid Light Layer */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: liquidLight }}
      />
      
      {/* Glossy Overlay Reflection (Static top sheen) */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};