import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { RadarSphere } from './RadarSphere';
import { SkillOrbit } from './SkillOrbit';
import { ConnectionLines } from './ConnectionLines';
import { useSkillGraph } from '../../hooks/useSkillGraph';
import type { Skill } from '../../types';

interface SceneContainerProps {
  skills: Skill[];
  showGlobe?: boolean;
}

export function SceneContainer({ skills, showGlobe = false }: SceneContainerProps) {
  const nodes = useSkillGraph(skills);
  const [animProgress, setAnimProgress] = useState(0);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  // Fly-in animation when skills change
  useEffect(() => {
    if (skills.length === 0) return;
    setAnimProgress(0);
    const start = Date.now();
    const duration = 900;

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      // Spring-like ease with slight overshoot
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setAnimProgress(Math.min(eased * 1.05, 1));
      if (t < 1) animRef.current = setTimeout(tick, 16);
    };
    animRef.current = setTimeout(tick, 50);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [skills]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      shadows
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#7c3aed" intensity={1.5} />
      <pointLight position={[-5, -3, -5]} color="#10b981" intensity={0.8} />
      <pointLight position={[0, -5, 3]} color="#f43f5e" intensity={0.6} />

      {/* Particle background — always visible */}
      <ParticleField count={2000} />

      {/* Globe + skill nodes — only when analysis is shown */}
      {showGlobe && (
        <>
          <RadarSphere />
          <SkillOrbit nodes={nodes} animProgress={animProgress} />
          <ConnectionLines nodes={nodes} animProgress={animProgress} />
        </>
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
