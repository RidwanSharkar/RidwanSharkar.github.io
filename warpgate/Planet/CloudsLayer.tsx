// src/components/Planet/CloudsLayer.tsx
import React, { useRef } from 'react';
import { CloudsShaderMaterial } from './shaders/cloudsShader';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CloudsLayer: React.FC = () => {
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    CloudsShaderMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={cloudsRef} scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive attach="material" object={CloudsShaderMaterial} />
    </mesh>
  );
};

export default CloudsLayer;
