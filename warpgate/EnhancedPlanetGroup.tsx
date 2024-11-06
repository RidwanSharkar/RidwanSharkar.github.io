// EnhancedPlanetGroup.tsx
import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import EnhancedPlanet from './EnhancedPlanet';
import Sun from './Sun';
import Explosion from './Explosion';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { AsteroidField } from './AsteroidField';
import { OrbitControls, TransformControls } from 'three-stdlib';
import { Mesh } from 'three'; // Ensure Mesh is imported

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
  const planetRefs = useRef<Array<React.RefObject<Mesh>>>([]);

  // 1. Memoize the planets array
  const planets: PlanetData[] = useMemo(() => [
    // PLANET 1: FRETBOARDX
    {
      position: [0, 0, 0],
      link: 'https://fretboardx.com',
      label: 'Fretboard-x', 
      description: 'explore()',
      orbitRadius: 2.1,
      orbitSpeed: 1.1,
      planetColor: '#e88d96',
      size: 0.22,
      rotationSpeed: 0.02, 
      logoTexturePath: '/textures/Fretboardx_logo.png', 
    },
    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.25,
      orbitSpeed: 0.60,
      planetColor: '#4FB8FF',
      size: 0.325,
      rotationSpeed: 0.01,
      rings: [
        { color: '#00FFFF', innerScale: 1.3, outerScale: 1.45, inclination: -Math.PI / 3 }
      ],
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },
    // PLANET 3: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      description: 'collaborate()',
      orbitRadius: 5.33,
      orbitSpeed: 0.15,
      planetColor: '#8980F5',
      rings: [
        { color: '#FFAAEE', innerScale: 1.25, outerScale: 1.40, inclination: 0 }, 
        { color: '#FFAAEE', innerScale: 1.5, outerScale: 1.825, inclination: Math.PI / 2 },
      ],
      size: 0.385,
      rotationSpeed: 0.010,
      moons: [
        { 
          orbitRadius: 0.90,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#E3C0D3',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'Predictive Analysis',
        },
        { 
          orbitRadius: 1.25,
          orbitSpeed: 1.5,
          size: 0.1625,
          moonColor: '#FFAAEE',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { 
          orbitRadius: 1.62,
          orbitSpeed: 2.2,
          size: 0.13,
          moonColor: '#D295BF',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg', 
    },
    // PLANET 4: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'carveWood()', 
      orbitRadius: 8,
      orbitSpeed: 0.2,
      planetColor: '#AFE3C0',
      rings: [
        { color: '#7EE081', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.35,
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
    // PLANET 5: OLD MYTHOS SITE
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Mythos.store',
      description: 'browse()',
      orbitRadius: 10,
      orbitSpeed: 0.3,
      planetColor: '#2DE1FC',
      rings: [
        { color: '#2DE1FC', innerScale: 1.3, outerScale: 1.75, inclination: -Math.PI }, 
      ],
      size: 0.28,
      rotationSpeed: 0.01,
      moons: [
        {
          orbitRadius: 0.9,
          orbitSpeed: 4,
          size: 0.10,
          moonColor: '#a6b5b7',  
          link: 'https://www.facebook.com/mythoscarver/',
          label: 'Facebook',
        },
      ],
      logoTexturePath: '/textures/Mythos_logo.png',
    },
  ], []); 

  // Initialize refs for each planet
  useEffect(() => {
    planetRefs.current = planets.map(() => React.createRef<Mesh>());
  }, [planets.length, planets]);


  const getPlanetPositions = (): Vector3[] => {
    const positions: Vector3[] = [];
    planetRefs.current.forEach(ref => {
      if (ref.current) {
        const worldPosition = new Vector3();
        ref.current.getWorldPosition(worldPosition);
        positions.push(worldPosition.clone());
      } else {
        positions.push(new Vector3(0, 0, 0));
      }
    });
    return positions;
  };



  const getPlanetSizes = (): number[] => {
    return planets.map(planet => planet.size);
  };


  const handleCollision = (planetIndex: number, collisionPosition: Vector3) => {
    const planetRef = planetRefs.current[planetIndex];
    if (planetRef.current) {
      // Remove old explosion immediately
      setExplosions(prev => prev.filter(exp => exp.id !== Date.now()));

      const newExplosion: ExplosionData = {
        position: collisionPosition.clone(), // Clone to prevent reference issues
        color: planets[planetIndex].planetColor,
        id: Date.now(),
      };

      setExplosions(prev => [...prev, newExplosion]);

      // Clean up explosion after animation
      setTimeout(() => {
        setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
      }, 1000);
    }
  };

  return (
    <Suspense fallback={null}> 
      <Sun />
      
      <AsteroidField 
        planetPositions={getPlanetPositions()} 
        planetSizes={getPlanetSizes()}
        onCollision={handleCollision} 
      />
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
          <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide}/>
        </mesh>
      ))}

      {/* collision points */}
      {explosions.map((explosion) => (
        <mesh key={explosion.id} position={explosion.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={explosion.color} />
        </mesh>
      ))}

      {/* Render Planets */}
      {planets.map((planet, index) => (
        <EnhancedPlanet
          key={index}
          {...planet}
          index={index}
          onSelectPlanet={onSelectPlanet} 
          selected={selectedPlanet?.index === index}
          collisionTriggered={false} // Initialize
          ref={planetRefs.current[index]} // tracks position
        />
      ))}


      {/* Render active explosions */}
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          position={explosion.position}
          color={explosion.color}
          size={0.5}
          duration={1}
          particleCount={30}
        />
      ))}
    </Suspense>
  );
};

export default EnhancedPlanetGroup;