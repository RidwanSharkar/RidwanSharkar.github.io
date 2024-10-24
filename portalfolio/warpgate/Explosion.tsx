import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Mesh, 
  Vector3, 
  Color, 
  SphereGeometry, 
  MeshBasicMaterial 
} from 'three';

interface ExplosionProps {
  position: Vector3;
  color: string;
}

const Explosion: React.FC<ExplosionProps> = ({ position, color }) => {
  const particles = useRef<Mesh[]>([]);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    // Particles
    particles.current = Array.from({ length: 50 }, () => {
      const mesh = new Mesh(
        new SphereGeometry(0.1, 8, 8),
        new MeshBasicMaterial({
          color: new Color(color),
          transparent: true,
        })
      );
      mesh.position.copy(position);
      mesh.userData.velocity = new Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
      return mesh;
    });
  }, [position, color]);

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    
    particles.current.forEach((particle) => {
      particle.position.add(particle.userData.velocity);
      particle.userData.velocity.multiplyScalar(0.98);
      
      const material = particle.material as MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - elapsed);
      
      particle.scale.multiplyScalar(0.98);
    });
  });

  return (
    <group>
      {particles.current.map((particle, i) => (
        <primitive key={i} object={particle} />
      ))}
    </group>
  );
};

export default Explosion;