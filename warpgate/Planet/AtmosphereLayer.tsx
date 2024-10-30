// src/components/Planet/AtmosphereLayer.tsx
import React from 'react';
import { AtmosphereShaderMaterial } from './shaders/atmosphereShader';

const AtmosphereLayer: React.FC = () => (
  <mesh scale={[1.1, 1.1, 1.1]}>
    <sphereGeometry args={[1, 64, 64]} />
    <primitive attach="material" object={AtmosphereShaderMaterial} />
  </mesh>
);

export default AtmosphereLayer;
