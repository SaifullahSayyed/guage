import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RadarSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 4]} />
      <meshBasicMaterial
        color="#1a1a2e"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
