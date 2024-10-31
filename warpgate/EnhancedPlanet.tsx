import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader, ShaderMaterial  } from 'three';
import Moon from './Moon';
import * as THREE from 'three';
import { CelestialObjectGlow } from './CelestialObjectGlow';
import { PlanetData } from './EnhancedPlanetGroup';
import { ThreeEvent } from '@react-three/fiber';


// Atmosphere shader
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
  onCollision: (index: number) => void;
  onSelectPlanet: (index: number, planet: PlanetData) => void;
  selected: boolean;
}

/*=============================================================================================================*/

const EnhancedPlanet: React.FC<EnhancedPlanetProps> = ({ 
  planetColor, 
  size,
  index,
  onCollision,
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
}) => {
  const meshRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const logoTexture = useLoader(
    TextureLoader,
    logoTexturePath || '/textures/transparent.png' //placeholder
  );
  
  // Create atmosphere material
  const atmosphereMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(planetColor) }
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });


  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;
      meshRef.current.rotation.y += rotationSpeed;         // Planet rotation
      if (atmosphereRef.current) {
        atmosphereRef.current.position.copy(meshRef.current.position);
        atmosphereRef.current.rotation.copy(meshRef.current.rotation);
      }
      const distance = meshRef.current.position.length();  // Collision detection placeholder logic
      if (distance < 0.4) { 
        onCollision(index);
      }
    }
  });

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
  
/*=============================================================================================================*/

  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Logo rotation speed
    }
  });

  useEffect(() => {
    console.log(`Planet ${index} selected: ${selected}`);
  }, [selected, index]);

  useEffect(() => {
    if (selected) {
      document.body.style.cursor = 'pointer';
    } else if (!hovered) {
      document.body.style.cursor = 'auto';
    }
  }, [hovered, selected]);

  return (
    <group>

      {/* Atmosphere layer */}
      <mesh
        ref={atmosphereRef}
        scale={[1.12, 1.12, 1.12]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>


      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={selected ? [1.0, 1.0, 1.0] : [1, 1, 1]} // scale when selected meh
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial color={planetColor} />

        {/* HOVER + SELECT GLOW */}
        {(selected) && (
          <CelestialObjectGlow 
            color={planetColor} 
            size={size} 
            intensity={0.4} 
            isSelected={selected} 
          />
        )}

        {/* Rings */}
        {rings && rings.map((ring, idx) => (
          <mesh 
            key={idx} 
            rotation={new Euler(
              ring.inclination || 0, 
              0, 
              0
            )}
          >
            <ringGeometry
              args={[
                size * (ring.innerScale || 1.1),
                size * (ring.outerScale || 1.3),
                32,
              ]}
            />
            <meshStandardMaterial 
              color={ring.color} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.8} 
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
            position={[0, size + 0.5, 0]} 
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]} 
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
};

export default EnhancedPlanet;