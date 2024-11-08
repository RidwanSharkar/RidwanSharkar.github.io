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
import { Mesh } from 'three'; 
import Exoplanet from './Exoplanet'; 

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
  initialAngle?: number;
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

  const planets: PlanetData[] = useMemo(() => [
    // PLANET 1: FRETBOARDX
    {
      position: [0, 0, 0],
      link: 'https://fretboardx.com',
      label: 'Fretboard-x', 
      description: 'explore()',
      orbitRadius: 2.25,
      orbitSpeed: 0.7,
      planetColor: '#B7D3F2',
      size: 0.225,
      rotationSpeed: 0.02, 
      moons: [
        { 
        orbitRadius: 0.5,
        orbitSpeed: 3.25,
        size: 0.12,
        moonColor: '#B7D3F2',
        link: 'https://github.com/RidwanSharkar/Fretboard-2.0',
        label: 'Fretboard-2.0',
      },
    ],
      logoTexturePath: '/textures/Fretboardx_logo.png', 
    },
    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.6,
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
      orbitRadius: 5.6,
      orbitSpeed: 0.15,
      startAngle: 0,
      planetColor: '#8980F5',
      rings: [
        { color: '#FFAAEE', innerScale: 1.25, outerScale: 1.40, inclination: 0 }, 
        { color: '#FFAAEE', innerScale: 1.5, outerScale: 1.825, inclination: Math.PI / 2 },
      ],
      size: 0.475,
      rotationSpeed: 0.010,
      moons: [
        { 
          orbitRadius: 1,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#EAC4D5',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'Predictive Analysis',
        },
        { 
          orbitRadius: 1.30,
          orbitSpeed: 1.5,
          size: 0.1625,
          moonColor: '#FFAAEE',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { 
          orbitRadius: 1.65,
          orbitSpeed: 2.2,
          size: 0.13,
          moonColor: '#D295BF',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg',
    },
    // PLANET 3.5: Nutrimancer
    {
      position: [0, 0, 0],  // Starting on the opposite side of the orbit
      link: '',
      label: 'Unknown',
      description: '()',
      orbitRadius: 5.6,
      orbitSpeed: 0.15,
      startAngle: Math.PI,
      planetColor: '#84DCC6', //85FFC7
      rings: [
        { color: '#7EE081', innerScale: 1.25, outerScale: 1.6, inclination: Math.PI / 4.5 }, 
      ],
      size: 0.275,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Nutrimancer_logo.svg',
    },
    // PLANET 4: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'carveWood()', 
      orbitRadius: 8,
      orbitSpeed: 0.2,
      planetColor: '#F4ACB7',
      rings: [
        { color: '#F694C1', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.35,
      rotationSpeed: 0.001,
      moons: [
        {
          orbitRadius: 1.2,
          orbitSpeed: 2,
          size: 0.125,
          moonColor: '#E8E9ED',
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
      description: 'browse(), buy()',
      orbitRadius: 10.75,
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
        // PLANET 6: Spotify
        {
          position: [0, 0, 0],
          link: 'https://open.spotify.com/user/1268486981',
          label: 'Spotify',
          description: 'getPlaylists()',
          orbitRadius: 9.5,
          orbitSpeed: 0.199,
          planetColor: '#F9B9F2',
          rings: [
            { color: 'white', innerScale: 1.2, outerScale: 1.5, inclination: Math.PI / 2 }, 
          ],
          size: 0.22,
          rotationSpeed: 0.02,
          logoTexturePath: '/textures/Spotify_logo.svg',
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

// DORMANT EXPLOSION HANDLER
  const handleCollision = (planetIndex: number, collisionPosition: Vector3) => {
    const planetRef = planetRefs.current[planetIndex];
    if (planetRef.current) {
      setExplosions(prev => prev.filter(exp => exp.id !== Date.now()));



      const newExplosion: ExplosionData = {
        position: collisionPosition.clone(), // clone for ref issues
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

  // State to manage Exoplanets
  const [exoplanets, setExoplanets] = useState<number[]>([]); // Using IDs for keys

  // Create a new Exoplanet every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setExoplanets(prev => [...prev, Date.now()]); // timestamp as unique ID
    }, 15000); // 30000 ms = 30 seconds

    return () => clearInterval(interval);
  }, []);

  // remove handler
  const removeExoplanet = (id: number) => {
    setExoplanets(prev => prev.filter(exoId => exoId !== id));
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

      {/* Render Exoplanets */}
      {exoplanets.map(id => (
        <Exoplanet key={id} onRemove={() => removeExoplanet(id)} />
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