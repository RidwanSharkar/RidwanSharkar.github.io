// warpgate/CelestialObjectGlow.tsx

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Color } from 'three';
import { glowVertexShader, glowFragmentShader } from './Glow';

interface GlowProps {
  color: string;
  size: number;
  intensity?: number;
  isSelected?: boolean;
}

export const CelestialObjectGlow: React.FC<GlowProps> = ({ 
  color, 
  size, 
  intensity = 0.4,
  isSelected = false,
}) => {
  const glowRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const t = clock.getElapsedTime();
      const dynamicIntensity = isSelected 
        ? intensity * 1.1 // intensity when selected
        : intensity * (1.0 + Math.sin(t * 2) * 0.1);
      glowRef.current.uniforms.intensity.value = dynamicIntensity;
    }
  });

  return (
    <mesh scale={[1.1, 1.1, 1.1]}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        ref={glowRef}
        transparent
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={{
          glowColor: { value: new Color(color) },
          intensity: { value: intensity }
        }}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
