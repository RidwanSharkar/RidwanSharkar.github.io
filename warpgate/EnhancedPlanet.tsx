import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader } from 'three';
import Moon from './Moon';
import * as THREE from 'three';
import { CelestialObjectGlow } from './CelestialObjectGlow';
import { PlanetData } from './EnhancedPlanetGroup';

interface EnhancedPlanetProps extends PlanetData {
  index: number;
  onCollision: (index: number) => void;
  onSelectPlanet: (index: number, planet: PlanetData) => void;
  selected: boolean;
}

const EnhancedPlanet: React.FC<EnhancedPlanetProps> = ({ 
  planetColor, 
  size,
  index,
  onCollision,
  onSelectPlanet,
  selected,
  link,
  label,
  description,
  orbitRadius,
  orbitSpeed,
  rings,
  rotationSpeed = 0.01,
  moons,
  logoTexturePath,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const logoTexture = useLoader(
    TextureLoader,
    logoTexturePath || '/textures/transparent.png'
  );

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;

      // Planet rotation
      meshRef.current.rotation.y += rotationSpeed;

      // Collision detection placeholder logic
      const distance = meshRef.current.position.length();
      if (distance < 0.1) { 
        onCollision(index);
      }
    }
  });

  const handleClick = () => {
    onSelectPlanet(index, { 
      position: [0, 0, 0], 
      link,
      label,
      description,
      orbitRadius,
      orbitSpeed,
      planetColor,
      rings,
      size,
      rotationSpeed,
      moons,
      logoTexturePath,
    });
  };

  const logoRef = useRef<Mesh>(null);

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Logo rotation speed
    }
  });

  useEffect(() => {
    console.log(`Planet ${index} selected: ${selected}`);
  }, [selected, index]);

  useEffect(() => {
    if (selected) {
      document.body.style.cursor = 'pointer';
    } else if (!hovered) {
      document.body.style.cursor = 'auto';
    }
  }, [hovered, selected]);

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer'; // Set cursor here for consistency
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          if (!selected) {
            document.body.style.cursor = 'auto'; // Reset cursor if not selected
          }
        }}
        scale={selected ? [1.0, 1.0, 1.0] : [1, 1, 1]} // scale when selected meh
      >
        <sphereGeometry args={[size, 96, 96]} />
        <meshStandardMaterial color={planetColor} />

        {/* HOVER + SELECT GLOW */}
        {(hovered || selected) && (
          <CelestialObjectGlow 
            color={planetColor} 
            size={size} 
            intensity={0.4} 
            isSelected={selected} 
          />
        )}

        {/* Rings */}
        {rings && rings.map((ring, idx) => (
          <mesh 
            key={idx} 
            rotation={new Euler(
              ring.inclination || 0, 
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
              opacity={0.8} 
            />
          </mesh>
        ))}

        {/* Moons */}
        {moons && moons.map((moon, idx) => (
          <Moon
            key={`moon-${idx}`}
            {...moon}
          />
        ))}

        {/* Logo */}
        {(hovered || selected) && logoTexturePath && (
          <mesh
            ref={logoRef}
            position={[0, size + 0.5, 0]} 
            rotation={[0, 0, 0]}
            scale={[0.7, 0.7, 0.7]} 
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}



        
      </mesh>
    </group>
  );
};

export default EnhancedPlanet;
