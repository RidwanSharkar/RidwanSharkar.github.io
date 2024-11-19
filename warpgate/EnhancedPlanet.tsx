// EnhancedPlanet.tsx
import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader, ShaderMaterial } from 'three';
import Moon from './Moon';
import * as THREE from 'three';
import { CelestialObjectGlow } from './CelestialObjectGlow';
import { PlanetData } from './EnhancedPlanetGroup';
import { ThreeEvent } from '@react-three/fiber';

/* ====================================== SHADERS(move) ====================================== */

const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
uniform vec3 glowColor;
void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;
}
`;

interface EnhancedPlanetProps extends PlanetData {
  index: number;
  onSelectPlanet: (index: number, planet: PlanetData) => void;
  selected: boolean;
  collisionTriggered: boolean;
  startAngle?: number;
  isBinary?: boolean;
  binaryOffset?: number;
  binarySpeed?: number;
}


/*=============================================================================================================*/

const EnhancedPlanet = forwardRef<Mesh, EnhancedPlanetProps>(({
  planetColor, 
  size,
  index,
  onSelectPlanet,
  selected,
  link,
  label,
  description,
  orbitRadius,
  orbitSpeed,
  rings,
  rotationSpeed = 0.01,
  moons,
  logoTexturePath,
  startAngle = 0,
  isBinary,
  binaryOffset,
  binarySpeed,
}, ref) => {
  const atmosphereRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const logoTexture = useLoader(
    TextureLoader,
    logoTexturePath || '/textures/transparent.png' // Placeholder texture
  );

  // Memoize atm material
  const atmosphereMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(planetColor) }
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  }), [planetColor]);

  // Local meshRef
  const meshRef = useRef<Mesh | null>(null);

  // Ref callback to assign both meshRef and forwarded ref
  const setRefs = (node: Mesh | null) => {
    meshRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<Mesh | null>).current = node;
    }
  };

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      if (isBinary && binaryOffset !== undefined && binarySpeed !== undefined) {
        // Calculate the binary orbit position
        const binaryAngle = elapsed * binarySpeed;
        const binaryX = Math.cos(binaryAngle) * binaryOffset;
        const binaryZ = Math.sin(binaryAngle) * binaryOffset;

        // Calculate the main orbit position
        const orbitAngle = elapsed * orbitSpeed + startAngle;
        const orbitX = orbitRadius * Math.cos(orbitAngle);
        const orbitZ = orbitRadius * Math.sin(orbitAngle);

        // Combine the positions
        meshRef.current.position.x = orbitX + binaryX;
        meshRef.current.position.z = orbitZ + binaryZ;
      } else {
        // Original single planet behavior
        const angle = elapsed * orbitSpeed + startAngle;
        meshRef.current.position.x = orbitRadius * Math.cos(angle);
        meshRef.current.position.z = orbitRadius * Math.sin(angle);
      }

      meshRef.current.rotation.y += rotationSpeed;

      // Update atmosphere and logo positions
      if (atmosphereRef.current) {
        atmosphereRef.current.position.copy(meshRef.current.position);
        atmosphereRef.current.rotation.copy(meshRef.current.rotation);
      }
      if (logoRef.current) {
        logoRef.current.rotation.y += 0.01;
      }
    }
  });

  /* ====================================== CLICK ====================================== */
  const handleClick = () => {
    onSelectPlanet(index, { 
      position: [0, 0, 0], 
      link,
      label,
      description,
      orbitRadius,
      orbitSpeed,
      planetColor,
      rings,
      size,
      rotationSpeed,
      moons,
      logoTexturePath,
    });
  };

  const logoRef = useRef<Mesh>(null);

  
  /* ====================================== HOVER ====================================== */
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setTimeout(() => setHovered(true), 50);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setTimeout(() => setHovered(false), 50);
    if (!selected) document.body.style.cursor = 'auto';
  };
  
  useEffect(() => {
    console.log(`Planet ${index} selected: ${selected}`);
  }, [selected, index]);

  // cursor style
  useEffect(() => {
    if (selected) {
      document.body.style.cursor = 'pointer';
    } else if (!hovered) {
      document.body.style.cursor = 'auto';
    }
  }, [hovered, selected]);
  /* ====================================== HOVER ====================================== */

  return (
    <group>
      {/* Atmosphere layer */}
      <mesh
        ref={atmosphereRef}
        scale={[1.225, 1.225, 1.225]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      <mesh
        ref={setRefs} // Attach meshRef and f ref
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={selected ? [1.0, 1.0, 1.0] : [1, 1, 1]} // dont
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial color={planetColor} />

        {/* Hover + Select Glow */}
        {(selected) && (
          <CelestialObjectGlow 
            color={planetColor} 
            size={size} 
            intensity={0.4} 
            isSelected={selected} 
          />
        )}

        {/* Rings */}
        {rings?.map((ring, idx) => (
          <mesh 
            key={idx} 
            rotation={new Euler(ring.inclination || 0, 0, 0)}
          >
            <ringGeometry
              args={[
                size * (ring.innerScale || 1.1),
                size * (ring.outerScale || 1.3),
                64
              ]}
            />
            <meshStandardMaterial 
              color={ring.color} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={1.0}
              alphaMap={new THREE.TextureLoader().load('/textures/ring-alpha.jpg')}
            />
          </mesh>
        ))}

        {/* Moons */}
        {moons && moons.map((moon, idx) => (
          <Moon
            key={`moon-${idx}`}
            {...moon}
          />
        ))}

        {/* Logo */}
        {(hovered || selected) && logoTexturePath && (
          <mesh
            ref={logoRef}
            position={[0, size + 0.65, 0]} 
            rotation={[0, 0, 0]}
            scale={[0.8, 0.8, 0.8]} 
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}
      </mesh>
    </group>
  );
});

EnhancedPlanet.displayName = 'EnhancedPlanet';

export default EnhancedPlanet;