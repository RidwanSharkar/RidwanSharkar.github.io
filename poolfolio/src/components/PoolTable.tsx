// src/components/PoolTable.tsx

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import Cue from './Cue';
import Pocket from './Pocket';
import Ball, { BallHandle } from './Ball';
import { tableMaterial, ballBallContactMaterial } from './PhysicsMaterials';


// Table dimensions
const TABLE_WIDTH = 10;
const TABLE_LENGTH = 20;
const WALL_HEIGHT = 1;
const WALL_THICKNESS = 0.5;

// Camera controls component
const CameraControls: React.FC = () => {
  const { camera } = useThree();
  const baseSpeed = 0.5;
  const minHeight = 2;
  const maxHeight = 20;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          camera.position.x -= baseSpeed;
          break;
        case 'ArrowRight':
          camera.position.x += baseSpeed;
          break;
        case 'ArrowUp':
          camera.position.z -= baseSpeed;
          break;
        case 'ArrowDown':
          camera.position.z += baseSpeed;
          break;
      }
      camera.position.y = Math.max(minHeight, Math.min(camera.position.y, maxHeight));
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera]);

  return null;
};

interface WallProps {
  position: [number, number, number];
  args: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ position, args }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args,
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};

interface PlaneProps {
  material: any;
}

const Plane: React.FC<PlaneProps> = ({ material }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material,
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} receiveShadow>
      <planeGeometry args={[TABLE_WIDTH, TABLE_LENGTH]} />
      <meshStandardMaterial color="#006400" />
    </mesh>
  );
};

interface BallData {
  position: Vector3;
  color: string;
  link: string;
}

const PoolTable: React.FC = () => {
  const initialBalls: BallData[] = [
    { position: new Vector3(-2, 0.5, -2), color: 'red', link: '/project1' },
    { position: new Vector3(0, 0.5, -2), color: 'blue', link: '/project2' },
    { position: new Vector3(2, 0.5, -2), color: 'green', link: '/project3' },
  ];

  const [balls, setBalls] = useState<BallData[]>(initialBalls);
  const targetBallRef = useRef<BallHandle>(null);

  const handlePocket = useCallback(() => {
    setBalls((prevBalls) => prevBalls.slice(1));
  }, []);

  const handleReset = () => setBalls(initialBalls);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 60 }}>
        <CameraControls />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />
        <Physics
          gravity={[0, -9.81, 0]}
          defaultContactMaterial={ballBallContactMaterial}
        >
          <Plane material={tableMaterial} />

          {/* Table walls */}
          <Wall 
            position={[-TABLE_WIDTH/2 - WALL_THICKNESS/2, WALL_HEIGHT/2, 0]} 
            args={[WALL_THICKNESS, WALL_HEIGHT, TABLE_LENGTH]} 
          />
          <Wall 
            position={[TABLE_WIDTH/2 + WALL_THICKNESS/2, WALL_HEIGHT/2, 0]} 
            args={[WALL_THICKNESS, WALL_HEIGHT, TABLE_LENGTH]} 
          />
          <Wall 
            position={[0, WALL_HEIGHT/2, -TABLE_LENGTH/2 - WALL_THICKNESS/2]} 
            args={[TABLE_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} 
          />
          <Wall 
            position={[0, WALL_HEIGHT/2, TABLE_LENGTH/2 + WALL_THICKNESS/2]} 
            args={[TABLE_WIDTH, WALL_HEIGHT, WALL_THICKNESS]} 
          />

          {/* Pockets */}
          <Pocket position={new Vector3(-TABLE_WIDTH/2, 0, -TABLE_LENGTH/2)} onPocket={handlePocket} />
          <Pocket position={new Vector3(TABLE_WIDTH/2, 0, -TABLE_LENGTH/2)} onPocket={handlePocket} />
          <Pocket position={new Vector3(-TABLE_WIDTH/2, 0, TABLE_LENGTH/2)} onPocket={handlePocket} />
          <Pocket position={new Vector3(TABLE_WIDTH/2, 0, TABLE_LENGTH/2)} onPocket={handlePocket} />
          <Pocket position={new Vector3(0, 0, -TABLE_LENGTH/2)} onPocket={handlePocket} />
          <Pocket position={new Vector3(0, 0, TABLE_LENGTH/2)} onPocket={handlePocket} />

          {/* Balls */}
          {balls.map((ball, index) => (
            <Ball
              key={index}
              position={ball.position}
              color={ball.color}
              link={ball.link}
              onPocket={handlePocket}
              ref={index === 0 ? targetBallRef : null}
            />
          ))}

          <Cue
            position={[0, 0.5, -8]}
            targetBallRef={targetBallRef}
          />
        </Physics>
      </Canvas>
      <button
        onClick={handleReset}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
        }}
      >
        Reset Table
      </button>
    </div>
  );
};

export default PoolTable;