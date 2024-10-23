// EnhancedPlanet.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Euler } from 'three';
import * as THREE from 'three';
import Moon from './Moon';

interface PlanetData {
  position: [number, number, number];
  link: string;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetColor: string;
  rings?: { 
    color: string; 
    innerScale?: number; 
    outerScale?: number; 
    inclination?: number; // Inclination in radians
  }[]; // Updated for multiple rings
  size: number;
  rotationSpeed?: number; // Optional rotation speed
  moons?: MoonData[]; // Optional moons
}

interface MoonData {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
}

interface EnhancedPlanetProps extends PlanetData {
  index: number;
  onCollision: (index: number) => void;
}

const EnhancedPlanet: React.FC<EnhancedPlanetProps> = ({
  orbitRadius,
  orbitSpeed,
  planetColor,
  rings,
  size,
  index,
  onCollision,
  rotationSpeed = 0.01, // Default rotation speed
  moons,
  link,
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      // Update orbit position
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;

      // Rotate the planet on its own axis (simulating day rotation)
      meshRef.current.rotation.y += rotationSpeed; // Adjust rotation speed as needed

      // Placeholder collision detection logic
      const distance = meshRef.current.position.length();
      if (distance < 0.1) { // Arbitrary condition for collision
        onCollision(index);
      }
    }
  });

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={planetColor} />

      {/* Render multiple rings if any */}
      {rings && rings.map((ring, idx) => (
        <mesh 
          key={idx} 
          rotation={new Euler(
            ring.inclination || 0, // Rotate around X-axis for inclination
            0, 
            0
          )}
        >
          <ringGeometry
            args={[
              size * (ring.innerScale || 1.1),
              size * (ring.outerScale || 1.3),
              32,
            ]}
          />
          <meshStandardMaterial 
            color={ring.color} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={0.8} // Optional: make rings slightly transparent
          />
        </mesh>
      ))}

      {/* Render moons if any */}
      {moons && moons.map((moon, idx) => (
        <Moon
          key={`moon-${idx}`}
          {...moon}
        />
      ))}
    </mesh>
  );
};

export default EnhancedPlanet;
