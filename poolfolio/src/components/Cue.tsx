import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { BallHandle } from './Ball';

interface CueProps {
  position: [number, number, number];
  targetBallRef: React.RefObject<BallHandle>;
}

interface DragState {
  x: number;
  y: number;
}

const Cue: React.FC<CueProps> = ({ position, targetBallRef }) => {
  const ref = useRef<Group>(null);
  const [angle, setAngle] = useState<number>(0);
  const [power, setPower] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const maxPower = 20;
  const angleSpeed = 0.05; // ROTATION SPEED

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart) {
        const dragDistance = Math.sqrt(
          Math.pow(e.clientX - dragStart.x, 2) +
          Math.pow(e.clientY - dragStart.y, 2)
        );
        setPower(Math.min(dragDistance / 50, maxPower));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Angle control with A and D keys
      if (e.key === 'a' || e.key === 'A') {
        setAngle(prev => prev + angleSpeed);
      } else if (e.key === 'd' || e.key === 'D') {
        setAngle(prev => prev - angleSpeed);
      }
      
      // SHOOT WITH SPACEBAR
      if (e.code === 'Space' && power > 0 && targetBallRef.current) {
        const impulse: [number, number, number] = [
          Math.cos(angle) * power,
          0,
          Math.sin(angle) * power,
        ];
        targetBallRef.current.applyImpulse(impulse, [0, 0, 0]);
        setPower(0);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [angle, power, targetBallRef, isDragging, dragStart]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = angle;
      ref.current.position.z = position[2] - power * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} rotation={[0, angle, 0]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[0, 0.5, -power * 0.2]}>
        <boxGeometry args={[0.1, 0.1, power * 0.2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
};

export default Cue;