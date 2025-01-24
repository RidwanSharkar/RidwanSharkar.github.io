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
      planetColor: '#C3F6EE', //C3F6EE
      size: 0.215,
      rotationSpeed: 0.005, 
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
      planetColor: '#FFCAE2',
      rings: [
        { color: 'white', innerScale: 1.2, outerScale: 1.5, inclination: Math.PI / 2 }, 
      ],
      size: 0.26,
      rotationSpeed: 0.005,
      logoTexturePath: '/textures/Spotify_logo.svg',
    },
    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.8,
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
      orbitRadius: 5.75,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#809BCE', // 809BCE FFA1CB
      size: 0.26,
      rotationSpeed: 0.01,
      rings: [
        { color: '#2DE1FC', innerScale: 1.3, outerScale: 1.45, inclination: -Math.PI / 3 }
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
      orbitRadius: 5.75,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#2DE1FC', //2DE1FC 84DCC6
      rings: [
        { color: '#2DE1FC', innerScale: 1.25, outerScale: 1.6, inclination: Math.PI  }, 
      ],
      size: 0.27,
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
      orbitRadius: 5.75,
      orbitSpeed: 0.125,
      startAngle: 0,
      planetColor: '#A55BFF',
      rings: [
        { color: '#FFAAEE', innerScale: 1.25, outerScale: 1.40, inclination: 0 }, 
        { color: '#FFAAEE', innerScale: 1.5, outerScale: 1.65, inclination: Math.PI / 2 },
      ],
      size: 0.525,
      rotationSpeed: 0.010,
      moons: [
        { 
          orbitRadius: 1,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#D9C6E8',
          link: 'https://github.com/RidwanSharkar/Predictive-Analysis-of-MMA-Fights',
          label: 'Predictive Analysis',
        },
        { 
          orbitRadius: 1.3,
          orbitSpeed: 1.5,
          size: 0.155,
          moonColor: '#A0C4E2',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { 
          orbitRadius: 1.65,
          orbitSpeed: 2.2,
          size: 0.12,
          moonColor: '#FFA1CB',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg',
    },

    // PLANET 5:  NEW SITE WIP
    {
      position: [0, 0, 0],
      link: 'https://ridwansharkar.com',
      label: 'Mythos.store',
      description: 'browse(), buy()',
      orbitRadius: 7.5,
      orbitSpeed: 0.1915,
      planetColor: '#F0C59D',
      size: 0.25,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Mythos_logo.png',
    },
    
    // PLANET 4: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'carveWood()', 
      orbitRadius: 9,
      orbitSpeed: 0.19,
      planetColor: '#F4ACB7', 
      rings: [
        { color: '#F694C1', innerScale: 1.4, outerScale: 2.25, inclination: -Math.PI / 2.3 },
      ],
      size: 0.40,
      rotationSpeed: 0.001,
      moons: [
        {
          orbitRadius: 1.0,
          orbitSpeed: 1.8,
          size: 0.11,
          moonColor: '#E8E9ED',
          link: 'https://www.artstation.com/ridwansharkar',
          label: 'Art Station',
        },
      ],
      logoTexturePath: '/textures/Instagram_logo.svg',
    },
    // PLANET 5: SPITTIN
    {
      position: [0, 0, 0],
      link: 'https://www.threads.net/@ridwansharkar?xmt=AQGzF4x6rq9v2Fg46C9dfQy7SBRsEPI9TXRREBqzWHq8xFg',
      label: 'Threads',
      description: 'readDiary()',
      orbitRadius: 10.35,
      orbitSpeed: 0.22,
      planetColor: '#8C8CD1',
      size: 0.28,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Threads_logo.svg',
    },
    // PLANET 6: Eidolon
    {
      position: [0, 0, 0],
      link: 'https://ridwansharkar.github.io/Eidolon/',
      label: 'Eidolon',
      description: 'play()',
      orbitRadius: 11.5,
      orbitSpeed: 0.315,
      planetColor: '#84DCC6', // 2DE1FC B8E0D2
      rings: [
        { color: '#2DE1FC', innerScale: 1.3, outerScale: 1.75, inclination: -Math.PI }, 
      ],
      size: 0.333,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Eidolon_logo.svg',
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
    let interval: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval);
        setExoplanets([]);
      }
    };

    const handleWindowBlur = () => {
      clearInterval(interval);
      setExoplanets([]);
    };

    const handleWindowFocus = () => {
      // Clear any existing interval
      clearInterval(interval);
      // Reset exoplanets
      setExoplanets([]);
      // Start new interval
      interval = setInterval(() => {
        setExoplanets(prev => [...prev, Date.now()]);
      }, 7500);
    };

    // Initial interval setup
    interval = setInterval(() => {
      setExoplanets(prev => [...prev, Date.now()]);
    }, 7500);

    // Add all event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
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
            opacity={0.03} 
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