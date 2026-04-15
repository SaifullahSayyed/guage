import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 2000 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Detect mobile for reduced particle count
  const particleCount = useMemo(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4) {
      return 800;
    }
    return count;
  }, [count]);

  const { positions, velocities, sizes, opacities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const RADIUS = 15;

    for (let i = 0; i < particleCount; i++) {
      // Random point on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * (0.5 + Math.random() * 0.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

      sizes[i] = 0.015 + Math.random() * 0.025;
      opacities[i] = 0.3 + Math.random() * 0.5;
    }
    return { positions, velocities, sizes, opacities };
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position;
    const arr = pos.array as Float32Array;
    const t = clock.getElapsedTime();
    const RADIUS = 15;

    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Mouse influence (subtle drift toward mouse position in world space)
      const dx = mouseRef.current.x * 5 - arr[i * 3];
      const dy = mouseRef.current.y * 5 - arr[i * 3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        arr[i * 3] += dx * 0.0005;
        arr[i * 3 + 1] += dy * 0.0005;
      }

      // Wrap around sphere boundary
      const len = Math.sqrt(arr[i * 3] ** 2 + arr[i * 3 + 1] ** 2 + arr[i * 3 + 2] ** 2);
      if (len > RADIUS) {
        arr[i * 3] *= -0.95;
        arr[i * 3 + 1] *= -0.95;
        arr[i * 3 + 2] *= -0.95;
      }
    }
    pos.needsUpdate = true;

    // Slow Y rotation
    meshRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
