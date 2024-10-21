// src/components/Ball.tsx

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useSphere } from '@react-three/cannon';
import { Mesh } from 'three';
import { useNavigate } from 'react-router-dom';
import { Vector3 } from 'three';

interface BallProps {
  position: Vector3;
  color: string;
  link: string;
  onPocket: () => void; 
}

export interface BallHandle {
  applyImpulse: (impulse: [number, number, number], point: [number, number, number]) => void;
}

const Ball = forwardRef<BallHandle, BallProps>(({ position, color, link, onPocket }, ref) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isPotted, setIsPotted] = useState(false);

  // Sphere
  const [ballRef, api] = useSphere<Mesh>(() => ({
    mass: 1,
    position: [position.x, position.y, position.z],
    args: [0.5], // Ball Radius
    userData: {
      isBall: true,
    },
    onCollide: (e: any) => {
      const collidedObject = e.body.userData;
      if (collidedObject && collidedObject.isPocket) {
        setIsPotted(true);
        onPocket(); 
      }
    },
  }));

  useImperativeHandle(ref, () => ({
    applyImpulse: (impulse: [number, number, number], point: [number, number, number]) => {
      api.applyImpulse(impulse, point);
    },
  }));

  const handleClick = () => {
    navigate(link);
  };

  if (isPotted) return null; // Remove ball from scene

  return (
    <mesh
      ref={ballRef} 
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={isHovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

export default Ball;
