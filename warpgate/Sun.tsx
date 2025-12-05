import React, { forwardRef, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color, AdditiveBlending, Points, BufferGeometry, Float32BufferAttribute } from 'three';


// Solar storm particle vertex shader
const solarParticleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  attribute float aRandom;
  attribute float aPhase;
  attribute vec3 aVelocity;
  varying float vAlpha;
  varying float vRandom;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
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
  
  void main() {
    vRandom = aRandom;
    
    // Create cyclic animation based on phase
    float cycle = mod(uTime * 0.3 + aPhase, 1.0);
    
    // Particles erupt and fall back
    float eruptionHeight = sin(cycle * 3.14159) * (0.15 + aRandom * 0.25);
    
    // Add turbulence with noise
    float noiseScale = 2.0;
    float turbulence = snoise(position * noiseScale + uTime * 0.5) * 0.08;
    
    // Calculate displaced position
    vec3 direction = normalize(position);
    vec3 displaced = position + direction * eruptionHeight;
    
    // Add swirling motion
    float swirl = uTime * (0.5 + aRandom * 0.5);
    displaced.x += sin(swirl + position.y * 3.0) * turbulence;
    displaced.z += cos(swirl + position.y * 3.0) * turbulence;
    displaced.y += sin(uTime + aRandom * 6.28) * 0.02;
    
    // Alpha based on eruption cycle - fade in and out
    vAlpha = sin(cycle * 3.14159) * (0.6 + aRandom * 0.4);
    
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_PointSize = uSize * (1.0 + eruptionHeight * 2.0) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Solar storm particle fragment shader
const solarParticleFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying float vAlpha;
  varying float vRandom;
  
  void main() {
    // Create soft circular particle
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Mix between orange colors based on random value
    vec3 color;
    if (vRandom < 0.33) {
      color = mix(uColor1, uColor2, vRandom * 3.0);
    } else if (vRandom < 0.66) {
      color = mix(uColor2, uColor3, (vRandom - 0.33) * 3.0);
    } else {
      color = mix(uColor3, uColor1, (vRandom - 0.66) * 3.0);
    }
    
    // Add hot white core
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    color = mix(color, vec3(1.0, 0.95, 0.8), core * 0.5);
    
    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;

interface SunProps {
  size?: number;
  color?: string | Color;
  glowIntensity?: number;
  rotationSpeed?: number;
  emissiveIntensity?: number;
}

const Sun = forwardRef<Mesh, SunProps>(({
  size = 1.5,
  color = "#FDB813",
  rotationSpeed = 0.001,
}, ref) => {
  const glowRef = useRef<Mesh>(null!);
  const particlesRef = useRef<Points>(null!);
  const particleMaterialRef = useRef<ShaderMaterial>(null!);

  // Create solar particle geometry
  const { particleGeometry, particleMaterial } = useMemo(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    const sunRadius = size * 0.5;
    
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = sunRadius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = sunRadius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = sunRadius * Math.cos(phi);
      
      randoms[i] = Math.random();
      phases[i] = Math.random(); // Stagger particle animation phases
      
      // Random velocity direction for turbulence
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1));
    geometry.setAttribute('aPhase', new Float32BufferAttribute(phases, 1));
    geometry.setAttribute('aVelocity', new Float32BufferAttribute(velocities, 3));
    
    const material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 1 },
        uColor1: { value: new Color('#FF6B00') }, // Deep orange
        uColor2: { value: new Color('#FFA500') }, // Orange
        uColor3: { value: new Color('#FFCC00') }, // Yellow-orange
      },
      vertexShader: solarParticleVertexShader,
      fragmentShader: solarParticleFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    
    return { particleGeometry: geometry, particleMaterial: material };
  }, [size]);


  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.rotation.y += rotationSpeed;
    }

    const glowMaterial = glowRef.current?.material as ShaderMaterial;
    if (glowMaterial?.uniforms) {
      glowMaterial.uniforms.intensity.value = 0.5 + Math.abs(Math.sin(t)) * 0.5;
    }
    
    // Update solar particle animation
    if (particleMaterialRef.current) {
      particleMaterialRef.current.uniforms.uTime.value = t;
    }
    
    // Slowly rotate particle system
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0003;
      particlesRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <group>
      {/* PointLight for illuminating planets */}
      <pointLight
        color={color}
        intensity={1.25} 
        distance={2000}
        decay={0.7} 
      />

      {/* Solar storm particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <primitive object={particleMaterial} attach="material" ref={particleMaterialRef} />
      </points>




      {/* Atmosphere layer */}
      <mesh
        scale={[0.85, 0.85, 0.85]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.76}  
          metalness={0.3}
        />
      </mesh>





    </group>
  );
});

Sun.displayName = 'Sun';

export default Sun;
