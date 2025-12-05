import React, { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color, AdditiveBlending, BackSide, DoubleSide } from 'three';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float strength = pow(0.6 - dot(vNormal, vPositionNormal), 3.0);
    gl_FragColor = vec4(glowColor, strength * intensity);
  }
`;

const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
uniform vec3 glowColor;
void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;
}
`;

interface SunProps {
  size?: number;
  color?: string | Color;
  glowIntensity?: number;
  rotationSpeed?: number;
  emissiveIntensity?: number;
}

const Sun = forwardRef<Mesh, SunProps>(({
  size = 1.15,
  color = "#FDB813",
  glowIntensity = 0.2,
  rotationSpeed = 0.001,
  emissiveIntensity = 0.25,
}, ref) => {
  const glowRef = useRef<Mesh>(null!);

  const atmosphereMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(color) }
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.rotation.y += rotationSpeed;
    }

    const glowMaterial = glowRef.current?.material as ShaderMaterial;
    if (glowMaterial?.uniforms) {
      glowMaterial.uniforms.intensity.value = 0.5 + Math.abs(Math.sin(t)) * 0.5; // Pulsing effect??cantnotice
    }
  });

  return (
    <group>
      {/* PointLight for illuminating planets */}
      <pointLight
        color={color}
        intensity={1.25} 
        distance={2000}
        decay={0.7} 
      />



      {/* Atmosphere layer */}
      <mesh
        scale={[1.18, 1.18, 1.18]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Sun sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[size*1.09, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.76}
          metalness={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={size * 1.08}> 
        <sphereGeometry args={[size, 32, 32]} />
        <shaderMaterial
          transparent
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            glowColor: { value: new Color(color) },
            intensity: { value: glowIntensity }
          }}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
});

Sun.displayName = 'Sun';

export default Sun;
