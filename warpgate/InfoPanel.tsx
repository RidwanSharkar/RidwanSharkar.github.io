// warpgate/InfoPanel.tsx
import React, { useEffect, useState, useRef } from 'react';
import { PlanetData } from './EnhancedPlanetGroup';
import styles from './InfoPanel.module.css'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import Image from 'next/image';

interface InfoPanelProps {
  planet: PlanetData;
  onClose: () => void;
}

interface MoonData {
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  moonColor: string;
  link?: string;
  label?: string;
}

// Converters, scaled to solar system
const convertSize = (size: number): string => {
  const miles = Math.round(size * 21100);
  return `${miles.toLocaleString()} miles`;
};

const convertSpeed = (speed: number, planetLabel: string): string => {
  const speeds: { [key: string]: number } = {
    'Fretboard-x': 76775,
    'LinkedIn': 62250,
    'GitHub': 21500,
    'Unknown': 21500,
    'Instagram': 59670,
    'Mythos.store': 89115,
    'Spotify': 59320,
  };
  return `${speeds[planetLabel]?.toLocaleString() || 0} mph`;
};

const convertDistance = (distance: number): string => {
  const miles = distance * 100_000_000;
  return `${miles.toExponential(2)} miles`;
};

// Replace the calculateTemperature function with this:
const getPlanetTemperature = (planetLabel: string): string => {
  const temperatures: { [key: string]: number } = {
    'Fretboard-x': 420,
    'LinkedIn': 69,
    'GitHub': 11,
    'Unknown': 262,
    'Instagram': -41,
    'Mythos.store': -458,
    'Spotify': -97,
  };
  
  return `${temperatures[planetLabel] || 0}°F`;
};

//LOOSEAF
const getAtmosphereComposition = (planetColor: string): string => {
  const atmospheres: { [key: string]: string } = {
    '#B7D3F2': '• Nitrogen (78%)\n• Oxygen (21%)\n• Argon (1%)\n• Earth-like',
    '#4FB8FF': '• Nitrogen (80%)\n• Methane (15%)\n• Hydrogen (5%)',
    '#8980F5': '• Hydrogen (75%)\n• Helium (24%)\n• Methane (1%)',
    '#84DCC6': '• Carbon Dioxide (95%)\n• Nitrogen (3%)\n• Argon (2%)',
    '#F4ACB7': '• Sulfur Dioxide (80%)\n• Carbon Dioxide (15%)\n• Helium (5%)',
    '#2DE1FC': '• Helium (60%)\n• Hydrogen (30%)\n• Methane (10%)',
    '#F9B9F2': '• Carbon Dioxide (60%)\n• Hydrogen (25%)\n• Neon (10%)\n• Titanium Dioxide (5%)',
  };
  return atmospheres[planetColor]?.split('\n').map(line => 
    `<div style="margin-left: 1rem">${line}</div>`
  ).join('') || 'Unknown composition';
};

const getPlanetMass = (planetLabel: string): string => {
  const masses: { [key: string]: number } = {
    'Fretboard-x': 1.4e24,
    'LinkedIn': 1.7e25,
    'GitHub': 2.5e26,
    'Unknown': 1.5e25,
    'Instagram': 1.3e26,
    'Mythos.store': 9.8e24,
    'Spotify': 1.2e24,
  };
  const mass = masses[planetLabel];
  return mass ? `${mass.toExponential(2)} lbs` : 'Unknown mass';
};

const MoonStatsPanel: React.FC<{ moons: MoonData[] }> = ({ moons }) => {
  return (
    <motion.div
      className={styles.moonStatsPanel}
      initial={{ opacity: 0, x: -20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -20, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.statsTitle}>{"Satellites:"}</h3>
      <div className={styles.moonGrid}>
        {moons.map((moon, index) => (
          <div key={index} className={styles.moonRow}>
            <div className={styles.moonInfo}>
              <span className={styles.moonName}>{moon.label || 'Unknown Moon'}</span>
              <span className={styles.moonSize}>Diameter: {convertSize(moon.size)}</span>
            </div>
            <a 
              href={moon.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.moonButton}
            >
              Visit
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [visible, setVisible] = useState(false);
  const statsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
    
    // Update CSS variable with stats panel height
    if (statsPanelRef.current) {
      const height = statsPanelRef.current.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--stats-panel-height', `${height}px`);
    }
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
          
          <div className={styles.panelsContainer}>
            <motion.div
              className={styles.statsPanel}
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className={styles.statsTitle}>{"{ "}{planet.label}{" }"}</h3>
              <div className={`${styles.statsGrid} text-sm`}>
                <div><span>Mass:</span> <span>{getPlanetMass(planet.label)}</span></div>
                <div><span>Diameter:</span> <span>{convertSize(planet.size)}</span></div>
                <div><span>Orbital Speed:</span> <span>{convertSpeed(planet.orbitSpeed, planet.label)}</span></div>
                <div><span>Orbital Radius:</span> <span>{convertDistance(planet.orbitRadius)}</span></div>
                <div><span>Mean Temperature:</span> <span>{getPlanetTemperature(planet.label)}</span></div>
                <div>
                  <span>Atmospheric Emission Spectrum:</span>
                  <div dangerouslySetInnerHTML={{ __html: getAtmosphereComposition(planet.planetColor) }}></div>
                </div>
              </div>
            </motion.div>

            {planet.moons && planet.moons.length > 0 && (
              <MoonStatsPanel moons={planet.moons} />
            )}
          </div>

          <motion.div
            className={styles.infoPanel}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.infoPanelContent}>
              <div className={styles.planetIcon}>
                <Image 
                  src={planet.logoTexturePath || '/textures/transparent.png'} 
                  alt={`${planet.label} icon`}
                  width={42}
                  height={42}
                  className={styles.planetIconImage}
                />
              </div>
              <div>
                <h2>{planet.label}</h2>
                <p>{planet.description || 'No description available.'}</p>
              </div>
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