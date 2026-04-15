import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SkillNode3D } from '../../types';

interface SkillNodeProps {
  node: SkillNode3D;
  animProgress: number; // 0-1, for fly-in animation
}

function SkillNode({ node, animProgress }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef(0);

  const color = useMemo(() => {
    if (node.skill.owned) return '#10b981';
    if (!node.skill.owned && node.skill.trend_label === 'rising') return '#f43f5e';
    return '#374151';
  }, [node.skill.owned, node.skill.trend_label]);

  const emissiveIntensity = useMemo(() => {
    if (node.skill.owned) return 0.4;
    if (!node.skill.owned && node.skill.trend_label === 'rising') return 0.6;
    return 0.1;
  }, [node.skill.owned, node.skill.trend_label]);

  // Current animated position (fly from center)
  const animPos = useMemo<[number, number, number]>(() => {
    const t = Math.min(animProgress, 1);
    return [
      node.position[0] * t,
      node.position[1] * t,
      node.position[2] * t,
    ];
  }, [node.position, animProgress]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Pulse for gap skills
    if (!node.skill.owned && node.skill.trend_label === 'rising') {
      const pulse = 0.3 + 0.25 * (Math.sin(t * Math.PI) + 1);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }

    // Hover scale
    const targetScale = hovered ? 1.5 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Update position for fly-in
    const target = new THREE.Vector3(...animPos);
    meshRef.current.position.lerp(target, 0.08);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <sphereGeometry args={[node.radius, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.2}
        metalness={0.5}
      />
      {hovered && (
        <Html center distanceFactor={8}>
          <div style={{
            background: 'rgba(13,13,20,0.95)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '8px',
            padding: '8px 12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ color: '#f9fafb', fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>
              {node.skill.name}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
              {node.skill.frequency}% of jobs · {node.skill.category}
            </div>
            <div style={{
              marginTop: 4,
              fontSize: '10px',
              color: node.skill.owned ? '#10b981' : '#f43f5e',
              fontFamily: 'Inter, sans-serif',
            }}>
              {node.skill.owned ? '✓ You have this' : '⚠ Gap skill'}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

interface SkillOrbitProps {
  nodes: SkillNode3D[];
  animProgress: number;
}

export function SkillOrbit({ nodes, animProgress }: SkillOrbitProps) {
  return (
    <group>
      {nodes.map((node, i) => (
        <SkillNode
          key={node.skill.name}
          node={node}
          animProgress={animProgress}
        />
      ))}
    </group>
  );
}
