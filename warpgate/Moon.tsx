// Moon.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';

interface MoonProps {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
  startAngle?: number;
}

const Moon: React.FC<MoonProps> = ({
  orbitRadius,
  orbitSpeed,
  size,
  moonColor,
  link,
  label,
  startAngle,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      const angle = (elapsed * orbitSpeed) + (startAngle || 0);
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;
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
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={moonColor} />
      {/* Tooltip */}
      {hovered && label && (
        <Html
          distanceFactor={10}
          position={[0, size + 0.3, 0]}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '3px 6px',
            borderRadius: '4px',
            color: 'white',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontSize: '0.8rem',
          }}
        >
          <span>{label}</span>
        </Html>
      )}
    </mesh>
  );
};

export default Moon;
