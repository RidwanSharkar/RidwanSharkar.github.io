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
  isBinary?: boolean;
  binaryOffset?: number;
  binarySpeed?: number;
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
      orbitRadius: 2.33,
      orbitSpeed: 0.775,
      startAngle: 0,
      planetColor: '#C3F6EE',
      size: 0.29,
      rotationSpeed: 0.02, 
      moons: [
        { 
        orbitRadius: 0.55,
        orbitSpeed: 3.25,
        size: 0.12,
        moonColor: '#B7D3F2',
        link: 'https://github.com/RidwanSharkar/Fretboard-2.0',
        label: 'Fretboard-2.0',
      },
    ],
      logoTexturePath: '/textures/Fretboardx_logo.png', 
    },
    // PLANET 1.5: Spotify
    {
      position: [0, 0, 0],
      link: 'https://open.spotify.com/user/1268486981',
      label: 'Spotify',
      description: 'getPlaylists()',
      orbitRadius: 2.33,
      orbitSpeed: 0.775,
      startAngle: (Math.PI),
      planetColor: '#F9B9F2',
      rings: [
        { color: 'white', innerScale: 1.2, outerScale: 1.5, inclination: Math.PI / 2 }, 
      ],
      size: 0.225,
      rotationSpeed: 0.02,
      logoTexturePath: '/textures/Spotify_logo.svg',
    },
    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.9,
      orbitSpeed: 0.45,
      planetColor: '#4FB8FF',
      size: 0.37,
      rotationSpeed: 0.01,
      rings: [
        { color: '#00FFFF', innerScale: 1.3, outerScale: 1.45, inclination: -Math.PI / 3 }
      ],
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },
    // PLANET 3,25: BORROWED ORDER BINARY SYSTEM
    {
      position: [0, 0, 0],
      link: 'https://ridwansharkar.github.io/Borrowed-Order/',
      label: 'Borrowed Order', 
      description: 'visualize()',
      orbitRadius: 6,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#809BCE',
      size: 0.27,
      rotationSpeed: 0.05,
      rings: [
        { color: '#00FFFF', innerScale: 1.3, outerScale: 1.45, inclination: -Math.PI / 3 }
      ],
      logoTexturePath: '/textures/BorrowedOrder_logo.svg', 
      isBinary: true,
      binaryOffset: 0.6,
      binarySpeed: 2.0,
    },
    // PLANET 3.5: Nutrimancer BINARY 
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar/The-Nutrimancers-Codex',
      label: "The Nutrimancer's Codex - Vol. II",
      description: 'unknown()',
      orbitRadius: 6,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#84DCC6',
      rings: [
        { color: '#7EE081', innerScale: 1.25, outerScale: 1.6, inclination: Math.PI / 4.5 }, 
      ],
      size: 0.3,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Nutrimancer_logo.svg',
      isBinary: true,
      binaryOffset: -0.6,
      binarySpeed: 2.0,
    },
    // PLANET 3: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      description: 'collaborate()',
      orbitRadius: 6,
      orbitSpeed: 0.125,
      startAngle: 0,
      planetColor: '#8980F5',
      rings: [
        { color: '#FFAAEE', innerScale: 1.25, outerScale: 1.40, inclination: 0 }, 
        { color: '#FFAAEE', innerScale: 1.5, outerScale: 1.825, inclination: Math.PI / 2 },
      ],
      size: 0.525,
      rotationSpeed: 0.010,
      moons: [
        { 
          orbitRadius: 1.12,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#D9C6E8',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'Predictive Analysis',
        },
        { 
          orbitRadius: 1.43,
          orbitSpeed: 1.5,
          size: 0.1625,
          moonColor: '#F9B9F2',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { 
          orbitRadius: 1.76,
          orbitSpeed: 2.2,
          size: 0.12,
          moonColor: '#4FB8FF',
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
      orbitRadius: 8.3,
      orbitSpeed: 0.2,
      planetColor: '#F4ACB7',
      rings: [
        { color: '#F694C1', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.40,
      rotationSpeed: 0.001,
      moons: [
        {
          orbitRadius: 1.1,
          orbitSpeed: 1.8,
          size: 0.175,
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
      orbitRadius: 10,
      orbitSpeed: 0.285,
      planetColor: '#2DE1FC',
      rings: [
        { color: '#2DE1FC', innerScale: 1.3, outerScale: 1.75, inclination: -Math.PI }, 
      ],
      size: 0.333,
      rotationSpeed: 0.01,
      moons: [
        {
          orbitRadius: 0.8,
          orbitSpeed: 3,
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
    }, 7500); 

    return () => clearInterval(interval);
  }, []);

  // remove handler
  const removeExoplanet = (id: number) => {
    setExoplanets(prev => prev.filter(exoId => exoId !== id));
  };

  const uniqueOrbitRadii = useMemo(() => {
    const radii = planets.map(planet => planet.orbitRadius);
    return Array.from(new Set(radii));
  }, [planets]);

  return (
    <Suspense fallback={null}> 
      <Sun />
      
      <AsteroidField 
        planetPositions={getPlanetPositions()} 
        planetSizes={getPlanetSizes()}
        onCollision={handleCollision} 
      />
      
      {/* Render unique orbit paths */}
      {uniqueOrbitRadii.map((orbitRadius, index) => (
        <mesh key={`orbit-${index}`} rotation-x={Math.PI / 2}>
          <ringGeometry
            args={[
              orbitRadius,
              orbitRadius + 0.05,
              64,
            ]}
          />
          <meshBasicMaterial 
            color="#ffffff" 
            opacity={0.08} 
            transparent 
            side={THREE.DoubleSide}
          />
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