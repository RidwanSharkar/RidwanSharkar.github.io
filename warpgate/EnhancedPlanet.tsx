import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader } from 'three';
import { Html } from '@react-three/drei';
import Moon from './Moon';
import * as THREE from 'three';
import { CelestialObjectGlow } from './CelestialObjectGlow';

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
    inclination?: number; 
  }[]; 
  size: number;
  rotationSpeed?: number; 
  moons?: MoonData[]; 
  logoTexturePath?: string; 
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
  rotationSpeed = 0.01,
  moons,
  link,
  label,
  logoTexturePath,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const logoTexture = useLoader(
    TextureLoader,
    logoTexturePath || '/textures/transparent.png' // TEMP
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;

      // PLANET ROTATION
      meshRef.current.rotation.y += rotationSpeed;

      // COLLISION
      const distance = meshRef.current.position.length();
      if (distance < 0.1) { // placeholder logic
        onCollision(index);
      }
    }
  });

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  // STORM?
  const logoRef = useRef<Mesh>(null);

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // storm effect rotation speed
    }
  });

  return (
    <group>
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

        {hovered && (
          <CelestialObjectGlow 
            color={planetColor} 
            size={size} 
            intensity={0.4} 
          />
        )}

        {/* If Multiple rings */}
        {rings && rings.map((ring, idx) => (
          <mesh 
            key={idx} 
            rotation={new Euler(
              ring.inclination || 0, // Inclination - around X-axis 
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
              opacity={0.8} // Ring Transparency
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

        {/* Render Logo only on hover */}
        {hovered && logoTexturePath && (
          <mesh
            ref={logoRef}
            position={[0, size + 0.5, 0]} // LOGO POSITION** above planet
            rotation={[0, 0, 0]}
            scale={[0.7, 0.7, 0.7]} // LOGO SIZING**
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}

        {/* Tooltip */}
        {hovered && (
          <Html
            distanceFactor={10}
            position={[0, size + 1.5, 0]}
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
    </group>
  );
};

export default EnhancedPlanet;
