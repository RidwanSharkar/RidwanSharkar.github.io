import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Vector3, Mesh, BufferGeometry, Group, BufferAttribute, SphereGeometry, MeshStandardMaterial } from 'three';

interface ExplosionProps {
  position: Vector3;
  color: string;
  size?: number;
  duration?: number;
  particleCount?: number;
}

const Explosion: React.FC<ExplosionProps> = ({
  position,
  color,
  size = 1,
  duration = 1,
  particleCount = 20
}) => {
  const groupRef = useRef<Group>(null);
  const particles = useRef<Array<{
    mesh: Mesh;
    velocity: Vector3;
    startTime: number;
  }>>([]);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current; // Copy ref to local variable

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const geometry = new BufferGeometry();
      const vertices = new Float32Array([0, 0, 0]); // Single point
      geometry.setAttribute('position', new BufferAttribute(vertices, 3));

      const particle = new Mesh(
        new SphereGeometry(0.05 * size, 8, 8),
        new MeshStandardMaterial({
          color: new Color(color),
          emissive: new Color(color),
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 1
        })
      );

      // Random direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const velocity = new Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).multiplyScalar(0.1 * size);

      particle.position.copy(position);
      group.add(particle);

      particles.current.push({
        mesh: particle,
        velocity: velocity,
        startTime: Date.now()
      });
    }

    return () => {
      particles.current.forEach(particle => {
        group.remove(particle.mesh);
      });
      particles.current = [];
    };
  }, [position, color, size, particleCount]);

  useFrame(() => {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000;

    if (elapsedTime > duration) {       // Remove explosion
      if (groupRef.current) {
        particles.current.forEach(particle => {
          groupRef.current?.remove(particle.mesh);
        });
        particles.current = [];
      }
      return;
    }

    particles.current.forEach(particle => {
      // Update particle positions with v and g
      particle.mesh.position.add(particle.velocity);
      particle.velocity.y -= 0.001; // Add gravity effect

      // Fade out particles
      const particleElapsedTime = (currentTime - particle.startTime) / 1000;
      const opacity = 1 - particleElapsedTime / duration;
      const scale = 1 - (particleElapsedTime / duration) * 0.5;

      if (particle.mesh.material instanceof MeshStandardMaterial) {
        particle.mesh.material.opacity = opacity;
      }
      particle.mesh.scale.setScalar(scale);
    });
  });

  return <group ref={groupRef} />;
};

export default Explosion;
