// warpgate/Nebula.tsx

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaCloudProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  scale: number;
  opacity: number;
  rotationSpeed?: number;
}

const nebulaVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float opacity;
  uniform float time;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Create cloudy noise pattern
    vec3 noiseCoord = vec3(vUv * 3.0, time * 0.02);
    float noise = fbm(noiseCoord);
    noise = (noise + 1.0) * 0.5; // Normalize to 0-1
    
    // Add secondary noise layer for more detail
    float detailNoise = fbm(noiseCoord * 2.0 + vec3(100.0));
    detailNoise = (detailNoise + 1.0) * 0.5;
    
    // Combine noise layers
    float combinedNoise = noise * 0.7 + detailNoise * 0.3;
    
    // Create soft circular falloff
    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    falloff = pow(falloff, 1.5);
    
    // Mix colors based on noise
    vec3 finalColor = mix(color1, color2, combinedNoise);
    
    // Add some brightness variation
    finalColor *= 0.8 + combinedNoise * 0.4;
    
    // Apply falloff and opacity
    float alpha = falloff * combinedNoise * opacity;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Special spiral nebula shader
const spiralFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  uniform float time;
  uniform float seed;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * abs(snoise(p * frequency));
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = uv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);
    
    // Spiral coordinates
    float spiralAngle = angle + dist * 8.0 + time * 0.05;
    vec2 spiralUv = vec2(cos(spiralAngle), sin(spiralAngle)) * dist + 0.5;
    
    vec3 spiralCoord = vec3(spiralUv * 3.0 + seed, time * 0.02);
    
    // Spiral arms
    float arms = sin(angle * 3.0 + dist * 10.0 + seed * 5.0) * 0.5 + 0.5;
    arms = pow(arms, 0.7);
    
    float spiralNoise = fbm(spiralCoord, 5);
    spiralNoise = (spiralNoise + 1.0) * 0.5;
    
    float noise = spiralNoise * arms;
    
    // Swirling falloff
    float spiralFalloff = 1.0 - smoothstep(0.1, 0.5, dist);
    spiralFalloff *= arms;
    
    // Add turbulent edges
    float edgeTurb = turbulence(vec3(uv * 4.0, seed));
    
    float falloff = spiralFalloff * (1.0 - edgeTurb * 0.3);
    float colorMix = spiralNoise;
    
    // Mix three colors based on noise
    vec3 finalColor;
    if (colorMix < 0.5) {
      finalColor = mix(color1, color2, colorMix * 2.0);
    } else {
      finalColor = mix(color2, color3, (colorMix - 0.5) * 2.0);
    }
    
    // Add brightness variation
    finalColor *= 0.7 + noise * 0.5;
    
    // Edge glow
    float edgeGlow = falloff * (1.0 - falloff) * 4.0;
    finalColor += color2 * edgeGlow * 0.3;
    
    // Apply falloff and opacity
    float alpha = falloff * opacity;
    alpha *= 0.8 + noise * 0.4;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const NebulaCloud: React.FC<NebulaCloudProps> = ({
  position,
  color1,
  color2,
  scale,
  opacity,
  rotationSpeed = 0.001
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color1: { value: new THREE.Color(color1) },
    color2: { value: new THREE.Color(color2) },
    opacity: { value: opacity },
    time: { value: 0 }
  }), [color1, color2, opacity]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Special spiral nebula component
interface SpiralNebulaProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scale: number;
  opacity: number;
  rotationSpeed?: number;
  seed: number;
}

const SpiralNebula: React.FC<SpiralNebulaProps> = ({
  position,
  color1,
  color2,
  color3,
  scale,
  opacity,
  rotationSpeed = 0.0008,
  seed
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color1: { value: new THREE.Color(color1) },
    color2: { value: new THREE.Color(color2) },
    color3: { value: new THREE.Color(color3) },
    opacity: { value: opacity },
    time: { value: 0 },
    seed: { value: seed }
  }), [color1, color2, color3, opacity, seed]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={spiralFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Nebula dust particles for extra atmosphere
const NebulaDust: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  count: number;
  spread: number;
}> = ({ position, color, count, spread }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * spread;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      siz[i] = Math.random() * 2 + 0.5;
    }

    return [pos, siz];
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.3}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface NebulaConfig {
  position: [number, number, number];
  color1: string;
  color2: string;
  scale: number;
  opacity: number;
  rotationSpeed: number;
  dustColor: string;
  dustCount: number;
}

interface SpiralConfig {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scale: number;
  opacity: number;
  rotationSpeed: number;
  seed: number;
  dustColor: string;
}

