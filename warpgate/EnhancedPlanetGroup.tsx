import React, { useState, Suspense } from 'react';
import EnhancedPlanet from './EnhancedPlanet';
import Sun from './Sun';
import Explosion from './Explosion';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

import { OrbitControls, TransformControls } from 'three-stdlib';
extend({ OrbitControls, TransformControls });

interface EnhancedPlanetGroupProps {
  onSelectPlanet: (index: number, planet: PlanetData) => void;
  selectedPlanet: { index: number; planet: PlanetData } | null;
}

interface MoonData {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
}

export interface PlanetData {
  position: [number, number, number];
  link: string;
  label: string;
  description: string; 
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
  position: THREE.Vector3;
  color: string;
  id: number;
}

//========================================================================================================

const EnhancedPlanetGroup: React.FC<EnhancedPlanetGroupProps> = ({ onSelectPlanet, selectedPlanet }) => {
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);

  const planets: PlanetData[] = [

    // PLANET 1: FRETBOARDX
    {
      position: [0, 0, 0],
      link: 'https://fretboardx.com',
      label: 'Fretboard-x', 
      description: 'explore()',
      orbitRadius: 2.2,
      orbitSpeed: 1.1,
      planetColor: '#95B8D1',
      size: 0.23,
      rotationSpeed: 0.02, 
      logoTexturePath: '/textures/Fretboardx_logo.png', 
    },


    //-----------------------------------------------------------------

    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.25,
      orbitSpeed: 0.60,
      planetColor: '#9eccfa',
      size: 0.35,
      rotationSpeed: 0.01, 
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },
    
    //-----------------------------------------------------------------

    // PLANET 3: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      description: 'browse()',
      orbitRadius: 5.5,
      orbitSpeed: 0.15,
      planetColor: '#4591f1', 
      rings: [
        { color: 'white', innerScale: 1.20, outerScale: 1.35, inclination: 0 }, 
        { color: 'white', innerScale: 1.4, outerScale: 1.7, inclination: Math.PI / 2 }, // Perpendicular
      ],
      size: 0.4,
      rotationSpeed: 0.010,
      moons: [
        { // Moon 1: Predictive Analysis
          orbitRadius: 0.85,
          orbitSpeed: 3,
          size: 0.11,
          moonColor: '#3ad8ff',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'MMA Analysis',
        },
        { // Moon 2: Compound Classifier
          orbitRadius: 1.2,
          orbitSpeed: 0.2,
          size: 0.18,
          moonColor: '#80FF72',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { // Moon 3: MMA Arbitrager
          orbitRadius: 1.6,
          orbitSpeed: 2.2,
          size: 0.15,
          moonColor: '#f0a5ab',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg', 
    },
    
    //-----------------------------------------------------------------

    // PLANET 3: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'cutWood()',
      orbitRadius: 8,
      orbitSpeed: 0.2,
      planetColor: '#B8E0D2', 
      rings: [
        { color: '#BAD29F', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.42,
      rotationSpeed: 0.001,
      moons: [
        {
          orbitRadius: 1.2,
          orbitSpeed: 2.5,
          size: 0.16,
          moonColor: '#EAC4D5',
          link: 'https://www.artstation.com/ridwansharkar',
          label: 'Art Station',
        },
      ],
      logoTexturePath: '/textures/Instagram_logo.svg',
    },
    
    //-----------------------------------------------------------------

    // PLANET 4: OLD MYTHOS SITE
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Mythos.store',
      description: 'browse() and buy()',
      orbitRadius: 10,
      orbitSpeed: 0.3,
      planetColor: '#fec99e',
      rings: [
        { color: '#ffe7ce', innerScale: 1.1, outerScale: 1.6, inclination: -Math.PI }, 
      ],
      size: 0.3,
      rotationSpeed: 0.05,
      moons: [
        {
          orbitRadius: 0.9,
          orbitSpeed: 5,
          size: 0.15,
          moonColor: '#53F4FF',
          link: 'https://www.facebook.com/mythoscarver/',
          label: 'Facebook',
        },
      ],
      logoTexturePath: '/textures/Mythos_logo.png',
    },
  ]; 

  //========================================================================================================

  const handleCollision = (index: number) => {
    const planet = planets[index];
    const currentTime = Date.now();
    const explosionPosition = new Vector3(
      Math.cos(currentTime * planet.orbitSpeed) * planet.orbitRadius,
      0,
      Math.sin(currentTime * planet.orbitSpeed) * planet.orbitRadius
    );

    const newExplosion: ExplosionData = {
      position: explosionPosition,
      color: planet.planetColor,
      id: currentTime,
    };

    setExplosions((prev) => [...prev, newExplosion]);
    setTimeout(() => {
      setExplosions((prev) => prev.filter((exp) => exp.id !== newExplosion.id));
    }, 2000);
  };

  return (
    <Suspense fallback={null}> 
    
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

      {planets.map((planet, index) => (
        <EnhancedPlanet
          key={index}
          {...planet}
          index={index}
          onCollision={handleCollision}
          onSelectPlanet={onSelectPlanet} 
          selected={selectedPlanet?.index === index} 
        />
      ))}

      {/* Render explosions - dormant */}
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
