// warpgate/OrbitalPlanet.tsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';

interface PlanetProps {
  position: [number, number, number];
  link: string;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetColor: string;
  ringColor?: string;
  size: number;
}

const Planet: React.FC<PlanetProps> = ({
  position,
  link,
  label,
  orbitRadius,
  orbitSpeed,
  planetColor,
  ringColor,
  size
}) => {
  const meshRef = useRef<Mesh>(null!);
  const ringRef = useRef<Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    
    // Calculate orbital position
    const x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
    const z = Math.sin(elapsed * orbitSpeed) * orbitRadius;
    
    meshRef.current.position.x = x;
    meshRef.current.position.z = z;
    
    // Rotate planet on its axis
    meshRef.current.rotation.y += 0.02;
    
    // Update ring position if it exists
    if (ringRef.current) {
      ringRef.current.position.x = x;
      ringRef.current.position.z = z;
      ringRef.current.rotation.x = Math.PI / 3;
    }
  });

  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <group>
      {/* Orbit path visualization */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[orbitRadius, orbitRadius + 0.05, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>
      
      {/* Planet */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={planetColor}
          metalness={0.4}
          roughness={0.7}
          emissive={planetColor}
          emissiveIntensity={0.2}
        />
        
        {/* Planet ring if ringColor is provided */}
        {ringColor && (
          <mesh ref={ringRef}>
            <ringGeometry args={[size * 1.3, size * 1.8, 32]} />
            <meshBasicMaterial color={ringColor} opacity={0.7} transparent />
          </mesh>
        )}

        {/* Label */}
        <Html distanceFactor={15}>
          <div className="bg-black bg-opacity-50 rounded px-2 py-1 text-white text-sm cursor-pointer hover:bg-opacity-75 transition">
            {label}
          </div>
        </Html>
      </mesh>
    </group>
  );
};

export default Planet;