// warpgate/CelestialObjectGlow.tsx

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Color, AdditiveBlending, DoubleSide, Mesh } from 'three';
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
  const meshRef = useRef<Mesh>(null);

  // Memoize uniforms to prevent recreation on every render
  const uniforms = useMemo(() => ({
    glowColor: { value: new Color(color) },
    intensity: { value: intensity }
  }), [color, intensity]);

  // Cleanup geometry and material on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof ShaderMaterial) {
          meshRef.current.material.dispose();
        }
      }
    };
  }, []);

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
    <mesh ref={meshRef} scale={[1.1, 1.1, 1.1]}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        ref={glowRef}
        transparent
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={uniforms}
        blending={AdditiveBlending}
        side={DoubleSide}
      />
    </mesh>
  );
};
