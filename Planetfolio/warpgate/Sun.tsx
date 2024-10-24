import React, { forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color } from 'three';
import * as THREE from 'three';

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

interface PhysicsState {
  velocity: THREE.Vector3;
  mass: number;
  lastCollisionTime: number;
  fragments: Fragment[];
}

interface Fragment {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  size: number;
  color: string;
}

interface SunProps {
  size?: number;
  color?: string | THREE.Color;
  glowIntensity?: number;
  rotationSpeed?: number;
  emissiveIntensity?: number;
}

const Sun = forwardRef<Mesh, SunProps>(({
  size = 1.10,
  color = "#FDB813",
  glowIntensity = 0.2,
  rotationSpeed = 0.001,
  emissiveIntensity = 0.7,
}, ref) => {
  const glowRef = React.useRef<Mesh>(null!);
  
  // DISCONTINUED repulsive force**
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.rotation.y += rotationSpeed;
      
      const sunPosition = ref.current.position;
      const repulsiveForce = 0.5; // force strength
      const minDistance = size * 2; // min safe distance
      
      ref.current.parent?.traverse((child) => {
        if (child instanceof THREE.Mesh && child !== ref.current && child !== glowRef.current) {
          const distance = child.position.distanceTo(sunPosition);
          if (distance < minDistance) {
            const direction = child.position.clone().sub(sunPosition).normalize();
            const force = repulsiveForce * (1 - distance / minDistance);
            const physicsState = child.userData.physicsState as PhysicsState;
            if (physicsState?.velocity) {
              physicsState.velocity.add(direction.multiplyScalar(force));
            }
          }
        }
      });
    }
    
    // Glow
    const glowMaterial = glowRef.current?.material as ShaderMaterial;
    if (glowMaterial?.uniforms) {
      glowMaterial.uniforms.intensity.value = 1.0 + Math.sin(t) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={glowRef} scale={size * 1.01}>
        <sphereGeometry args={[size, 32, 32]} />
        <shaderMaterial
          transparent
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            glowColor: { value: new Color(color) },
            intensity: { value: glowIntensity }
          }}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
});

Sun.displayName = 'Sun';

export default Sun;
