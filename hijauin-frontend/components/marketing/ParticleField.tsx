'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * WebGL particle field for the hero scene.
 *
 * Represents waste fragments in the four material colors (DESIGN.md §3).
 * Particles settle/pile under gravity on load, respond subtly to time.
 *
 * Guardrails (DESIGN.md §7.3):
 * - Capped particle count
 * - Falls back to static if WebGL unavailable
 * - Pauses when not in viewport (handled by parent IntersectionObserver)
 */

const MATERIAL_COLORS = [
  '#2F7DB8', // plastik
  '#B8873A', // kertas
  '#8A94A0', // logam
  '#4FA6A0', // kaca
];

const PARTICLE_COUNT = 800;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Simple deterministic pseudo-random generator to guarantee pure render
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed + 1) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scattered across view
      positions[i * 3] = (pseudoRandom(i * 3) - 0.5) * 10;
      positions[i * 3 + 1] = (pseudoRandom(i * 3 + 1) - 0.5) * 8;
      positions[i * 3 + 2] = (pseudoRandom(i * 3 + 2) - 0.5) * 5;

      // Deterministic material color
      const colorIndex = Math.floor(pseudoRandom(i * 7) * MATERIAL_COLORS.length);
      const color = new THREE.Color(MATERIAL_COLORS[colorIndex]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Subtle drift — particles slowly settle downward
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 1] -= 0.001; // Gravity

      // Reset if fallen too far
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 5;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation responding to time
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleField() {
  // Check WebGL support
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      // Fallback: static gradient instead of WebGL
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#14140F] via-[#1a1a14] to-[#14140F]" />
      );
    }
  }

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <Particles />
      </Canvas>
    </div>
  );
}
