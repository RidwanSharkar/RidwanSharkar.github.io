// components/PortalCanvas.tsx

import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import PortalGroup from './PortalGroup';

const ResponsiveCamera: React.FC = () => {
  const { camera, size } = useThree();

  React.useEffect(() => {
    if (size.width < 768) {
      camera.position.set(0, 0, 6);
    } else {
      camera.position.set(0, 0, 8);
    }
  }, [size, camera]);

  return null;
};

const PortalCanvas: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ResponsiveCamera />
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.5} />
      {/* Point light for direct lighting */}
      <pointLight position={[10, 10, 10]} />
      {/* Stars in the background */}
      <Stars />
      {/* Suspense to handle asynchronous loading */}
      <React.Suspense fallback={<Html center>Loading...</Html>}>
        <PortalGroup />
      </React.Suspense>
      {/* OrbitControls to allow user interaction */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default PortalCanvas;
