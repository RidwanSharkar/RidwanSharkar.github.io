import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, MathUtils, Color } from 'three';
import PlanetTrail from './PlanetTrail';

interface ExoplanetProps {
  onRemove: () => void;
}

const Exoplanet: React.FC<ExoplanetProps> = ({ onRemove }) => {
  const meshRef = useRef<Mesh>(null);
  const velocityRef = useRef<Vector3>();

  const size = 0.17; // SIZE    
  const colors = useMemo(() => ['#00ffff', '#ff00ff', '#ffff00', '#ff3366', '#66ff33'], []);
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [colors]);

  const SPAWN_RADIUS = 50; // SPAWN POINT

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

  // Generates random position on surface with spawn radius
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

  // Velocity vector towards the solar system with variration
  useEffect(() => {
    const speed = Math.random() * 0.6 + 0.04;
    const direction = targetPoint.clone().sub(initialPosition).normalize();
    
    // Flattening to horizontal axis
    const inclinationVariation = MathUtils.degToRad(Math.random() * 10 - 5);

    const axis = new Vector3(
      0.8, // x component
      Math.random() * 0.2 - 0.1, //          y variation
      Math.random() * 0.4 - 0.2  // medium z variation
    ).normalize();

    direction.applyAxisAngle(axis, inclinationVariation);
    velocityRef.current = direction.multiplyScalar(speed);
  }, [initialPosition, targetPoint]);

  // OPACITY
  const [opacity, setOpacity] = useState(1);

  // FADE OUT TIMER
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      // Start fade-out
      setOpacity(0);
      // Remove Exoplanet after fade-out duration (e.g., 1 second)
      const removeTimer = setTimeout(() => {
        onRemove();
      }, 1000); // 1000 ms = 1 second

      return () => clearTimeout(removeTimer);
    }, 20000); // 20000 ms = 20 seconds

    return () => clearTimeout(fadeOutTimer);
  }, [onRemove]);

  useFrame(() => {
    if (meshRef.current && velocityRef.current) {
      meshRef.current.position.add(velocityRef.current);    // Update position
    }
  });

  return (
    <group>
      {/* Exoplanet Mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={new Color(color)} transparent opacity={opacity} />
      </mesh>

      {/* Trail Effect */}
      <PlanetTrail
        color={new Color(color)}
        size={size}
        meshRef={meshRef}
        orbitRadius={10} 
        orbitSpeed={0.025} 
        opacity={opacity} // to synchornize fade-out
      />
    </group>
  );
};

export default Exoplanet;