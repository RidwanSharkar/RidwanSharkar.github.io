// EnhancedPlanetGroup.tsx
import React, { useState } from 'react';
import EnhancedPlanet from './HDplanet'; // Correct import path
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
  ringColor?: string;
  size: number;
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
      orbitSpeed: 0.3,
      planetColor: '#0077B5', // LinkedIn blue
      size: 0.8,
    },
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      orbitRadius: 6,
      orbitSpeed: 0.2,
      planetColor: '#6e5494', // GitHub purple
      ringColor: '#4078c0', // GitHub blue
      size: 1,
    },
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Art Portfolio',
      orbitRadius: 8,
      orbitSpeed: 0.15,
      planetColor: '#FF6B6B', // Coral red
      size: 1.2,
    },
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      orbitRadius: 10,
      orbitSpeed: 0.1,
      planetColor: '#E4405F', // Instagram pink
      ringColor: '#FCAF45', // Instagram yellow
      size: 0.9,
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

      {planets.map((planet, index) => (
        <EnhancedPlanet
          key={index}
          {...planet}
          index={index}
          onCollision={handleCollision}
        />
      ))}

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
