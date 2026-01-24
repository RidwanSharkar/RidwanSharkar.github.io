// EnhancedPlanet.tsx
import React, { forwardRef, useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Mesh, Euler, TextureLoader, ShaderMaterial, Color, AdditiveBlending, BackSide, DoubleSide } from 'three';
import Moon from './Moon';
import { CelestialObjectGlow } from './CelestialObjectGlow';
import { PlanetData } from './EnhancedPlanetGroup';
import { ThreeEvent } from '@react-three/fiber';
import PlanetTrail from './PlanetTrail';

/* ====================================== SHADERS (PRECOMPILE AT SOME POINT) ====================================== */

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

// Surface shader for procedural detail on planets
const surfaceVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const surfaceFragmentShader = `
uniform vec3 uColor;
uniform float uTime;
uniform float uRoughness;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// Simple noise function for surface detail
float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    // Base color
    vec3 color = uColor;
    
    // Add surface detail using noise
    float surfaceNoise = fbm(vPosition * 8.0 + uTime * 0.05);
    
    // Subtle color variation
    color *= 0.85 + surfaceNoise * 0.3;
    
    // Simple lighting
    vec3 lightDir = normalize(vec3(0.0) - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Ambient + diffuse
    vec3 ambient = color * 0.3;
    vec3 diffuse = color * diff * 0.7;
    
    // Add slight specular highlight
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
    vec3 specular = vec3(1.0) * spec * 0.2 * (1.0 - uRoughness);
    
    vec3 finalColor = ambient + diffuse + specular;
    
    gl_FragColor = vec4(finalColor, 1.0);
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

  // Load ring alpha texture once and cache it
  const ringAlphaTexture = useLoader(
    TextureLoader,
    '/textures/ring-alpha.jpg'
  );

  // Memoize planet color for PlanetTrail
  const planetTrailColor = useMemo(() => new Color(planetColor), [planetColor]);

  // Memoize ring rotations to avoid creating new Euler objects on every render
  const ringRotations = useMemo(() => {
    return rings?.map(ring => new Euler(ring.inclination || 0, 0, 0)) || [];
  }, [rings]);

  // Memoize atm material
  const atmosphereMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(planetColor) }
    },
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true
  }), [planetColor]);

  // Surface material with procedural detail
  const surfaceMaterial = useMemo(() => new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(planetColor) },
      uTime: { value: 0 },
      uRoughness: { value: 0.7 },
    },
    vertexShader: surfaceVertexShader,
    fragmentShader: surfaceFragmentShader,
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
      
      // Animate surface shader time for surface animation
      if (surfaceMaterial.uniforms) {
        surfaceMaterial.uniforms.uTime.value = elapsed;
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
      {/* Orbital Trail - comet-like effect following planet */}
      <PlanetTrail
        color={planetTrailColor}
        size={size*0.725}
        meshRef={meshRef}
        orbitRadius={orbitRadius}
        orbitSpeed={orbitSpeed}
        opacity={0.15}
      />

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
        <primitive object={surfaceMaterial} attach="material" />

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
            rotation={ringRotations[idx]}
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
              side={DoubleSide} 
              transparent 
              opacity={1.0}
              alphaMap={ringAlphaTexture}
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
              side={DoubleSide} 
            />
          </mesh>
        )}
      </mesh>
    </group>
  );
});

EnhancedPlanet.displayName = 'EnhancedPlanet';

export default EnhancedPlanet;