import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { SkillNode3D } from '../../types';
import * as THREE from 'three';

interface ConnectionLinesProps {
  nodes: SkillNode3D[];
  animProgress: number;
}

export function ConnectionLines({ nodes, animProgress }: ConnectionLinesProps) {
  const lines = useMemo(() => {
    const result: { points: [number, number, number][] }[] = [];
    const MAX_ANGLE = 0.8; // radians

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        // Only connect same-category skills
        if (a.skill.category !== b.skill.category) continue;

        const va = new THREE.Vector3(...a.position).normalize();
        const vb = new THREE.Vector3(...b.position).normalize();
        const angle = va.angleTo(vb);

        if (angle < MAX_ANGLE) {
          result.push({
            points: [
              [a.position[0] * animProgress, a.position[1] * animProgress, a.position[2] * animProgress],
              [b.position[0] * animProgress, b.position[1] * animProgress, b.position[2] * animProgress],
            ],
          });
        }
      }
    }
    return result;
  }, [nodes, animProgress]);

  if (animProgress < 0.3) return null;

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color="#7c3aed"
          lineWidth={0.5}
          transparent
          opacity={0.15 * animProgress}
        />
      ))}
    </>
  );
}
