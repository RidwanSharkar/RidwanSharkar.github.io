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
    'Fretboard-x': 66775,
    'LinkedIn': 49250,
    'GitHub': 21510,
    'The Nutrimancer\'s Codex - Vol. II': 21510,
    'Instagram': 48990,
    'Mythos.store': 117225,
    'Spotify': 62670,
  };
  return `${speeds[planetLabel]?.toLocaleString() || 0} mph`;
};

const convertDistance = (distance: number): string => {
  const miles = distance * 100_000_000;
  return `${miles.toExponential(2)} miles`;
};

const getPlanetTemperature = (planetLabel: string): string => {
  const temperatures: { [key: string]: number } = {
    'Fretboard-x': 420.0,
    'LinkedIn': 69.0,
    'GitHub': 11.8,
    'The Nutrimancer\'s Codex - Vol. II': 378.4,
    'Instagram': -41.7,
    'Mythos.store': -359.7,
    'Spotify': 42.9,
  };
  
  return `${temperatures[planetLabel] || 0}°F`;
};

// Updated getAtmosphereComposition function with chemical formulas and subscripts
const getAtmosphereComposition = (planetColor: string): string => {
  const atmospheres: { [key: string]: string } = {
    '#B7D3F2': '• [N<sub>2</sub>] Nitrogen (74%)\n• [O<sub>2</sub>] Oxygen (25%)\n• [Ar] Argon (1%)',
    '#4FB8FF': '• [N<sub>2</sub>] Nitrogen (80%)\n• [CH<sub>4</sub>] Methane (15%)\n• [H<sub>2</sub>] Hydrogen (5%)',
    '#8980F5': '• [H<sub>2</sub>] Hydrogen (68%)\n• [He] Helium (3%)\n• [CH<sub>4</sub>] Methane (1%)',
    '#84DCC6': '• [CO<sub>2</sub>] Carbon Dioxide (88%)\n• [N<sub>2</sub>] Nitrogen (10%)\n• [Ar] Argon (2%)',
    '#F4ACB7': '• [SO<sub>2</sub>] Sulfur Dioxide (80%)\n• [CO<sub>2</sub>] Carbon Dioxide (15%)\n• [He] Helium (5%)',
    '#2DE1FC': '• [He] Helium (60%)\n• [H<sub>2</sub>] Hydrogen (30%)\n• [CH<sub>4</sub>] Methane (10%)',
    '#F9B9F2': '• [CO<sub>2</sub>] Carbon Dioxide (60%)\n• [H<sub>2</sub>] Hydrogen (25%)\n• [Ne] Neon (10%)\n• [TiO<sub>2</sub>] Titanium Dioxide (5%)',
  };
  return atmospheres[planetColor]?.split('\n').map(line => 
    `<div style="margin-left: 1rem">${line}</div>`
  ).join('') || 'Unknown composition';
};

// merge*
const getPlanetMass = (planetLabel: string): string => {
  const masses: { [key: string]: number } = {
    'Fretboard-x': 1.4e24,
    'LinkedIn': 1.7e25,
    'GitHub': 5.7e26,
    'The Nutrimancer\'s Codex - Vol. II': 1.5e25,
    'Instagram': 2.3e26,
    'Mythos.store': 9.8e25,
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
      <h3 
        className={`${styles.statsTitle} ${
          moons.some(moon => moon.label === "The Nutrimancer's Codex - Vol. II") ? styles.nutrimancerTitle : ''
        }`}
      >
        {"Satellites:"}
      </h3>
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

// NEWTON SHIT
const G = 6.67430e-11;  // gravitational constant in m³/kg/s²
const LBS_TO_KG = 0.45359237;  // conversion factor for pounds to kilograms
const MILES_TO_METERS = 1609.344;  // miles to meters

const calculateGravity = (planetLabel: string, size: number): string => {
  const masses: Record<string, number> = {
    'Fretboard-x': 1.4e24,
    'LinkedIn': 1.7e25,
    'GitHub': 5.7e26,
    'The Nutrimancer\'s Codex - Vol. II': 1.5e25,
    'Instagram': 2.3e26,
    'Mythos.store': 1.8e25,
    'Spotify': 1.2e24,
  };

  const mass = masses[planetLabel];
  if (!mass) return 'Unknown';

  // Convert mass from lbs to kg
  const massInKg = mass * LBS_TO_KG;
  
  // Get radius in meters
  const radiusInMiles = (size * 21100) / 2;  
  const radiusInMeters = radiusInMiles * MILES_TO_METERS;

  // Calculate gravity (m/s²)
  const gravity = (G * massInKg) / (radiusInMeters * radiusInMeters);
  
  return `${gravity.toFixed(2)} m/s²`;
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
              ref={statsPanelRef}
            >
              <h3 
                className={`${styles.statsTitle} ${
                  planet.label === "The Nutrimancer's Codex - Vol. II" ? styles.nutrimancerTitle : ''
                }`}
              >
                {"{ "}{planet.label}{" }"}
              </h3>
              <div className={`${styles.statsGrid} text-sm`}>
                
                <div><span>Mass:</span> <span>{getPlanetMass(planet.label)}</span></div>
                <div><span>Diameter:</span> <span>{convertSize(planet.size)}</span></div>
                <div><span>Orbital Speed:</span> <span>{convertSpeed(planet.orbitSpeed, planet.label)}</span></div>
                <div><span>Orbital Radius:</span> <span>{convertDistance(planet.orbitRadius)}</span></div>
                <div><span>Surface Gravity:</span> <span>{calculateGravity(planet.label, planet.size)}</span></div>
                <div><span>Mean Temperature:</span> <span>{getPlanetTemperature(planet.label)}</span></div>
                
                <div>
                  <span>Emission Spectrum:</span>
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
                <h2 
                  className={
                    planet.label === "The Nutrimancer's Codex - Vol. II" 
                      ? styles.nutrimancerTitle 
                      : ''
                  }
                >
                  {planet.label}
                </h2>
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