// CelestialObjectGlow.tsx
import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, ShaderMaterial } from 'three';
import { glowVertexShader, glowFragmentShader } from './Glow';
import * as THREE from 'three';

interface GlowProps {
  color: string;
  size: number;
  intensity?: number;
}

export const CelestialObjectGlow: React.FC<GlowProps> = ({ 
  color, 
  size, 
  intensity = 0.5 
}) => {
  const glowRef = React.useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const glowMaterial = glowRef.current?.material as ShaderMaterial;
    if (glowMaterial?.uniforms) {
      const t = clock.getElapsedTime();
      glowMaterial.uniforms.intensity.value = intensity * (1.0 + Math.sin(t * 2) * 0.1);
    }
  });

  return (
    <mesh ref={glowRef} scale={[1.2, 1.2, 1.2]}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
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