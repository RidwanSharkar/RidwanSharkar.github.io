import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

interface BallProps {
  position: Vector3;
  color: string;
  link: string;
}

const Ball: React.FC<BallProps> = ({ position, color, link }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    navigate(link);
  };

  return (
    <mesh
      position={position}
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const PoolTable: React.FC = () => {
  const balls: BallProps[] = [
    { position: new Vector3(-2, 0.5, -2), color: 'red', link: '/project1' },
    { position: new Vector3(0, 0.5, -2), color: 'blue', link: '/project2' },
    { position: new Vector3(2, 0.5, -2), color: 'green', link: '/project3' },
    // Add more balls as needed
  ];

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Pool Table Surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color="#006400" />
      </mesh>
      {/* Balls */}
      {balls.map((ball, index) => (
        <Ball
          key={index}
          position={ball.position}
          color={ball.color}
          link={ball.link}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
};

export default PoolTable;
