import React, { forwardRef, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color, AdditiveBlending, Points, BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';


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

// Solar flare vertex shader - for dramatic eruptions
const solarFlareVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uFlareTime;
  uniform float uDuration;
  uniform vec3 uFlareOrigin;
  uniform vec3 uFlareDirection;
  // Variation uniforms
  uniform float uScale;
  uniform float uSpread;
  uniform float uDistance;
  uniform float uSpeed;
  
  attribute float aRandom;
  attribute float aParticleIndex;
  
  varying float vAlpha;
  varying float vHeat;
  
  void main() {
    // Flare lifetime based on duration
    float flareProgress = clamp(uFlareTime / uDuration, 0.0, 1.0);
    
    // Each particle has slightly different timing based on index
    float particleDelay = aParticleIndex * 0.03 * (2.0 - uSpeed);
    float particleProgress = clamp((uFlareTime - particleDelay) / (uDuration * 0.8), 0.0, 1.0);
    
    // Ejection speed varies per particle, scaled by flare speed
    float speed = (0.6 + aRandom * 0.8) * uSpeed;
    
    // Calculate arc trajectory - height varies with distance
    float arcHeight = sin(particleProgress * 3.14159) * (0.3 + aRandom * 0.5) * uDistance;
    float outwardDist = particleProgress * speed * uDistance;
    
    // Spread particles in a cone - spread angle varies per flare
    float spreadAngle = aRandom * uSpread;
    float spreadRotation = aParticleIndex * 2.39996 + aRandom * 1.5; // Golden angle + randomness
    
    vec3 perpendicular1 = normalize(cross(uFlareDirection, vec3(0.0, 1.0, 0.0)));
    if (length(perpendicular1) < 0.1) perpendicular1 = normalize(cross(uFlareDirection, vec3(1.0, 0.0, 0.0)));
    vec3 perpendicular2 = normalize(cross(uFlareDirection, perpendicular1));
    
    // Wider spread for larger flares
    vec3 spreadOffset = (perpendicular1 * cos(spreadRotation) + perpendicular2 * sin(spreadRotation)) 
                       * spreadAngle * outwardDist * (0.5 + uScale * 0.5);
    
    // Final position: origin + outward movement + arc + spread
    vec3 flarePos = uFlareOrigin 
                  + uFlareDirection * outwardDist 
                  + uFlareDirection * arcHeight * 0.25
                  + spreadOffset;
    
    // Alpha: fade in quickly, sustain, fade out
    float fadeIn = smoothstep(0.0, 0.15, particleProgress);
    float fadeOut = 1.0 - smoothstep(0.5, 1.0, particleProgress);
    vAlpha = fadeIn * fadeOut * (0.6 + aRandom * 0.4) * min(uScale, 1.5);
    
    // Heat: hotter at beginning, cooler as it travels
    vHeat = 1.0 - particleProgress * 0.5;
    
    // Hide particles before their time
    if (particleProgress <= 0.0) {
      vAlpha = 0.0;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(flarePos, 1.0);
    // Size varies with scale and arc height
    gl_PointSize = uSize * uScale * (1.0 + arcHeight * 1.5) * (300.0 / -mvPosition.z) * (1.0 - particleProgress * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Solar flare fragment shader - orange/yellow hot plasma
const solarFlareFragmentShader = `
  varying float vAlpha;
  varying float vHeat;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Color gradient - more orange, less yellow
    vec3 hotCore = vec3(1.0, 0.95, 0.7);      // Warm white-yellow core
    vec3 brightOrange = vec3(1.0, 0.6, 0.15); // Bright orange
    vec3 deepOrange = vec3(1.0, 0.35, 0.05);  // Deep orange/red
    
    // Blend from deep orange to bright orange based on heat
    vec3 color = mix(deepOrange, brightOrange, vHeat);
    
    // Hot core at center of particle
    float core = 1.0 - smoothstep(0.0, 0.25, dist);
    color = mix(color, hotCore, core * vHeat * 0.7);
    
    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;

// Pulsar beam vertex shader - bi-directional pole beams
const pulsarBeamVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform float uBeamTime;
  uniform float uDuration;
  uniform float uBeamLength;
  uniform float uDirection; // 1.0 for up, -1.0 for down
  
  attribute float aRandom;
  attribute float aParticleIndex;
  
  varying float vAlpha;
  varying float vHeat;
  varying float vDistFromCenter;
  
  void main() {
    // Beam lifetime
    float beamProgress = clamp(uBeamTime / uDuration, 0.0, 1.0);
    
    // Particles stream outward along Y axis
    float particleOffset = aParticleIndex;
    float streamProgress = fract(beamProgress * 3.0 + particleOffset);
    
    // Distance along beam
    float beamDist = streamProgress * uBeamLength;
    
    // Spiral motion around beam axis
    float spiralSpeed = 8.0;
    float spiralRadius = 0.08 * (1.0 - streamProgress * 0.5) * (1.0 + aRandom * 0.5);
    float spiralAngle = uTime * spiralSpeed + aParticleIndex * 6.28 + aRandom * 3.14;
    
    // Position along beam with spiral
    vec3 beamPos = vec3(
      cos(spiralAngle) * spiralRadius,
      beamDist * uDirection,
      sin(spiralAngle) * spiralRadius
    );
    
    // Intensity envelope - bright burst then fade
    float burstPhase = beamProgress * 3.14159;
    float intensity = sin(burstPhase) * (1.0 - beamProgress * 0.3);
    
    // Alpha based on position in stream and overall intensity
    float streamFade = 1.0 - streamProgress * 0.7;
    vAlpha = intensity * streamFade * (0.6 + aRandom * 0.4);
    
    // Heat - hotter near the sun
    vHeat = 1.0 - streamProgress * 0.6;
    vDistFromCenter = spiralRadius / 0.12;
    
    // Hide before beam starts
    if (beamProgress <= 0.01) {
      vAlpha = 0.0;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(beamPos, 1.0);
    gl_PointSize = uSize * (1.5 - streamProgress * 0.8) * intensity * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Pulsar beam fragment shader - intense blue-white energy
const pulsarBeamFragmentShader = `
  varying float vAlpha;
  varying float vHeat;
  varying float vDistFromCenter;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Pulsar colors - intense cyan/blue/white
    vec3 hotWhite = vec3(1.0, 1.0, 1.0);
    vec3 brightCyan = vec3(0.4, 0.9, 1.0);
    vec3 deepBlue = vec3(0.2, 0.5, 1.0);
    
    // Core is white-hot, edges are blue
    vec3 color = mix(deepBlue, brightCyan, vHeat);
    
    // Hot white core
    float core = 1.0 - smoothstep(0.0, 0.3, dist);
    color = mix(color, hotWhite, core * vHeat);
    
    // Center of beam is brighter
    float centerBrightness = 1.0 - vDistFromCenter * 0.3;
    color *= centerBrightness;
    
    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;

// Interface for pulsar beam event
interface PulsarBeam {
  id: number;
  startTime: number;
  duration: number;
}

// Interface for tracking active flares
interface SolarFlare {
  id: number;
  origin: Vector3;
  direction: Vector3;
  startTime: number;
  duration: number;
  // Variation parameters
  scale: number;        // Overall size multiplier (0.3 - 2.0)
  spread: number;       // Cone spread angle (0.1 - 0.8)
  distance: number;     // Travel distance multiplier (0.5 - 2.5)
  speed: number;        // Ejection speed multiplier (0.5 - 1.5)
}

// Pulsar Beam Particles Component
interface PulsarBeamParticlesProps {
  beam: PulsarBeam;
  geometry: BufferGeometry;
  direction: number; // 1 for up, -1 for down
  beamLength: number;
}

const PulsarBeamParticles: React.FC<PulsarBeamParticlesProps> = ({ beam, geometry, direction, beamLength }) => {
  const materialRef = useRef<ShaderMaterial>(null!);
  
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.0 },
        uBeamTime: { value: 0 },
        uDuration: { value: beam.duration },
        uBeamLength: { value: beamLength },
        uDirection: { value: direction },
      },
      vertexShader: pulsarBeamVertexShader,
      fragmentShader: pulsarBeamFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });
  }, [beam.duration, direction, beamLength]);
  
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uBeamTime.value = t - beam.startTime;
    }
  });
  
  return (
    <points geometry={geometry}>
      <primitive object={material} attach="material" ref={materialRef} />
    </points>
  );
};

