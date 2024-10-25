// EnhancedPlanetGroup.tsx
import React, { useState, Suspense } from 'react';
import EnhancedPlanet from './EnhancedPlanet';
import Sun from './Sun';
import Explosion from './Explosion';
import { Vector3 } from 'three';
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
    inclination?: number; 
  }[]; 
  size: number;
  rotationSpeed?: number; 
  moons?: MoonData[];
  logoTexturePath?: string; 
}

interface ExplosionData {
  position: Vector3;
  color: string;
  id: number;
}

const EnhancedPlanetGroup: React.FC = () => {
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);

  
  const planets: PlanetData[] = [
    // PLANET 1: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/RidwanSharkar',
      label: 'LinkedIn',
      orbitRadius: 2.75,
      orbitSpeed: 0.75,
      planetColor: '#60AFFF',
      size: 0.40,
      rotationSpeed: 0.02, 
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },


    // PLANET 2: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      orbitRadius: 5.0,
      orbitSpeed: 0.1,
      planetColor: '#0d1117', 
      rings: [
        { color: '#73ced4', innerScale: 1.1, outerScale: 1.3, inclination: 0 }, 
        { color: '#d2fbfd', innerScale: 1.4, outerScale: 1.6, inclination: Math.PI / 2 }, // Perpendicular
      ],
      size: 0.4,
      rotationSpeed: 0.010,
      moons: [
        { // Moon 1: Fretboard Explorer 
          orbitRadius: 1.0,
          orbitSpeed: 2.0,
          size: 0.18,
          moonColor: '#d2fbfd',
          link: 'https://fretboardx.com',
          label: 'Fretboard Explorer',
        },
        { // Moon 2: Nimbus Weather App
          orbitRadius: 1.38,
          orbitSpeed: 1.5,
          size: 0.12,
          moonColor: '#3ad8ff',
          link: 'http://nimbusweatherapp.com',
          label: 'Nimbus Weather',
        },
        { // Moon 3: Compound Classifier
          orbitRadius: 1.75,
          orbitSpeed: 0.9,
          size: 0.15,
          moonColor: '#80FF72',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier.com',
          label: 'Compound Classifier',
        },
        { // Moon 4: MMA Arbitrager
          orbitRadius: 2.1,
          orbitSpeed: 0.1,
          size: 0.11,
          moonColor: '#f0a5ab',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg', 
    },

    // PLANET 3: ARTSTATION IG
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      orbitRadius: 8,
      orbitSpeed: 0.2,
      planetColor: '#BDA0BC', 
      rings: [
        { color: '#BAD29F', innerScale: 1.1, outerScale: 1.4, inclination: -Math.PI / 6 }, // -30 degrees
      ],
      size: 0.5,
      rotationSpeed: 0.03,
      moons: [
        {
          orbitRadius: 1.2,
          orbitSpeed: 2.5,
          size: 0.16,
          moonColor: '#EAC4D5',
          link: 'https://https://www.artstation.com/ridwansharkar',
          label: 'Art Station',
        },
      ],
      logoTexturePath: '/textures/Instagram_logo.svg',
    },


    // PLANET 4: OLD MYTHOS SITE
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Art Portfolio',
      orbitRadius: 10,
      orbitSpeed: 0.3,
      planetColor: '#fec99e',
      rings: [
        { color: '#ffe7ce', innerScale: 1.1, outerScale: 1.4, inclination: -Math.PI / 3 }, 
      ],
      size: 0.4,
      rotationSpeed: 0.01,
      moons: [
        {
          orbitRadius: 1.0,
          orbitSpeed: 4.0,
          size: 0.15,
          moonColor: '#53F4FF',
          link: 'https://www.facebook.com/MythosCarver/',
          label: 'Facebook',
        },
      ],
      logoTexturePath: '/textures/Mythos_logo.jpg',
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

    // Remove after
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id));
    }, 2000);
  };

  return (
    <Suspense fallback={null}> {/* Suspense boundary */}
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
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide}/>
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
    </Suspense>
  );
};

export default EnhancedPlanetGroup;
