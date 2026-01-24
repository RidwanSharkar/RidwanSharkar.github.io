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
    'Fretboard-x': 117420,
    'LinkedIn': 41250,
    'GitHub': 21510,
    'The Nutrimancer\'s Codex': 21510,
    'Instagram': 78375,
    'Mythos': 38250,
    'Spotify': 62670,
    'Borrowed Order': 21510,
    'Eidolon': 21510,
    'Threads': 78375,
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
    'Fretboard-x': -173.6,
    'LinkedIn': 69.0,
    'GitHub': 11.8,
    'The Nutrimancer\'s Codex': 108.4,
    'Instagram': -41.7,
    'Mythos': -59.7,
    'Spotify': 420,
    'Borrowed Order': -112.3,
    'Eidolon': -78.5,
    'Threads': -157.3,
    'Avernus': 231.3,
  };
  
  return `${temperatures[planetLabel] || 0}°F`;
};

// Updated getAtmosphereComposition function with chemical formulas and subscripts
const getAtmosphereComposition = (planetColor: string): string => {
  const atmospheres: { [key: string]: string } = {      
    // Spotify: PINK (#FFCAE2) ATMOSPHERE: Pink from alkali metals + iron haze.
    '#FFCAE2': '• [CO₂] Carbon Dioxide (68%)\n• [SO₂] Sulfur Dioxide (12%)\n• [Na] Sodium Vapor (7%)\n• [K] Potassium Vapor (5%)\n• [O] Atomic Oxygen (3%)\n• [FeO] Iron Oxides (3%)\n• [Ar] Argon (2%)', 
  
    // LinkedIn: BLUE (#4FB8FF) ATMOSPHERE: Blue from Rayleigh scattering.
    '#4FB8FF': '• [N₂] Nitrogen (72%)\n• [O₂] Oxygen (21%)\n• [H₂O] Water Vapor (4%)\n• [Ar] Argon (1.5%)\n• [CO₂] Carbon Dioxide (0.8%)\n• [O₃] Ozone (0.4%)\n• [Ne] Neon (0.3%)',
    
    // GitHub: PURPLE (#A55BFF) ATMOSPHERE: Purple from hydrogen emission + alkali metals + aurorae.
    '#A55BFF': '• [H₂] Hydrogen (61%)\n• [He] Helium (24%)\n• [CH₄] Methane (6%)\n• [NH₃] Ammonia (3%)\n• [Xe] Xenon (3%)\n• [K] Potassium Vapor (2%)\n• [Ca⁺] Ionized Calcium (1%)',

    // Eidolon: TURQUOISE (#84DCC6) ATMOSPHERE: Turquoise from methane + clouds + nitrogen scattering.
    '#2DE1FC': '• [N₂] Nitrogen (48%)\n• [CH₄] Methane (22%)\n• [NH₃] Ammonia (10%)\n• [H₂O] Ice Clouds (7%)\n• [Ar] Argon (6%)\n• [Ne] Neon (4%) \n• [C₂H₆] Ethane (3%)',

    // Avernus: LAVENDER (#BAB9FF) ATMOSPHERE: Lavender caused by metal oxides absorbing green/yellow.
    '#BAB9FF': '• [CO₂] Carbon Dioxide (52%)\n• [SO₂] Sulfur Dioxide (20%)\n• [TiO] Titanium Oxide (8%)\n• [VO] Vanadium Oxide (6%)\n• [Na] Sodium Vapor (6%)\n• [K] Potassium Vapor (5%)\n• [Kr] Krypton (3%)',
    
    // Mythos: GREEN (#84DCC6) ATMOSPHERE: Green from oxygen absorption + chlorine chemistry + ice cloud haze.
    '#84DCC6': '• [N₂] Nitrogen (54%)\n• [O₂] Oxygen (18%)\n• [H₂O] Ice Clouds (9%)\n• [CH₄] Methane (6%)\n• [Ar] Argon (6%)\n• [Cl] Chlorine (4%)\n• [Kr] Krypton (3%)',
    
    // Instagram: RED (#F4ACB7) ATMOSPHERE: Red from iron dust filtered through methane.
    '#F4ACB7': '• [H₂] Hydrogen (44%)\n• [He] Helium (26%)\n• [CH₄] Methane (12%)\n• [CO₂] Carbon Dioxide (7%)\n• [FeO] Iron Oxides (6%)\n• [H₂S] Hydrogen Sulfide (3%)\n• [Xe] Xenon (2%)',
    
    // Threads: NAVY (#809BCE) ATMOSPHERE: Deep blue from heavy methane absorption.
    '#809BCE': '• [N₂] Nitrogen (41%)\n• [CH₄] Methane (29%)\n• [H₂] Hydrogen (12%)\n• [He] Helium (8%)\n• [NH₃] Ammonia (5%)\n• [Ne] Neon (3%) \n• [HD] Hydrogen Deuteride (2%)',
    
    // Fretboard-x: ORANGE (#FFD0BA) ATMOSPHERE: Orange from tholins + alkali metals
    '#FFD0BA': '• [N₂] Nitrogen (46%)\n• [CO] Carbon Monoxide (18%)\n• [CH₄] Methane (12%)\n• [Na(s)] Sodium (7%)\n• [K(s)] Potassium (6%)\n• [Th] Organic Tholins (8%) \n• [Ar] Argon (3%)',

  };
  return atmospheres[planetColor]?.split('\n').map(line => 
    `<div style="margin-left: 1rem">${line}</div>`
  ).join('') || 'Unknown composition';
};

// merge*
const getPlanetMass = (planetLabel: string): string => {
  const masses: { [key: string]: number } = {
    'Fretboard-x': 1.9e24,
    'LinkedIn': 1.7e25,
    'GitHub': 7.5e26,
    'The Nutrimancer\'s Codex': 1.5e25,
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
          moons.some(moon => moon.label === "The Nutrimancer's Codex") ? styles.nutrimancerTitle : ''
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
    'Fretboard-x': 1.9e24,
    'LinkedIn': 1.2e25,
    'GitHub': 5.7e25,
    'The Nutrimancer\'s Codex': 1.5e25,
    'Instagram': 2.3e25,
    'Mythos': 9.8e24,
    'Spotify': 1.2e24,
    'Borrowed Order': 1.4e25,
    'Eidolon': 1e25,
    'Threads': 9.6e24,
    'Avernus': 3.1e25,
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
                  planet.label === "The Nutrimancer's Codex" ? styles.nutrimancerTitle : ''
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
                    planet.label === "The Nutrimancer's Codex" 
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