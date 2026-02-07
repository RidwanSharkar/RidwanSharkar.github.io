// EnhancedPlanetGroup.tsx
import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import EnhancedPlanet from './EnhancedPlanet';
import Sun from './Sun';
import Explosion from './Explosion';
import { Vector3, DoubleSide, Mesh } from 'three';
import { extend } from '@react-three/fiber';
import { AsteroidField } from './AsteroidField';
import { OrbitControls, TransformControls } from 'three-stdlib';
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
  verticalOrbit?: boolean;
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
  position: Vector3;
  color: string;
  id: number;
}

//========================================================================================================
const EnhancedPlanetGroup: React.FC<EnhancedPlanetGroupProps> = ({ onSelectPlanet, selectedPlanet }) => {
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const planetRefs = useRef<Array<React.RefObject<Mesh>>>([]);

  const planets: PlanetData[] = useMemo(() => [
    // PLANET 1: SPOTIFY
    {
      position: [0, 0, 0],
      link: 'https://open.spotify.com/user/1268486981',
      label: 'Spotify',
      description: 'getPlaylists()',
      orbitRadius: 2,
      orbitSpeed: 0.7,
      startAngle: (Math.PI),
      planetColor: '#FFCAE2',
      size: 0.225,
      rotationSpeed: 0.005,
      logoTexturePath: '/textures/Spotify_logo.svg',
    },
    // PLANET 2: LINKEDIN
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/ridwansharkar',
      label: 'LinkedIn', 
      description: 'connect()',
      orbitRadius: 3.33,
      orbitSpeed: 0.375,
      planetColor: '#4FB8FF',
      size: 0.375,
      rotationSpeed: 0.01,
      moons: [
        {
          orbitRadius: 0.75,
          orbitSpeed: 2.25,
          size: 0.1125,
          moonColor: '#E8E9ED',
          link: 'https://www.youtube.com/@ridwansharkar638',
          label: 'YouTube',
        },
      ],
      rings: [
        { color: '#00FFFF', innerScale: 1.3, outerScale: 1.45, inclination: -Math.PI / 3 }
      ],
      logoTexturePath: '/textures/LinkedIn_logo.svg', 
    },
    // AVERNUS AND EIDOLON
    {
      position: [0, 0, 0],
      link: 'https://eidolon-flame.vercel.app/',
      label: 'Eidolon', 
      description: 'play()',
      orbitRadius: 5.25,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#2DE1FC', // 809BCE FFA1CB
      size: 0.25,
      rotationSpeed: 0.01,
      rings: [
        { color: '#2DE1FC', innerScale: 1.25, outerScale: 1.6, inclination: Math.PI  }, 
      ],
      logoTexturePath: '/textures/Eidolon_logo.svg', 
      isBinary: true,
      binaryOffset: 0.55,
      binarySpeed: 2.15,
    },
    // avernus 
    {
      position: [0, 0, 0],
      link: 'https://avernus.vercel.app/',
      label: "Avernus",
      description: 'play()',
      orbitRadius: 5.25,
      orbitSpeed: 0.125,
      startAngle: (Math.PI),
      planetColor: '#BAB9FF', //FF8E9F
      size: 0.275,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Nutrimancer_logo.svg',
      isBinary: true,
      binaryOffset: -0.55,
      binarySpeed: 2.15,
    },
    // PLANET 3: GITHUB
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      description: 'viewProjects(), collaborate()',
      orbitRadius: 5.25,
      orbitSpeed: 0.125,
      startAngle: 0,
      planetColor: '#A55BFF',
      rings: [
        { color: '#CCA2FF', innerScale: 1.25, outerScale: 1.40, inclination: 0 }, 
        { color: '#CCA2FF', innerScale: 1.5, outerScale: 1.85, inclination: Math.PI / 2 },
      ],
      size: 0.525,
      rotationSpeed: 0.010,
      moons: [
        { 
          orbitRadius: 1,
          orbitSpeed: 3,
          size: 0.10,
          moonColor: '#D9C6E8',
          link: 'https://github.com/RidwanSharkar/The-Nutrimancers-Codex',
          label: 'The Nutrimancer\'s Codex',
        },
        { 
          orbitRadius: 1.3,
          orbitSpeed: 2.25,
          size: 0.14,
          moonColor: '#A0C4E2',
          link: 'https://github.com/RidwanSharkar/Pharmacological-Compound-Classifier',
          label: 'Compound Classifier',
        },
        { 
          orbitRadius: 1.59,
          orbitSpeed: 1.75,
          size: 0.10,
          moonColor: '#FFA1CB',
          link: 'https://github.com/RidwanSharkar/Arbitrage-Better',
          label: 'MMA Arbitrager',
        },
        {
          orbitRadius: 1.3,
          orbitSpeed: 2.25,
          size: 0.11,
          moonColor: '#B8B3E9',
          link: 'https://github.com/RidwanSharkar/Erebus',
          label: 'Erebus',
          startAngle: Math.PI
        },
      ],
      logoTexturePath: '/textures/Github_logo.svg',
    },

    // PLANET 5:  MYTHOS
    {
      position: [0, 0, 0],
      link: 'https://ridwansharkar.com',
      label: 'Mythos',
      description: 'browse(), buy()',
      orbitRadius: 7,
      orbitSpeed: 0.2,
      planetColor: '#84DCC6', // 2DE1FC B8E0D2
      rings: [
        { color: '#2DE1FC', innerScale: 1.3, outerScale: 1.75, inclination: -Math.PI }, 
      ],
      size: 0.30,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/mythos.png',
    },
    
    // PLANET 4: IG ART STATION
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      description: 'carveWood()', 
      orbitRadius: 8.5,
      orbitSpeed: 0.23,
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
          size: 0.098,
          moonColor: '#CDCDCE',
          link: 'https://www.artstation.com/ridwansharkar',
          label: 'Art Station',
        },
        {
          orbitRadius: 0.5,
          orbitSpeed: 1.8,
          size: 0.0775,
          moonColor: '#E8E9ED',
          link: 'https://www.facebook.com/MythosCarver/',
          label: 'Facebook',
          verticalOrbit: true,
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
      orbitRadius: 8.5, 
      orbitSpeed: 0.23, 
      startAngle: Math.PI, 
      planetColor: '#809BCE',
      rings: [
        { color: '#70A2FF', innerScale: 1.5, outerScale: 1.75, inclination: Math.PI / 2 },
      ],
      size: 0.325,
      rotationSpeed: 0.01,
      logoTexturePath: '/textures/Threads_logo.svg',
    },
    // PLANET 9: FRETBOARD-EXPLORER
    {
      position: [0, 0, 0],
      link: 'https://ridwansharkar.github.io/Fretboard-Explorer/',
      label: 'Fretboard-x',
      description: 'learnGuitar()',
      orbitRadius: 10,
      orbitSpeed: 0.275,
      planetColor: '#FFD0BA',
      size: 0.23,
      rotationSpeed: 0.005,
      logoTexturePath: '/textures/Fretboardx_logo.png',
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
      {uniqueOrbitRadii.slice(0, -1).map((orbitRadius, index) => (
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
            side={DoubleSide}
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
