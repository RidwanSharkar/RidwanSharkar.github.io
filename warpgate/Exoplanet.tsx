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

  // SIZE RANGE
  const size = 0.14 + Math.random() * (0.20 - 0.14);
  const colors = useMemo(() => ['#00ffff', '#ff00ff', '#FF7F11', '#ff3366', '#66ff33', '#B8B3E9', '#B8B3E9', '#F87666', '6EFAFB', 'BEEE62', 'CD9FCC', '93FF96', 'B2FFA8' ], []);
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [colors]);
  
  // Memoize Color objects to prevent recreation on every render
  const planetColor = useMemo(() => new Color(color), [color]);

  // SIMULATION CONSTANTS
  const SPAWN_RADIUS = 50;
  const HYPERBOLIC_THRESHOLD = 18; // GRAVITY INFLUENCE RADIUS
  const MIN_DISTANCE = 1.5; // ACTUAL COLLSION SIZE
  const BASE_GRAVITY_STRENGTH = 0.25; // GRAVITY STRENGTH
  const CLOSE_APPROACH_THRESHOLD = 2.35; // APPROACH THRESHOLD

  const targetPoint = useMemo(() => {
    const radius = Math.random() * 21; // COLLISION PLANE 
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
    const speed = Math.random() * 0.375 + 0.11;
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

  // OPACITY and Collision States
  const [opacity, setOpacity] = useState(1);
  const [showExplosion, setShowExplosion] = useState(false);
  const [collisionPoint, setCollisionPoint] = useState<Vector3 | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasCollided, setHasCollided] = useState(false);

  // FADE OUT TIMER
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
      // Remove after fade-out duration
      const removeTimer = setTimeout(() => {
        onRemove();
      }, 3000); // 1000 ms = 1 second

      return () => clearTimeout(removeTimer);
    }, 15000); // 15000 ms = 15 seconds

    return () => clearTimeout(fadeOutTimer);
  }, [onRemove]);

  useFrame(() => {
    if (hasCollided) return;

    if (meshRef.current && velocityRef.current) {
      meshRef.current.position.add(velocityRef.current);
      
      // Proximity detection to the Sun 
      const distanceToSun = meshRef.current.position.length();
      
      // Check for collision with sun FIRST, before any gravity calculations
      if (distanceToSun < MIN_DISTANCE && isVisible) {
        setCollisionPoint(meshRef.current.position.clone());
        setShowExplosion(true);
        setIsVisible(false);
        setHasCollided(true);
        // Immediately stop all motion
        velocityRef.current.set(0, 0, 0);
        setTimeout(() => {
          onRemove();
        }, 1000);
        return;
      }

      // Apply continuous gravitational force when within threshold
      if (distanceToSun < HYPERBOLIC_THRESHOLD) {
        // Add a minimum distance clamp to prevent extreme gravity values
        const clampedDistance = Math.max(distanceToSun, CLOSE_APPROACH_THRESHOLD * 0.5);
        
        let gravityStrength = BASE_GRAVITY_STRENGTH;
        if (distanceToSun < CLOSE_APPROACH_THRESHOLD) {
          // Limit the maximum gravity multiplier
          const gravityMultiplier = Math.min(
            (CLOSE_APPROACH_THRESHOLD / clampedDistance) ** 1.6,
            3.0 // Maximum multiplier cap
          );
          gravityStrength *= gravityMultiplier;
        }

        const gravityMultiplier = gravityStrength / (clampedDistance * clampedDistance);
        const gravity = meshRef.current.position.clone()
          .normalize()
          .multiplyScalar(-gravityMultiplier);
        
        // Limit the maximum gravity force
        const maxGravityMagnitude = 0.5;
        if (gravity.length() > maxGravityMagnitude) {
          gravity.normalize().multiplyScalar(maxGravityMagnitude);
        }
        
        velocityRef.current.add(gravity);
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} visible={isVisible}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={planetColor} transparent opacity={opacity} />
      </mesh>

      <PlanetTrail
        color={planetColor}
        size={size}
        meshRef={meshRef}
        orbitRadius={10} 
        orbitSpeed={0.025} 
        opacity={opacity}
        particlesCount={20}
      />

      {showExplosion && collisionPoint && (
        <Explosion
          position={collisionPoint}
          color={color}
          size={size * 1.8}
          duration={1.9}
          particleCount={125}
        />
      )}
    </group>
  );
};

export default Exoplanet;