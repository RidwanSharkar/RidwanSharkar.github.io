
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

interface PlanetData {
  position: [number, number, number];
  link: string;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetColor: string;
  ringColor?: string;
  size: number;
}

interface EnhancedPlanetProps extends PlanetData {
  index: number;
  onCollision: (index: number) => void;
}

const EnhancedPlanet: React.FC<EnhancedPlanetProps> = ({
  orbitRadius,
  orbitSpeed,
  planetColor,
  ringColor,
  size,
  index,
  onCollision,
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;

      // Placeholder collision detection logic
      const distance = meshRef.current.position.length();
      if (distance < 0.1) { // Arbitrary condition for collision
        onCollision(index);
      }
    }
  });

  return (

    
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={planetColor} />
      {ringColor && (
        <mesh>
          <ringGeometry args={[size * 1.1, size * 1.3, 32]} />
          <meshStandardMaterial color={ringColor} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Orbit path visualization */}
        <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[orbitRadius, orbitRadius + 0.05, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>
    </mesh>
  );
};

export default EnhancedPlanet;
