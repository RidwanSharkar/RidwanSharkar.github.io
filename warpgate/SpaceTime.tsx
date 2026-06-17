// warpgate/SpaceTime.tsx

import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import EnhancedPlanetGroup, { PlanetData } from './EnhancedPlanetGroup';
import Nebula from './Nebula';
import { MOUSE } from 'three';
import { TargetRegistryProvider } from './targetRegistry';
import MissileSystem from './MissileSystem';
import MissileChargeUI from './MissileChargeUI';


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
  showNebulas?: boolean;
  timeScale: number;
}

const PlanetCanvas: React.FC<PlanetCanvasProps> = ({ onSelectPlanet, selectedPlanet, showNebulas = true, timeScale }) => {
  // Bridges the DOM charging UI to the in-canvas launch logic (which needs camera/raycaster access).
  const fireRef = React.useRef<(() => void) | null>(null);

  return (
    <>
    <Canvas camera={{ position: [0, 20, 25], fov: 60 }} className="w-full h-full">
      <ResponsiveCamera />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FDB813" />
      

      
      <Stars
        radius={100}
        depth={300} // 200
        count={3500} // 4000
        factor={3} // 4
        saturation={0}
        fade
      />
      
      {/* Distant nebula clouds */}
      {showNebulas && <Nebula />}

      <TargetRegistryProvider>
        <React.Suspense fallback={<Html center>Loading...</Html>}>
          <EnhancedPlanetGroup 
            onSelectPlanet={onSelectPlanet} 
            selectedPlanet={selectedPlanet} 
            timeScale={timeScale}
          />
        </React.Suspense>

        <MissileSystem fireRef={fireRef} />
      </TargetRegistryProvider>

      <OrbitControls
        enableZoom={true}
        minDistance={10}
        maxDistance={25}
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

    <MissileChargeUI fireRef={fireRef} />
    </>
  );
};

export default PlanetCanvas;
