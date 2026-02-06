import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Mesh, Points, BufferAttribute, AdditiveBlending, ShaderMaterial } from 'three';

interface PlanetTrailProps {
  color: Color;
  size: number;
  meshRef: React.RefObject<Mesh>;
  orbitRadius: number;
  orbitSpeed: number;
  opacity: number;
  particlesCount?: number;
}

const PlanetTrail: React.FC<PlanetTrailProps> = ({
  color,
  size,
  meshRef,
  opacity,
  particlesCount = 5,
}) => {
  const particlesRef = useRef<Points>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array(particlesCount * 3));
  const opacitiesRef = useRef<Float32Array>(new Float32Array(particlesCount));
  const scalesRef = useRef<Float32Array>(new Float32Array(particlesCount));

  // Memoize shader material
  const trailMaterial = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
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
        float strength = smoothstep(0.5, 0.1, d);
        vec3 glowColor = mix(uColor, vec3(1.0), 0.3);
        gl_FragColor = vec4(glowColor, vOpacity * strength);
      }
    `,
    uniforms: {
      uColor: { value: color },
    },
  }), [color]);

  // Dispose material on unmount
  useEffect(() => {
    return () => {
      trailMaterial.dispose();
    };
  }, [trailMaterial]);

  useFrame(() => {
    if (!particlesRef.current?.parent || !meshRef.current) return;

    const { x, y, z } = meshRef.current.position;

    for (let i = particlesCount - 1; i > 0; i--) {
      positionsRef.current[i * 3] = positionsRef.current[(i - 1) * 3];
      positionsRef.current[i * 3 + 1] = positionsRef.current[(i - 1) * 3 + 1];
      positionsRef.current[i * 3 + 2] = positionsRef.current[(i - 1) * 3 + 2];

      opacitiesRef.current[i] =
        Math.pow((1 - i / particlesCount), 2) *
        0.3 *
        opacity;

      scalesRef.current[i] =
        size *
        0.9 *
        Math.pow((1 - i / particlesCount), 0.5);
    }

    positionsRef.current[0] = x;
    positionsRef.current[1] = y;
    positionsRef.current[2] = z;
    opacitiesRef.current[0] = 0.4 * opacity;
    scalesRef.current[0] = size * 1;

    if (particlesRef.current) {
      const geometry = particlesRef.current.geometry;

      // Update buffer attributes in place instead of reassigning array
      const positionAttr = geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < positionsRef.current.length; i++) {
        positionAttr.array[i] = positionsRef.current[i];
      }
      positionAttr.needsUpdate = true;

      if (geometry.attributes.opacity) {
        const opacityAttr = geometry.attributes.opacity as BufferAttribute;
        for (let i = 0; i < opacitiesRef.current.length; i++) {
          opacityAttr.array[i] = opacitiesRef.current[i];
        }
        opacityAttr.needsUpdate = true;
      }

      if (geometry.attributes.scale) {
        const scaleAttr = geometry.attributes.scale as BufferAttribute;
        for (let i = 0; i < scalesRef.current.length; i++) {
          scaleAttr.array[i] = scalesRef.current[i];
        }
        scaleAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positionsRef.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={particlesCount}
          array={opacitiesRef.current}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={particlesCount}
          array={scalesRef.current}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={trailMaterial} attach="material" />
    </points>
  );
};

export default PlanetTrail;