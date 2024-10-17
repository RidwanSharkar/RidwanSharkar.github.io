// components/Portal.tsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Html } from '@react-three/drei';

interface PortalProps {
  position: [number, number, number];
  link: string;
  label: string;
}

const Portal: React.FC<PortalProps> = ({ position, link, label }) => {
  const meshRef = useRef<Mesh>(null!);

  // Rotate the portal continuously
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    meshRef.current.rotation.y = elapsed * 0.3;
  });

  // Handle click to open the link in a new tab
  const handleClick = () => {
    window.open(link, '_blank');
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      // Change cursor to pointer when hovering over the portal
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      {/* Geometry of the portal */}
      <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
      {/* Material with emissive color for a glowing effect */}
      <meshStandardMaterial color="#1E90FF" emissive="#1E90FF" emissiveIntensity={0.6} />
      {/* HTML label above the portal */}
      <Html distanceFactor={10}>
        <div className="bg-black bg-opacity-50 rounded px-2 py-1 text-white text-sm cursor-pointer hover:bg-opacity-75 transition">
          {label}
        </div>
      </Html>
    </mesh>
  );
};

export default Portal;
