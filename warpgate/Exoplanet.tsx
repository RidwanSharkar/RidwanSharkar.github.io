import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, Color } from 'three';
import PlanetTrail from './PlanetTrail';
import Explosion from './Explosion';

interface ExoplanetProps {
  onRemove: () => void;
}

const Exoplanet: React.FC<ExoplanetProps> = ({ onRemove }) => {
  const meshRef = useRef<Mesh>(null);
  const velocityRef = useRef<Vector3>();

  // Random size between 0.14 and 0.20
  const size = 0.15 + Math.random() * (0.20 - 0.14);
  const colors = useMemo(() => ['#00ffff', '#ff00ff', '#FF7F11', '#ff3366', '#66ff33', '#B8B3E9', '#B8B3E9', '#F87666', '6EFAFB', 'BEEE62', 'CD9FCC', '93FF96', 'B2FFA8' ], []);
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [colors]);

  // Constants for simulation
  const SPAWN_RADIUS = 50;
  const HYPERBOLIC_THRESHOLD = 40; // GRAVITY INFLUENCE
  const MIN_DISTANCE = 2;
  const BASE_GRAVITY_STRENGTH = 0.15; // GRAVITY STRENGTH
  const CLOSE_APPROACH_THRESHOLD = 8; // APPROACH THRESHOLD

  const targetPoint = useMemo(() => {
    const radius = Math.random() * 8; // COLLISION ZONE
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    return new Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }, []);

  // SPAWNER
  const initialPosition = useMemo(() => {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = SPAWN_RADIUS * Math.sin(phi) * Math.cos(theta);
    const y = SPAWN_RADIUS * Math.sin(phi) * Math.sin(theta);
    const z = SPAWN_RADIUS * Math.cos(phi);
    return new Vector3(x, y, z);
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(initialPosition);
    }
  }, [initialPosition]);

  // Velocity vector towards the solar system with variation
  useEffect(() => {
    const speed = Math.random() * 0.4 + 0.04;
    const direction = targetPoint.clone().sub(initialPosition).normalize();
    
    // Inclination variation ±5° to ±3°
    const inclinationVariation = MathUtils.degToRad(Math.random() * 6 - 3);

    const axis = new Vector3(
      0.9,                        // x component
      Math.random() * 0.1 - 0.05, // y variation
      Math.random() * 0.2 - 0.1   // z variation
    ).normalize();

    direction.applyAxisAngle(axis, inclinationVariation);
    velocityRef.current = direction.multiplyScalar(speed);
  }, [initialPosition, targetPoint]);

  // OPACITY
  const [opacity, setOpacity] = useState(1);
  const [showExplosion, setShowExplosion] = useState(false);
  const [collisionPoint, setCollisionPoint] = useState<Vector3 | null>(null);

  // FADE OUT TIMER
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
      // Remove after fade-out duration
      const removeTimer = setTimeout(() => {
        onRemove();
      }, 1000); // 1000 ms = 1 second

      return () => clearTimeout(removeTimer);
    }, 15000); // 15000 ms = 15 seconds

    return () => clearTimeout(fadeOutTimer);
  }, [onRemove]);

  useFrame(() => {
    if (meshRef.current && velocityRef.current) {
      meshRef.current.position.add(velocityRef.current);
      
      // Proximity detection to the Sun 
      const distanceToSun = meshRef.current.position.length();
      
      // Check for collision with sun
      if (distanceToSun < MIN_DISTANCE) {
        setCollisionPoint(meshRef.current.position.clone());
        setShowExplosion(true);
        setTimeout(() => {
          onRemove();
        }, 1500); // 1.5 seconds matching explosion duration
        return;
      }

      // Apply continuous gravitational force when within threshold
      if (distanceToSun < HYPERBOLIC_THRESHOLD) {
        // Enhanced gravity when very close to sun
        let gravityStrength = BASE_GRAVITY_STRENGTH;
        if (distanceToSun < CLOSE_APPROACH_THRESHOLD) {
          // Exponentially increase gravity strength for close approaches
          gravityStrength *= (CLOSE_APPROACH_THRESHOLD / distanceToSun) ** 1.5;
        }

        const gravityMultiplier = gravityStrength / (distanceToSun * distanceToSun);
        const gravity = meshRef.current.position.clone()
          .normalize()
          .multiplyScalar(-gravityMultiplier);
        
        velocityRef.current.add(gravity);
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={new Color(color)} transparent opacity={opacity} />
      </mesh>

      <PlanetTrail
        color={new Color(color)}
        size={size}
        meshRef={meshRef}
        orbitRadius={10} 
        orbitSpeed={0.025} 
        opacity={opacity}
      />

      {showExplosion && collisionPoint && (
        <Explosion
          position={collisionPoint}
          color={color}
          size={size * 2}
          duration={1.5}
          particleCount={30}
        />
      )}
    </group>
  );
};

export default Exoplanet;