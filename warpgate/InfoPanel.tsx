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
    'Fretboard-x': 62670,
    'LinkedIn': 41250,
    'GitHub': 21510,
    'The Nutrimancer\'s Codex - Vol. II': 21510,
    'Instagram': 58375,
    'Mythos': 31250,
    'Spotify': 62670,
    'Borrowed Order': 21510,
    'Eidolon': 21510,
    'Threads': 58375,
    'Avernus': 21510,
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
    'The Nutrimancer\'s Codex - Vol. II': 108.4,
    'Instagram': -41.7,
    'Mythos': -59.7,
    'Spotify': 420,
    'Borrowed Order': -112.3,
    'Eidolon': -359.7,
    'Threads': -157.3,
    'Avernus': 431.3,
  };
  
  return `${temperatures[planetLabel] || 0}°F`;
};

// Updated getAtmosphereComposition function with chemical formulas and subscripts
const getAtmosphereComposition = (planetColor: string): string => {
  const atmospheres: { [key: string]: string } = {
    // Fretboard-x: Aqua/Cyan (#C3F6EE)
    '#C3F6EE': '• [N₂] Nitrogen (78%)\n• [O₂] Oxygen (21%)\n• [Ar] Argon (1%)',
    
    // Fretboard 2.0 Moon: Light blue (#B7D3F2)
    '#B7D3F2': '• [N₂] Nitrogen (95%)\n• [CH₄] Methane (4%)\n• [H₂] Hydrogen (1%)',
    
    // Spotify: Pink (#F9B9F2)
    '#F9B9F2': '• [CO₂] Carbon Dioxide (96%)\n• [SO₂] Sulfur Dioxide (3%)\n• [Ar] Argon (1%)',
    
    // LinkedIn: Blue (#4FB8FF)
    '#4FB8FF': '• [H₂] Hydrogen (89%)\n• [He] Helium (10%)\n• [CH₄] Methane (1%)',
    
    // Borrowed Order: Navy blue (#809BCE)
    '#809BCE': '• [N₂] Nitrogen (78%)\n• [O₂] Oxygen (20%)\n• [H₂O] Water Vapor (2%)',
    
    // Nutrimancer: Bright cyan (#2DE1FC)
    '#2DE1FC': '• [He] Helium (85%)\n• [H₂] Hydrogen (13%)\n• [CH₄] Methane (2%)',
    
    // GitHub: Purple (#A55BFF)
    '#A55BFF': '• [H₂] Hydrogen (82%)\n• [He] Helium (17%)\n• [NH₃] Ammonia (1%)',
    
    // Mythos: Beige (#F0C59D)
    '#F0C59D': '• [CO₂] Carbon Dioxide (95%)\n• [N₂] Nitrogen (3%)\n• [SO₂] Sulfur Dioxide (2%)',
    
    // Instagram: Pink (#F4ACB7)
    '#F4ACB7': '• [SO₂] Sulfur Dioxide (80%)\n• [CO₂] Carbon Dioxide (18%)\n• [H₂O] Water Vapor (2%)',
    
    // Eidolon: Mint (#84DCC6)
    '#84DCC6': '• [CO₂] Carbon Dioxide (95%)\n• [N₂] Nitrogen (4%)\n• [Ar] Argon (1%)',
    
    // New/Changed colors that need to be added
    '#FFCAE2': '• [CO₂] Carbon Dioxide (96%)\n• [SO₂] Sulfur Dioxide (3%)\n• [Ar] Argon (1%)', // New Spotify color
    '#8C8CD1': '• [N₂] Nitrogen (75%)\n• [O₂] Oxygen (23%)\n• [Ar] Argon (2%)', // New Threads color
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
    'Mythos': 9.8e25,
    'Spotify': 1.2e24,
    'Borrowed Order': 1.4e25,
    'Eidolon': 3.1e26,
    'Threads': 9.6e24,
    'Avernus': 4.2e26,
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
    'Mythos': 1.8e25,
    'Spotify': 1.2e24,
    'Borrowed Order': 1.4e25,
    'Eidolon': 3.1e26,
    'Threads': 9.6e24,
    'Avernus': 1.5e25,
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