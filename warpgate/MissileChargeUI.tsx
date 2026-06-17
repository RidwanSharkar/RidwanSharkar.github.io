// warpgate/MissileChargeUI.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './MissileChargeUI.module.css';

const CHARGE_DURATION = 1000; // ms the user must hold Space before the salvo fires

interface MissileChargeUIProps {
  // Imperative fire trigger, registered by the in-canvas MissileSystem
  fireRef: React.MutableRefObject<(() => void) | null>;
}

const MissileChargeUI: React.FC<MissileChargeUIProps> = ({ fireRef }) => {
  const [charging, setCharging] = useState(false);
  const [progress, setProgress] = useState(0);

  // Live mouse position kept in a ref so the rAF loop can position the overlay
  const mouseRef = useRef({ x: -100, y: -100 });
  const reticleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // True once the current hold has fired, so we don't re-fire until Space is released
  const firedRef = useRef(false);

  const stopCharging = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setCharging(false);
    setProgress(0);
    document.documentElement.classList.remove('missile-charging');
  }, []);

  const positionOverlay = useCallback(() => {
    const { x, y } = mouseRef.current;
    if (reticleRef.current) {
      reticleRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
    if (barRef.current) {
      barRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, 42px)`;
    }
  }, []);

  const tick = useCallback(() => {
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(elapsed / CHARGE_DURATION, 1);
    setProgress(p);
    positionOverlay();

    if (p >= 1) {
      // Charge complete -> fire once, then wait for key release
      if (!firedRef.current) {
        firedRef.current = true;
        fireRef.current?.();
      }
      stopCharging();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [fireRef, positionOverlay, stopCharging]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      positionOverlay();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (e.repeat || firedRef.current || rafRef.current !== null) return;
      startRef.current = performance.now();
      setCharging(true);
      setProgress(0);
      document.documentElement.classList.add('missile-charging');
      positionOverlay();
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      // Released: reset so a new hold can begin (cancels an in-progress charge)
      firedRef.current = false;
      stopCharging();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopCharging();
    };
  }, [positionOverlay, stopCharging, tick]);

  if (!charging) return null;

  const pct = Math.round(progress * 100);

  return (
    <>
      <div ref={reticleRef} className={styles.reticle}>
        <svg className={styles.reticleSvg} width="64" height="64" viewBox="0 0 64 64">
          {/* rotating outer scanner ring (dashed) */}
          <circle
            className={styles.ringSpin}
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="10 8"
            opacity="0.85"
          />
          {/* counter-rotating inner ring */}
          <circle
            className={styles.ringSpinReverse}
            cx="32"
            cy="32"
            r="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.55"
          />
          {/* corner targeting brackets */}
          <g stroke="currentColor" strokeWidth="2" fill="none" className={styles.pulse}>
            <path d="M8 18 V8 H18" />
            <path d="M46 8 H56 V18" />
            <path d="M56 46 V56 H46" />
            <path d="M18 56 H8 V46" />
          </g>
          {/* crosshair lines */}
          <g stroke="currentColor" strokeWidth="1.5">
            <line x1="32" y1="2" x2="32" y2="14" />
            <line x1="32" y1="50" x2="32" y2="62" />
            <line x1="2" y1="32" x2="14" y2="32" />
            <line x1="50" y1="32" x2="62" y2="32" />
          </g>
          {/* center pip */}
          <circle cx="32" cy="32" r="2.2" fill="currentColor" />
        </svg>
      </div>

      <div ref={barRef} className={styles.barWrap}>
        <div className={styles.barLabel}>
          <span>Arming</span>
          <span className={styles.barPct}>{pct}%</span>
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${pct}%` }} />
          <div className={styles.barTicks} />
        </div>
      </div>
    </>
  );
};

export default MissileChargeUI;
