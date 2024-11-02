// AsteroidField.tsx
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color, MeshStandardMaterial } from 'three';
import { v4 as uuidv4 } from 'uuid';


interface AsteroidProps {
    size: number;
    speed: number;
    orbitRadius: number;
    orbitCenter: Vector3;
    planetPositions: Vector3[];
    planetSizes: number[];
    onCollision: (planetIndex: number, position: Vector3) => void;
  }

interface AsteroidData {
    id: string;
    size: number;
    speed: number;
    orbitRadius: number;
    orbitCenter: Vector3;
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
    planetPositions,
    planetSizes,
    onCollision 
  }) => {
    const meshRef = useRef<Mesh | null>(null);
    const materialRef = useRef<MeshStandardMaterial | null>(null);
    const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);
    const yOffset = useMemo(() => (Math.random() - 0.5) * 2, []);
    const [hasCollided, setHasCollided] = useState(false);
    const lastCollisionTime = useRef(0);
  
    // Calculate collision point on planet surface
    const calculateCollisionPoint = (asteroidPos: Vector3, planetPos: Vector3, planetSize: number): Vector3 => {
      const direction = new Vector3().subVectors(asteroidPos, planetPos).normalize();
      return new Vector3().addVectors(planetPos, direction.multiplyScalar(planetSize));
    };
  
    // Reset asteroid to a new random position
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
  
        materialRef.current.color = new Color('#8B8B8B');
        materialRef.current.emissive = new Color('#000000');
        lastCollisionTime.current = time;
        setHasCollided(false);
      }
    };
  
    useFrame(({ clock }) => {
      if (!meshRef.current) return;
  
      const time = clock.getElapsedTime();
  
      if (hasCollided) {
        if (time - lastCollisionTime.current > 0.5) {
          resetAsteroid(time);
        }
        return;
      }
  
      const angle = initialAngle + time * speed;
      
   
      meshRef.current.position.x = orbitCenter.x + Math.cos(angle) * orbitRadius;
      meshRef.current.position.y = orbitCenter.y + yOffset;
      meshRef.current.position.z = orbitCenter.z + Math.sin(angle) * orbitRadius;
  

      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
  

      planetPositions.forEach((planetPos, index) => {
        const distance = meshRef.current!.position.distanceTo(planetPos);
        const collisionThreshold = size + planetSizes[index];
        
        if (distance < collisionThreshold && !hasCollided && time - lastCollisionTime.current > 1) {
      
          const collisionPoint = calculateCollisionPoint(
            meshRef.current!.position,
            planetPos,
            planetSizes[index]
          );
  
         
          if (materialRef.current) {
            materialRef.current.opacity = 0;
            materialRef.current.transparent = true;
          }
  
        
          onCollision(index, collisionPoint);
          setHasCollided(true);
          lastCollisionTime.current = time;
        }
      });
    });
  
    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#8B8B8B"
          roughness={0.8}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
    );
  };
  
  export const AsteroidField: React.FC<AsteroidFieldProps> = ({ 
    planetPositions, 
    planetSizes,
    onCollision 
  }) => {
    const asteroidCount = 100;
    const asteroids: AsteroidData[] = useMemo(() => 
      Array.from({ length: asteroidCount }).map(() => {
        const isInnerOrbit = Math.random() < 0.3;
        const orbitRadius = isInnerOrbit ?
          Math.random() * 5 + 3 :  // Inner orbit: 3-8 units
          Math.random() * 12 + 8;  // Outer orbit: 8-20 units
  
        return {
          id: uuidv4(),
          size: Math.random() * 0.08 + 0.05, // Size
          speed: Math.random() * 0.3 + 0.1, // Speed
          orbitRadius,
          orbitCenter: new Vector3(0, 0, 0)
        };
      }), [asteroidCount]
    );
  
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
        />
        ))}
      </group>
    );
  };


















