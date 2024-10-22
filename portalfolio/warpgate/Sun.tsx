import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial } from 'three';

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

const Sun = () => {
  const sunRef = useRef<Mesh>(null!);
  const glowRef = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Rotate the sun
    sunRef.current.rotation.y += 0.001;
    
    // Pulse the glow
    const glowMaterial = glowRef.current.material as ShaderMaterial;
    glowMaterial.uniforms.intensity.value = 1.0 + Math.sin(t) * 0.2;
  });

  return (
    <group>
      {/* Main sun sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={1}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <shaderMaterial
          transparent
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            glowColor: { value: [1.0, 0.8, 0.3] },
            intensity: { value: 1.0 }
          }}
          blending={2}
          side={2}
        />
      </mesh>
    </group>
  );
};

export default Sun;