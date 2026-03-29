
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useTheme } from './ThemeContext';

// Fix: Define component aliases for Three.js intrinsic elements to resolve TypeScript "Property does not exist on type 'JSX.IntrinsicElements'" errors.
// This allows the use of capitalized components which bypasses the strict intrinsic element check.
const Fog = 'fog' as any;
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

export const Hero3DScene = () => {
  const { theme } = useTheme();
  
  // Theme-aware fog color
  // Light: #f1f5f9 (slate-100)
  // Dark: #0f172a (slate-900)
  const fogColor = theme === 'dark' ? '#0f172a' : '#f1f5f9';

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        {/* Deep Slate Fog for Seamless Blend with CSS Background */}
        {/* Fix: Using capitalized alias to resolve JSX element type error for 'fog' */}
        <Fog attach="fog" args={[fogColor, 5, 25]} />
        
        {/* Fix: Using capitalized alias to resolve JSX element type error for 'ambientLight' */}
        <AmbientLight intensity={0.5} />
        {/* Fix: Using capitalized alias to resolve JSX element type error for 'spotLight' */}
        <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#38bdf8" castShadow />
        {/* Fix: Using capitalized alias to resolve JSX element type error for 'pointLight' */}
        <PointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        
        {/* No geometry - just pure atmosphere and lighting ready for potential future assets */}
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
