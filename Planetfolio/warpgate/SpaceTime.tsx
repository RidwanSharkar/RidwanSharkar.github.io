// SpaceTime.tsx
import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import EnhancedPlanetGroup from './EnhancedPlanetGroup';

const ResponsiveCamera: React.FC = () => {
  const { camera, size } = useThree();

  React.useEffect(() => {
    if (size.width < 768) {
      camera.position.set(0, 15, 20);
    } else {
      camera.position.set(0, 20, 25);
    }
  }, [size, camera]);

  return null;
};

const PlanetCanvas: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 20, 25], fov: 60 }}>
      <ResponsiveCamera />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FDB813" />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <React.Suspense fallback={<Html center>Loading...</Html>}>
        <EnhancedPlanetGroup /> {/* No props needed */}
      </React.Suspense>
      <OrbitControls
        enableZoom={true}
        minDistance={15}
        maxDistance={40}
        enablePan={false}
      />
    </Canvas>
  );
};

export default PlanetCanvas;
