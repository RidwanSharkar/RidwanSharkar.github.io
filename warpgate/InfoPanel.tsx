// warpgate/InfoPanel.tsx
import React, { useEffect, useState } from 'react';
import { PlanetData } from './EnhancedPlanetGroup';
import styles from './InfoPanel.module.css'; 
import { motion, AnimatePresence } from 'framer-motion'; 

interface InfoPanelProps {
  planet: PlanetData;
  onClose: () => void;
}

// Conversion helpers
const convertSize = (size: number): string => {
  // Assuming max size is 1, convert to miles (Earth = ~8,000 miles diameter)
  const miles = Math.round(size * 12000);
  return `${miles.toLocaleString()} miles`;
};

const convertSpeed = (speed: number): string => {
  // Convert to miles per hour (Earth = ~67,000 mph)
  const mph = Math.round(speed * 100000);
  return `${mph.toLocaleString()} mph`;
};

const convertDistance = (distance: number): string => {
  // Convert to millions of miles (Earth = ~93 million miles from Sun)
  const millionMiles = Math.round(distance * 100);
  return `${millionMiles.toLocaleString()} million miles`;
};

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <div className={styles.overlay} onClick={handleClose}></div>
          
          <motion.div
            className={styles.statsPanel}
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Planet {planet.label}:</h3>
            <div className={styles.statsGrid}>
              <div>Diameter: {convertSize(planet.size)}</div>
              <div>Orbital Speed: {convertSpeed(planet.orbitSpeed)}</div>
              <div>Orbital Radius: {convertDistance(planet.orbitRadius)}</div>
            </div>
          </motion.div>

          <motion.div
            className={styles.infoPanel}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2>{planet.label}</h2>
              <p>{planet.description || 'No description available.'}</p>
            </div>
            <a href={planet.link} target="_blank" rel="noopener noreferrer" className={styles.infoButton}>
              Visit
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;