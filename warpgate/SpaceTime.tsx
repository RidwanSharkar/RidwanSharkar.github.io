// warpgate/SpaceTime.tsx

import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import EnhancedPlanetGroup, { PlanetData } from './EnhancedPlanetGroup';
import { MOUSE } from 'three';

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

interface PlanetCanvasProps {
  onSelectPlanet: (index: number, planet: PlanetData) => void;
  selectedPlanet: { index: number; planet: PlanetData } | null;
}

const PlanetCanvas: React.FC<PlanetCanvasProps> = ({ onSelectPlanet, selectedPlanet }) => {
  return (
    <Canvas camera={{ position: [0, 20, 25], fov: 60 }} className="w-full h-full">
      <ResponsiveCamera />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FDB813" />
      <Stars
        radius={100}
        depth={100}
        count={4000}
        factor={4}
        saturation={0}
        fade
      />
      <React.Suspense fallback={<Html center>Loading...</Html>}>
        <EnhancedPlanetGroup 
          onSelectPlanet={onSelectPlanet} 
          selectedPlanet={selectedPlanet} 
        />
      </React.Suspense>

      <OrbitControls
        enableZoom={true}
        minDistance={10}
        maxDistance={20}
        enablePan={true}
        zoomSpeed={0.75}
        enableDamping={true}
        dampingFactor={0.4}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.ROTATE
        }}
      />

    </Canvas>
  );
};

export default PlanetCanvas;
