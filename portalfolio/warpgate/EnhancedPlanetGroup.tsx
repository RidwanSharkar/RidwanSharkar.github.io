// EnhancedPlanetGroup.tsx
import React, { useState } from 'react';
import EnhancedPlanet from './EnhancedPlanet'; // Correct import path
import Sun from './Sun';
import Explosion from './Explosion';
import { Vector3 } from 'three';

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
}

interface ExplosionData {
  position: Vector3;
  color: string;
  id: number;
}

const EnhancedPlanetGroup: React.FC = () => {
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);

  const planets: PlanetData[] = [
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/RidwanSharkar',
      label: 'LinkedIn',
      orbitRadius: 4,
      orbitSpeed: 0.6,
      planetColor: '#0077B5', // LinkedIn blue
      size: 0.8,
      rotationSpeed: 0.02, // Example rotation speed
    },
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      orbitRadius: 6,
      orbitSpeed: 0.4,
      planetColor: '#6e5494', // GitHub purple
      rings: [
        { color: '#6e5494', innerScale: 1.1, outerScale: 1.3, inclination: 0 }, // First ring: Flat
        { color: '#4078c0', innerScale: 1.4, outerScale: 1.6, inclination: Math.PI / 2 }, // Second ring: Perpendicular
      ],
      size: 0.7,
      rotationSpeed: 0.015,
    },
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Art Portfolio',
      orbitRadius: 8,
      orbitSpeed: 0.3,
      planetColor: '#FF6B6B', // Coral red
      size: 0.6,
      rotationSpeed: 0.025,
    },
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      orbitRadius: 10,
      orbitSpeed: 0.6,
      planetColor: '#E4405F', // Instagram pink
      rings: [
        { color: '#FCAF45', innerScale: 1.1, outerScale: 1.6, inclination: -Math.PI / 6 }, // Second ring: -30 degrees
      ],
      size: 0.9,
      rotationSpeed: 0.018,
    },
  ];

  const handleCollision = (index: number) => {
    const planet = planets[index];
    const currentTime = Date.now();
    const position = new Vector3(
      Math.cos(currentTime * planet.orbitSpeed) * planet.orbitRadius,
      0,
      Math.sin(currentTime * planet.orbitSpeed) * planet.orbitRadius
    );

    const newExplosion: ExplosionData = {
      position,
      color: planet.planetColor,
      id: currentTime,
    };

    setExplosions((prev) => [...prev, newExplosion]);

    // Remove explosion after animation
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id));
    }, 2000);
  };

  return (
    <>
      <Sun />

      {/* Render orbit paths */}
      {planets.map((planet, index) => (
        <mesh key={`orbit-${index}`} rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              planet.orbitRadius,
              planet.orbitRadius + 0.05,
              64,
            ]}
          />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
      ))}

      {/* Render planets */}
      {planets.map((planet, index) => (
        <EnhancedPlanet
          key={index}
          {...planet}
          index={index}
          onCollision={handleCollision}
        />
      ))}

      {/* Render explosions */}
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          position={explosion.position}
          color={explosion.color}
        />
      ))}
    </>
  );
};

export default EnhancedPlanetGroup;
