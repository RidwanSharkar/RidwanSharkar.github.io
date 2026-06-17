// warpgate/MissileSystem.tsx
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3, Plane } from 'three';
import Missile from './Missile';
import MissileExplosion from './MissileExplosion';
import { useTargetRegistry, TargetEntry } from './targetRegistry';

/* ====================================== TUNING CONSTANTS ====================================== */
const LAUNCH_DISTANCE = 70;      // how far back along the aim ray missiles spawn
const MISSILE_COLOR = '#7DF9FF'; // body/trail color of the missiles themselves

interface ActiveMissile {
  id: number;
  launchOrigin: Vector3;
  aimPoint: Vector3;
  phase: number;
}

interface ActiveExplosion {
  id: number;
  position: Vector3;
  normal: Vector3;
  color: string;
}

const MissileSystem: React.FC = () => {
  const three = useThree();
  const threeRef = useRef(three);
  threeRef.current = three;

  const registry = useTargetRegistry();
  const registryRef = useRef(registry);
  registryRef.current = registry;

  const [missiles, setMissiles] = useState<ActiveMissile[]>([]);
  const [explosions, setExplosions] = useState<ActiveExplosion[]>([]);
  const idRef = useRef(0);

  // Reusable target ref handed to every missile for live collision checks
  const fallbackTargets = useRef<TargetEntry[]>([]);
  const targetsRef = registry?.targets ?? fallbackTargets;

  // Scratch objects reused during aim resolution
  const scratch = useMemo(() => ({
    eclipticPlane: new Plane(new Vector3(0, 1, 0), 0),
    planeHit: new Vector3(),
    closestHit: new Vector3(),
    origin: new Vector3(0, 0, 0),
    rayDir: new Vector3(),
  }), []);

  const launchSalvo = useCallback(() => {
    const { camera, raycaster, pointer } = threeRef.current;
    const reg = registryRef.current;
    raycaster.setFromCamera(pointer, camera);

    let aimPoint: Vector3 | null = null;

    // 1) Raycast the registered target meshes (planets + moons)
    if (reg && reg.targets.current.length > 0) {
      const meshes = reg.targets.current.map(t => t.mesh);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        aimPoint = hits[0].point.clone();
      }
    }

    // 2) Else intersect the ecliptic y = 0 plane where the planets orbit
    if (!aimPoint) {
      const hit = raycaster.ray.intersectPlane(scratch.eclipticPlane, scratch.planeHit);
      if (hit) {
        aimPoint = hit.clone();
      }
    }

    // 3) Else fall back to the closest point on the ray to the origin
    if (!aimPoint) {
      raycaster.ray.closestPointToPoint(scratch.origin, scratch.closestHit);
      aimPoint = scratch.closestHit.clone();
    }

    // Launch from far away, streaking in along the aim direction
    scratch.rayDir.copy(raycaster.ray.direction).normalize();
    const launchOrigin = aimPoint.clone().addScaledVector(scratch.rayDir, -LAUNCH_DISTANCE);

    const baseId = idRef.current;
    idRef.current += 2;
    setMissiles(prev => [
      ...prev,
      { id: baseId, launchOrigin: launchOrigin.clone(), aimPoint: aimPoint!.clone(), phase: 0 },
      { id: baseId + 1, launchOrigin: launchOrigin.clone(), aimPoint: aimPoint!.clone(), phase: Math.PI },
    ]);
  }, [scratch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();
      launchSalvo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [launchSalvo]);

  const removeMissile = useCallback((id: number) => {
    setMissiles(prev => prev.filter(m => m.id !== id));
  }, []);

  const handleImpact = useCallback((id: number, surfacePoint: Vector3, normal: Vector3, color: string) => {
    setMissiles(prev => prev.filter(m => m.id !== id));
    const explosionId = idRef.current++;
    setExplosions(prev => [
      ...prev,
      { id: explosionId, position: surfacePoint, normal, color },
    ]);
  }, []);

  const removeExplosion = useCallback((id: number) => {
    setExplosions(prev => prev.filter(ex => ex.id !== id));
  }, []);

  return (
    <group>
      {missiles.map(m => (
        <Missile
          key={m.id}
          launchOrigin={m.launchOrigin}
          aimPoint={m.aimPoint}
          phase={m.phase}
          color={MISSILE_COLOR}
          targets={targetsRef}
          onImpact={(surfacePoint, normal, color) => handleImpact(m.id, surfacePoint, normal, color)}
          onMiss={() => removeMissile(m.id)}
        />
      ))}

      {explosions.map(ex => (
        <MissileExplosion
          key={ex.id}
          position={ex.position}
          normal={ex.normal}
          color={ex.color}
          onComplete={() => removeExplosion(ex.id)}
        />
      ))}
    </group>
  );
};

export default MissileSystem;