// Solar Flare Particles Component
interface SolarFlareParticlesProps {
  flare: SolarFlare;
  geometry: BufferGeometry;
  currentTime: number;
}

const SolarFlareParticles: React.FC<SolarFlareParticlesProps> = ({ flare, geometry }) => {
  const materialRef = useRef<ShaderMaterial>(null!);
  
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 1.5 },
        uFlareTime: { value: 0 },
        uDuration: { value: flare.duration },
        uFlareOrigin: { value: flare.origin },
        uFlareDirection: { value: flare.direction },
        // Variation uniforms
        uScale: { value: flare.scale },
        uSpread: { value: flare.spread },
        uDistance: { value: flare.distance },
        uSpeed: { value: flare.speed },
      },
      vertexShader: solarFlareVertexShader,
      fragmentShader: solarFlareFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });
  }, [flare.origin, flare.direction, flare.duration, flare.scale, flare.spread, flare.distance, flare.speed]);
  
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uFlareTime.value = t - flare.startTime;
    }
  });
  
  return (
    <points geometry={geometry}>
      <primitive object={material} attach="material" ref={materialRef} />
    </points>
  );
};

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
  const lastFlareTimeRef = useRef<number>(0);
  const flareIdCounterRef = useRef<number>(0);
  const lastPulsarTimeRef = useRef<number>(0);
  const pulsarIdCounterRef = useRef<number>(0);
  const flareTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Track active solar flares
  const [activeFlares, setActiveFlares] = useState<SolarFlare[]>([]);
  
  // Track active pulsar beams
  const [activePulsarBeam, setActivePulsarBeam] = useState<PulsarBeam | null>(null);
  
  // Spawn a new solar flare at a random position
  const spawnFlare = useCallback((currentTime: number) => {
    const sunRadius = size * 0.25;
    
    // Random position on sun surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const origin = new Vector3(
      sunRadius * Math.sin(phi) * Math.cos(theta),
      sunRadius * Math.sin(phi) * Math.sin(theta),
      sunRadius * Math.cos(phi)
    );
    
    // Direction is outward from center with some randomness
    const direction = origin.clone().normalize();
    // Add slight random deviation
    direction.x += (Math.random() - 0.5) * 0.4;
    direction.y += (Math.random() - 0.5) * 0.4;
    direction.z += (Math.random() - 0.5) * 0.4;
    direction.normalize();
    
    // Generate random variation parameters
    // Use weighted randomness for more interesting distribution
    const sizeRoll = Math.random();
    let scale: number;
    if (sizeRoll < 0.5) {
      // 50% small flares
      scale = 0.3 + Math.random() * 0.5; // 0.3 - 0.8
    } else if (sizeRoll < 0.85) {
      // 35% medium flares
      scale = 0.8 + Math.random() * 0.7; // 0.8 - 1.5
    } else {
      // 15% large dramatic flares
      scale = 1.5 + Math.random() * 1.0; // 1.5 - 2.5
    }
    
    // Spread varies - some tight jets, some wide sprays
    const spreadRoll = Math.random();
    let spread: number;
    if (spreadRoll < 0.4) {
      spread = 0.1 + Math.random() * 0.15; // Tight jets
    } else if (spreadRoll < 0.8) {
      spread = 0.25 + Math.random() * 0.25; // Medium spread
    } else {
      spread = 0.5 + Math.random() * 0.4; // Wide sprays
    }
    
    // Distance varies significantly
    const distanceRoll = Math.random();
    let distance: number;
    if (distanceRoll < 0.3) {
      distance = 0.3 + Math.random() * 0.4; // Short bursts
    } else if (distanceRoll < 0.7) {
      distance = 0.7 + Math.random() * 0.6; // Medium reach
    } else {
      distance = 1.3 + Math.random() * 1.2; // Long eruptions
    }
    
    // Speed affects how quickly the flare travels
    const speed = 0.5 + Math.random() * 1.0; // 0.5 - 1.5
    
    // Duration correlates with distance and scale
    const baseDuration = 1.5 + Math.random() * 1.0;
    const duration = baseDuration * (0.7 + distance * 0.3) * (0.8 + scale * 0.2);
    
    const newFlare: SolarFlare = {
      id: flareIdCounterRef.current++,
      origin,
      direction,
      startTime: currentTime,
      duration,
      scale,
      spread,
      distance,
      speed,
    };
    
    setActiveFlares(prev => [...prev, newFlare]);
  }, [size]);

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

  // Create flare particle geometry (shared between all flares)
  const flareGeometry = useMemo(() => {
    const particleCount = 50; // Particles per flare - enough for large flares
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    const particleIndices = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Initial positions don't matter - shader will compute them
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      randoms[i] = Math.random();
      particleIndices[i] = i / particleCount;
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1));
    geometry.setAttribute('aParticleIndex', new Float32BufferAttribute(particleIndices, 1));
    
    return geometry;
  }, []);

  // Create pulsar beam geometry
  const pulsarGeometry = useMemo(() => {
    const particleCount = 150; // More particles for dense beam
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    const particleIndices = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      randoms[i] = Math.random();
      particleIndices[i] = i / particleCount;
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1));
    geometry.setAttribute('aParticleIndex', new Float32BufferAttribute(particleIndices, 1));
    
    return geometry;
  }, []);

  // Cleanup timers and dispose resources on unmount
  useEffect(() => {
    return () => {
      // Clear all pending flare timers
      flareTimersRef.current.forEach(timer => clearTimeout(timer));
      flareTimersRef.current = [];
      
      // Dispose geometries and materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      flareGeometry.dispose();
      pulsarGeometry.dispose();
    };
  }, [particleGeometry, particleMaterial, flareGeometry, pulsarGeometry]);

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
    
    // Spawn new solar flares every 4-6 seconds (randomized)
    const timeSinceLastFlare = t - lastFlareTimeRef.current;
    const nextFlareInterval = 4 + Math.random() * 2; // 4-6 seconds
    
    if (timeSinceLastFlare > nextFlareInterval || lastFlareTimeRef.current === 0) {
      // Spawn 1-3 flares at once for more dramatic effect
      const flareCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < flareCount; i++) {
        const timer = setTimeout(() => spawnFlare(t + i * 0.3), i * 300);
        flareTimersRef.current.push(timer);
      }
      lastFlareTimeRef.current = t;
    }
    
    // Clean up expired flares
    setActiveFlares(prev => 
      prev.filter(flare => (t - flare.startTime) < flare.duration + 0.5)
    );
    
    // Spawn pulsar beam every 20 seconds
    const timeSinceLastPulsar = t - lastPulsarTimeRef.current;
    const pulsarInterval = 20 + Math.random() * 30; // Every 20-50 seconds
    
    if (timeSinceLastPulsar > pulsarInterval || lastPulsarTimeRef.current === 0) {
      const newBeam: PulsarBeam = {
        id: pulsarIdCounterRef.current++,
        startTime: t,
        duration: 2.0 + Math.random() * 4.0, // 2-6 seconds
      };
      setActivePulsarBeam(newBeam);
      lastPulsarTimeRef.current = t;
    }
    
    // Clean up expired pulsar beam
    if (activePulsarBeam && (t - activePulsarBeam.startTime) > activePulsarBeam.duration + 0.5) {
      setActivePulsarBeam(null);
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

      {/* Solar Flares */}
      {activeFlares.map(flare => (
        <SolarFlareParticles
          key={flare.id}
          flare={flare}
          geometry={flareGeometry}
          currentTime={lastFlareTimeRef.current}
        />
      ))}

      {/* Pulsar Beams - bi-directional from poles */}
      {activePulsarBeam && (
        <>
          {/* Upper beam (positive Y) */}
          <PulsarBeamParticles
            key={`pulsar-up-${activePulsarBeam.id}`}
            beam={activePulsarBeam}
            geometry={pulsarGeometry}
            direction={1}
            beamLength={2 + Math.random() * 12}
          />
          {/* Lower beam (negative Y) */}
          <PulsarBeamParticles
            key={`pulsar-down-${activePulsarBeam.id}`}
            beam={activePulsarBeam}
            geometry={pulsarGeometry}
            direction={-1}
            beamLength={2 + Math.random() * 12}
          />
        </>
      )}

      {/* Atmosphere layer */}
      <mesh
        scale={[0.725, 0.725, 0.725]}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.05}
          roughness={0.76}  
          metalness={0.3}
        />
      </mesh>





    </group>
  );
});

Sun.displayName = 'Sun';

export default Sun;
