// EnhancedPlanet.tsx
import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader } from 'three';
import { Html } from '@react-three/drei';
import Moon from './Moon';
import * as THREE from 'three';

interface MoonData {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
}

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
  logoTexturePath?: string; // Path to the logo texture
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
  label,
  logoTexturePath,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load the logo texture; fallback to a transparent texture if not provided
  const logoTexture = useLoader(
    TextureLoader,
    logoTexturePath || '/textures/transparent.png' // Ensure you have a transparent.png in your textures folder
  );

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

  // Optional: Animate the logo's rotation to simulate a storm
  const logoRef = useRef<Mesh>(null);

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Adjust rotation speed for storm effect
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[size, 64, 64]} />
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

      {/* Logo Texture */}
      {logoTexturePath && (
        <mesh
          ref={logoRef}
          position={[0, size + 0.2, 0]} // Position the logo slightly above the planet
          rotation={[0, 0, 0]}
          scale={[0.5, 0.5, 0.5]} // Adjust the size as needed
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent={true} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Label/Tooltip */}
      {hovered && (
        <Html
          distanceFactor={10}
          position={[0, size + 0.5, 0]}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '5px 10px',
            borderRadius: '4px',
            color: 'white',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span>{label}</span>
        </Html>
      )}
    </mesh>
  );
};

export default EnhancedPlanet;
