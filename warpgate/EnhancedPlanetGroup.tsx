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
      orbitRadius: 2.1,
      orbitSpeed: 1.1,
      planetColor: '#fc8dad', // f0a5ab                                   <<<<<<<<<<<<<<<<<<<<<<<<<<<<< 1 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      size: 0.22,
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
      planetColor: '#4FB8FF', // 9eccfa 7692FF 06AED5*** 5EC2B7           <<<<<<<<<<<<<<<<<<<<<<<<<<<<< 2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      size: 0.325,
      rotationSpeed: 0.01, 
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },
    //-----------------------------------------------------------------
    // PLANET 3: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      description: 'collaborate()',
      orbitRadius: 5.33,
      orbitSpeed: 0.15,
      planetColor: '#8980F5', // 4591f1  7692FF                           <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 3 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      rings: [
        { color: '#42F2F7', innerScale: 1.25, outerScale: 1.45, inclination: 0 }, 
        { color: '#42F2F7', innerScale: 1.5, outerScale: 1.7, inclination: Math.PI / 2 }, // Perpendicular
      ],
      size: 0.385,
      rotationSpeed: 0.010,
      moons: [
        { // Moon 1: Predictive Analysis
          orbitRadius: 0.85,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#42F2F7',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'Predictive Analysis',
        },
        { // Moon 2: Compound Classifier
          orbitRadius: 1.2,
          orbitSpeed: 1.0,
          size: 0.1675,
          moonColor: '#80ED99',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { // Moon 3: MMA Arbitrager
          orbitRadius: 1.6,
          orbitSpeed: 2.2,
          size: 0.13,
          moonColor: '#D295BF',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg', 
    },
    //-----------------------------------------------------------------
    // PLANET 4: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'carveWood()', 
      orbitRadius: 8,
      orbitSpeed: 0.2,
      planetColor: '#2DE1FC', // 91C499 BEFFC7   41EAD4                   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 4 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      rings: [
        { color: '#2DE1FC', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.36,
      rotationSpeed: 0.001,
      moons: [
        {
          orbitRadius: 1.2,
          orbitSpeed: 2,
          size: 0.125,
          moonColor: '#91F5AD',
          link: 'https://www.artstation.com/ridwansharkar',
          label: 'Art Station',
        },
      ],
      logoTexturePath: '/textures/Instagram_logo.svg',
    },
    //-----------------------------------------------------------------
    // PLANET 5: OLD MYTHOS SITE
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Mythos.store',
      description: 'browse()',
      orbitRadius: 10,
      orbitSpeed: 0.3,
      planetColor: '#FFAAEE', // C880B7                                   <<<<<<<<<<<<<<<<<<<<<<<<<<<<< 5 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      rings: [
        { color: '#fec2e6', innerScale: 1.3, outerScale: 1.75, inclination: -Math.PI }, 
      ],
      size: 0.3,
      rotationSpeed: 0.01,
      moons: [
        {
          orbitRadius: 0.9,
          orbitSpeed: 4,
          size: 0.10,
          moonColor: '#66C3FF',  
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
