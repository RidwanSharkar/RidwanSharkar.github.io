// warpgate/MissileExplosion.tsx
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  Vector3,
  Mesh,
  Points,
  BufferAttribute,
  AdditiveBlending,
  ShaderMaterial,
  MeshBasicMaterial,
} from 'three';

/* ====================================== TUNING CONSTANTS ====================================== */
const DURATION = 1.0;            // total lifetime in seconds (self-cleans after this)
const FLASH_MAX_SCALE = 1.6;     // peak radius of the additive flash sphere
const SHOCKWAVE_MAX_SCALE = 3.2; // peak radius of the surface shockwave ring
const PARTICLE_COUNT = 26;       // colored debris particles
const PARTICLE_SPEED = 3.0;      // world units per second for particle expansion
const BASE_SIZE = 0.5;           // overall explosion scale factor

interface MissileExplosionProps {
  position: Vector3;
  normal: Vector3;
  color: string;
  onComplete: () => void;
}

const MissileExplosion: React.FC<MissileExplosionProps> = ({
  position,
  normal,
  color,
  onComplete,
}) => {
  const flashRef = useRef<Mesh>(null);
  const shockwaveRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);
  const startRef = useRef<number>(performance.now());
  const completedRef = useRef(false);

  const baseColor = useMemo(() => new Color(color), [color]);

  // Per-particle directions (hemisphere biased along the surface normal) + speeds
  const particleData = useMemo(() => {
    const dirs: Vector3[] = [];
    const speeds: number[] = [];
    const n = normal.clone().normalize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const random = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      // Bias outward from the surface so debris sprays away from the body
      random.addScaledVector(n, 0.6).normalize();
      dirs.push(random);
      speeds.push(PARTICLE_SPEED * (0.5 + Math.random()));
    }
    return { dirs, speeds };
  }, [normal]);

  const particlePositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const particleOpacities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT));

  useEffect(() => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlePositions.current[i * 3] = position.x;
      particlePositions.current[i * 3 + 1] = position.y;
      particlePositions.current[i * 3 + 2] = position.z;
      particleOpacities.current[i] = 1;
    }
  }, [position]);

  // Flash sphere: additive, bright core fading to the body color
  const flashMaterial = useMemo(() => new MeshBasicMaterial({
    color: new Color(color).lerp(new Color('#ffffff'), 0.7),
    transparent: true,
    opacity: 1,
    blending: AdditiveBlending,
    depthWrite: false,
  }), [color]);

  // Shockwave ring material
  const shockwaveMaterial = useMemo(() => new MeshBasicMaterial({
    color: new Color(color).lerp(new Color('#ffffff'), 0.4),
    transparent: true,
    opacity: 1,
    blending: AdditiveBlending,
    depthWrite: false,
  }), [color]);

  // Additive point-sprite material for the particle burst
  const particleMaterial = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uColor: { value: baseColor },
    },
    vertexShader: `
      attribute float opacity;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = 14.0 * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float strength = smoothstep(0.5, 0.05, d);
        vec3 glow = mix(uColor, vec3(1.0), 0.3);
        gl_FragColor = vec4(glow, vOpacity * strength);
      }
    `,
  }), [baseColor]);

  // Orient the shockwave ring so its plane is tangent to the surface (normal = center->impact)
  useEffect(() => {
    if (shockwaveRef.current) {
      const lookTarget = position.clone().add(normal);
      shockwaveRef.current.lookAt(lookTarget);
    }
  }, [position, normal]);

  useEffect(() => {
    return () => {
      flashMaterial.dispose();
      shockwaveMaterial.dispose();
      particleMaterial.dispose();
    };
  }, [flashMaterial, shockwaveMaterial, particleMaterial]);

  useFrame(() => {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const t = Math.min(elapsed / DURATION, 1);

    if (t >= 1) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    // Flash: rapid expansion then fade out (ease-out)
    if (flashRef.current) {
      const flashT = Math.min(t / 0.35, 1);
      const scale = BASE_SIZE * (0.2 + FLASH_MAX_SCALE * flashT);
      flashRef.current.scale.setScalar(scale);
      flashMaterial.opacity = Math.max(0, 1 - t / 0.5);
    }

    // Shockwave ring: expands across the full duration while fading
    if (shockwaveRef.current) {
      const scale = BASE_SIZE * (0.2 + SHOCKWAVE_MAX_SCALE * t);
      shockwaveRef.current.scale.setScalar(scale);
      shockwaveMaterial.opacity = Math.max(0, 1 - t);
    }

    // Particle burst: expand outward along their directions and fade
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = particleData.dirs[i];
      const travel = particleData.speeds[i] * BASE_SIZE * elapsed;
      particlePositions.current[i * 3] = position.x + d.x * travel;
      particlePositions.current[i * 3 + 1] = position.y + d.y * travel;
      particlePositions.current[i * 3 + 2] = position.z + d.z * travel;
      particleOpacities.current[i] = Math.max(0, 1 - t);
    }
    if (particlesRef.current) {
      const geometry = particlesRef.current.geometry;
      const positionAttr = geometry.attributes.position as BufferAttribute;
      positionAttr.array.set(particlePositions.current);
      positionAttr.needsUpdate = true;
      const opacityAttr = geometry.attributes.opacity as BufferAttribute | undefined;
      if (opacityAttr) {
        opacityAttr.array.set(particleOpacities.current);
        opacityAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Additive flash sphere */}
      <mesh ref={flashRef} position={position}>
        <sphereGeometry args={[1, 16, 16]} />
        <primitive object={flashMaterial} attach="material" />
      </mesh>

      {/* Surface-oriented shockwave ring */}
      <mesh ref={shockwaveRef} position={position}>
        <ringGeometry args={[0.55, 0.7, 48]} />
        <primitive object={shockwaveMaterial} attach="material" />
      </mesh>

      {/* Colored particle burst */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={particlePositions.current}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={PARTICLE_COUNT}
            array={particleOpacities.current}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive object={particleMaterial} attach="material" />
      </points>
    </group>
  );
};

export default MissileExplosion;
