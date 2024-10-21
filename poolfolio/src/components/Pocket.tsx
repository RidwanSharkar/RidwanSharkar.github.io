// src/components/Pocket.tsx

import React, { forwardRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { Mesh } from 'three';

interface PocketProps {
  position: Vector3;
  onPocket: () => void; // Callback
}

const Pocket = forwardRef<Mesh, PocketProps>(({ position, onPocket }, ref) => {
  useSphere(() => ({
    type: 'Static',
    position: [position.x, position.y, position.z],
    args: [1],                // Radius of the pocket
    isTrigger: true,          // Makes it a trigger zone
    collisionFilterGroup: 0,  // Disable physical collisions
    collisionFilterMask: 0,   // Disable physical collisions
    userData: {
      isPocket: true,
    },
    onCollide: (e: any) => {
      const collidedObject = e.body.userData;
      if (collidedObject && collidedObject.isBall) {
        onPocket(); // Notify parent component
      }
    },
  }));

  return (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="black" transparent opacity={0.5} />
    </mesh>
  );
});

export default Pocket;
