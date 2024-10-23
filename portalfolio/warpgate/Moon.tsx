// Moon.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface MoonProps {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
}

const Moon: React.FC<MoonProps> = ({
  orbitRadius,
  orbitSpeed,
  size,
  moonColor,
  link,
}) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;
    }
  });

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={moonColor} />
      {/* Optional: Add label or tooltip here */}
    </mesh>
  );
};

export default Moon;
