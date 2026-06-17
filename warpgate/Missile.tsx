// warpgate/Missile.tsx
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Color,
  Vector3,
  Group,
  Points,
  BufferAttribute,
  AdditiveBlending,
  ShaderMaterial,
} from 'three';
import { TargetEntry } from './targetRegistry';

/* ====================================== TUNING CONSTANTS ====================================== */
const MISSILE_SPEED = 65;        // world units per second along the flight path
const COILS = 4;                 // number of times the pair winds around the center line
const R0 = 1.0;                  // starting helix radius (tightens to 0 at the aim point)
const MISSILE_RADIUS = 0.125;     // collision radius of the missile body
const TRAIL_COUNT = 30;          // ring-buffer trail length
const BODY_SIZE = 0.19;          // glowing body radius
const TRAIL_SIZE = 0.9;          // base scale fed into gl_PointSize — keep well under hw cap

interface MissileProps {
  launchOrigin: Vector3;
  aimPoint: Vector3;
  phase: number;
  color: string;
  targets: React.MutableRefObject<TargetEntry[]>;
  onImpact: (surfacePoint: Vector3, normal: Vector3, color: string) => void;
  onMiss: () => void;
}

const Missile: React.FC<MissileProps> = ({
  launchOrigin,
  aimPoint,
  phase,
  color,
  targets,
  onImpact,
  onMiss,
}) => {
  const bodyRef = useRef<Group>(null);
  const trailRef = useRef<Points>(null);
  const finishedRef = useRef(false);
  const tRef = useRef(0);

  // Perpendicular basis built once from the (fixed) flight direction
  const { dir, u, v, distance } = useMemo(() => {
    const d = new Vector3().subVectors(aimPoint, launchOrigin);
    const dist = d.length();
    d.normalize();
    // Pick a reference axis least aligned with the direction to avoid degenerate cross products
    const ref = Math.abs(d.y) < 0.99 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
    const uu = new Vector3().crossVectors(d, ref).normalize();
    const vv = new Vector3().crossVectors(d, uu).normalize();
    return { dir: d, u: uu, v: vv, distance: dist || 1 };
  }, [launchOrigin, aimPoint]);

  // Ring-buffer trail data, initialized at the launch origin so it doesn't streak from the origin
  const positions = useRef<Float32Array>(new Float32Array(TRAIL_COUNT * 3));
  const opacities = useRef<Float32Array>(new Float32Array(TRAIL_COUNT));
  const scales = useRef<Float32Array>(new Float32Array(TRAIL_COUNT));

  const bodyColor = useMemo(() => new Color(color), [color]);
  const trailColor = useMemo(() => new Color(color), [color]);

  useEffect(() => {
    for (let i = 0; i < TRAIL_COUNT; i++) {
      positions.current[i * 3] = launchOrigin.x;
      positions.current[i * 3 + 1] = launchOrigin.y;
      positions.current[i * 3 + 2] = launchOrigin.z;
    }
  }, [launchOrigin]);

  // Additive glow material for the missile body
  const bodyMaterial = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uColor: { value: bodyColor },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.85 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
        vec3 glow = mix(uColor, vec3(1.0), 0.6);
        gl_FragColor = vec4(glow, clamp(rim + 0.5, 0.0, 1.0));
      }
    `,
  }), [bodyColor]);

  // Trail material — matches PlanetTrail's soft-disc approach, adds a hot white core
  const trailMaterial = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uColor: { value: trailColor },
    },
    vertexShader: `
      attribute float opacity;
      attribute float scale;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = scale * 15.0 * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        // Outer soft halo — same curve as PlanetTrail
        float strength = smoothstep(0.5, 0.08, d);
        // Hot white core — brightens the centre of each sprite
        float core = smoothstep(0.22, 0.0, d);
        vec3 glowColor = mix(uColor, vec3(1.0), 0.3 + core * 0.6);
        gl_FragColor = vec4(glowColor, vOpacity * strength);
      }
    `,
  }), [trailColor]);

  useEffect(() => {
    return () => {
      bodyMaterial.dispose();
      trailMaterial.dispose();
    };
  }, [bodyMaterial, trailMaterial]);

  // Scratch vectors reused each frame
  const scratch = useMemo(() => ({
    center: new Vector3(),
    pos: new Vector3(),
    offset: new Vector3(),
    worldPos: new Vector3(),
    normal: new Vector3(),
    look: new Vector3(),
  }), []);

  useFrame((_, delta) => {
    if (finishedRef.current) return;

    // Advance along the path at a constant world-space speed
    tRef.current += (MISSILE_SPEED * delta) / distance;
    const t = Math.min(tRef.current, 1);

    // Center point along the line, then helix offset that tightens to 0 at the aim point
    const { center, pos, offset } = scratch;
    center.copy(launchOrigin).lerp(aimPoint, t);
    const a = phase + t * COILS * Math.PI * 2;
    const radius = R0 * (1 - t);
    offset.set(0, 0, 0)
      .addScaledVector(u, Math.cos(a) * radius)
      .addScaledVector(v, Math.sin(a) * radius);
    pos.copy(center).add(offset);

    // Update body position + orientation (face along flight direction)
    if (bodyRef.current) {
      bodyRef.current.position.copy(pos);
      scratch.look.copy(pos).add(dir);
      bodyRef.current.lookAt(scratch.look);
    }

    // Advance the ring-buffer trail
    for (let i = TRAIL_COUNT - 1; i > 0; i--) {
      positions.current[i * 3] = positions.current[(i - 1) * 3];
      positions.current[i * 3 + 1] = positions.current[(i - 1) * 3 + 1];
      positions.current[i * 3 + 2] = positions.current[(i - 1) * 3 + 2];
      // Opacity: squared decay (PlanetTrail style) but at full brightness
      opacities.current[i] = Math.pow(1 - i / TRAIL_COUNT, 1.6) * 0.95;
      // Scale: sqrt decay so the trail stays fat down its length
      scales.current[i] = TRAIL_SIZE * Math.pow(1 - i / TRAIL_COUNT, 0.45);
    }
    positions.current[0] = pos.x;
    positions.current[1] = pos.y;
    positions.current[2] = pos.z;
    opacities.current[0] = 1.0;
    scales.current[0] = TRAIL_SIZE * 1.15;

    if (trailRef.current) {
      const geometry = trailRef.current.geometry;
      const positionAttr = geometry.attributes.position as BufferAttribute;
      positionAttr.array.set(positions.current);
      positionAttr.needsUpdate = true;
      const opacityAttr = geometry.attributes.opacity as BufferAttribute | undefined;
      if (opacityAttr) {
        opacityAttr.array.set(opacities.current);
        opacityAttr.needsUpdate = true;
      }
      const scaleAttr = geometry.attributes.scale as BufferAttribute | undefined;
      if (scaleAttr) {
        scaleAttr.array.set(scales.current);
        scaleAttr.needsUpdate = true;
      }
    }

    // Continuous collision check against live registry targets
    const list = targets.current;
    for (let i = 0; i < list.length; i++) {
      const target = list[i];
      target.mesh.getWorldPosition(scratch.worldPos);
      const threshold = target.size + MISSILE_RADIUS;
      if (scratch.worldPos.distanceToSquared(pos) < threshold * threshold) {
        scratch.normal.copy(pos).sub(scratch.worldPos);
        if (scratch.normal.lengthSq() < 1e-6) {
          scratch.normal.copy(dir).negate();
        }
        scratch.normal.normalize();
        const surfacePoint = scratch.worldPos.clone().addScaledVector(scratch.normal, target.size);
        finishedRef.current = true;
        onImpact(surfacePoint, scratch.normal.clone(), target.color);
        return;
      }
    }

    // Reached the aim point with no hit -> ballistic miss, despawn quietly
    if (t >= 1) {
      finishedRef.current = true;
      onMiss();
    }
  });

  return (
    <group>
      <group ref={bodyRef}>
        <mesh>
          <sphereGeometry args={[BODY_SIZE, 12, 12]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
        {/* Elongated nose oriented along +Z (flight direction set via lookAt) */}
        <mesh position={[0, 0, BODY_SIZE * 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[BODY_SIZE * 0.7, BODY_SIZE * 3, 12]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
      </group>

      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={TRAIL_COUNT}
            array={positions.current}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={TRAIL_COUNT}
            array={opacities.current}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={TRAIL_COUNT}
            array={scales.current}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive object={trailMaterial} attach="material" />
      </points>
    </group>
  );
};

export default Missile;
