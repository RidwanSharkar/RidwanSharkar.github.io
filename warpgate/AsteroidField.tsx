// AsteroidField.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, MeshStandardMaterial } from 'three';
import { v4 as uuidv4 } from 'uuid';


interface AsteroidProps {
    size: number;
    speed: number;
    orbitRadius: number;
    orbitCenter: Vector3;
    planetPositions: Vector3[];
    planetSizes: number[];
    onCollision: (planetIndex: number, position: Vector3) => void;
    color: string;
}

interface AsteroidData {
    id: string;
    size: number;
    speed: number;
    orbitRadius: number;
    orbitCenter: Vector3;
    color: string;
}

interface AsteroidFieldProps {
    planetPositions: Vector3[];
    planetSizes: number[];
    onCollision: (planetIndex: number, position: Vector3) => void;
}

  
  const Asteroid: React.FC<AsteroidProps> = ({ 
    size, 
    speed, 
    orbitRadius,
    orbitCenter,
    //planetPositions,
    //planetSizes,
   //onCollision,
    color
  }) => {
    const meshRef = useRef<Mesh | null>(null);
    const materialRef = useRef<MeshStandardMaterial | null>(null);
    const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
    const yOffset = useMemo(() => (Math.random() - 0.5) * 2.2, []); // field height 
   // const [hasCollided, setHasCollided] = useState(false);
    //const lastCollisionTime = useRef(0);
    //const collisionsRef = useRef<Set<number>>(new Set());
  
    // Calculate collision point on planet surface
   // const calculateCollisionPoint = (asteroidPos: Vector3, planetPos: Vector3, planetSize: number): Vector3 => {
     // const direction = new Vector3().subVectors(asteroidPos, planetPos).normalize();
    //  return planetPos.clone().add(direction.multiplyScalar(planetSize));
    //};
  
    /* Reset asteroid to a new random position
  const resetAsteroid = (time: number) => {
      if (meshRef.current && materialRef.current) {
        const newAngle = Math.random() * Math.PI * 2;
        const newOrbitRadius = Math.random() > 0.5 ? 
          Math.random() * 5 + 3 : // Inner orbit
          Math.random() * 12 + 8;  // Outer orbit
  
        meshRef.current.position.set(
          orbitCenter.x + Math.cos(newAngle) * newOrbitRadius,
          orbitCenter.y + (Math.random() - 0.5) * 2,
          orbitCenter.z + Math.sin(newAngle) * newOrbitRadius
        );
  
        materialRef.current.color = new Color(color);
        materialRef.current.emissive = new Color('#000000');
        lastCollisionTime.current = time;
        setHasCollided(false);
      }
    };*/
  
    useFrame(({ clock }) => {
      if (!meshRef.current) return;
  
      const time = clock.getElapsedTime();
  
      // if (hasCollided) {
      //   if (time - lastCollisionTime.current > 2) {
      //     resetAsteroid(time);
      //     collisionsRef.current.clear();
      //   }
      //   return;
      // }
  
      const angle = initialAngle + time * speed;
      
   
      meshRef.current.position.x = orbitCenter.x + Math.cos(angle) * orbitRadius;
      meshRef.current.position.y = orbitCenter.y + yOffset;
      meshRef.current.position.z = orbitCenter.z + Math.sin(angle) * orbitRadius;
  

      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
  

      // Commenting out collision detection
      // planetPositions.forEach((planetPos, index) => {
      //   const currentPlanetPos = planetPos.clone();
      //   const distance = meshRef.current!.position.distanceTo(currentPlanetPos);
      //   const collisionThreshold = size + planetSizes[index];
        
      //   if (distance < collisionThreshold && !hasCollided && time - lastCollisionTime.current > 1 && !collisionsRef.current.has(index)) {
      //     const collisionPoint = calculateCollisionPoint(
      //       meshRef.current!.position,
      //       currentPlanetPos,
      //       planetSizes[index]
      //     );

      //     if (materialRef.current) {
      //       materialRef.current.opacity = 0;
      //       materialRef.current.transparent = true;
      //     }

      //     onCollision(index, collisionPoint);
      //     setHasCollided(true);
      //     lastCollisionTime.current = time;
      //     collisionsRef.current.add(index);
      //   }
      // });
    });
  
    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={color}
          roughness={0.95}
          metalness={0.2}
          transparent
          opacity={1}
        />
      </mesh>
    );
  };
  
  export const AsteroidField: React.FC<AsteroidFieldProps> = ({ 
    planetPositions, 
    planetSizes,
    onCollision 
  }) => {
    const asteroidCount = 350;
    const asteroids: AsteroidData[] = useMemo(() => {
      const asteroidColors = [ '#A88F6B', '#C4B08C', '#A9A9A9', '#D3D3D3'];
      return Array.from({ length: asteroidCount }).map(() => ({
        id: uuidv4(),
        size: Math.random() * 0.07 + 0.001,
        speed: Math.random() * 0.5 + 0.1,
        orbitRadius: Math.random() < 0.28 ? 
          Math.random() * 5 + 2 : 
          Math.random() * 2.5 + 9,
        orbitCenter: new Vector3(0, 0, 0),
        color: asteroidColors[Math.floor(Math.random() * asteroidColors.length)]
      }));
    }, [asteroidCount]);
  
    return (
      <group>
        {asteroids.map((asteroid) => (
    <Asteroid 
        key={asteroid.id} 
        size={asteroid.size} 
        speed={asteroid.speed} 
        orbitRadius={asteroid.orbitRadius}
        orbitCenter={asteroid.orbitCenter}
        planetPositions={planetPositions} 
        planetSizes={planetSizes}
        onCollision={onCollision}
        color={asteroid.color}
    />
        ))}
      </group>
    );
  };


