// Color palettes for nebulae - each has dark base and bright accent
const nebulaColorPalettes = [
  { dark: '#1a0533', bright: '#2d5a7b', dust: '#4a2c6a' },   // Purple/teal
  { dark: '#4a1a0a', bright: '#8b4513', dust: '#cd853f' },   // Orange/red
  { dark: '#0a1a3a', bright: '#1e90ff', dust: '#4169e1' },   // Blue
  { dark: '#0a2a2a', bright: '#20b2aa', dust: '#40e0d0' },   // Cyan/teal
  { dark: '#2a0a2a', bright: '#8b008b', dust: '#9932cc' },   // Purple/magenta
  { dark: '#1a2a0a', bright: '#32cd32', dust: '#228b22' },   // Green
  { dark: '#3a1a1a', bright: '#dc143c', dust: '#b22222' },   // Crimson
  { dark: '#0a1a2a', bright: '#4682b4', dust: '#5f9ea0' },   // Steel blue
  { dark: '#2a1a3a', bright: '#9370db', dust: '#8a2be2' },   // Medium purple
  { dark: '#1a3a3a', bright: '#00ced1', dust: '#008b8b' },   // Dark cyan
];

// Spiral color palettes - 3 colors each
const spiralColorPalettes = [
  { c1: '#2a0a2a', c2: '#8b008b', c3: '#da70d6', dust: '#9932cc' },  // Purple
  { c1: '#0a1a3a', c2: '#1e90ff', c3: '#87ceeb', dust: '#4169e1' },  // Blue
  { c1: '#2a1a0a', c2: '#ff6347', c3: '#ffa07a', dust: '#cd5c5c' },  // Coral
  { c1: '#0a2a2a', c2: '#20b2aa', c3: '#7fffd4', dust: '#40e0d0' },  // Aqua
  { c1: '#1a1a3a', c2: '#6a5acd', c3: '#e6e6fa', dust: '#9370db' },  // Lavender
];

const Nebula: React.FC = () => {
  // Generate truly random nebulae - different each page load
  const nebulae: NebulaConfig[] = useMemo(() => {
    const count = 5 + Math.floor(Math.random() * 3); // 5-7 nebulae
    const generated: NebulaConfig[] = [];
    
    for (let i = 0; i < count; i++) {
      // Random position distributed around the scene
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 80; // 80-160 units from center
      const x = Math.cos(angle) * distance;
      const y = (Math.random() - 0.5) * 80; // -40 to 40 vertical
      const z = -90 - Math.random() * 70; // -90 to -160 depth
      
      // Random color palette
      const paletteIndex = Math.floor(Math.random() * nebulaColorPalettes.length);
      const palette = nebulaColorPalettes[paletteIndex];
      
      // Random scale and properties
      const scale = 60 + Math.random() * 50; // 60-110
      const opacity = 0.2 + Math.random() * 0.2; // 0.2-0.4
      const rotationSpeed = (Math.random() - 0.5) * 0.001; // -0.0005 to 0.0005
      const dustCount = 100 + Math.floor(Math.random() * 150); // 100-250
      
      generated.push({
        position: [x, y, z] as [number, number, number],
        color1: palette.dark,
        color2: palette.bright,
        scale,
        opacity,
        rotationSpeed,
        dustColor: palette.dust,
        dustCount
      });
    }
    
    return generated;
  }, []);

  // Generate random spiral nebula - different each page load
  const spiralNebula: SpiralConfig = useMemo(() => {
    // Random position
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = (Math.random() - 0.5) * 60;
    const z = -100 - Math.random() * 50;
    
    // Random spiral palette
    const paletteIndex = Math.floor(Math.random() * spiralColorPalettes.length);
    const palette = spiralColorPalettes[paletteIndex];
    
    return {
      position: [x, y, z] as [number, number, number],
      color1: palette.c1,
      color2: palette.c2,
      color3: palette.c3,
      scale: 20 + Math.random() * 30,
      opacity: 0.28 + Math.random() * 0.1,
      rotationSpeed: 0.0006 + Math.random() * 0.0004,
      seed: Math.random() * 10,
      dustColor: palette.dust
    };
  }, []);

  return (
    <group>
      {/* Random cloud nebulae */}
      {nebulae.map((nebula, index) => (
        <group key={index}>
          <NebulaCloud
            position={nebula.position}
            color1={nebula.color1}
            color2={nebula.color2}
            scale={nebula.scale}
            opacity={nebula.opacity}
            rotationSpeed={nebula.rotationSpeed}
          />
          <NebulaDust
            position={nebula.position}
            color={nebula.dustColor}
            count={nebula.dustCount}
            spread={nebula.scale * 0.4}
          />
        </group>
      ))}

      {/* Special spiral nebula */}
      <SpiralNebula
        position={spiralNebula.position}
        color1={spiralNebula.color1}
        color2={spiralNebula.color2}
        color3={spiralNebula.color3}
        scale={spiralNebula.scale}
        opacity={spiralNebula.opacity}
        rotationSpeed={spiralNebula.rotationSpeed}
        seed={spiralNebula.seed}
      />
      <NebulaDust
        position={spiralNebula.position}
        color={spiralNebula.dustColor}
        count={200}
        spread={spiralNebula.scale * 0.4}
      />
    </group>
  );
};

export default Nebula;
