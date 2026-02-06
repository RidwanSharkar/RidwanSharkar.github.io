// Moon.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import { Html } from '@react-three/drei';

interface MoonProps {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
  startAngle?: number;
  verticalOrbit?: boolean;
}

const Moon: React.FC<MoonProps> = ({
  orbitRadius,
  orbitSpeed,
  size,
  moonColor,
  link,
  label,
  startAngle,
  verticalOrbit = false,
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Cleanup geometry and material on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof MeshStandardMaterial) {
          meshRef.current.material.dispose();
        }
      }
    };
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      const angle = (elapsed * orbitSpeed) + (startAngle || 0);
      if (verticalOrbit) {
        // Vertical orbit: orbit in the x-y plane
        meshRef.current.position.x = Math.cos(angle) * orbitRadius;
        meshRef.current.position.y = Math.sin(angle) * orbitRadius;
        meshRef.current.position.z = 0;
      } else {
        // Horizontal orbit: orbit in the x-z plane
        meshRef.current.position.x = Math.cos(angle) * orbitRadius;
        meshRef.current.position.z = Math.sin(angle) * orbitRadius;
      }
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
